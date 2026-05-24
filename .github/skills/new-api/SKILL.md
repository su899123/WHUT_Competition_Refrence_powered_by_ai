---
name: new-api
description: '新增一个全栈 API 端点（后端 Schema → Router → 注册 → 前端 API 方法 → 前端类型）。Use when: 需要新增接口、添加后端路由、前后端联调新功能、扩展 API。'
argument-hint: '描述你要新增的 API 功能，例如：新增公告 CRUD、新增用户收藏接口'
---

# 新增全栈 API 端点

按照后端→前端的顺序，为竞赛信息平台新增一个完整的 API 端点。

## 适用场景

- 新增一个数据库表的 CRUD 接口（需新建 Model）
- 在已有表上扩展新查询端点（不需新建 Model）
- 新增统计/聚合类接口（非 CRUD 模式）

## 开始前：判断两条路径

| 问题 | 是 → 执行 | 否 → 跳过 |
|------|-----------|-----------|
| 需要**新建数据库表**吗？ | 先执行第 0 步，再 1→6 | 从第 1 步开始 |
| 是 **CRUD** 还是**聚合查询**？ | CRUD 用模板 A | 聚合查询用模板 B（见第 2 步分支） |

---

## 流程

按顺序执行以下步骤，每步完成后确认无误再进行下一步。

### 第 0 步：后端 — 新建数据库模型（按需）

> 仅在需要新建数据库表时执行此步。如果是在已有 `competitions` 表上扩展，跳过。

在 `backend/models.py` 中定义 ORM 模型：

```python
class Xxx(Base):
    __tablename__ = "xxx"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text, default="")            # 长文本用 Text
    status = Column(String(20), default="active")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
```

**检查清单**：
- [ ] 继承 `Base`（来自 `database.py`）
- [ ] `__tablename__` 用复数/小写蛇形命名
- [ ] `id` 设 `primary_key=True, autoincrement=True`
- [ ] 标题类字段设 `index=True`
- [ ] 时间戳用 `server_default=func.now()`
- [ ] 如有枚举，参考已有 `CompetitionLevel` 模式定义

> 表会在 `main.py` 启动时通过 `Base.metadata.create_all(bind=engine)` 自动创建。

---

### 第 1 步：后端 — 定义 Pydantic Schema

在 `backend/schemas.py` 中添加请求/响应模型。

**模式参考**（已存在的模式）：

```python
# 创建请求 — 必填字段用 Field(...)，可选字段给默认值
class XxxCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: str = ""

# 更新请求 — 全部 Optional
class XxxUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None

# 响应 — 包含所有字段 + from_attributes=True
class XxxOut(BaseModel):
    id: int
    title: str
    created_at: datetime

    model_config = {"from_attributes": True}

# 列表响应 — total + items
class XxxListOut(BaseModel):
    total: int
    items: list[XxxOut]
```

**检查清单**：
- [ ] 继承 `BaseModel`（Pydantic v2）
- [ ] 响应模型设置 `model_config = {"from_attributes": True}`
- [ ] 日期字段用 `Optional[date]`，时间戳用 `datetime`

### 第 2 步：后端 — 编写路由

在 `backend/routers/` 下新建或编辑路由文件。

#### 模板 A：CRUD 端点

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import Xxx
from schemas import XxxCreate, XxxUpdate, XxxOut, XxxListOut

router = APIRouter(prefix="/api/xxx", tags=["xxx"])

