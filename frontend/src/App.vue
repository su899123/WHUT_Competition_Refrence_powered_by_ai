<template>
  <t-layout class="app-layout">
    <t-header class="app-header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <t-icon name="trophy" size="24px" />
          <span class="logo-text">大学生竞赛信息平台</span>
        </div>
        <nav class="header-nav">
          <router-link to="/" class="nav-item" :class="{ active: activeMenu === '/' }">
            <t-icon name="home" /> 竞赛列表
          </router-link>
          <router-link to="/calendar" class="nav-item" :class="{ active: activeMenu === '/calendar' }">
            <t-icon name="calendar" /> 竞赛日历
          </router-link>
          <router-link to="/statistics" class="nav-item" :class="{ active: activeMenu === '/statistics' }">
            <t-icon name="chart-bar" /> 数据统计
          </router-link>
          <router-link to="/compare" class="nav-item" :class="{ active: activeMenu === '/compare' }">
            <t-icon name="swap" /> 对比分析
          </router-link>
          <router-link to="/admin" class="nav-item" :class="{ active: activeMenu === '/admin' }">
            <t-icon name="setting" /> 后台管理
          </router-link>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  background-color: #f5f7fa;
}

.app-layout {
  min-height: 100vh;
}

.app-header {
  background: #fff;
  border-bottom: 1px solid #e7e7e7;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #0052d9;
  flex-shrink: 0;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  color: #555;
  text-decoration: none;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background: #f0f5ff;
  color: #0052d9;
}

.nav-item.active {
  background: #e6f0ff;
  color: #0052d9;
  font-weight: 600;
}

.app-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 24px;
  min-height: calc(100vh - 64px - 60px);
}

.app-footer {
  text-align: center;
  color: #999;
  padding: 20px;
  border-top: 1px solid #e7e7e7;
  background: #fff;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header-content {
    height: auto;
    flex-direction: column;
    padding: 8px 12px;
    gap: 8px;
  }

  .logo {
    width: 100%;
    justify-content: center;
    padding: 4px 0;
  }

  .logo-text {
    font-size: 16px;
  }

  .header-nav {
    width: 100%;
    justify-content: space-around;
    overflow-x: auto;
    gap: 0;
  }

  .nav-item {
    padding: 8px 10px;
    font-size: 13px;
    gap: 3px;
  }

  .app-content {
    margin: 12px auto;
    padding: 0 12px;
  }
}
</style>
