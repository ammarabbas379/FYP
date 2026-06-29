import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return new NextResponse("Text is required", { status: 400 });
        }

        // Use the free-tier compatible Sarah voice
        const voiceId = 'EXAVITQu4vr4xnSDxMaL';
        const apiKey = process.env.ELEVENLABS_API_KEY || '9a7db35a2b769ac22a7ed8ce855d3c8dbd47e5900c5148d980f0bd5aff048ffa';

        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text: text.slice(0, 5000),
                model_id: 'eleven_multilingual_v2',
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("ElevenLabs API Error:", err);
            return new NextResponse(err, { status: response.status });
        }

        const audioBuffer = await response.arrayBuffer();

        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
            },
        });
    } catch (error) {
        console.error("Error generating audio:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
