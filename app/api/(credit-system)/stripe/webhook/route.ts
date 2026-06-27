import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/app/db';
import { UserCredits, CreditTransactions } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Webhook signature verification failed:`, err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const userId = session.metadata?.userId;
        const creditsToAdding = parseInt(session.metadata?.credits || '0');
        const packageId = session.metadata?.packageId;

        if (userId && creditsToAdding > 0) {
            try {
                // Add credits to the user's account
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
                    description: `Purchased via Stripe: ${packageId} (${creditsToAdding} credits)`,
                    paymentId: session.id, 
                });

                console.log(`✅ Webhook: Credits added for user ${userId}. New balance: ${newBalance}`);
            } catch (dbError) {
                console.error('❌ Database error in Stripe webhook:', dbError);
                return NextResponse.json({ error: 'Database error' }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}
