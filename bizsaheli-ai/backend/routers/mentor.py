"""
POST /mentor — Get Lakshmi mentor feedback for a business decision.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import MentorRequest, MentorResponse
from services.gemini_service import get_mentor_response

router = APIRouter(prefix="/mentor", tags=["mentor"])


@router.post("", response_model=MentorResponse)
async def mentor_feedback(req: MentorRequest):
    """Generate AI mentor feedback for user's business decision."""
    try:
        result = get_mentor_response(
            business_type=req.business_type,
            day=req.day,
            capital=req.capital,
            profit=req.profit,
            scenario=req.scenario,
            choice=req.choice,
            outcome=req.outcome,
            language=req.language,
        )
        return MentorResponse(
            message=result.get("message", ""),
            comparison_table=result.get("comparison_table", []),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mentor AI error: {str(e)}")
