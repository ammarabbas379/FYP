import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { StoryData } from '@/app/db/schema';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { auth, currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userEmail = user.emailAddresses[0]?.emailAddress;
        const userName = user.fullName || user.firstName || 'Little Explorer';
        const userImage = user.imageUrl;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY is missing from environment variables');
            return NextResponse.json({ error: 'Gemini API Key is not configured in .env.local' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const body = await req.json();
        const { storySubject, storyType, ageGroup, imageStyle } = body;

        if (!storySubject || !storyType || !ageGroup || !imageStyle) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        console.log('✨ Generating story for:', storySubject);

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let themeInstructions = "";
        if (storyType === 'bed-story') {
            themeInstructions = "This is a BEDTIME STORY. The tone should be calming, gentle, and cozy. Use repetitive, soothing language and ensure a peaceful ending where the characters settle down for sleep.";
        } else if (storyType === 'educational') {
            themeInstructions = "This is an EDUCATIONAL STORY. The content should be informative and focus on a clear moral lesson, a scientific fact, or a problem-solving skill suitable for the age group. Use clear, simple explanations.";
        } else {
            themeInstructions = "This is a classic STORY BOOK. The tone should be adventurous, whimsical, and engaging, focusing on a magical journey or a discovery.";
        }

        let ageInstructions = "";
        if (ageGroup === '3-5') {
            ageInstructions = "Target age: 3-5 years. Use very simple words, short sentences, and focus on basic emotions and sensory details. Avoid complex plots.";
        } else if (ageGroup === '6-8') {
            ageInstructions = "Target age: 6-8 years. Use descriptive language, slightly more complex sentence structures, and a clear narrative arc with a simple conflict and resolution.";
        } else {
            ageInstructions = "Target age: 9-12 years. Use rich vocabulary, varied sentence structures, and more developed characters and plot points. Can include subtle humor or life lessons.";
        }

        const prompt = `
            Create a children's story based on the following details:
            - Subject: ${storySubject}
            - Story Type: ${storyType} (${themeInstructions})
            - Age Group: ${ageGroup} (${ageInstructions})
            - Image Style: ${imageStyle}

            The story should have a title and 5 chapters.
            Each chapter should be between 3 to 5 sentences long to fit on a book page.
            
            Also, provide a highly descriptive and artistic "coverImagePrompt" (around 50 words) that describes the cover illustration for this story based on the subject and the chosen image style (${imageStyle}).
            
            Please return the story in JSON format exactly as follows:
            {
              "title": "Story Title",
              "coverImagePrompt": "Visual description for the cover image...",
              "chapters": [
                {
                  "chapterNum": 1,
                  "chapterTitle": "Chapter Title",
                  "chapterDescription": "Short description for illustration",
                  "content": "Story content for this chapter"
                }
              ],
              "quiz": [
                {
                  "question": "Question text?",
                  "options": ["Option A", "Option B", "Option C", "Option D"],
                  "correctAnswer": "The exact string of the correct option"
                }
              ]
            }
            
            Important: Generate exactly 4 MCQ questions for the 'quiz' field based on the story content. Each question must have exactly 4 options.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up the response text if it contains markdown code blocks
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error('Failed to extract JSON from AI response:', text);
            throw new Error('Failed to generate valid JSON from AI');
        }

        let storyOutput;
        try {
            storyOutput = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError, 'on string:', jsonMatch[0]);
            throw new Error('Failed to parse story JSON');
        }

        const storyId = crypto.randomUUID();

        // Determine Cover Image
        let coverImage = '/images/story-book-cover.jpg';
        if (storyType === 'bed-story') coverImage = '/images/bed-story.jpg';
        else if (storyType === 'educational') coverImage = '/images/educational.jpg';
        else if (ageGroup === '3-5') coverImage = '/images/age-0-2.jpg';
        else if (ageGroup === '6-8') coverImage = '/images/age-3-5.jpg';
        else if (ageGroup === '9-12') coverImage = '/images/age-5-8.jpg';

        // Save to database
        const insertedData = await db.insert(StoryData).values({
            storyId,
            storySubject,
            storyType,
            ageGroup,
            imageStyle,
            output: storyOutput,
            coverImage,
            coverImagePrompt: storyOutput.coverImagePrompt,
            userEmail,
            userName,
            userImage,
        }).returning();

        console.log('✅ Story saved:', storyId);

        return NextResponse.json({
            success: true,
            storyId: storyId,
            data: insertedData[0]
        }, { status: 200 });

    } catch (error: any) {
        console.error('Detailed error generating story:', error);
        return NextResponse.json({
            error: 'Failed to generate story',
            details: error.message
        }, { status: 500 });
    }
}
