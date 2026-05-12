import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { UserCredits } from '@/app/db/schema';
import { auth, currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

// GET: Fetch the current user's credit balance
export async function GET() {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = user.emailAddresses[0]?.emailAddress;

        // Find or create the user's credit record
        let creditRecord = await db
            .select()
            .from(UserCredits)
            .where(eq(UserCredits.userId, userId))
            .limit(1);

        if (creditRecord.length === 0) {
            // New user — start with 0 credits
            const newRecord = await db
                .insert(UserCredits)
                .values({
                    userId,
                    userEmail,
                    credits: 0,
                })
                .returning();
            creditRecord = newRecord;
        }

        return NextResponse.json({
            credits: creditRecord[0].credits,
            userId,
        });
    } catch (error: any) {
        console.error('Error fetching credits:', error);
        return NextResponse.json(
            { error: 'Failed to fetch credits', details: error.message },
            { status: 500 }
        );
    }
}
