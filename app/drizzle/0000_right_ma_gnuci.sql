CREATE TABLE "storyData" (
	"id" serial PRIMARY KEY NOT NULL,
	"storyId" varchar NOT NULL,
	"storySubject" text NOT NULL,
	"storyType" varchar NOT NULL,
	"ageGroup" varchar NOT NULL,
	"imageStyle" varchar NOT NULL,
	"output" json,
	"coverImage" varchar
);
