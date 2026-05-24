<template>
  <div class="home-page">
    <t-card class="filter-card" :bordered="false">
      <div class="filter-row">
        <t-input v-model="keyword" placeholder="搜索竞赛名称、标签、主办方..." clearable class="search-input" @enter="onSearch" @clear="onSearch">
          <template #prefix-icon><t-icon name="search" /></template>
        </t-input>
        <t-select v-model="filterLevel" placeholder="竞赛级别" clearable class="filter-select" @change="onSearch">
          <t-option value="A1" label="A1" />
          <t-option value="A2" label="A2" />
          <t-option value="A3" label="A3" />
          <t-option value="B1" label="B1" />
          <t-option value="B2" label="B2" />
        </t-select>
        <t-select v-model="filterCategory" placeholder="学科类别" clearable class="filter-select" @change="onSearch">
          <t-option value="理工科" label="理工科" />
          <t-option value="文科" label="文科" />
          <t-option value="商科" label="商科" />
          <t-option value="医学" label="医学" />
          <t-option value="艺术" label="艺术" />
          <t-option value="综合" label="综合" />
        </t-select>
      </div>
    </t-card>

    <div v-if="upcomingCount > 0 && !showUpcomingOnly" class="alert-custom alert-warning">
      <t-icon name="error-circle" />
      <span>有 <b>{{ upcomingCount }}</b> 个竞赛即将截止报名</span>
      <t-button variant="text" theme="warning" size="small" @click.stop="showUpcoming">点击查看 →</t-button>
    </div>

    <div v-if="showUpcomingOnly" class="alert-custom alert-info">
      <t-icon name="info-circle" />
      <span>正在查看即将截止报名的竞赛</span>
      <t-button variant="text" size="small" @click="resetFilter">← 返回全部竞赛</t-button>
    </div>

    <t-loading :loading="loading" text="加载中...">
      <div v-if="competitions.length === 0 && !loading" class="empty-state">
        <t-icon name="inbox" size="64px" style="color: #555" />
        <p>暂无竞赛信息</p>
      </div>
      <div class="competition-grid">
        <t-card v-for="item in competitions" :key="item.id" class="competition-card" hover-shadow @click="goDetail(item.id)">
          <div class="card-header">
            <t-tag :theme="levelTheme(item.level)" variant="light" size="small">{{ item.level }}</t-tag>
            <t-tag :theme="categoryTheme(item.category)" variant="light" size="small">{{ item.category }}</t-tag>
            <span v-if="isUpcoming(item.registration_end)" class="deadline-badge">
              <t-icon name="error-circle" /> 即将截止
            </span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">{{ item.summary || item.description || '暂无简介' }}</p>
          <div class="card-footer">
            <span class="organizer-info">
              <t-icon name="user" /> {{ item.organizer || '未知主办方' }}
            </span>
            <span v-if="item.registration_end" class="date-info">
              <t-icon name="calendar" /> 截止：{{ formatDate(item.registration_end) }}
            </span>
          </div>
        </t-card>
      </div>
    </t-loading>

    <div class="pagination-wrapper" v-if="total > 0">
      <t-pagination v-model="currentPage" v-model:pageSize="pageSize" :total="total" :page-size-options="[8, 12, 20, 30]" :show-jumper="true" show-page-size @change="onPageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { competitionApi } from '@/api'
import type { Competition } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const competitions = ref<Competition[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)
const keyword = ref('')
const filterLevel = ref('')
const filterCategory = ref('')
const upcomingCount = ref(0)
const showUpcomingOnly = ref(false)

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return dayjs(dateStr).format('YYYY-MM-DD')
}
function isUpcoming(dateStr: string | null) {
  if (!dateStr) return false
  const end = dayjs(dateStr)
  const now = dayjs()
  return end.diff(now, 'day') <= 7 && end.diff(now, 'day') >= 0
}
function levelTheme(level: string) {
  const map: Record<string, string> = { A1: 'danger', A2: 'warning', A3: 'primary', B1: 'success', B2: 'default' }
  return map[level] || 'default'
}
function categoryTheme(category: string) {
  const map: Record<string, string> = {
    '理工科': 'primary', '文科': 'warning', '商科': 'success',
    '医学': 'danger', '艺术': 'warning', '综合': 'primary',
  }
  return map[category] || 'primary'
}

