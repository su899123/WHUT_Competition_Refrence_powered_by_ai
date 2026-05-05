<template>
  <div class="home-page">
    <!-- 搜索和筛选 -->
    <t-card class="filter-card" :bordered="false">
      <div class="filter-row">
        <t-input
          v-model="keyword"
          placeholder="搜索竞赛名称、标签、主办方..."
          clearable
          class="search-input"
          @enter="onSearch"
          @clear="onSearch"
        >
          <template #prefix-icon><t-icon name="search" /></template>
        </t-input>
        <t-select
          v-model="filterLevel"
          placeholder="竞赛级别"
          clearable
          class="filter-select"
          @change="onSearch"
        >
          <t-option value="A1" label="A1" />
          <t-option value="A2" label="A2" />
          <t-option value="A3" label="A3" />
          <t-option value="B1" label="B1" />
          <t-option value="B2" label="B2" />
        </t-select>
        <t-select
          v-model="filterCategory"
          placeholder="学科类别"
          clearable
          class="filter-select"
          @change="onSearch"
        >
          <t-option value="理工科" label="理工科" />
          <t-option value="文科" label="文科" />
          <t-option value="商科" label="商科" />
          <t-option value="医学" label="医学" />
          <t-option value="艺术" label="艺术" />
          <t-option value="综合" label="综合" />
        </t-select>
      </div>
    </t-card>

    <!-- 即将截止提醒 -->
    <t-alert
      v-if="upcomingCount > 0"
      theme="warning"
      :message="`有 ${upcomingCount} 个竞赛即将截止报名，请尽快关注！`"
      close
      class="deadline-alert"
    />

    <!-- 竞赛卡片列表 -->
    <t-loading :loading="loading" text="加载中...">
      <div v-if="competitions.length === 0 && !loading" class="empty-state">
        <t-icon name="inbox" size="64px" style="color: #ccc" />
        <p>暂无竞赛信息</p>
      </div>
      <div class="competition-grid">
        <t-card
          v-for="item in competitions"
          :key="item.id"
          class="competition-card"
          hover-shadow
          @click="goDetail(item.id)"
        >
          <div class="card-header">
            <t-tag :theme="levelTheme(item.level)" variant="light" size="small">
              {{ item.level }}
            </t-tag>
            <t-tag theme="default" variant="outline" size="small">
              {{ item.category }}
            </t-tag>
            <span v-if="isUpcoming(item.registration_end)" class="deadline-badge">
              <t-icon name="error-circle" /> 即将截止
            </span>
          </div>
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-summary">{{ item.summary || item.description || '暂无简介' }}</p>
          <div class="card-footer">
            <span v-if="item.registration_end" class="date-info">
              <t-icon name="calendar" />
              截止：{{ formatDate(item.registration_end) }}
            </span>
            <span class="organizer-info">
              <t-icon name="user" /> {{ item.organizer || '未知主办方' }}
            </span>
          </div>
        </t-card>
      </div>
    </t-loading>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="total > 0">
      <t-pagination
        v-model="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        :page-size-options="[8, 12, 20, 30]"
        :show-jumper="true"
        show-page-size
        @change="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { competitionApi } from '@/api'
import type { Competition, StatsOverview } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()

const loading = ref(false)
const competitions = ref<Competition[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(12)

const keyword = ref('')
const filterLevel = ref('')
const filterCategory = ref('')

const upcomingCount = ref(0)

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
  const map: Record<string, string> = {
    'A1': 'danger',
    'A2': 'warning',
    'A3': 'primary',
    'B1': 'success',
    'B2': 'default',
  }
  return map[level] || 'default'
}

async function fetchCompetitions() {
  loading.value = true
  try {
    const { data } = await competitionApi.list({
      page: currentPage.value,
      page_size: pageSize.value,
      keyword: keyword.value || undefined,
      level: filterLevel.value || undefined,
      category: filterCategory.value || undefined,
      status: 'active',
    })
    competitions.value = data.items
    total.value = data.total
  } catch (e) {
    console.error('加载竞赛列表失败:', e)
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  try {
    const { data } = await competitionApi.stats()
    upcomingCount.value = data.upcoming_deadline
  } catch (e) {
    // ignore
  }
}

function onSearch() {
  currentPage.value = 1
  fetchCompetitions()
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  currentPage.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchCompetitions()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goDetail(id: number) {
  router.push(`/competition/${id}`)
}

onMounted(() => {
  fetchCompetitions()
  fetchStats()
})
</script>

<style scoped>
.home-page {
  max-width: 100%;
}

.filter-card {
  margin-bottom: 16px;
}

.filter-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  width: 150px;
}

.deadline-alert {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #999;
}

.empty-state p {
  margin-top: 12px;
  font-size: 16px;
}

.competition-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.competition-card {
  cursor: pointer;
  transition: transform 0.2s;
  border-radius: 8px;
}

.competition-card:hover {
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.deadline-badge {
  color: #e34d59;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 500;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.card-summary {
  color: #666;
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
  min-height: 42px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.date-info,
.organizer-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .competition-grid {
    grid-template-columns: 1fr;
  }

  .filter-select {
    width: 120px;
    flex: 1;
  }
}
</style>
