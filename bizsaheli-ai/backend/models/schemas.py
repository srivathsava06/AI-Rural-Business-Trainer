"""
Pydantic v2 request / response models for all API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional


# ─── Mentor ──────────────────────────────────────────────────────────────────

class MentorRequest(BaseModel):
    business_type: str = Field(..., min_length=1, max_length=80)
    day: int = Field(..., ge=1)
    capital: int = Field(..., ge=0)
    profit: int = Field(default=0)
    scenario: str = Field(..., min_length=1)
    choice: str = Field(..., pattern=r"^[ABC]$")
    outcome: str = Field(..., min_length=1)
    language: str = Field(default="en", pattern=r"^(en|te|hi)$")


class ComparisonRow(BaseModel):
    option: str
    action: str
    result: str


class MentorResponse(BaseModel):
    message: str
    comparison_table: list[ComparisonRow] = []


# ─── Scenario ────────────────────────────────────────────────────────────────

class ScenarioRequest(BaseModel):
    business_type: str = Field(..., min_length=1, max_length=80)
    day: int = Field(..., ge=1)
    capital: int = Field(..., ge=0)
    profit: int = Field(default=0)
    inventory: dict = Field(default_factory=dict)
    events: list[str] = Field(default_factory=list)
    language: str = Field(default="en", pattern=r"^(en|te|hi)$")


class ScenarioOption(BaseModel):
    label: str  # "A", "B", "C"
    text: str
    risk_level: str = "medium"


class ScenarioResponse(BaseModel):
    scenario: str
    options: list[ScenarioOption]
    difficulty: str = "medium"
    category: str = "general"


# ─── Learning ────────────────────────────────────────────────────────────────

class LearnAskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=500)
    language: str = Field(default="en", pattern=r"^(en|te|hi)$")


class LearnAskResponse(BaseModel):
    answer: str
    related_course: Optional[str] = None


class LearnQuizRequest(BaseModel):
    skill: str = Field(..., min_length=1)
    question_id: str = Field(..., min_length=1)
    answer: str = Field(..., min_length=1)
    language: str = Field(default="en", pattern=r"^(en|te|hi)$")


class LearnQuizResponse(BaseModel):
    correct: bool
    explanation: str
    score_delta: int = 0


# ─── Progress ────────────────────────────────────────────────────────────────

class SkillProgress(BaseModel):
    skill: str
    level: int = Field(default=0, ge=0, le=5)
    completed: bool = False
    score: int = Field(default=0, ge=0, le=100)


class ProgressResponse(BaseModel):
    skills: list[SkillProgress] = []
    readiness_score: float = 0.0
    decision_count: int = 0


class ProgressUpdateRequest(BaseModel):
    user_id: str
    skill: str
    level: int = Field(default=0, ge=0, le=5)
    score: int = Field(default=0, ge=0, le=100)
    completed: bool = False


# ─── TTS ─────────────────────────────────────────────────────────────────────

class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000)
    language: str = Field(default="en", pattern=r"^(en|te|hi)$")
