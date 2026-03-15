"""
POST /scenario — Generate a daily business scenario via Claude AI.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ScenarioRequest, ScenarioResponse, ScenarioOption
from services.gemini_service import generate_scenario

router = APIRouter(prefix="/scenario", tags=["scenario"])


@router.post("", response_model=ScenarioResponse)
async def create_scenario(req: ScenarioRequest):
    """Generate a new daily business scenario."""
    try:
        result = generate_scenario(
            business_type=req.business_type,
            day=req.day,
            capital=req.capital,
            profit=req.profit,
            inventory=req.inventory,
            events=req.events,
            language=req.language,
        )
        options = [
            ScenarioOption(
                label=opt.get("label", ""),
                text=opt.get("text", ""),
                risk_level=opt.get("risk_level", "medium"),
            )
            for opt in result.get("options", [])
        ]
        return ScenarioResponse(
            scenario=result.get("scenario", ""),
            options=options,
            difficulty=result.get("difficulty", "medium"),
            category=result.get("category", "general"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scenario AI error: {str(e)}")
