import { db } from './app/db';
import { StoryData } from './app/db/schema';
import { desc } from 'drizzle-orm';

async function getLatestStory() {
    const result = await db.select().from(StoryData).orderBy(desc(StoryData.id)).limit(1);
    if (result.length > 0) {
        console.log('LATEST_STORY_ID=' + result[0].storyId);
    } else {
        console.log('NO_STORIES_FOUND');
    }
    process.exit(0);
}

getLatestStory();
