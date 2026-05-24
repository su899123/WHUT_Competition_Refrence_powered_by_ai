# 前端检查清单

> 对 Vue 3/TypeScript 前端代码逐文件检查。

---

## 通用检查（所有 .vue / .ts 文件）

- [ ] 是否使用了 `<script setup lang="ts">`？（项目约定，不用 Options API）
- [ ] 是否引入了 Pinia/Vuex？（项目约定：组件级状态，不用状态管理库）
- [ ] 日期处理是否用了 `dayjs` 而非 `moment`？
- [ ] TDesign 组件是否在模板中直接使用（不 import）？（`main.ts` 已全局注册）
- [ ] import 路径是否使用了 `@/` 别名而非相对路径 `../../`？

---

## `frontend/src/types/index.ts`

- [ ] `CompetitionCreate` 是否缺少 `summary` 字段？
  - 已知陷阱：`CompetitionForm.vue` 发送了 `summary`，但类型定义中没有
- [ ] 日期字段类型是否为 `string | null`（而非 `Date`）？
  - 后端 JSON 序列化后日期变成字符串
- [ ] 响应接口是否包含服务端生成字段（`id`、`created_at`、`updated_at`）？
- [ ] 请求接口是否排除了服务端生成字段？
- [ ] 接口命名是否一致：`Xxx`（单条）、`XxxListResponse`（列表）、`XxxCreate`（创建）？

---

## `frontend/src/api/index.ts`

- [ ] API 路径是否去掉了 `/api` 前缀？（Axios `baseURL` 已是 `/api`）
- [ ] GET 请求参数是否放在 `{ params }` 中？
- [ ] POST/PUT 的 data 是否直接作为第二个参数（不嵌套在 `{ data }` 中）？
- [ ] 返回类型泛型是否正确（如 `api.get<CompetitionListResponse>`）？
- [ ] 是否有 API 方法定义了但前端页面未使用？
- [ ] `timeout: 30000` 对 AI 接口是否足够（AI 可能需要更长时间）？

---

## `frontend/src/router/index.ts`

- [ ] 所有路由是否使用 `() => import(...)` 懒加载？
- [ ] Admin 子路由的 `path` 是否不带 `/` 前缀？
- [ ] Admin 子路由的 `name` 是否以 `admin-` 开头？
- [ ] 参数路由（如 `:id`）是否正确使用了动态参数语法？
- [ ] 是否有路由配置了但 View 文件不存在？

---

## `frontend/src/App.vue`

- [ ] 导航 `router-link` 的 `active` 判断是否与路由 `path` 一致？
- [ ] `activeMenu` computed 是否处理了子路径匹配？
  - 如 `/competition/:id` 应匹配到 `/`
- [ ] 是否有 TDesign 图标 `name` 不存在于图标库中？
- [ ] `<style>` 是否应该加 `scoped`？（全局 reset 除外）

---

## `frontend/src/views/*.vue` (每个页面组件)

- [ ] `<template>` 根元素是否有明确的 class 名？
- [ ] 使用了 `v-for` 是否加了 `:key`？
- [ ] 异步数据加载是否有 `loading` 状态和 `t-loading` 包裹？
- [ ] 空数据状态是否有友好提示（而非空白页）？

### API 调用检查

- [ ] `onMounted` 中是否调用了数据加载函数？
- [ ] 错误处理是否一致：用 `MessagePlugin.error()` 而非 `console.log` 或静默忽略？
  - 已知陷阱：`Home.vue` 只 log，`CompetitionCalendar.vue` 静默忽略
- [ ] 增/删/改成功后是否调用了 `fetchList()` 刷新数据？
- [ ] `loading` 是否在 `finally` 中置 `false`（确保异常时也关闭）？
- [ ] 并发请求是否可以考虑 `Promise.all` 替代顺序 `await`？
  - 已知陷阱：`Comparison.vue` 用 `for...of` 顺序请求

### 日期处理检查

- [ ] 日期格式化是否用 `dayjs(dateStr).format(...)`？
- [ ] 日期比较是否用 `dayjs(dateStr).diff(dayjs(), 'day')`？
- [ ] `CompetitionCalendar.vue` 是否依赖了字符串前缀匹配月份？
  - 已知陷阱：后端日期格式改变会导致日历失效

### 类型安全检查

- [ ] 是否从 `@/types` 导入了正确的类型？
- [ ] API 响应是否用类型断言（`as`）绕过类型检查？
- [ ] `route.params.id` 是否转换为 `Number()`？（路由参数是字符串）

---

## `frontend/src/views/admin/*.vue` (管理页面)

- [ ] 是否导入了 `MessagePlugin` from `tdesign-vue-next`？
- [ ] 删除操作是否用了 `t-popconfirm` 二次确认？
- [ ] 表单提交前是否有必填字段校验？
- [ ] `CompetitionForm.vue` 发送的数据是否与 `CompetitionCreate` 类型匹配？
  - 已知陷阱：`form.aiSummary` 赋值给 `summary` 字段，但类型定义缺少 `summary`

---

## `frontend/vite.config.ts`

- [ ] 代理 `/api` 是否指向正确的后端地址 `http://localhost:8000`？
- [ ] `@` 别名是否指向 `src` 目录？

---

## `frontend/package.json`

- [ ] 依赖版本是否与 lockfile 一致？
- [ ] `dayjs` 是否在 dependencies 中？
- [ ] 是否有未使用的依赖？

---

## 验证命令

```bash
# TypeScript 类型检查
cd frontend && npx vue-tsc --noEmit

# 构建检查
npm run build

# 开发服务器
npm run dev
# 打开浏览器逐一访问每个路由，确认无空白页和控制台报错
```
