import { db } from '@/app/db';
import { StoryData } from '@/app/db/schema';
import { desc } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import ExploreContent from './ExploreContent';

export default async function ExplorePage() {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    // Fetch stories from the database
    const allStories = await db.select().from(StoryData).orderBy(desc(StoryData.createdAt)).limit(100);

    return <ExploreContent allStories={allStories} userEmail={userEmail} />;
}
