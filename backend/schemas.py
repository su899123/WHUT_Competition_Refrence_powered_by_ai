from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime


class CompetitionCreate(BaseModel):
    title: str = Field(..., max_length=200)
    level: str = "B1"
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

    model_config = {"from_attributes": True}


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

    model_config = {"from_attributes": True}


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


# ============ AI 对话 & 对比 ============

class AIChatRequest(BaseModel):
    competition_id: int = Field(..., description="当前竞赛ID")
    message: str = Field(..., min_length=1, description="用户消息")
    enable_search: bool = Field(False, description="是否启用联网搜索")


class AIChatResponse(BaseModel):
    reply: str


class AICompareRequest(BaseModel):
    ids: list[int] = Field(..., min_length=2, max_length=5, description="要对比的竞赛ID列表")
    dimensions: list[str] = Field(
        default_factory=lambda: ["综合推荐", "级别含金量", "时间紧迫度", "难度评估", "适合人群"],
        description="对比维度"
    )


class AICompareResponse(BaseModel):
    result: str
