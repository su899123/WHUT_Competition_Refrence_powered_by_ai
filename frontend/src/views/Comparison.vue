<template>
  <div class="compare-page">
    <t-card :bordered="false" title="🔄 竞赛对比分析">
      <p class="compare-desc">选择 2~5 个竞赛进行横向对比分析</p>
      <div class="select-area">
        <t-select v-model="selectedIds" multiple placeholder="搜索并选择要对比的竞赛..." filterable :max="5" class="compare-select" @change="onSelectionChange">
          <t-option v-for="c in allCompetitions" :key="c.id" :value="c.id" :label="c.title">
            <div class="option-item"><span>{{ c.title }}</span><t-tag size="small" variant="light">{{ c.level }}</t-tag></div>
          </t-option>
        </t-select>
        <t-button theme="primary" :disabled="selectedIds.length < 2" @click="doCompare">开始对比</t-button>
      </div>
      <div v-if="compareList.length >= 2" class="compare-table-wrap">
        <t-table :data="compareList" :columns="compareColumns" row-key="id" bordered stripe table-layout="auto">
          <template #title="{ row }"><strong>{{ row.title }}</strong></template>
          <template #level="{ row }"><t-tag :theme="levelTheme(row.level)" variant="light" size="small">{{ row.level }}</t-tag></template>
          <template #category="{ row }"><t-tag :theme="categoryTheme(row.category)" variant="light" size="small">{{ row.category }}</t-tag></template>
          <template #registration_end="{ row }"><span :class="{ 'deadline-near': isUpcoming(row.registration_end) }">{{ row.registration_end || '-' }}</span></template>
        </t-table>
      </div>
      <div v-else-if="selectedIds.length >= 2" class="loading-compare"><t-loading text="正在加载对比数据..." /></div>

      <div v-if="compareList.length >= 2" class="ai-compare-section">
        <t-divider />
        <div class="ai-compare-header"><span>🤖 AI 深度对比分析</span><t-tag size="small" theme="primary" variant="light">DeepSeek</t-tag></div>
        <div class="dimension-select">
          <span class="dim-label">对比维度：</span>
          <t-checkbox-group v-model="selectedDimensions">
            <t-checkbox value="综合推荐">综合推荐</t-checkbox>
            <t-checkbox value="级别含金量">级别含金量</t-checkbox>
            <t-checkbox value="时间紧迫度">时间紧迫度</t-checkbox>
            <t-checkbox value="难度评估">难度评估</t-checkbox>
            <t-checkbox value="适合人群">适合人群</t-checkbox>
            <t-checkbox value="获奖难度">获奖难度</t-checkbox>
            <t-checkbox value="备赛建议">备赛建议</t-checkbox>
          </t-checkbox-group>
          <t-button theme="primary" variant="outline" :loading="aiCompareLoading" :disabled="selectedDimensions.length === 0" @click="doAICompare"><t-icon name="lightbulb" /> AI 分析</t-button>
        </div>
        <div v-if="aiBrief" class="ai-brief"><div class="ai-brief-label">💡 快速结论</div><div class="ai-brief-text" v-html="renderMd(aiBrief)"></div></div>
        <t-collapse v-if="aiDetail" class="ai-detail-collapse"><t-collapse-panel header="📊 查看详细分析"><div class="ai-detail-text" v-html="renderMd(aiDetail)"></div></t-collapse-panel></t-collapse>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { competitionApi, aiApi } from '@/api'
import type { Competition } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const allCompetitions = ref<Competition[]>([])
const selectedIds = ref<number[]>([])
const compareList = ref<Competition[]>([])

const selectedDimensions = ref<string[]>(["综合推荐", "级别含金量", "时间紧迫度", "难度评估", "适合人群"])
const aiCompareLoading = ref(false)
const aiBrief = ref('')
const aiDetail = ref('')

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

function isUpcoming(dateStr: string | null) { if (!dateStr) return false; const end = dayjs(dateStr); return end.diff(dayjs(), 'day') <= 7 && end.diff(dayjs(), 'day') >= 0 }
function levelTheme(level: string) { const m: Record<string,string> = { A1:'danger',A2:'warning',A3:'primary',B1:'success',B2:'default' }; return m[level]||'default' }
function categoryTheme(c: string) { const m: Record<string,string> = { '理工科':'primary','文科':'warning','商科':'success','医学':'danger','艺术':'warning','综合':'primary' }; return m[c]||'primary' }
function onSelectionChange() { compareList.value = []; aiBrief.value = ''; aiDetail.value = '' }

function renderMd(text: string): string {
  if (!text) return ''
  let html = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  // bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  // headers
  html = html.replace(/^### (.+)$/gm, '<h4 style="margin:12px 0 6px;color:#1a1a2e">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 style="margin:14px 0 8px;color:#1a1a2e">$1</h3>')
  // list items
  html = html.replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
  // wrap consecutive li in ul
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul style="padding-left:20px;margin:8px 0">$1</ul>')
  // paragraphs by double newline
  html = html.replace(/\n\n/g, '</p><p style="margin:8px 0">')
  html = '<p style="margin:8px 0">' + html + '</p>'
  return html
}


async function doCompare() {
  try { const res = await Promise.all(selectedIds.value.map(id => competitionApi.getById(id))); compareList.value = res.map(r => r.data) }
  catch (e) { MessagePlugin.error('对比数据加载失败') }
}

async function doAICompare() {
  if (selectedIds.value.length < 2) return; aiCompareLoading.value = true; aiBrief.value = ''; aiDetail.value = ''
  try {
    const { data } = await aiApi.compare(selectedIds.value, selectedDimensions.value)
    const briefMatch = data.result.match(/^(?:##|###)\s*简短结论[:：]?\s*\n([\s\S]*?)(?=^(?:##|###)\s*详细分析|$)/im)
    const detailMatch = data.result.match(/^(?:##|###)\s*详细分析[:：]?\s*\n([\s\S]*)/im)
    aiBrief.value = briefMatch ? briefMatch[1].trim() : data.result.substring(0, 200).trim()
    aiDetail.value = detailMatch ? detailMatch[1].trim() : ''
    if (!detailMatch) aiDetail.value = data.result
  } catch (e: any) { MessagePlugin.error('AI 对比分析失败：' + (e?.response?.data?.detail || e.message)) }
  finally { aiCompareLoading.value = false }
}

onMounted(async () => {
  try { const { data } = await competitionApi.list({ page_size: 100, status: 'active' }); allCompetitions.value = data.items }
  catch (e) { MessagePlugin.error('加载竞赛列表失败') }
})
</script>

<style scoped>
.compare-desc { color: #888; margin-bottom: 16px; }
.select-area { display: flex; gap: 12px; margin-bottom: 24px; }
.compare-select { flex: 1; }
.option-item { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.compare-table-wrap { overflow-x: auto; }
.deadline-near { color: #e0243f; font-weight: 600; }
.loading-compare { padding: 40px; text-align: center; }
.ai-compare-section { margin-top: 24px; }
.ai-compare-header { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; margin-bottom: 16px; }
.dimension-select { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.dim-label { font-size: 14px; color: #666; white-space: nowrap; }
.ai-brief { background: #f0f5ff; padding: 16px 20px; border-radius: 10px; margin-bottom: 16px; }
.ai-brief-label { font-weight: 700; margin-bottom: 8px; font-size: 15px; }
.ai-brief-text { font-size: 14px; line-height: 1.8; color: #333; }
.ai-detail-collapse { margin-top: 12px; }
.ai-detail-text { font-size: 14px; line-height: 1.8; white-space: pre-wrap; }
</style>
