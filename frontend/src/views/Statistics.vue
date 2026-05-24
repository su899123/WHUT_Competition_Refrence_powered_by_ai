<template>
  <div class="stats-page">
    <t-loading :loading="loading">
      <div class="stats-cards">
        <t-card :bordered="false" class="stat-card"><div class="stat-num primary">{{ stats.total }}</div><div class="stat-label">活跃竞赛总数</div></t-card>
        <t-card :bordered="false" class="stat-card"><div class="stat-num warning">{{ stats.upcoming_deadline }}</div><div class="stat-label">即将截止（30天内）</div></t-card>
      </div>
      <div class="charts-grid">
        <t-card :bordered="false" title="竞赛级别分布">
          <div class="chart-container">
            <div class="bar-chart">
              <div v-for="item in stats.by_level" :key="item.name" class="bar-row">
                <span class="bar-label">{{ item.name }}</span><div class="bar-track"><div class="bar-fill" :class="'bar-' + levelColor(item.name)" :style="{ width: getPercent(item.count, maxLevelCount) + '%' }"></div></div><span class="bar-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </t-card>
        <t-card :bordered="false" title="学科类别分布">
          <div class="chart-container">
            <div class="pie-legend"><div v-for="(item, idx) in stats.by_category" :key="item.name" class="legend-item"><span class="legend-dot" :style="{ background: categoryColors[idx % categoryColors.length] }"></span><span class="legend-name">{{ item.name }}</span><span class="legend-count">{{ item.count }}</span></div></div>
            <div class="pie-visual">
              <svg viewBox="0 0 200 200" width="200" height="200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#eee" stroke-width="30" />
                <circle v-for="(slice, idx) in pieSlices" :key="idx" cx="100" cy="100" r="80" fill="none" :stroke="slice.color" stroke-width="30" :stroke-dasharray="slice.dashArray" :stroke-dashoffset="slice.dashOffset" transform="rotate(-90 100 100)" style="transition: all 0.5s" />
              </svg>
            </div>
          </div>
        </t-card>
      </div>
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { competitionApi } from '@/api'
import type { StatsOverview } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'

const loading = ref(true)
const stats = ref<StatsOverview>({ total: 0, upcoming_deadline: 0, by_level: [], by_category: [] })
const categoryColors = ['#1a6fff', '#0d9e6c', '#e0243f', '#e8830c', '#8b5cf6', '#06b6d4', '#84cc16']

const maxLevelCount = computed(() => { if (stats.value.by_level.length === 0) return 1; return Math.max(...stats.value.by_level.map(i => i.count)) })
const pieSlices = computed(() => {
  const total = stats.value.by_category.reduce((s, i) => s + i.count, 0); if (total === 0) return []
  const circumference = 2 * Math.PI * 80; let offset = 0
  return stats.value.by_category.map((item, idx) => { const ratio = item.count / total; const dashLen = ratio * circumference; const slice = { color: categoryColors[idx % categoryColors.length], dashArray: `${dashLen} ${circumference - dashLen}`, dashOffset: -offset }; offset += dashLen; return slice })
})

function getPercent(count: number, max: number) { if (max === 0) return 0; return Math.round((count / max) * 100) }
function levelColor(level: string) { const map: Record<string,string> = { A1:'danger',A2:'warning',A3:'primary',B1:'success',B2:'default' }; return map[level]||'default' }

onMounted(async () => {
  try { const { data } = await competitionApi.stats(); stats.value = data }
  catch (e) { MessagePlugin.error('加载统计数据失败') }
  finally { loading.value = false }
})
</script>

<style scoped>
.stats-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { text-align: center; padding: 24px; }
.stat-num { font-size: 40px; font-weight: 700; margin-bottom: 8px; }
.stat-num.primary { color: #1a6fff; }
.stat-num.warning { color: #e8830c; }
.stat-label { color: #888; font-size: 14px; }
.charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.chart-container { padding: 16px 0; }
.bar-chart { display: flex; flex-direction: column; gap: 16px; }
.bar-row { display: flex; align-items: center; gap: 12px; }
.bar-label { width: 60px; text-align: right; font-size: 13px; color: #666; flex-shrink: 0; }
.bar-track { flex: 1; height: 24px; background: #f0f0f0; border-radius: 12px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 12px; transition: width 0.5s ease; min-width: 20px; }
.bar-danger { background: #e0243f; }
.bar-warning { background: #e8830c; }
.bar-primary { background: #1a6fff; }
.bar-success { background: #0d9e6c; }
.bar-default { background: #bbb; }
.bar-count { width: 30px; font-weight: 600; font-size: 14px; color: #333; }
.pie-legend { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
.legend-item { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #666; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.legend-name { min-width: 40px; }
.legend-count { font-weight: 600; color: #333; }
.pie-visual { display: flex; justify-content: center; }
@media (max-width: 768px) { .charts-grid { grid-template-columns: 1fr; } }
</style>
