"""
GET  /progress/{uid} — Fetch user progress.
POST /progress       — Update a skill record.
"""

from fastapi import APIRouter, HTTPException
from models.schemas import ProgressResponse, ProgressUpdateRequest, SkillProgress
from db.supabase_client import supabase

router = APIRouter(prefix="/progress", tags=["progress"])


@router.get("/{uid}", response_model=ProgressResponse)
async def get_progress(uid: str):
    """Fetch user's learning progress and readiness score."""
    try:
        # Fetch skills
        result = supabase.table("learning_progress") \
            .select("*") \
            .eq("user_id", uid) \
            .execute()

        skills = [
            SkillProgress(
                skill=row["skill"],
                level=row.get("level", 0),
                completed=row.get("completed", False),
                score=row.get("score", 0),
            )
            for row in (result.data or [])
        ]

        # Fetch decision count
        decisions_result = supabase.table("decisions") \
            .select("decision_id", count="exact") \
            .eq("business_id", uid) \
            .execute()
        decision_count = decisions_result.count or 0

        # Calculate readiness score
        if skills:
            avg_score = sum(s.score for s in skills) / len(skills)
            readiness = round(avg_score, 1)
        else:
            readiness = 0.0

        return ProgressResponse(
            skills=skills,
            readiness_score=readiness,
            decision_count=decision_count,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progress fetch error: {str(e)}")


@router.post("", status_code=200)
async def update_progress(req: ProgressUpdateRequest):
    """Update or insert a skill progress record."""
    try:
        supabase.table("learning_progress").upsert({
            "user_id": req.user_id,
            "skill": req.skill,
            "level": req.level,
            "score": req.score,
            "completed": req.completed,
        }).execute()
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Progress update error: {str(e)}")
