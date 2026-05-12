import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { UserCredits, CreditTransactions } from '@/app/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

// POST: Deduct 1 credit for story generation
export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { description } = body; // e.g. "Generated story: My Adventure"

        // Get current balance
        const creditRecord = await db
            .select()
            .from(UserCredits)
            .where(eq(UserCredits.userId, userId))
            .limit(1);

        if (creditRecord.length === 0 || creditRecord[0].credits < 1) {
            return NextResponse.json(
                { error: 'Insufficient credits', credits: creditRecord[0]?.credits || 0 },
                { status: 403 }
            );
        }

        const newBalance = creditRecord[0].credits - 1;

        // Deduct 1 credit
        await db
            .update(UserCredits)
            .set({
                credits: newBalance,
                updatedAt: new Date(),
            })
            .where(eq(UserCredits.userId, userId));

        // Log the transaction
        await db.insert(CreditTransactions).values({
            userId,
            type: 'usage',
            amount: -1,
            creditsAfter: newBalance,
            description: description || 'Story generation',
        });

        return NextResponse.json({
            success: true,
            credits: newBalance,
        });
    } catch (error: any) {
        console.error('Error deducting credit:', error);
        return NextResponse.json(
            { error: 'Failed to deduct credit', details: error.message },
            { status: 500 }
        );
    }
}
