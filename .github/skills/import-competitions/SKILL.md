---
name: import-competitions
description: '从 storage/competition-vXX.txt 导入竞赛数据到数据库。自动检测最新版本文件，清空旧数据后全量导入。Use when: 导入竞赛数据、更新数据库、新版本数据文件到达、数据迁移。'
argument-hint: '可选：指定版本号，如 v3；不指定则自动用最新版本'
---

# 导入竞赛数据

从 `storage/competition-vXX.txt` 全量导入竞赛数据到 SQLite 数据库。


## 适用场景

- 新的 `competition-v*.txt` 文件到达，需要更新数据库
- 数据库被清空后需要恢复
- 数据格式升级，需要重新导入

## 流程

### 第 1 步：确认数据文件

检查 `storage/` 目录下的文件：

```bash
ls storage/competition-v*.txt
```

**自动检测规则**：
- 扫描 `storage/competition-v*.txt`，提取版本号（支持 1-2 位数字）
- 自动选择最大版本号的文件
- 可通过 `--version v3` 手动指定版本

### 第 2 步：运行导入

```bash
cd backend
python import_data.py              # 自动用最新版本
python import_data.py --version v3 # 指定版本
python import_data.py --dry-run    # 预览模式，不实际写入
```

### 第 3 步：验证

1. 访问 `http://localhost:8000/docs`，调用 `GET /api/competitions` 检查数据量
2. 访问前端 `http://localhost:5173/`，确认列表、详情、日历、统计页数据正确
3. 检查导入日志中的警告信息，关注解析失败的条目

### 第 4 步：回滚（如有问题）

```bash
# 用之前的版本文件重新导入
cd backend
python import_data.py --version v2  # 回滚到 v2
```

---

## 数据格式约定

### 文本文件格式

每条记录由两部分组成：
```
N.网站：URL
{ JSON }
```

**兼容的变体**：
- `N.网站：` / `N.网址：`（均可）
- `N，网站：` / `N。网站：`（全角标点兼容）
- `N.网站:` / `N.网站：`（半角/全角冒号兼容）

### JSON 字段映射

| 源字段 | 目标字段 | 说明 |
|--------|---------|------|
| `title` | `title` | 竞赛名称 |
| `level` | `level` | A1/A2/A3/B1/B2，null 时自动推断 |
| `organizer` | `organizer` | 主办单位，null→"" |
| `intro` | `description` + `summary` | 完整描述 + 前150字摘要 |
| `deadline` | `registration_end` | 报名截止日期 |
| `tracks` | `tags` | 赛道列表，逗号拼接 |
| `qq_groups` | `contact_info` | QQ群，格式化为 `赛道:群号; ...` |
| `file_url` | `official_url` | 官方链接，优先取 file_url |

### 自动推断

| 字段 | 推断逻辑 |
|------|---------|
| `level` | 无效值/null → 从标题关键词推断（"全国"→A2, "校"→B1...） |
| `category` | 从标题+赛道关键词推断（理工科/文科/商科/艺术/综合） |

---

## 容错处理

脚本自动修复以下常见格式问题，无需手动修正源文件：

| 问题 | 示例 | 修复方式 |
|------|------|---------|
| level 值缺引号 | `"level": A2` | 正则补引号 → `"level": "A2"` |
| 字段间缺逗号 | `"level": "A2"\n"tracks"` | 正则补逗号 |
| 日期格式多样 | `2026年3月23日`、`2026.03.23` | 多格式 `strptime` |
| 全角标点 | `51，网址：`、`51。网站：` | 正则兼容全角 |
| JSON 前有描述文字 | `根据文档...\n{...}` | 自动找 `{` 位置截取 |

跳过的条目会在控制台打印 `⚠ 第 N 条 ... 失败`，不影响其他条目导入。

---

## 注意事项

- **全量替换**：导入前会清空数据库全部竞赛，不会增量合并
- **不调用 AI**：导入的竞赛不含 AI 摘要，需在管理后台手动触发 AI 解析
- **status 默认 active**：所有导入竞赛状态为 active
- **后端会重载**：导入脚本修改数据库文件会触发 uvicorn 的 watch 重载
