import { NextResponse } from 'next/server';
import Replicate from "replicate";
import { auth } from '@clerk/nextjs/server';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({ error: 'Missing prompt field' }, { status: 400 });
        }

        console.log('🖼️ Generating image with Replicate for prompt:', prompt);

        const input = {
            prompt: prompt,
            // You can add more parameters here like width, height, num_outputs etc.
        };

        const output: any = await replicate.run("black-forest-labs/flux-2-pro", { input });

        // The output is typically an array of streams or URLs depending on the model
        // Flux models on Replicate return an array of image URLs or WebP data.
        
        // Sometimes it returns stream objects with .url(), sometimes just raw URLs.
        let imageUrl = '';
        if (output && typeof output.url === 'function') {
            // Handle cases like flux-2-pro where the output is directly a FileOutput object
            imageUrl = output.url().toString();
        } else if (Array.isArray(output) && output.length > 0) {
            // Check if it's an object with a url() function
            if (typeof output[0] === 'object' && typeof output[0].url === 'function') {
                imageUrl = output[0].url().toString();
            } else if (typeof output[0] === 'string') {
                imageUrl = output[0];
            } else if (typeof output[0] === 'object' && output[0] instanceof ReadableStream) {
                 // In newer replicate SDKs it might return streams
                 const streamObj = output[0] as any;
                 imageUrl = streamObj.url ? streamObj.url().toString() : streamObj;
            }
        }

        if (!imageUrl) {
             // Fallback if Replicate returned something else
             console.log('Replicate output:', output);
             if(Array.isArray(output) && typeof output[0] === 'object' && 'url' in output[0]) {
                 imageUrl = (output[0] as any).url;
             } else if (output && typeof output === 'object' && 'url' in output) {
                 imageUrl = (output as any).url;
             } else {
                 return NextResponse.json({ error: 'Failed to extract image URL from Replicate response', output }, { status: 500 });
             }
        }

        // Fetch the image and convert to Base64 for permanent storage
        console.log('📥 Fetching image from Replicate CDN...');
        const imageRes = await fetch(imageUrl);
        if (!imageRes.ok) {
            throw new Error(`Failed to fetch image from Replicate: ${imageRes.statusText}`);
        }
        
        const buffer = await imageRes.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString('base64');
        const contentType = imageRes.headers.get('content-type') || 'image/webp';
        const permanentImage = `data:${contentType};base64,${base64Image}`;

        console.log('✅ Image converted to Base64 successfully');

        return NextResponse.json({
            success: true,
            imageUrl: permanentImage
        }, { status: 200 });

    } catch (error: any) {
        console.error('Detailed error generating image:', error);
        return NextResponse.json({
            error: 'Failed to generate image',
            details: error.message
        }, { status: 500 });
    }
}