@router.get("", response_model=XxxListOut)
def list_xxx(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    keyword: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(Xxx)
    if keyword:
        query = query.filter(Xxx.title.ilike(f"%{keyword}%"))
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return XxxListOut(total=total, items=[XxxOut.model_validate(item) for item in items])

@router.post("", response_model=XxxOut)
def create_xxx(data: XxxCreate, db: Session = Depends(get_db)):
    obj = Xxx(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return XxxOut.model_validate(obj)

@router.get("/{obj_id}", response_model=XxxOut)
def get_xxx(obj_id: int, db: Session = Depends(get_db)):
    obj = db.query(Xxx).filter(Xxx.id == obj_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="资源不存在")
    return XxxOut.model_validate(obj)

@router.put("/{obj_id}", response_model=XxxOut)
def update_xxx(obj_id: int, data: XxxUpdate, db: Session = Depends(get_db)):
    obj = db.query(Xxx).filter(Xxx.id == obj_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="资源不存在")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return XxxOut.model_validate(obj)

@router.delete("/{obj_id}")
def delete_xxx(obj_id: int, db: Session = Depends(get_db)):
    obj = db.query(Xxx).filter(Xxx.id == obj_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="资源不存在")
    db.delete(obj)
    db.commit()
    return {"message": "删除成功"}
```

#### 模板 B：聚合/统计端点

> 不需要 Pydantic Schema 的列表包装，直接返回自定义结构。

```python
from sqlalchemy import func

@router.get("/stats/overview")
def xxx_stats(db: Session = Depends(get_db)):
    total = db.query(Xxx).count()

    # 分组聚合示例
    by_level = (
        db.query(Xxx.level, func.count(Xxx.id))
        .group_by(Xxx.level)
        .all()
    )

    return {
        "total": total,
        "by_level": [{"name": name, "count": cnt} for name, cnt in by_level],
    }
```

**注意**：聚合端点返回 `dict`，不需要 `response_model`，但前端需在 `types/index.ts` 中手动定义返回类型接口。

**检查清单**：
- [ ] `prefix` 以 `/api/` 开头
- [ ] `db: Session = Depends(get_db)` 作为最后一个参数
- [ ] ORM → Pydantic 用 `XxxOut.model_validate(obj)`
- [ ] Pydantic → ORM 用 `Xxx(**data.model_dump())`
- [ ] 更新用 `data.model_dump(exclude_unset=True)` 只更新传入字段
- [ ] 不存在的资源返回 `HTTPException(404)`

### 第 3 步：后端 — 注册路由

在 `backend/main.py` 中注册新路由：

```python
from routers import xxx      # 新增导入

app.include_router(xxx.router)  # 新增注册
```

### 第 4 步：前端 — 添加 API 方法

在 `frontend/src/api/index.ts` 的对应 API 对象中添加方法。

**模式参考**：

```typescript
// 在已有 api 对象中添加，或新建 xxxApi 对象
export const xxxApi = {
  list(params: { page?: number; page_size?: number }) {
    return api.get<XxxListResponse>('/xxx', { params })
  },
  getById(id: number) {
    return api.get<Xxx>(`/xxx/${id}`)
  },
  create(data: XxxCreate) {
    return api.post<Xxx>('/xxx', data)
  },
  update(id: number, data: Partial<XxxCreate>) {
    return api.put<Xxx>(`/xxx/${id}`, data)
  },
  delete(id: number) {
    return api.delete(`/xxx/${id}`)
  },
}
```

**检查清单**：
- [ ] 路径去掉 `/api` 前缀（Axios `baseURL` 已是 `/api`）
- [ ] GET 请求参数放在 `{ params }` 中
- [ ] POST/PUT 的 data 直接作为第二个参数
- [ ] 泛型指定返回类型 `<Xxx>`

### 第 5 步：前端 — 补充类型定义

在 `frontend/src/types/index.ts` 中添加接口：

```typescript
export interface Xxx {
  id: number
  title: string
  created_at: string     // 前端日期用 string
  // ...其他字段
}

export interface XxxListResponse {
  total: number
  items: Xxx[]
}

export interface XxxCreate {
  title: string
  // ...必填和可选字段
}
```

**检查清单**：
- [ ] 日期字段类型为 `string | null`（后端 `date`/`datetime` 经 JSON 序列化后是字符串）
- [ ] 响应和请求类型分开定义
- [ ] `Create` 类型不包含 `id`、`created_at`、`updated_at` 等服务端生成字段

## 验证

完成所有步骤后：

1. 重启后端 `python main.py`，访问 `http://localhost:8000/docs` 确认新接口出现在 Swagger 中
2. 如果执行了第 0 步（新建表），检查 SQLite 中表是否已创建：`sqlite3 backend/competitions.db ".tables"`
3. 在 Swagger 中直接测试接口可用性
4. 前端 `npm run dev`，确认无 TypeScript 编译错误

## 注意事项

- **枚举对齐**：前端类型用 `string`，后端 Schema 默认值需与 ORM 枚举值一致（如 `A1` 而非 `"校级"`）
- **字段命名**：后端用 `snake_case`，前端用 `snake_case`（本项目前后端字段名保持一致）
- **不要遗漏**：新增路由文件后必须在 `main.py` 注册，否则 404
