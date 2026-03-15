"""
Google Text-to-Speech service.
Converts text to audio in Telugu, Hindi, or English using Google TTS API.
"""

import os
import httpx
from dotenv import load_dotenv

load_dotenv()

GOOGLE_TTS_API_KEY = os.getenv("GOOGLE_TTS_API_KEY", "")
TTS_API_URL = "https://texttospeech.googleapis.com/v1/text:synthesize"

# Language code mapping
LANGUAGE_MAP = {
    "en": {"languageCode": "en-IN", "name": "en-IN-Wavenet-A", "ssmlGender": "FEMALE"},
    "te": {"languageCode": "te-IN", "name": "te-IN-Standard-A", "ssmlGender": "FEMALE"},
    "hi": {"languageCode": "hi-IN", "name": "hi-IN-Wavenet-A", "ssmlGender": "FEMALE"},
}


async def synthesize_speech(text: str, language: str = "en") -> bytes:
    """
    Convert text to speech audio (MP3) using Google Cloud TTS API.
    Returns raw audio bytes.
    """
    voice_config = LANGUAGE_MAP.get(language, LANGUAGE_MAP["en"])

    payload = {
        "input": {"text": text},
        "voice": voice_config,
        "audioConfig": {
            "audioEncoding": "MP3",
            "speakingRate": 0.9,  # Slightly slower for clarity
            "pitch": 1.0,
        },
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{TTS_API_URL}?key={GOOGLE_TTS_API_KEY}",
            json=payload,
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

    # Google TTS returns base64-encoded audio
    import base64
    audio_content = base64.b64decode(data["audioContent"])
    return audio_content
