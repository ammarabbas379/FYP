CREATE TABLE "storyData" (
	"id" serial PRIMARY KEY NOT NULL,
	"storyId" varchar NOT NULL,
	"storySubject" text,
	"storyType" varchar,
	"ageGroup" varchar,
	"imageStyle" varchar,
	"output" json,
	"coverImage" varchar
);
--> statement-breakpoint
DROP TABLE "stories" CASCADE;