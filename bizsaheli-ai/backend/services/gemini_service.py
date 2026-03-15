"""
Gemini AI service — all Google Generative AI API calls go through here.
Handles mentor responses, scenario generation, Q&A, and quiz grading.
"""

import os
import json
from pathlib import Path
import httpx
from dotenv import load_dotenv

load_dotenv(override=True)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/hunter-alpha")

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def _load_prompt(filename: str) -> str:
    """Load a prompt template from the prompts directory."""
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8")


def _call_gemini(system_prompt: str, user_message: str) -> str:
    """Make a single API call to OpenRouter and return the text response."""
    try:
        response = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "AI Rural Business Trainer",
                "Content-Type": "application/json"
            },
            json={
                "model": OPENROUTER_MODEL,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ]
            },
            timeout=30.0
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        import traceback
        traceback.print_exc()
        return "{}"


def _parse_json_response(text: str) -> dict:
    """Extract JSON from Gemini response, handling markdown code fences."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        lines = cleaned.split("\n")
        # Remove first and last lines (code fences)
        lines = lines[1:-1] if lines[-1].strip() == "```" else lines[1:]
        cleaned = "\n".join(lines)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {"message": text, "comparison_table": []}


# ─── Mentor ──────────────────────────────────────────────────────────────────

def get_mentor_response(
    business_type: str,
    day: int,
    capital: int,
    profit: int,
    scenario: str,
    choice: str,
    outcome: str,
    language: str = "en",
    decision_history: list[dict] | None = None,
) -> dict:
    """Get Lakshmi mentor feedback for a user's decision."""
    template = _load_prompt("mentor_system.txt")
    system_prompt = template.format(
        language=language,
        business_type=business_type,
        day=day,
        capital=capital,
        profit=profit,
        scenario=scenario,
        choice=choice,
        outcome=outcome,
    )

    # Add decision history for context continuity
    context_parts = [f"The user chose option {choice}. The outcome was: {outcome}"]
    if decision_history:
        recent = decision_history[-5:]  # Last 5 decisions
        history_text = "\n".join(
            f"Day {d['day']}: Chose {d['choice']} → {d.get('outcome', 'N/A')}"
            for d in recent
        )
        context_parts.append(f"\nRecent decision history:\n{history_text}")

    user_message = "\n".join(context_parts)
    raw = _call_gemini(system_prompt, user_message)
    return _parse_json_response(raw)


# ─── Scenario Generation ────────────────────────────────────────────────────

def generate_scenario(
    business_type: str,
    day: int,
    capital: int,
    profit: int = 0,
    inventory: dict | None = None,
    events: list[str] | None = None,
    language: str = "en",
) -> dict:
    """Generate a daily business scenario using Gemini."""
    template = _load_prompt("scenario_gen.txt")
    system_prompt = template.format(
        language=language,
        business_type=business_type,
        day=day,
        capital=capital,
        profit=profit,
        inventory=json.dumps(inventory or {}),
        events=", ".join(events or []),
    )

    user_message = (
        f"Generate a scenario for day {day} of a {business_type} business "
        f"with Rs{capital} capital and Rs{profit} profit so far."
    )
    raw = _call_gemini(system_prompt, user_message)
    return _parse_json_response(raw)


# ─── Learning Q&A ────────────────────────────────────────────────────────────

def answer_question(question: str, language: str = "en") -> dict:
    """Answer a freeform business question."""
    template = _load_prompt("learn_system.txt")
    system_prompt = template.format(language=language)
    user_message = f"Question: {question}\n\nRespond with a JSON answer."
    raw = _call_gemini(system_prompt, user_message)
    return _parse_json_response(raw)


# ─── Quiz Grading ────────────────────────────────────────────────────────────

def grade_quiz(
    skill: str,
    question_id: str,
    answer: str,
    language: str = "en",
) -> dict:
    """Grade a quiz answer and provide explanation."""
    template = _load_prompt("learn_system.txt")
    system_prompt = template.format(language=language)
    user_message = (
        f"Grade this quiz answer.\n"
        f"Skill: {skill}\n"
        f"Question ID: {question_id}\n"
        f"User's answer: {answer}\n\n"
        f"Respond with JSON containing correct (bool), explanation, score_delta."
    )
    raw = _call_gemini(system_prompt, user_message)
    return _parse_json_response(raw)
