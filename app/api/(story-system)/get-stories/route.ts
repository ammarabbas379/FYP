import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { StoryData } from '@/app/db/schema';
import { desc, sql, eq } from 'drizzle-orm';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const offset = parseInt(searchParams.get('offset') || '0');
        const limit = parseInt(searchParams.get('limit') || '8');
        const email = searchParams.get('email');

        let query = db.select({
            id: StoryData.id,
            storyId: StoryData.storyId,
            storySubject: StoryData.storySubject,
            storyType: StoryData.storyType,
            ageGroup: StoryData.ageGroup,
            imageStyle: StoryData.imageStyle,
            userEmail: StoryData.userEmail,
            userName: StoryData.userName,
            userImage: StoryData.userImage,
            createdAt: StoryData.createdAt,
            coverImage: sql<string>`COALESCE(${StoryData.coverImage}, ${StoryData.output}->>'coverImage')`.as('coverImage'),
            title: sql<string>`${StoryData.output}->>'title'`.as('title'),
        }).from(StoryData);

        if (email) {
            query = query.where(eq(StoryData.userEmail, email)) as any;
        }

        const stories = await query.orderBy(desc(StoryData.createdAt)).limit(limit).offset(offset);

        return NextResponse.json({ success: true, stories });
    } catch (error) {
        console.error("Error fetching stories:", error);
        return NextResponse.json({ success: false, error: 'Failed to fetch stories' }, { status: 500 });
    }
}
