# 🏆 大学生竞赛信息平台

基于 **Vue 3 + FastAPI** 的竞赛信息收集与展示系统，收集学校内网发布的竞赛信息并通过 AI 智能分析，在网页上多维度展示。

## ✨ 核心功能

| 功能 | 说明 |
|------|------|
| 📋 **竞赛列表** | 卡片网格展示，支持关键词搜索、级别/类别筛选、分页，即将截止竞赛一键筛选 |
| 📝 **竞赛详情** | AI 智能摘要 + 结构化字段（主办方、参赛资格、奖项等）+ AI 对话助手 |
| 📅 **竞赛日历** | 左侧序号列表 + 右侧日期标注日历，月视图切换 |
| 📊 **数据统计** | 概览卡片 + 柱状图 + 饼图，可视化竞赛分布 |
| 🔄 **对比分析** | 选择 2-5 个竞赛横向表格对比 + AI 多维度深度对比分析 |
| 🛠 **后台管理** | 竞赛 CRUD + AI 智能解析 + 状态管理 |
| 🤖 **AI 对话** | 竞赛详情页内嵌 AI 助手，支持联网搜索，结合武汉理工大学背景分析 |
| 🎨 **亮色主题** | 高对比白底主题，全站响应式适配移动端 |

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Vue 3 (Composition API) + Vite + TypeScript |
| **UI 框架** | TDesign Vue Next (腾讯多端适配组件库) |
| **后端** | Python FastAPI (自动生成 Swagger 文档) |
| **数据库** | SQLite (零配置，单文件) |
| **AI 模型** | DeepSeek Chat API |
| **工具库** | Axios / dayjs / Vue Router / python-dotenv |

## 📁 项目结构

```
web/
├── .env                              # DeepSeek API Key 配置
├── .env.example                      # 配置模板
├── AGENTS.md                         # AI 编程助手指令
├── backend/                          # FastAPI 后端
│   ├── main.py                       # 应用入口，路由注册，CORS，启动检测
│   ├── database.py                   # SQLite 连接与 ORM 基类
│   ├── models.py                     # Competition 数据模型及枚举
│   ├── schemas.py                    # Pydantic 请求/响应模型
│   ├── import_data.py                # 数据导入脚本（自动检测最新版本）
│   ├── requirements.txt              # Python 依赖
│   ├── routers/
│   │   ├── competitions.py           # 竞赛 CRUD + 统计 API
│   │   └── ai.py                     # AI 摘要/对话/对比 API
│   └── services/
│       └── ai_service.py             # DeepSeek API 调用 + 联网搜索
│
├── frontend/                         # Vue 3 前端
│   ├── package.json
│   ├── vite.config.ts                # Vite 配置 + /api 代理
│   ├── index.html                    # SPA 入口
│   └── src/
│       ├── main.ts                   # 应用入口，TDesign 全局注册
│       ├── App.vue                   # 全局布局 + 主题样式
│       ├── router/index.ts           # 路由配置（懒加载）
│       ├── types/index.ts            # TypeScript 类型定义
│       ├── api/index.ts              # Axios 封装及所有 API 方法
│       └── views/
│           ├── Home.vue              # 竞赛列表首页 + 即将截止筛选
│           ├── CompetitionDetail.vue # 竞赛详情 + AI 对话助手
│           ├── CompetitionCalendar.vue # 竞赛日历（dayjs 月份匹配）
│           ├── Statistics.vue        # 数据统计图表
│           ├── Comparison.vue        # 对比分析 + AI 多维度对比
│           └── admin/                # 后台管理
│               ├── AdminLayout.vue
│               ├── CompetitionList.vue
│               └── CompetitionForm.vue
│
├── storage/                          # 竞赛原始数据
│   └── competition-v2.txt           # 当前版本数据（84 条竞赛）
│
└── .github/skills/                   # AI 编程助手 Skill
    ├── code-review/                  # 代码审查
    ├── frontend-page/                # 新增前端页面
    ├── import-competitions/          # 导入竞赛数据
    └── new-api/                      # 新增 API 端点
```

## 🚀 快速开始

### 环境要求

- **Python** ≥ 3.10
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. 项目初始化

```bash
git clone <repo-url>
cd web
```

### 2. 配置 AI（可选）

复制 `.env.example` 为 `.env`，填入 DeepSeek API Key：

```bash
cp .env.example .env
# 编辑 .env：DEEPSEEK_API_KEY=sk-你的API密钥
```

> 获取 Key：https://platform.deepseek.com/api_keys

### 3. 启动后端

```bash
cd backend
pip install -r requirements.txt
python main.py                  # → http://localhost:8000, Swagger: /docs
```

启动时会自动检测 `.env` 配置，打印 API Key 状态。

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev                     # → http://localhost:5173, API 代理到 :8000
```

### 5. 导入数据

```bash
cd backend
python import_data.py           # 自动用最新版本
python import_data.py --dry-run # 预览模式
```

## 📡 API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/competitions` | 竞赛列表（搜索、筛选、排序、分页） |
| `GET` | `/api/competitions/{id}` | 竞赛详情 |
| `POST` | `/api/competitions` | 创建竞赛 |
| `PUT` | `/api/competitions/{id}` | 更新竞赛 |
| `DELETE` | `/api/competitions/{id}` | 删除竞赛 |
| `GET` | `/api/competitions/stats/overview` | 统计概览 |
| `POST` | `/api/ai/summarize` | AI 摘要解析 |
| `POST` | `/api/ai/chat` | AI 对话（竞赛上下文 + 联网搜索） |
| `POST` | `/api/ai/compare` | AI 多维度对比分析 |

## 🎨 竞赛级别

| 级别 | 含义 |
|------|------|
| A1 | 国际级 |
| A2 | 国家级 |
| A3 | 省级 |
| B1 | 校级 |
| B2 | 院系级 |

## 📱 多端适配

- TDesign 组件库原生响应式
- 所有页面使用 CSS Grid/Flexbox + `@media` 断点适配移动端
- 导航栏移动端自动换行折叠

## 🤖 AI 编程助手 Skills

项目内置 4 个 AI 编程助手 Skill，在 VS Code Chat 中输入 `/` 即可使用：

| Skill | 用途 |
|-------|------|
| `/new-api` | 新增全栈 API 端点（Schema → Router → 前端 API → 类型） |
| `/frontend-page` | 新增前端页面（View → Router → API 对接） |
| `/code-review` | 代码质量检查（后端 + 前端） |
| `/import-competitions` | 导入竞赛数据到数据库 |

## 📄 License

MIT
