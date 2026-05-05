<template>
  <div class="compare-page">
    <t-card :bordered="false" title="🔄 竞赛对比分析">
      <p class="compare-desc">选择 2~5 个竞赛进行横向对比分析</p>

      <!-- 竞赛选择 -->
      <div class="select-area">
        <t-select
          v-model="selectedIds"
          multiple
          placeholder="搜索并选择要对比的竞赛..."
          filterable
          :max="5"
          class="compare-select"
          @change="onSelectionChange"
        >
          <t-option
            v-for="c in allCompetitions"
            :key="c.id"
            :value="c.id"
            :label="c.title"
          >
            <div class="option-item">
              <span>{{ c.title }}</span>
              <t-tag size="small" variant="light">{{ c.level }}</t-tag>
            </div>
          </t-option>
        </t-select>
        <t-button
          theme="primary"
          :disabled="selectedIds.length < 2"
          @click="doCompare"
        >
          开始对比
        </t-button>
      </div>

      <!-- 对比结果 -->
      <div v-if="compareList.length >= 2" class="compare-table-wrap">
        <t-table
          :data="compareList"
          :columns="compareColumns"
          row-key="id"
          bordered
          stripe
          table-layout="auto"
        >
          <template #title="{ row }">
            <strong>{{ row.title }}</strong>
          </template>
          <template #level="{ row }">
            <t-tag :theme="levelTheme(row.level)" variant="light" size="small">
              {{ row.level }}
            </t-tag>
          </template>
          <template #registration_end="{ row }">
            <span :class="{ 'deadline-near': isUpcoming(row.registration_end) }">
              {{ row.registration_end || '-' }}
            </span>
          </template>
        </t-table>
      </div>

      <div v-else-if="selectedIds.length >= 2" class="loading-compare">
        <t-loading text="正在加载对比数据..." />
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { competitionApi } from '@/api'
import type { Competition } from '@/types'
import dayjs from 'dayjs'

const allCompetitions = ref<Competition[]>([])
const selectedIds = ref<number[]>([])
const compareList = ref<Competition[]>([])

const compareColumns = [
  { colKey: 'title', title: '竞赛名称', width: 200 },
  { colKey: 'level', title: '级别', width: 100 },
  { colKey: 'category', title: '类别', width: 80 },
  { colKey: 'organizer', title: '主办方', width: 150 },
  { colKey: 'registration_end', title: '报名截止', width: 120 },
  { colKey: 'eligibility', title: '参赛资格', ellipsis: true },
  { colKey: 'awards', title: '奖项设置', ellipsis: true },
  { colKey: 'contact_info', title: '联系方式', width: 150 },
]

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

function onSelectionChange() {
  compareList.value = []
}

async function doCompare() {
  const results: Competition[] = []
  for (const id of selectedIds.value) {
    const { data } = await competitionApi.getById(id)
    results.push(data)
  }
  compareList.value = results
}

onMounted(async () => {
  const { data } = await competitionApi.list({ page_size: 100, status: 'active' })
  allCompetitions.value = data.items
})
</script>

<style scoped>
.compare-desc {
  color: #888;
  margin-bottom: 16px;
}

.select-area {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.compare-select {
  flex: 1;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.compare-table-wrap {
  overflow-x: auto;
}

.deadline-near {
  color: #e34d59;
  font-weight: 600;
}

.loading-compare {
  padding: 40px;
  text-align: center;
}
</style>
