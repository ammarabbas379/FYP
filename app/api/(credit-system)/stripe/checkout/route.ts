import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const CREDIT_PACKAGES: Record<string, { credits: number; price: number; label: string }> = {
    'starter': { credits: 5, price: 2.99, label: 'Starter Pack' },
    'popular': { credits: 15, price: 6.99, label: 'Popular Pack' },
    'mega': { credits: 50, price: 17.99, label: 'Mega Pack' },
};

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

        const origin = req.headers.get('origin');

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `StoryNest AI - ${pkg.label}`,
                            description: `${pkg.credits} Magical Story Credits`,
                        },
                        unit_amount: Math.round(pkg.price * 100), // Stripe expects cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/buy-credits?success=true&amount=${pkg.credits}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/buy-credits?canceled=true`,
            metadata: {
                userId: userId,
                packageId: packageId,
                credits: pkg.credits.toString(),
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('❌ Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
