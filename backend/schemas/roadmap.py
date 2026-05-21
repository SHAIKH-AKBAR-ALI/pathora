from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field


class DifficultyLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class RoadmapRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=200)
    difficulty: DifficultyLevel
    goal: str = Field(min_length=1, max_length=200)


class RateRequest(BaseModel):
    rating: Literal[1, -1]


class ExplainRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=100)


class WhyRequest(BaseModel):
    topic: str = Field(min_length=1, max_length=100)


class RoadmapPhase(BaseModel):
    phase_number: int
    title: str
    description: str
    topics: list[str]
    estimated_days: int


class RoadmapContent(BaseModel):
    title: str
    total_estimated_days: int
    phases: list[RoadmapPhase]


class RoadmapResponse(BaseModel):
    id: str
    user_id: str
    topic: str
    difficulty: str
    goal: str
    content: RoadmapContent
    rating: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
