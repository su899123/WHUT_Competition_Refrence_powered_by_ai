# AGENTS.md — 大学生竞赛信息平台

> Vue 3 + FastAPI + SQLite + TDesign 竞赛信息收集与展示系统

## 快速启动

```bash
# 1. 配置 AI（可选，跳过则 AI 功能不可用）
cp .env.example .env
# 编辑 .env：DEEPSEEK_API_KEY=sk-你的API密钥

# 2. 后端 (Python ≥ 3.10)
cd backend
pip install -r requirements.txt
python main.py                  # → http://localhost:8000, Swagger: /docs

# 3. 前端 (Node ≥ 18)
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
| AI | DeepSeek Chat API + DuckDuckGo 联网搜索 | 通过 `httpx.AsyncClient` 调用，API Key 从 `.env` 加载 |
| 配置 | python-dotenv | 启动时自动加载项目根目录 `.env` |

## 项目约定

### 后端
- **路由**: 在 `routers/` 下按功能拆分，`main.py` 中注册
- **服务层**: AI 调用逻辑隔离在 `services/ai_service.py`，含 `chat_about_competition` / `compare_competitions` / `web_search`
- **数据库会话**: 使用 `get_db()` 依赖，`finally` 中关闭
- **响应模型**: Pydantic v2 `BaseModel`，`from_attributes=True` 用于 ORM 映射
- **枚举**: `CompetitionLevel` (`A1`–`B2`), `CompetitionCategory`（中文标签）
- **AI 提示词**: 对话/对比均内置"武汉理工大学本科生"上下文
- **API Key**: `_get_api_key()` 每次调用时读取，不缓存模块级变量
- **注释**: 中文注释，保持与业务领域一致

### 前端
- **页面**: `views/` 按功能拆分，admin 页面在 `views/admin/`
- **API 封装**: 集中在 `api/index.ts`，使用 Axios 实例（`baseURL: '/api'`）
- **类型**: 集中在 `types/index.ts`
- **样式**: 组件级 scoped CSS，亮色白底主题，高对比度
- **主题**: 全局样式在 App.vue `<style>`（无 scoped），组件用 scoped
- **路由**: 懒加载，Vite 代理 `/api` → `localhost:8000`
- **Markdown**: AI 对话/对比输出用 `renderMd()` 函数渲染，不用第三方库
- **类别标签**: 使用 `categoryTheme()` 映射到 TDesign 彩色主题（primary/warning/success/danger）
- **日期处理**: 统一使用 `dayjs`，日历页用 `dayjs().isSame()` 匹配月份

## 注意事项

- **API Key 配置**: 通过项目根目录 `.env` 文件配置，不再依赖终端环境变量。`main.py` 启动时自动检测并打印状态
- **联网搜索**: 使用 DuckDuckGo Instant Answer API（免费，无需 Key），在 `ai_service.py` 的 `web_search()` 中实现
- **数据导入**: `import_data.py` 自动检测 `storage/competition-v*.txt` 最新版本（支持 v1-v99），支持 `--dry-run` 预览
- **v2 数据格式**: JSON 中 `level` 值可能缺引号、字段间缺逗号，`fix_json()` 自动修复
- **即将截止**: 30 天内截止的竞赛，首页提醒可点击筛选查看
- **Schema 默认值**: `CompetitionCreate.level` 默认 `"B1"`，与 ORM 枚举一致
- **类型已修复**: `CompetitionCreate` 已包含 `summary?: string` 字段
- **日期匹配已修复**: `CompetitionCalendar.vue` 改用 `dayjs().isSame()` 代替字符串前缀
- **错误处理已统一**: 所有前端页面使用 `MessagePlugin.error/warning/success`，`loading` 在 `finally` 关闭
- **对比请求已并行**: `Comparison.vue` 用 `Promise.all` 替代串行 `for...of`
- **文件编码**: `.vue` 文件必须使用 UTF-8 BOM 编码（`create_file` 工具可能产生无 BOM 编码导致中文乱码，需用 PowerShell `WriteAllText` + UTF8Encoding 修复）

## 关键文件

- `backend/main.py` — 应用入口、CORS、路由注册、`.env` 加载、启动检测
- `backend/models.py` — Competition ORM 模型及枚举定义
- `backend/schemas.py` — Pydantic 请求/响应模型（含 AIChat、AICompare）
- `backend/database.py` — SQLite 连接与 `get_db()` 依赖
- `backend/routers/competitions.py` — 竞赛 CRUD + 统计 API（含排序校验）
- `backend/routers/ai.py` — AI 摘要/对话/对比 API
- `backend/services/ai_service.py` — DeepSeek 调用 + DuckDuckGo 联网搜索
- `backend/import_data.py` — 数据导入（自动版本检测、JSON 容错）
- `frontend/src/App.vue` — 全局布局 + 亮色主题样式 + TDesign 覆盖
- `frontend/src/api/index.ts` — Axios 封装及所有 API 方法（含 chat/compare）
- `frontend/src/types/index.ts` — TypeScript 类型定义
- `frontend/src/router/index.ts` — 路由配置
- `frontend/src/views/Home.vue` — 首页列表 + 即将截止筛选
- `frontend/src/views/CompetitionDetail.vue` — 详情 + AI 对话助手
- `frontend/src/views/Comparison.vue` — 对比 + AI 多维度分析（Promise.all 并行）
- `frontend/vite.config.ts` — Vite 配置及 API 代理
- `.env` / `.env.example` — API Key 配置
- `.github/skills/` — AI 编程助手 Skill（code-review / frontend-page / import-competitions / new-api）

详细文档见 [README.md](./README.md)。
