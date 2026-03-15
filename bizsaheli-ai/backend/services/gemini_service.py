"""
Gemini AI service — all Google Generative AI API calls go through here.
Handles mentor responses, scenario generation, Q&A, and quiz grading.
"""

import os
import json
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(override=True)

genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))

# Use the recommended Gemini model
# 'gemini-1.5-flash' is fast and good for general text tasks
model = genai.GenerativeModel("gemini-1.5-flash")

PROMPTS_DIR = Path(__file__).parent.parent / "prompts"


def _load_prompt(filename: str) -> str:
    """Load a prompt template from the prompts directory."""
    return (PROMPTS_DIR / filename).read_text(encoding="utf-8")


def _call_gemini(system_prompt: str, user_message: str) -> str:
    """Make a single Gemini API call and return the text response."""
    # We can pass system instructions directly to the model configuration if supported,
    # or prepend it to the user's prompt as a workaround.
    prompt = f"System Instruction:\n{system_prompt}\n\nUser Request:\n{user_message}"
    
    response = model.generate_content(prompt)
    return response.text


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
