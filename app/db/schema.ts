import { pgTable, text, serial, json, varchar } from 'drizzle-orm/pg-core';

export const StoryData = pgTable('storyData', {
    id: serial('id').primaryKey(),
    storyId: varchar('storyId').notNull(),
    storySubject: text('storySubject'),
    storyType: varchar('storyType'),
    ageGroup: varchar('ageGroup'),
    imageStyle: varchar('imageStyle'),
    output: json('output'),
    coverImage: varchar('coverImage'),
});
