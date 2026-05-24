---
name: frontend-page
description: '新增前端页面（创建 View 组件 → 添加路由 → 导航菜单 → API 对接）。Use when: 需要新建页面、添加前端路由、扩展页面功能。'
argument-hint: '描述你要新增的页面，例如：公告列表页、用户收藏页、admin 下的新管理页'
---

# 新增前端页面

按照 View → Router → 导航 → API 的顺序，为竞赛信息平台新增前端页面。

## 适用场景

- 新增一个独立页面（如公告列表、用户收藏）
- 在 `/admin` 下新增管理子页面
- 新增带参数路由的详情页（如 `/xxx/:id`）

## 开始前：判断页面类型

| 页面类型 | 路由位置 | 例子 |
|---------|---------|------|
| 顶级独立页 | `routes` 数组直接添加 | `/calendar`, `/statistics` |
| Admin 子页面 | `/admin` 的 `children` 数组 | `/admin/create` |
| 带参数详情页 | 路径含 `:id` | `/competition/:id`, `/admin/edit/:id` |

---

## 流程

### 第 1 步：创建 View 组件

在 `frontend/src/views/` 下新建 `XxxPage.vue`（admin 页面放 `views/admin/`）。

#### 模板骨架

```vue
<template>
  <div class="xxx-page">
    <t-card :bordered="false" title="页面标题">
      <!-- TDesign 组件直接使用，已全局注册，无需 import -->
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { xxxApi } from '@/api'
import type { Xxx } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const loading = ref(false)
const dataList = ref<Xxx[]>([])

async function fetchData() {
  loading.value = true
  try {
    const { data } = await xxxApi.list({ page: 1, page_size: 12 })
    dataList.value = data.items
  } catch (e) {
    MessagePlugin.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.xxx-page {
  padding: 24px;
}
</style>
```

**关键约定**：

| 项目 | 正确做法 | 错误做法 |
|------|---------|---------|
| Script | `<script setup lang="ts">` | `<script>` 或 Options API |
| 状态管理 | `ref` / `reactive` 组件级状态 | Pinia / Vuex |
| TDesign 组件 | 模板中直接用 `<t-card>` | `import { Card } from 'tdesign-vue-next'` |
| 消息提示 | `MessagePlugin.error('...')` | `alert(...)` 或 `console.log` |
| 样式 | `<style scoped>` | 全局样式或 CSS Module |
| 根元素 class | `xxx-page`（kebab-case） | 无 class 或 PascalCase |
| API 调用 | `onMounted` + `try/catch/finally` | 无错误处理 |
| 路由跳转 | `router.push('/path')` | `window.location` |

### 第 2 步：添加路由

在 `frontend/src/router/index.ts` 中添加路由配置。

#### 模板 A：顶级独立页面

```typescript
{
  path: '/xxx',
  name: 'xxx',
  component: () => import('@/views/XxxPage.vue'),
}
```

#### 模板 B：带参数的详情页

```typescript
{
  path: '/xxx/:id',
  name: 'xxx-detail',
  component: () => import('@/views/XxxDetail.vue'),
}
```

页面中获取参数：
```typescript
import { useRoute } from 'vue-router'
const route = useRoute()
const id = Number(route.params.id)  // 路径参数是字符串，需转换
```

#### 模板 C：Admin 子页面

在 `/admin` 路由的 `children` 数组中添加：
```typescript
{
  path: 'xxx',                    // 注意：不要 / 前缀
  name: 'admin-xxx',             // 命名规范：admin-xxx
  component: () => import('@/views/admin/XxxPage.vue'),
}
```

**检查清单**：
- [ ] 所有路由用 `() => import(...)` 懒加载
- [ ] admin 子路由的 `path` 不带 `/` 前缀
- [ ] admin 子路由的 `name` 以 `admin-` 开头

### 第 3 步：添加导航菜单（按需）

> 仅顶级独立页面需要此步。Admin 子页面已有侧边栏入口则跳过。

在 `frontend/src/App.vue` 的 `<nav class="header-nav">` 中添加：

```html
<router-link to="/xxx" class="nav-item" :class="{ active: activeMenu === '/xxx' }">
  <t-icon name="xxx" /> 菜单名
</router-link>
```

**选择图标**：从 [TDesign Icons](https://tdesign.tencent.com/vue-next/components/icon) 选一个合适的 `name`。

**检查清单**：
- [ ] `activeMenu === '/xxx'` 路径与路由 `path` 一致
- [ ] 如果有多级路径（如 `/xxx/:id`），在 `activeMenu` computed 中加判断：`if (path.startsWith('/xxx')) return '/xxx'`

### 第 4 步：API 对接

页面通过 `@/api` 导入对应的 API 对象和 `@/types` 类型。

#### 数据获取标准模式

```typescript
import { xxxApi } from '@/api'
import type { Xxx, XxxListResponse } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'

const loading = ref(false)
const list = ref<Xxx[]>([])
const total = ref(0)

async function fetchList() {
  loading.value = true
  try {
    const { data } = await xxxApi.list({ page: currentPage.value, page_size: pageSize.value })
    list.value = data.items
    total.value = data.total
  } catch (e) {
    MessagePlugin.error('加载失败')
  } finally {
    loading.value = false
  }
}
```

#### 带分页的完整模式

```typescript
const currentPage = ref(1)
const pageSize = ref(12)

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  currentPage.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchList()
}
```

#### 增/删/改操作模式

```typescript
async function handleDelete(id: number) {
  try {
    await xxxApi.delete(id)
    MessagePlugin.success('删除成功')
    fetchList()  // 刷新列表
  } catch (e) {
    MessagePlugin.error('删除失败')
  }
}
```

**检查清单**：
- [ ] API 路径不带 `/api` 前缀（Axios `baseURL` 已是 `/api`）
- [ ] 增删改成功后调用 `fetchList()` 刷新数据
- [ ] 错误用 `MessagePlugin.error()` 提示用户
- [ ] 成功用 `MessagePlugin.success()` 反馈
- [ ] `loading` 在 `finally` 中置 `false`（确保异常时也关闭）

---

## 验证

1. `npm run dev`，确认页面可访问且无空白
2. 打开浏览器 DevTools → Network，确认 API 请求正确发出
3. 检查控制台无红色报错
4. 测试空数据状态（后端无数据时页面不崩溃）

## 注意事项

- **TDesign 全局注册**：`main.ts` 中 `app.use(TDesign)`，所有组件在模板中直接使用
- **不可用的组件**：`t-form` 不在此项目中全局引入，如需表单参考 `admin/CompetitionForm.vue` 的手动实现
- **日期处理**：用 `dayjs`（已在 `package.json` 中），不要引入 `moment`
- **无 Pinia**：数据跨页面共享通过路由参数或 API 重新获取，不用状态管理库
