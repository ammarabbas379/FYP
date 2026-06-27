import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';
import { db } from '@/app/db';
import { UserCredits, CreditTransactions } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { sessionId } = body;

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
        }

        // Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Ensure the session is paid and belongs to the current user
        if (session.payment_status !== 'paid' || session.metadata?.userId !== userId) {
            return NextResponse.json({ error: 'Invalid or unpaid session' }, { status: 400 });
        }

        const creditsToAdding = parseInt(session.metadata?.credits || '0');
        const packageId = session.metadata?.packageId || 'unknown';

        if (creditsToAdding <= 0) {
            return NextResponse.json({ error: 'Invalid credit amount' }, { status: 400 });
        }

        // Check if this transaction has already been processed (e.g., by the webhook)
        const existingTx = await db
            .select()
            .from(CreditTransactions)
            .where(eq(CreditTransactions.paymentId, sessionId))
            .limit(1);

        if (existingTx.length > 0) {
            return NextResponse.json({ success: true, message: 'Already processed' });
        }

        // If not processed, add the credits
        const creditRecord = await db
            .select()
            .from(UserCredits)
            .where(eq(UserCredits.userId, userId))
            .limit(1);

        let newBalance: number;

        if (creditRecord.length === 0) {
            newBalance = creditsToAdding;
            await db.insert(UserCredits).values({
                userId,
                credits: newBalance,
            });
        } else {
            newBalance = creditRecord[0].credits + creditsToAdding;
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
            amount: creditsToAdding,
            creditsAfter: newBalance,
            description: `Purchased via Stripe (Verified): ${packageId} (${creditsToAdding} credits)`,
            paymentId: sessionId,
        });

        console.log(`✅ Verified Session: Credits added for user ${userId}. New balance: ${newBalance}`);

        return NextResponse.json({ success: true, credits: newBalance });

    } catch (error: any) {
        console.error('❌ Stripe Verification Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
