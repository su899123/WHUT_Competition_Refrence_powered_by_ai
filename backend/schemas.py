from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class CompetitionCreate(BaseModel):
    title: str = Field(..., max_length=200)
    level: str = "校级"
    category: str = "综合"
    organizer: str = ""
    description: str = ""
    registration_start: Optional[date] = None
    registration_end: Optional[date] = None
    competition_date: Optional[date] = None
    eligibility: str = ""
    awards: str = ""
    contact_info: str = ""
    official_url: str = ""
    tags: str = ""


class CompetitionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    level: Optional[str] = None
    category: Optional[str] = None
    organizer: Optional[str] = None
    description: Optional[str] = None
    registration_start: Optional[date] = None
    registration_end: Optional[date] = None
    competition_date: Optional[date] = None
    eligibility: Optional[str] = None
    awards: Optional[str] = None
    contact_info: Optional[str] = None
    official_url: Optional[str] = None
    tags: Optional[str] = None
    status: Optional[str] = None


class CompetitionOut(BaseModel):
    id: int
    title: str
    level: str
    category: str
    organizer: str
    description: str
    summary: str
    registration_start: Optional[date] = None
    registration_end: Optional[date] = None
    competition_date: Optional[date] = None
    eligibility: str
    awards: str
    contact_info: str
    official_url: str
    tags: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CompetitionListOut(BaseModel):
    total: int
    items: list[CompetitionOut]


class AISummaryRequest(BaseModel):
    description: str = Field(..., description="竞赛原始描述文本")


class AISummaryOut(BaseModel):
    summary: str
    title: str
    level: str
    category: str
    organizer: str
    registration_start: Optional[str] = None
    registration_end: Optional[str] = None
    competition_date: Optional[str] = None
    eligibility: str
    awards: str
    contact_info: str
    tags: str


class ComparisonRequest(BaseModel):
    ids: list[int] = Field(..., min_length=2, max_length=5)


class ComparisonItem(BaseModel):
    id: int
    title: str
    level: str
    category: str
    organizer: str
    registration_end: Optional[date] = None
    eligibility: str
    awards: str


class ComparisonOut(BaseModel):
    competitions: list[ComparisonItem]
