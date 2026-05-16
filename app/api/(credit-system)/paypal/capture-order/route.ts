import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { UserCredits, CreditTransactions } from '@/app/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

// Credit package definitions
const CREDIT_PACKAGES: Record<string, { credits: number; price: string; label: string }> = {
    'starter': { credits: 5, price: '2.99', label: 'Starter Pack' },
    'popular': { credits: 15, price: '6.99', label: 'Popular Pack' },
    'mega': { credits: 50, price: '17.99', label: 'Mega Pack' },
};

async function getPayPalAccessToken() {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const baseUrl = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

    if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials (CLIENT_ID or CLIENT_SECRET) are missing in environment variables.');
    }

    const res = await fetch(`${baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await res.json();
    return data.access_token;
}

// POST: Capture a PayPal order after user approval
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { orderID, packageId } = body;

        if (!orderID || !packageId) {
            return NextResponse.json({ error: 'Missing orderID or packageId' }, { status: 400 });
        }

        const pkg = CREDIT_PACKAGES[packageId];
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
        }

        // Capture the PayPal order
        const accessToken = await getPayPalAccessToken();
        const baseUrl = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

        const captureRes = await fetch(`${baseUrl}/v2/checkout/orders/${orderID}/capture`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        const captureData = await captureRes.json();

        if (captureData.status !== 'COMPLETED') {
            console.error('PayPal capture failed:', captureData);
            return NextResponse.json({ error: 'Payment not completed', details: captureData }, { status: 400 });
        }

        // Add credits to the user's account
        const creditRecord = await db
            .select()
            .from(UserCredits)
            .where(eq(UserCredits.userId, userId))
            .limit(1);

        let newBalance: number;

        if (creditRecord.length === 0) {
            // New user — create record with purchased credits
            newBalance = pkg.credits;
            await db.insert(UserCredits).values({
                userId,
                credits: newBalance,
            });
        } else {
            newBalance = creditRecord[0].credits + pkg.credits;
            await db
                .update(UserCredits)
                .set({
                    credits: newBalance,
                    updatedAt: new Date(),
                })
                .where(eq(UserCredits.userId, userId));
        }

        // Log the transaction
        await db.insert(CreditTransactions).values({
            userId,
            type: 'purchase',
            amount: pkg.credits,
            creditsAfter: newBalance,
            description: `Purchased ${pkg.label} (${pkg.credits} credits) for $${pkg.price}`,
            paypalOrderId: orderID,
        });

        console.log(`✅ Credits added: ${pkg.credits} for user ${userId}. New balance: ${newBalance}`);

        return NextResponse.json({
            success: true,
            credits: newBalance,
            purchased: pkg.credits,
        });
    } catch (error: any) {
        console.error('❌ PayPal Capture Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to capture payment', 
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
            },
            { status: 500 }
        );
    }
}
