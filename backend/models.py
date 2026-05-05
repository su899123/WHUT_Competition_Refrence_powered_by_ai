from sqlalchemy import Column, Integer, String, Text, Date, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
import enum

from database import Base


class CompetitionLevel(str, enum.Enum):
    A1 = "A1"
    A2 = "A2"
    A3 = "A3"
    B1 = "B1"
    B2 = "B2"


class CompetitionCategory(str, enum.Enum):
    STEM = "理工科"
    LIBERAL_ARTS = "文科"
    BUSINESS = "商科"
    MEDICINE = "医学"
    ART = "艺术"
    COMPREHENSIVE = "综合"
    OTHER = "其他"


class Competition(Base):
    __tablename__ = "competitions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False, index=True)
    level = Column(SAEnum(CompetitionLevel), nullable=False, default=CompetitionLevel.B1)
    category = Column(SAEnum(CompetitionCategory), nullable=False, default=CompetitionCategory.COMPREHENSIVE)
    organizer = Column(String(200), default="")  # 主办单位
    description = Column(Text, default="")  # 原始描述
    summary = Column(Text, default="")  # AI摘要
    # AI 结构化提取字段
    registration_start = Column(Date, nullable=True)  # 报名开始
    registration_end = Column(Date, nullable=True)  # 报名截止
    competition_date = Column(Date, nullable=True)  # 比赛时间
    eligibility = Column(Text, default="")  # 参赛资格
    awards = Column(Text, default="")  # 奖项设置
    contact_info = Column(String(300), default="")  # 联系方式
    official_url = Column(String(500), default="")  # 官方链接
    tags = Column(String(500), default="")  # 标签，逗号分隔
    status = Column(String(20), default="active")  # active / closed / archived
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
