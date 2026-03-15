import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Explicitly handle Next.js environment variables (Node.js vs backend)
    // Avoid localhost resolution issues between IPv4/IPv6 by using 127.0.0.1
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${backendUrl}/learn/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error from FastAPI (/learn/ask):", errorText);
      return NextResponse.json(
        { error: "Failed to fetch response from mentor AI" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Next.js proxy error (/api/learn/ask):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
