from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional

from database import get_db
from models import Competition, CompetitionLevel, CompetitionCategory
from schemas import CompetitionCreate, CompetitionUpdate, CompetitionOut, CompetitionListOut

router = APIRouter(prefix="/api/competitions", tags=["competitions"])


@router.get("", response_model=CompetitionListOut)
def list_competitions(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    keyword: Optional[str] = Query(None, description="搜索关键词"),
    level: Optional[str] = Query(None, description="级别筛选"),
    category: Optional[str] = Query(None, description="类别筛选"),
    status: Optional[str] = Query("active", description="状态筛选"),
    sort_by: Optional[str] = Query("created_at", description="排序字段"),
    sort_order: Optional[str] = Query("desc", description="排序方向"),
    db: Session = Depends(get_db),
):
    query = db.query(Competition)

    if status:
        query = query.filter(Competition.status == status)
    if keyword:
        keyword_filter = or_(
            Competition.title.ilike(f"%{keyword}%"),
            Competition.description.ilike(f"%{keyword}%"),
            Competition.summary.ilike(f"%{keyword}%"),
            Competition.tags.ilike(f"%{keyword}%"),
            Competition.organizer.ilike(f"%{keyword}%"),
        )
        query = query.filter(keyword_filter)
    if level:
        query = query.filter(Competition.level == level)
    if category:
        query = query.filter(Competition.category == category)

    total = query.count()

    # 排序 — 校验排序字段
    allowed_sort_fields = {"title", "created_at", "updated_at", "registration_end", "competition_date"}
    if sort_by not in allowed_sort_fields:
        raise HTTPException(status_code=400, detail=f"无效的排序字段: {sort_by}，可选: {', '.join(sorted(allowed_sort_fields))}")
    if sort_order not in ("asc", "desc"):
        raise HTTPException(status_code=400, detail="排序方向必须是 asc 或 desc")
    sort_column = getattr(Competition, sort_by)
    if sort_order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return CompetitionListOut(
        total=total,
        items=[CompetitionOut.model_validate(item) for item in items],
    )


@router.post("", response_model=CompetitionOut)
def create_competition(data: CompetitionCreate, db: Session = Depends(get_db)):
    competition = Competition(**data.model_dump())
    db.add(competition)
    db.commit()
    db.refresh(competition)
    return CompetitionOut.model_validate(competition)


@router.get("/{competition_id}", response_model=CompetitionOut)
def get_competition(competition_id: int, db: Session = Depends(get_db)):
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(status_code=404, detail="竞赛不存在")
    return CompetitionOut.model_validate(competition)


@router.put("/{competition_id}", response_model=CompetitionOut)
def update_competition(competition_id: int, data: CompetitionUpdate, db: Session = Depends(get_db)):
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(status_code=404, detail="竞赛不存在")
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(competition, key, value)
    db.commit()
    db.refresh(competition)
    return CompetitionOut.model_validate(competition)


@router.delete("/{competition_id}")
def delete_competition(competition_id: int, db: Session = Depends(get_db)):
    competition = db.query(Competition).filter(Competition.id == competition_id).first()
    if not competition:
        raise HTTPException(status_code=404, detail="竞赛不存在")
    db.delete(competition)
    db.commit()
    return {"message": "删除成功"}


@router.get("/stats/overview")
def get_stats(db: Session = Depends(get_db)):
    """获取统计概览数据"""
    total = db.query(Competition).filter(Competition.status == "active").count()

    # 按级别统计
    level_stats = (
        db.query(Competition.level, func.count(Competition.id))
        .filter(Competition.status == "active")
        .group_by(Competition.level)
        .all()
    )

    # 按类别统计
    category_stats = (
        db.query(Competition.category, func.count(Competition.id))
        .filter(Competition.status == "active")
        .group_by(Competition.category)
        .all()
    )

    # 即将截止（30天内）
    from datetime import date, timedelta
    today = date.today()
    deadline = today + timedelta(days=30)
    upcoming = (
        db.query(Competition)
        .filter(
            Competition.status == "active",
            Competition.registration_end.isnot(None),
            Competition.registration_end >= today,
            Competition.registration_end <= deadline,
        )
        .count()
    )

    return {
        "total": total,
        "upcoming_deadline": upcoming,
        "by_level": [{"name": l, "count": c} for l, c in level_stats],
        "by_category": [{"name": c, "count": cnt} for c, cnt in category_stats],
    }
