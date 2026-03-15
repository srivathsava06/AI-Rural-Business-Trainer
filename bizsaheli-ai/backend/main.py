"""
AI Rural Business Trainer — FastAPI Backend Entry Point.
Provides AI mentor, scenario generation, learning, and progress APIs.
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import io

load_dotenv()

app = FastAPI(
    title="AI Rural Business Trainer Backend",
    description="AI-powered business simulation for rural women entrepreneurs",
    version="1.0.0",
)

# ─── CORS ────────────────────────────────────────────────────────────────────
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
from routers import mentor, scenario, learn, progress  # noqa: E402

app.include_router(mentor.router)
app.include_router(scenario.router)
app.include_router(learn.router)
app.include_router(progress.router)


# ─── Health Check ────────────────────────────────────────────────────────────
@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "ai-rural-business-trainer-backend"}


# ─── TTS Endpoint ────────────────────────────────────────────────────────────
from models.schemas import TTSRequest  # noqa: E402
from services.tts_service import synthesize_speech  # noqa: E402


@app.post("/tts")
async def text_to_speech(req: TTSRequest):
    """Convert text to speech audio (MP3)."""
    try:
        audio_bytes = await synthesize_speech(
            text=req.text,
            language=req.language,
        )
        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"},
        )
    except Exception as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")


# ─── Run ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
