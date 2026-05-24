<template>
  <t-layout class="app-layout">
    <t-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-icon">🏆</span>
          <span class="logo-text">大学生竞赛信息平台</span>
        </div>
        <nav class="header-nav">
          <router-link to="/" class="nav-item" :class="{ active: activeMenu === '/' }">📋 竞赛列表</router-link>
          <router-link to="/calendar" class="nav-item" :class="{ active: activeMenu === '/calendar' }">📅 竞赛日历</router-link>
          <router-link to="/statistics" class="nav-item" :class="{ active: activeMenu === '/statistics' }">📊 数据统计</router-link>
          <router-link to="/compare" class="nav-item" :class="{ active: activeMenu === '/compare' }">🔄 对比分析</router-link>
          <router-link to="/admin" class="nav-item" :class="{ active: activeMenu === '/admin' }">⚙️ 后台管理</router-link>
        </nav>
      </div>
    </t-header>
    <t-content class="app-content">
      <router-view />
    </t-content>
    <t-footer class="app-footer">
      <span>© 2026 大学生竞赛信息平台 · 助力每一位追梦学子</span>
    </t-footer>
  </t-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/admin')) return '/admin'
  if (path.startsWith('/competition/')) return '/'
  return path || '/'
})
</script>

<style>
:root { --accent: #1a6fff; --border: #e2e4e9; --radius: 10px; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif; background: #f0f2f5; color: #1a1a2e; }

.t-card { background: #fff !important; border: 1px solid var(--border) !important; border-radius: var(--radius) !important; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.t-card:hover { border-color: var(--accent) !important; }
.t-card__title, .t-card__header { color: #1a1a2e; font-weight: 600; }
.t-input__inner, .t-select__wrap { color: #1a1a2e; }
.t-input__inner::placeholder { color: #aaa; }
.t-input, .t-select, .t-textarea { background: #fff !important; border-color: var(--border) !important; }
.t-button--theme-primary { background: var(--accent) !important; border: none !important; color: #fff !important; }
.t-table { background: #fff !important; }
.t-table th { background: #f8f9fc !important; color: #555; font-weight: 600; }
.t-table td { border-color: var(--border) !important; color: #1a1a2e; }
.t-table tr:hover td { background: #f5f7fa !important; }
.t-pagination .t-is-current { background: var(--accent) !important; color: #fff !important; }
.t-alert--warning { background: #fff8e6 !important; border-color: #ffd666 !important; }
.t-alert__content { color: #8c5a00; }
.t-divider { border-color: var(--border) !important; }
.t-tag { border-radius: 6px !important; }

.app-layout { min-height: 100vh; }
.app-header { background: #fff !important; border-bottom: 1px solid var(--border) !important; padding: 0 32px; position: sticky; top: 0; z-index: 100; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
.header-content { display: flex; align-items: center; justify-content: space-between; height: 60px; max-width: 1400px; margin: 0 auto; }
.logo { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; }
.logo-icon { font-size: 28px; }
.logo-text { font-size: 18px; font-weight: 700; color: var(--accent); }
.header-nav { display: flex; align-items: center; gap: 4px; }
.nav-item { display: flex; align-items: center; gap: 4px; padding: 8px 16px; border-radius: 8px; text-decoration: none; color: #555; font-size: 14px; font-weight: 500; transition: all 0.2s; }
.nav-item:hover { color: var(--accent); background: #f0f5ff; }
.nav-item.active { color: var(--accent); background: #e8f0fe; font-weight: 600; }
.app-content { max-width: 1400px; margin: 0 auto; padding: 24px 32px; min-height: calc(100vh - 120px); }
.app-footer { background: #fff !important; border-top: 1px solid var(--border) !important; text-align: center; padding: 20px !important; color: #999; font-size: 13px; }

@media (max-width: 768px) {
  .app-header { padding: 0 16px; }
  .header-content { height: auto; flex-direction: column; gap: 8px; padding: 12px 0; }
  .header-nav { flex-wrap: wrap; justify-content: center; gap: 2px; }
  .nav-item { padding: 6px 10px; font-size: 13px; }
  .logo-text { font-size: 16px; }
  .app-content { padding: 16px; }
}
</style>
