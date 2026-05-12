import { db } from '@/app/db';
import { StoryData } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import BookDisplay from './BookDisplay';

interface ViewStoryProps {
    params: Promise<{
        storyId: string;
    }>;
}

export default async function ViewStoryPage({ params }: ViewStoryProps) {
    const { storyId } = await params;

    const result = await db.select().from(StoryData).where(eq(StoryData.storyId, storyId));
    const story = result[0];

    if (!story) {
        notFound();
    }

    return (
        <BookDisplay story={story} />
    );
}
