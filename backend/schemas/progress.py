from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProgressUpdate(BaseModel):
    completed_topics: list[str]


class ProgressResponse(BaseModel):
    id: str
    user_id: str
    roadmap_id: str
    completed_topics: list[str]
    streak: int
    last_activity: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}
