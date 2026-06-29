import { db } from '@/app/db';
import { StoryData } from '@/app/db/schema';
import { desc, sql } from 'drizzle-orm';
import { currentUser } from '@clerk/nextjs/server';
import ExploreContent from './ExploreContent';

export default async function ExplorePage() {
    const user = await currentUser();
    const userEmail = user?.emailAddresses[0]?.emailAddress;

    // Fetch ONLY the required fields to avoid loading huge base64 images from the output JSON
    const allStories = await db.select({
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
    }).from(StoryData).orderBy(desc(StoryData.createdAt)).limit(100);

    return <ExploreContent allStories={allStories} userEmail={userEmail} />;
}
