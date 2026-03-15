"""
POST /learn/ask — Open Q&A with Lakshmi.
POST /learn/quiz — Grade a quiz answer.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import (
    LearnAskRequest, LearnAskResponse,
    LearnQuizRequest, LearnQuizResponse,
)
from services.gemini_service import answer_question, grade_quiz

router = APIRouter(prefix="/learn", tags=["learning"])


@router.post("/ask", response_model=LearnAskResponse)
async def ask_question(req: LearnAskRequest):
    """Answer a freeform business question via AI."""
    try:
        result = answer_question(
            question=req.question,
            language=req.language,
        )
        return LearnAskResponse(
            answer=result.get("answer", ""),
            related_course=result.get("related_course"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Learning AI error: {str(e)}")


@router.post("/quiz", response_model=LearnQuizResponse)
async def quiz_answer(req: LearnQuizRequest):
    """Grade a quiz answer and return explanation."""
    try:
        result = grade_quiz(
            skill=req.skill,
            question_id=req.question_id,
            answer=req.answer,
            language=req.language,
        )
        return LearnQuizResponse(
            correct=result.get("correct", False),
            explanation=result.get("explanation", ""),
            score_delta=result.get("score_delta", 0),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz AI error: {str(e)}")
