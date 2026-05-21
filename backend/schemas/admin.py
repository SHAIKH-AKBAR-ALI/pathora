import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict


class UserActionEnum(str, Enum):
    ban = "ban"
    unban = "unban"
    change_plan = "change_plan"


class UserListResponse(BaseModel):
    id: uuid.UUID
    email: str
    full_name: str | None
    role: str
    created_at: datetime
    deleted_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class UserActionRequest(BaseModel):
    action: UserActionEnum
    plan: str | None = None  # "free" or "paid" — required when action == change_plan

    model_config = ConfigDict(from_attributes=True)


class PlatformStatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_roadmaps: int
    total_revenue_inr: int
    new_users_today: int

    model_config = ConfigDict(from_attributes=True)


class FeatureFlagResponse(BaseModel):
    id: uuid.UUID
    name: str
    enabled: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class FeatureFlagUpdate(BaseModel):
    enabled: bool

    model_config = ConfigDict(from_attributes=True)
