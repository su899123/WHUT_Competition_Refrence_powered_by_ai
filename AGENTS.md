# AGENTS.md — 大学生竞赛信息平台

> Vue 3 + FastAPI + SQLite + TDesign 竞赛信息收集与展示系统

## 快速启动

```bash
# 后端 (Python ≥ 3.10)
cd backend
pip install -r requirements.txt
python main.py                  # → http://localhost:8000, Swagger: /docs

# 前端 (Node ≥ 18)
cd frontend
npm install
npm run dev                     # → http://localhost:5173, API 代理到 :8000
```

## 架构概览

| 层 | 技术 | 关键约定 |
|---|------|---------|
| 前端 | Vue 3 (Composition API) + TDesign Vue Next + TypeScript | SFC `<script setup lang="ts">`，组件级状态，无 Pinia |
| 后端 | FastAPI + SQLAlchemy 2.0 + Pydantic v2 | 依赖注入 `get_db()`，Pydantic `model_validate` |
| 数据库 | SQLite (`backend/competitions.db`) | `check_same_thread=False` |
| AI | DeepSeek Chat API | 通过 `httpx.AsyncClient` 调用 |

## 项目约定

### 后端
- **路由**: 在 `routers/` 下按功能拆分，`main.py` 中注册
- **服务层**: AI 调用逻辑隔离在 `services/ai_service.py`
- **数据库会话**: 使用 `get_db()` 依赖，`finally` 中关闭
- **响应模型**: Pydantic v2 `BaseModel`，`from_attributes=True` 用于 ORM 映射
- **枚举**: `CompetitionLevel` (`A1`–`B2`), `CompetitionCategory`（中文标签）
- **注释**: 中文注释，保持与业务领域一致

### 前端
- **页面**: `views/` 按功能拆分，admin 页面在 `views/admin/`
- **API 封装**: 集中在 `api/index.ts`，使用 Axios 实例（`baseURL: '/api'`）
- **类型**: 集中在 `types/index.ts`
- **样式**: 组件级 scoped CSS，主要使用 TDesign 原生组件
- **路由**: 懒加载，Vite 代理 `/api` → `localhost:8000`

## 注意事项

- **硬编码配置**: SQLite URL、CORS origins、DeepSeek endpoint 均为硬编码，修改时需同步更新
- **Schema 默认值**: `CompetitionCreate.level` 默认 `"校级"`，但 ORM 枚举为 `A1`–`B2`，注意对齐
- **AI 调用脆弱**: DeepSeek 响应无 `raise_for_status()`，无重试逻辑，JSON 解析假设严格格式
- **错误处理不一致**: 前端各页面对 API 错误的处理方式不统一（有的静默忽略，有的仅 log）
- **类型缺口**: `CompetitionCreate` 类型定义缺少 `summary` 字段，但 `CompetitionForm.vue` 实际发送了 `summary`
- **日期格式依赖**: `CompetitionCalendar.vue` 使用字符串前缀匹配月份，依赖后端日期格式不变
- **DeepSeek API Key**: 通过环境变量 `DEEPSEEK_API_KEY` 配置，未设置时调用会失败

## 关键文件

- `backend/main.py` — 应用入口、CORS、路由注册
- `backend/models.py` — Competition ORM 模型及枚举定义
- `backend/schemas.py` — Pydantic 请求/响应模型
- `backend/routers/competitions.py` — 竞赛 CRUD + 统计 API
- `backend/routers/ai.py` — AI 摘要 API
- `backend/services/ai_service.py` — DeepSeek 调用封装
- `frontend/src/api/index.ts` — Axios 封装及所有 API 方法
- `frontend/src/types/index.ts` — TypeScript 类型定义
- `frontend/src/router/index.ts` — 路由配置
- `frontend/vite.config.ts` — Vite 配置及 API 代理

详细文档见 [README.md](./README.md)。
