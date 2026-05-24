# 后端检查清单

> 对 Python/FastAPI 后端代码逐文件检查。

---

## 通用检查（所有 .py 文件）

- [ ] 是否有裸 `except Exception`？替换为具体异常类型
- [ ] 导入语句是否按标准库 → 第三方 → 项目模块排序？
- [ ] 是否有未使用的 import？
- [ ] 变量/函数名是否用 `snake_case`？
- [ ] 中文注释是否正确描述了业务逻辑？

---

## `backend/main.py`

- [ ] 所有 `routers/` 下的路由是否都已 `import` 并 `include_router`？
- [ ] CORS `allow_origins` 是否包含当前前端地址（开发: `localhost:5173`）？
- [ ] `Base.metadata.create_all` 是否在路由注册之前调用？

---

## `backend/models.py`

- [ ] ORM 枚举（`CompetitionLevel`、`CompetitionCategory`）的值是否与 Schema 默认值一致？
  - 特别注意：Schema `level` 默认值不应为 `"校级"`（ORM 枚举是 `A1`-`B2`）
- [ ] 新增 Model 是否继承 `Base`（来自 `database.py`）？
- [ ] `__tablename__` 是否命名规范（小写复数蛇形）？
- [ ] `id` 字段是否设 `primary_key=True, autoincrement=True`？
- [ ] 日期字段类型是否正确（`Date` vs `DateTime`）？
- [ ] 字符串字段长度是否合理（`String(200)` vs `Text`）？

---

## `backend/schemas.py`

- [ ] 响应模型是否设 `model_config = {"from_attributes": True}`？
- [ ] `Create` Schema 的默认值是否与 ORM 枚举一致？
  - 已知陷阱：`level="校级"` → 应为 `"B1"`
  - 已知陷阱：`category="综合"` → 应检查是否与 `CompetitionCategory.COMPREHENSIVE` 一致
- [ ] `Update` Schema 字段是否全是 `Optional`？
- [ ] 日期字段类型：请求用 `Optional[date]`，响应用 `Optional[date]`，不要用 `str`
- [ ] `ListOut` 是否包含 `total: int` 和 `items: list[XxxOut]`？
- [ ] 是否有 Schema 定义了但 Router 未使用？（如 `ComparisonRequest`）

---

## `backend/routers/*.py`

- [ ] 路由 `prefix` 是否以 `/api/` 开头？
- [ ] `db: Session = Depends(get_db)` 是否作为最后一个参数？
- [ ] 查询不存在的资源是否返回 `HTTPException(status_code=404)`？
- [ ] ORM 对象转 Pydantic 是否用 `XxxOut.model_validate(obj)`（Pydantic v2 标准）？
- [ ] Pydantic 转 ORM 是否用 `Model(**data.model_dump())`？
- [ ] 更新操作是否用 `data.model_dump(exclude_unset=True)` 只更新传入字段？
- [ ] `sort_by` 参数是否做了合法字段校验？（当前实现用 `getattr(..., default)` 静默回退）
- [ ] `level`/`category` 筛选是否应该校验枚举值？
- [ ] 异常处理是否区分了业务异常和系统异常？
- [ ] `DELETE` 端点是否返回一致的响应格式？

---

## `backend/routers/ai.py`

- [ ] `except Exception` 是否过于宽泛？应区分网络错误、API 错误、JSON 解析错误
- [ ] 是否对 DeepSeek API Key 未设置的情况给出友好提示？
- [ ] 超时设置是否合理（当前 `httpx` 60s）？

---

## `backend/services/ai_service.py`

- [ ] 是否调用了 `response.raise_for_status()`？（当前未调用，HTTP 错误被静默吞掉）
- [ ] `data["choices"][0]["message"]["content"]` 是否先检查 `choices` 非空？
- [ ] JSON 解析是否处理了 `json.JSONDecodeError`？
- [ ] Markdown 代码块清理是否健壮（处理嵌套 ``` 的情况）？
- [ ] `DEEPSEEK_API_KEY` 为空时是否提前报错而非发送无效请求？
- [ ] API URL 和 model 名称是否硬编码？（当前是）

---

## `backend/database.py`

- [ ] `get_db()` 是否在 `finally` 中 `db.close()`？
- [ ] SQLite URL 是否正确（`sqlite:///./competitions.db`）？
- [ ] `check_same_thread=False` 是否已设置？（SQLite 必须）

---

## `backend/import_data.py`

- [ ] 文件路径是否硬编码？如果修改数据文件名是否需要同步更新代码？
- [ ] 导入前是否先删除了旧数据？（当前行为：有数据就全删）
- [ ] JSON 解析失败是否有 `try/except` 并打印警告？
- [ ] 新增字段（如 `registration_start`、`eligibility`）是否在导入时赋值？
- [ ] 级别/类别推断规则是否与 ORM 枚举值一致？

---

## 验证命令

```bash
# 语法检查
python -m py_compile backend/main.py
python -m py_compile backend/routers/*.py

# 启动后端确认无报错
cd backend && python main.py
# 访问 http://localhost:8000/docs 确认所有接口可见
```
