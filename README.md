# 🏆 大学生竞赛信息平台

基于 **Vue 3 + FastAPI** 的多端适配竞赛信息收集与展示系统，致力于收集学校内网发布的竞赛信息并做 AI 智能摘要，最终在网页上多维度展示。

## ✨ 核心功能

| 功能 | 说明 |
|------|------|
| 📋 **竞赛列表** | 卡片网格展示，支持关键词搜索、级别/类别筛选、分页 |
| 📝 **竞赛详情** | AI 智能摘要 + 结构化字段（主办方、参赛资格、奖项等） |
| 📅 **竞赛日历** | 左侧序号列表 + 右侧红点标注日历，月视图切换 |
| 📊 **数据统计** | 概览卡片 + 柱状图 + 饼图，可视化竞赛分布 |
| 🔄 **对比分析** | 选择 2-5 个竞赛横向表格对比 |
| 🛠 **后台管理** | 竞赛 CRUD + AI 智能解析 + 状态管理 |
| 🤖 **AI 摘要** | 接入 DeepSeek API，自动提取结构化信息并生成摘要 |

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Vue 3 (Composition API) + Vite + TypeScript |
| **UI 框架** | TDesign Vue Next (腾讯多端适配组件库) |
| **后端** | Python FastAPI (自动生成 Swagger 文档) |
| **数据库** | SQLite (零配置，单文件) |
| **AI 模型** | DeepSeek Chat API |
| **工具库** | Axios / dayjs / Vue Router |

## 📁 项目结构

```
web/
├── backend/                          # FastAPI 后端
│   ├── main.py                       # 应用入口，路由注册，CORS
│   ├── database.py                   # SQLite 连接与 ORM 基类
│   ├── models.py                     # Competition 数据模型
│   ├── schemas.py                    # Pydantic 请求/响应模型
│   ├── import_data.py                # 数据导入脚本
│   ├── requirements.txt              # Python 依赖
│   ├── routers/
│   │   ├── competitions.py           # 竞赛 CRUD + 统计 API
│   │   └── ai.py                     # AI 摘要 API
│   └── services/
│       └── ai_service.py             # DeepSeek API 调用封装
│
├── frontend/                         # Vue 3 前端
│   ├── package.json
│   ├── vite.config.ts                # Vite 配置 + 代理
│   ├── index.html                    # SPA 入口
│   └── src/
│       ├── main.ts                   # 应用入口
│       ├── App.vue                   # 全局布局
│       ├── router/index.ts           # 路由配置
│       ├── types/index.ts            # TypeScript 类型
│       ├── api/index.ts              # Axios 封装
│       └── views/
│           ├── Home.vue              # 竞赛列表首页
│           ├── CompetitionDetail.vue # 竞赛详情页
│           ├── CompetitionCalendar.vue # 竞赛日历
│           ├── Statistics.vue        # 数据统计
│           ├── Comparison.vue        # 对比分析
│           └── admin/                # 后台管理
│               ├── AdminLayout.vue
│               ├── CompetitionList.vue
│               └── CompetitionForm.vue
│
├── storage/                          # 竞赛原始数据
│   ├── 竞赛收集1.txt
│   └── 竞赛收集2.txt
└── .gitignore
```

## 🚀 快速开始

### 环境要求

- **Python** ≥ 3.10
- **Node.js** ≥ 18
- **npm** ≥ 9

### 1. 克隆项目

```bash
git clone <repo-url>
cd web
```

### 2. 启动后端

```bash
# 安装 Python 依赖
cd backend
pip install -r requirements.txt

# 启动 FastAPI 服务 (默认 http://localhost:8000)
python main.py
```

API 文档自动生成于：http://localhost:8000/docs

### 3. 启动前端

```bash
cd frontend

# 安装 npm 依赖
npm install

# 启动 Vite 开发服务器 (默认 http://localhost:5173)
npm run dev
```

### 4. 配置 AI 摘要 (可选)

AI 摘要功能需要 DeepSeek API Key：

```powershell
# Windows PowerShell
$env:DEEPSEEK_API_KEY = "你的API密钥"

# 或在 backend/services/ai_service.py 中直接设置
```

### 5. 导入竞赛数据

```bash
cd backend
python import_data.py
```

## 📡 API 概览

| 方法 | 路径 | 说明 |
|------|------|------|
| `GET` | `/api/competitions` | 竞赛列表（支持关键词搜索、级别/类别筛选、分页） |
| `GET` | `/api/competitions/{id}` | 竞赛详情 |
| `POST` | `/api/competitions` | 创建竞赛 |
| `PUT` | `/api/competitions/{id}` | 更新竞赛 |
| `DELETE` | `/api/competitions/{id}` | 删除竞赛 |
| `GET` | `/api/competitions/stats/overview` | 统计概览 |
| `POST` | `/api/ai/summarize` | AI 摘要解析 |

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
- 日历页移动端自动上下堆叠布局

## 📄 License

MIT
