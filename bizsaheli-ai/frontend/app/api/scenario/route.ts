import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:8000";

/**
 * Proxy POST /api/scenario → FastAPI POST /scenario
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await fetch(`${BACKEND_URL}/scenario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Scenario API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to reach scenario service" },
      { status: 500 }
    );
  }
}
