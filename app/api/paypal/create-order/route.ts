import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

// Credit package definitions — same as on the frontend
const CREDIT_PACKAGES: Record<string, { credits: number; price: string; label: string }> = {
    'starter': { credits: 5, price: '2.99', label: 'Starter Pack' },
    'popular': { credits: 15, price: '6.99', label: 'Popular Pack' },
    'mega': { credits: 50, price: '17.99', label: 'Mega Pack' },
};

// Generate a PayPal access token
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

// POST: Create a PayPal order for a credit package
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { packageId } = body;

        const pkg = CREDIT_PACKAGES[packageId];
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
        }

        const accessToken = await getPayPalAccessToken();
        const baseUrl = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';

        const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: pkg.price,
                        },
                        description: `StoryNest AI - ${pkg.label} (${pkg.credits} credits)`,
                        custom_id: `${userId}|${packageId}`,
                    },
                ],
            }),
        });

        const orderData = await orderRes.json();

        if (!orderRes.ok) {
            console.error('PayPal create order error:', orderData);
            return NextResponse.json({ error: 'PayPal error', details: orderData }, { status: 500 });
        }

        return NextResponse.json({ orderID: orderData.id });
    } catch (error: any) {
        console.error('❌ PayPal Create Order Error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to create order', 
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
