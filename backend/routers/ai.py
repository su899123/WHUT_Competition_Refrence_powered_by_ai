from fastapi import APIRouter, HTTPException
from services.ai_service import extract_competition_info
from schemas import AISummaryRequest, AISummaryOut

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/summarize", response_model=AISummaryOut)
async def summarize_competition(request: AISummaryRequest):
    """AI 解析竞赛描述，返回结构化信息 + 摘要"""
    try:
        result = await extract_competition_info(request.description)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI解析失败: {str(e)}")
