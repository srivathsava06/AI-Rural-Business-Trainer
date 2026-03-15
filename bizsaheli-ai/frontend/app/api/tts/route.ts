import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

/**
 * Proxy POST /api/tts → FastAPI POST /tts
 * Returns audio/mpeg stream.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "TTS API error" },
        { status: response.status }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": "inline; filename=speech.mp3",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reach TTS service" },
      { status: 500 }
    );
  }
}
