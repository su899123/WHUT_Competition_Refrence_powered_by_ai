<template>
  <div class="detail-page">
    <t-loading :loading="loading">
      <template v-if="competition">
        <!-- 返回按钮 -->
        <t-button variant="text" @click="$router.push('/')" class="back-btn">
          <t-icon name="chevron-left" /> 返回列表
        </t-button>

        <!-- 标题区 -->
        <t-card :bordered="false" class="header-card">
          <div class="title-row">
            <h1>{{ competition.title }}</h1>
            <div class="title-tags">
              <t-tag :theme="levelTheme(competition.level)" variant="light" size="medium">
                {{ competition.level }}
              </t-tag>
              <t-tag theme="default" variant="outline" size="medium">
                {{ competition.category }}
              </t-tag>
              <t-tag
                v-if="isUpcoming(competition.registration_end)"
                theme="danger"
                variant="light"
                size="medium"
              >
                即将截止
              </t-tag>
            </div>
          </div>
          <div class="meta-row">
            <span v-if="competition.organizer">
              <t-icon name="user" /> {{ competition.organizer }}
            </span>
            <span>
              <t-icon name="time" /> 发布于 {{ formatDateTime(competition.created_at) }}
            </span>
          </div>
        </t-card>

        <div class="detail-grid">
          <!-- 左侧详情 -->
          <div class="detail-main">
            <t-card :bordered="false" title="📝 AI 智能摘要">
              <p class="summary-text">{{ competition.summary || '暂无AI摘要' }}</p>
            </t-card>

            <t-card :bordered="false" title="📄 竞赛详情" class="section-card">
              <div class="description-text">{{ competition.description || '暂无详细描述' }}</div>
            </t-card>

            <t-card v-if="competition.eligibility" :bordered="false" title="🎯 参赛资格" class="section-card">
              <p>{{ competition.eligibility }}</p>
            </t-card>

            <t-card v-if="competition.awards" :bordered="false" title="🏆 奖项设置" class="section-card">
              <p>{{ competition.awards }}</p>
            </t-card>
          </div>

          <!-- 右侧信息栏 -->
          <div class="detail-sidebar">
            <t-card :bordered="false" title="📋 关键信息">
              <div class="info-list">
                <div class="info-item" v-if="competition.registration_start">
                  <span class="info-label">报名开始</span>
                  <span class="info-value">{{ formatDate(competition.registration_start) }}</span>
                </div>
                <div class="info-item" v-if="competition.registration_end">
                  <span class="info-label">报名截止</span>
                  <span class="info-value highlight">{{ formatDate(competition.registration_end) }}</span>
                </div>
                <div class="info-item" v-if="competition.competition_date">
                  <span class="info-label">比赛时间</span>
                  <span class="info-value">{{ formatDate(competition.competition_date) }}</span>
                </div>
                <div class="info-item" v-if="competition.contact_info">
                  <span class="info-label">联系方式</span>
                  <span class="info-value">{{ competition.contact_info }}</span>
                </div>
              </div>
            </t-card>

            <t-card :bordered="false" title="🏷️ 标签" class="section-card" v-if="competition.tags">
              <div class="tags-wrap">
                <t-tag
                  v-for="tag in tagList"
                  :key="tag"
                  variant="light"
                  class="tag-item"
                >
                  {{ tag }}
                </t-tag>
              </div>
            </t-card>

            <t-card :bordered="false" class="section-card" v-if="competition.official_url">
              <t-button
                theme="primary"
                block
                @click="openUrl(competition.official_url)"
              >
                <t-icon name="link" /> 访问官方链接
              </t-button>
            </t-card>
          </div>
        </div>
      </template>
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { competitionApi } from '@/api'
import type { Competition } from '@/types'
import dayjs from 'dayjs'

const route = useRoute()
const loading = ref(true)
const competition = ref<Competition | null>(null)

const tagList = computed(() => {
  if (!competition.value?.tags) return []
  return competition.value.tags.split(',').filter(Boolean)
})

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return dayjs(dateStr).format('YYYY-MM-DD')
}

function formatDateTime(dateStr: string | null) {
  if (!dateStr) return ''
  return dayjs(dateStr).format('YYYY-MM-DD HH:mm')
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

function openUrl(url: string) {
  window.open(url, '_blank')
}

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    const { data } = await competitionApi.getById(id)
    competition.value = data
  } catch (e) {
    console.error('加载竞赛详情失败:', e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.detail-page {
  max-width: 100%;
}

.back-btn {
  margin-bottom: 16px;
}

.header-card {
  margin-bottom: 24px;
}

.title-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.title-row h1 {
  font-size: 24px;
  font-weight: 700;
  flex: 1;
  min-width: 250px;
}

.title-tags {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.meta-row {
  display: flex;
  gap: 24px;
  color: #888;
  font-size: 14px;
}

.meta-row span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.summary-text {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  background: #f0f5ff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #0052d9;
}

.description-text {
  font-size: 15px;
  line-height: 1.8;
  color: #333;
  white-space: pre-wrap;
}

.section-card {
  margin-bottom: 0;
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.info-label {
  color: #888;
  font-size: 14px;
}

.info-value {
  font-weight: 500;
  font-size: 14px;
}

.info-value.highlight {
  color: #e34d59;
  font-weight: 600;
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .title-row h1 {
    font-size: 20px;
  }
}
</style>
