import os
import json
from fastapi import APIRouter, Depends, HTTPException
from httpx import HTTPError
from sqlalchemy.orm import Session

from database import get_db
from models import Competition
from services.ai_service import extract_competition_info, chat_about_competition, compare_competitions
from schemas import (
    AISummaryRequest, AISummaryOut,
    AIChatRequest, AIChatResponse,
    AICompareRequest, AICompareResponse,
)

router = APIRouter(prefix="/api/ai", tags=["ai"])


def _competition_to_json(comp: Competition) -> str:
    """将 Competition ORM 对象转为 AI 可读的 JSON 字符串"""
    return json.dumps({
        "id": comp.id, "title": comp.title, "level": comp.level,
        "category": comp.category, "organizer": comp.organizer,
        "description": comp.description[:500],
        "registration_end": str(comp.registration_end) if comp.registration_end else "未公布",
        "eligibility": comp.eligibility or "不限",
        "awards": comp.awards or "未注明",
        "tags": comp.tags,
    }, ensure_ascii=False)


@router.post("/summarize", response_model=AISummaryOut)
async def summarize_competition(request: AISummaryRequest):
    """AI 解析竞赛描述，返回结构化信息 + 摘要"""
    if not os.getenv("DEEPSEEK_API_KEY"):
        raise HTTPException(status_code=500, detail="DeepSeek API Key 未配置，请设置环境变量 DEEPSEEK_API_KEY")
    try:
        result = await extract_competition_info(request.description)
        return result
    except HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AI 服务调用失败: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI 返回格式错误: {str(e)}")


@router.post("/chat", response_model=AIChatResponse)
async def ai_chat(request: AIChatRequest, db: Session = Depends(get_db)):
    """AI 对话：基于竞赛信息回答用户问题，支持联网搜索"""
    if not os.getenv("DEEPSEEK_API_KEY"):
        raise HTTPException(status_code=500, detail="DeepSeek API Key 未配置")
    competition = db.query(Competition).filter(Competition.id == request.competition_id).first()
    if not competition:
        raise HTTPException(status_code=404, detail="竞赛不存在")

    # 当前竞赛上下文
    current_json = _competition_to_json(competition)

    # 全局竞赛参考：同级别 + 同类别，取前 5 条
    related = (
        db.query(Competition)
        .filter(Competition.id != request.competition_id)
        .filter(
            (Competition.level == competition.level) |
            (Competition.category == competition.category)
        )
        .limit(5).all()
    )
    related_text = "\n".join(
        f"- {c.title} (级别:{c.level}, 类别:{c.category}, 截止:{c.registration_end or '未知'})"
        for c in related
    )

    try:
        reply = await chat_about_competition(
            competition_json=current_json,
            related_competitions=related_text,
            user_message=request.message,
            enable_search=request.enable_search,
        )
        return AIChatResponse(reply=reply)
    except HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AI 服务调用失败: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI 返回格式错误: {str(e)}")


@router.post("/compare", response_model=AICompareResponse)
async def ai_compare(request: AICompareRequest, db: Session = Depends(get_db)):
    """AI 对比分析：多维度对比多个竞赛"""
    if not os.getenv("DEEPSEEK_API_KEY"):
        raise HTTPException(status_code=500, detail="DeepSeek API Key 未配置")
    if len(request.ids) < 2:
        raise HTTPException(status_code=400, detail="至少选择 2 个竞赛进行对比")

    competitions = db.query(Competition).filter(Competition.id.in_(request.ids)).all()
    if len(competitions) < 2:
        raise HTTPException(status_code=404, detail="部分竞赛不存在")

    comps_json = "\n---\n".join(_competition_to_json(c) for c in competitions)

    try:
        result = await compare_competitions(
            competitions_json=comps_json,
            dimensions=request.dimensions,
        )
        return AICompareResponse(result=result)
    except HTTPError as e:
        raise HTTPException(status_code=502, detail=f"AI 服务调用失败: {str(e)}")
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI 返回格式错误: {str(e)}")
