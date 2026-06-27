import { pgTable, text, serial, json, varchar, timestamp, integer } from 'drizzle-orm/pg-core';

export const StoryData = pgTable('storyData', {
    id: serial('id').primaryKey(),
    storyId: varchar('storyId').notNull(),
    storySubject: text('storySubject'),
    storyType: varchar('storyType'),
    ageGroup: varchar('ageGroup'),
    imageStyle: varchar('imageStyle'),
    output: json('output'),
    coverImage: varchar('coverImage'),
    userEmail: varchar('userEmail'),
    userName: varchar('userName'),
    userImage: varchar('userImage'),
    coverImagePrompt: text('coverImagePrompt'),
    createdAt: timestamp('createdAt').defaultNow(),
});

export const Subscribers = pgTable('subscribers', {
    id: serial('id').primaryKey(),
    email: varchar('email').notNull().unique(),
    createdAt: timestamp('createdAt').defaultNow(),
});

// Stores the credit balance for each user
export const UserCredits = pgTable('userCredits', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull().unique(),       // Clerk user ID
    userEmail: varchar('userEmail'),
    credits: integer('credits').notNull().default(0),    // New users start with 0 credits
    createdAt: timestamp('createdAt').defaultNow(),
    updatedAt: timestamp('updatedAt').defaultNow(),
});

// Logs every credit purchase or deduction
export const CreditTransactions = pgTable('creditTransactions', {
    id: serial('id').primaryKey(),
    userId: varchar('userId').notNull(),
    type: varchar('type').notNull(),                     // 'purchase' | 'usage' | 'bonus'
    amount: integer('amount').notNull(),                 // Positive for purchases, negative for usage
    creditsAfter: integer('creditsAfter').notNull(),     // Balance after this transaction
    description: text('description'),                    // e.g. "Purchased 10 credits" or "Generated story: ..."
    paymentId: varchar('paymentId'),                  // Stripe Session ID or PayPal Order ID
    createdAt: timestamp('createdAt').defaultNow(),
});
