import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { text } = await request.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        // Using a voice that is supported on the free tier (Sarah)
        const voiceId = "EXAVITQu4vr4xnSDxMaL"; 
        
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': process.env.ELEVENLABS_API_KEY || '9a7db35a2b769ac22a7ed8ce855d3c8dbd47e5900c5148d980f0bd5aff048ffa',
            },
            body: JSON.stringify({
                text: text.slice(0, 5000), // Safety clip
                model_id: 'eleven_multilingual_v2',
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("ElevenLabs API Error:", errorData);
            return NextResponse.json({ error: "Failed to generate audio." }, { status: response.status });
        }

        const arrayBuffer = await response.arrayBuffer();
        
        return new NextResponse(arrayBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
            }
        });
    } catch (error) {
        console.error("Error generating audio:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
