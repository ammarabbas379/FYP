import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { StoryData } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { storyId, chapterIndex, imageUrl, isCover } = body;

        if (!storyId || !imageUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Fetch current story
        const result = await db.select().from(StoryData).where(eq(StoryData.storyId, storyId));
        const story = result[0];

        if (!story) {
            return NextResponse.json({ error: 'Story not found' }, { status: 404 });
        }

        if (isCover) {
            // Store cover image in the output JSON (no varchar size limit)
            const output: any = typeof story.output === 'string' ? JSON.parse(story.output) : story.output;
            output.coverImage = imageUrl;
            await db.update(StoryData)
                .set({ output: output })
                .where(eq(StoryData.storyId, storyId));
            return NextResponse.json({ success: true, updated: 'coverImage' });
        }

        if (typeof chapterIndex !== 'number') {
             return NextResponse.json({ error: 'Missing chapterIndex' }, { status: 400 });
        }

        // Update the chapter image
        const output: any = typeof story.output === 'string' ? JSON.parse(story.output) : story.output;
        
        if (!output.chapters || !output.chapters[chapterIndex]) {
             return NextResponse.json({ error: 'Chapter not found' }, { status: 400 });
        }

        output.chapters[chapterIndex].image = imageUrl;

        await db.update(StoryData)
            .set({ output: output })
            .where(eq(StoryData.storyId, storyId));

        return NextResponse.json({ success: true, updated: 'chapterImage' });

    } catch (error: any) {
        console.error('Detailed error updating story image:', error);
        return NextResponse.json({
            error: 'Failed to update story image',
            details: error.message
        }, { status: 500 });
    }
}