async function fetchCompetitions() {
  loading.value = true
  try {
    const params: any = {
      page: currentPage.value, page_size: pageSize.value,
      keyword: keyword.value || undefined,
      level: filterLevel.value || undefined,
      category: filterCategory.value || undefined,
      status: 'active',
    }
    if (showUpcomingOnly.value) {
      params.page_size = 100
      params.sort_by = 'registration_end'
      params.sort_order = 'asc'
    }
    const { data } = await competitionApi.list(params)
    if (showUpcomingOnly.value) {
      const now = dayjs()
      const deadline30 = now.add(30, 'day')
      const filtered = data.items.filter(item => {
        if (!item.registration_end) return false
        const end = dayjs(item.registration_end)
        return end.isAfter(now) && end.isBefore(deadline30)
      })
      competitions.value = filtered
      total.value = filtered.length
    } else {
      competitions.value = data.items
      total.value = data.total
    }
  } catch (e) {
    MessagePlugin.error('加载竞赛列表失败')
  } finally {
    loading.value = false
  }
}

function showUpcoming() {
  showUpcomingOnly.value = true
  currentPage.value = 1
  pageSize.value = 30
  fetchCompetitions()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetFilter() {
  showUpcomingOnly.value = false
  currentPage.value = 1
  pageSize.value = 12
  fetchCompetitions()
}

async function fetchStats() {
  try {
    const { data } = await competitionApi.stats()
    upcomingCount.value = data.upcoming_deadline
  } catch (e) {
    MessagePlugin.warning('获取统计信息失败')
  }
}

function onSearch() { currentPage.value = 1; fetchCompetitions() }
function onPageChange(pageInfo: { current: number; pageSize: number }) {
  currentPage.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchCompetitions()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
function goDetail(id: number) { router.push(`/competition/${id}`) }

onMounted(() => { fetchCompetitions(); fetchStats() })
</script>

<style scoped>
.home-page { max-width: 100%; }
.filter-card { margin-bottom: 20px; }
.filter-row { display: flex; gap: 12px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 200px; }
.filter-select { width: 150px; }
.deadline-alert { margin-bottom: 20px; cursor: pointer; }
.alert-custom {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; border-radius: 8px;
  margin-bottom: 20px; font-size: 14px; line-height: 22px;
}
.alert-custom .t-icon { flex-shrink: 0; font-size: 16px; }
.alert-custom span { flex: 1; }
.alert-custom .t-button { flex-shrink: 0; font-size: 14px; }
.alert-warning { background: #fff8e6; border: 1px solid #ffd666; color: #8c5a00; }
.alert-info { background: #e8f0fe; border: 1px solid #a8c8fa; color: #1a6fff; }
.empty-state { text-align: center; padding: 80px 0; color: #999; }
.empty-state p { margin-top: 12px; font-size: 16px; }

.competition-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.competition-card {
  cursor: pointer; transition: all 0.3s;
  border: 1px solid #e8e8e8 !important; overflow: hidden;
  padding: 0 !important; height: 220px;
}
.competition-card :deep(.t-card__body) {
  padding: 20px 20px 16px 20px !important;
  display: flex; flex-direction: column;
  height: 100%;
}
.competition-card:hover { transform: translateY(-3px); border-color: #1a6fff !important; box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.card-header { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.card-title { font-size: 16px; font-weight: 600; margin: 10px 0 6px 0; color: #1a1a2e; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex-shrink: 0; }
.card-summary { font-size: 13px; color: #666; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
.card-footer { display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #999; flex-shrink: 0; padding-top: 10px; border-top: 1px solid #f0f0f0; }
.date-info, .organizer-info { display: flex; align-items: center; gap: 4px; }
.deadline-badge { display: flex; align-items: center; gap: 4px; color: #e0243f; font-size: 12px; font-weight: 600; }
.pagination-wrapper { display: flex; justify-content: center; margin-top: 24px; }

@media (max-width: 768px) { .competition-grid { grid-template-columns: 1fr; } .filter-row { flex-direction: column; } .filter-select { width: 100%; } }
</style>