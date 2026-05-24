---
name: code-review
description: '对项目代码进行质量检查（后端 FastAPI + 前端 Vue 3），覆盖已知陷阱、约定违规、潜在 bug。Use when: 需要代码审查、检查代码质量、提交前 review、排查常见错误。'
argument-hint: '可选：检查后端 / 检查前端 / 全面检查（默认）'
---

# 项目代码审查

对竞赛信息平台进行代码质量检查。根据检查范围，加载对应的专项检查清单。

## 确定检查范围

| 用户描述 | 加载清单 |
|---------|---------|
| "检查后端" / "只查 Python" | 只加载 [backend-checklist.md](./references/backend-checklist.md) |
| "检查前端" / "只查 Vue" | 只加载 [frontend-checklist.md](./references/frontend-checklist.md) |
| "全面检查" / 未指定范围 | 依次加载两个清单 |

## 审查流程

### 1. 列出目标文件

根据检查范围，列出需要检查的所有源文件：

- **后端**：`backend/main.py`、`backend/models.py`、`backend/schemas.py`、`backend/database.py`、`backend/routers/*.py`、`backend/services/*.py`、`backend/import_data.py`
- **前端**：`frontend/src/App.vue`、`frontend/src/router/index.ts`、`frontend/src/api/index.ts`、`frontend/src/types/index.ts`、`frontend/src/views/**/*.vue`

### 2. 逐文件检查

对每个文件，按清单逐项核对：

- ✅ 通过 — 符合规范
- ⚠️ 建议 — 不致命但可改进
- ❌ 问题 — 需要修复（潜在 bug、约定违规）

### 3. 输出报告

按严重度降序排列：

```
## 代码审查报告

### ❌ 需要修复（X 项）
| 文件 | 行 | 问题 | 修复建议 |
...

### ⚠️ 建议改进（X 项）
| 文件 | 行 | 问题 | 修复建议 |
...

### ✅ 已通过（X 项）
...
```

---

## 关键上下文

审查时牢记项目特有约定：

- **后端**：Pydantic v2 `model_validate`、`get_db()` 依赖注入、路由必须 `main.py` 注册
- **前端**：`<script setup lang="ts">`、TDesign 全局注册、无 Pinia、`dayjs` 处理日期
- **全栈**：前后端字段名统一 `snake_case`、API 前缀 `/api`
- **已知陷阱**：见 [AGENTS.md](../../../AGENTS.md) 注意事项章节

## 输出原则

1. **不虚构问题**：必须有对应代码行才能报
2. **优先致命错误**：路由未注册 > 类型缺口 > 错误处理缺失 > 代码风格
3. **每个问题给修复代码**：不只说"有问题"，要给出具体怎么改
4. **关联已知陷阱**：如果发现的问题在 `AGENTS.md` 中已有记录，标注"已知陷阱"
