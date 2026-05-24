<template>
  <div class="detail-page">
    <t-loading :loading="loading">
      <template v-if="competition">
        <t-button variant="text" @click="$router.push('/')" class="back-btn"><t-icon name="chevron-left" /> 返回列表</t-button>
        <t-card :bordered="false" class="header-card">
          <div class="title-row"><h1>{{ competition.title }}</h1>
            <div class="title-tags">
              <t-tag :theme="levelTheme(competition.level)" variant="light" size="medium">{{ competition.level }}</t-tag>
              <t-tag theme="default" variant="outline" size="medium">{{ competition.category }}</t-tag>
              <t-tag v-if="isUpcoming(competition.registration_end)" theme="danger" variant="light" size="medium">即将截止</t-tag>
            </div>
          </div>
          <div class="meta-row"><span v-if="competition.organizer"><t-icon name="user" /> {{ competition.organizer }}</span><span><t-icon name="time" /> 发布于 {{ formatDateTime(competition.created_at) }}</span></div>
        </t-card>
        <div class="detail-grid">
          <div class="detail-main">
            <t-card :bordered="false" title="📝 AI 智能摘要"><p class="summary-text">{{ competition.summary || '暂无AI摘要' }}</p></t-card>
            <t-card :bordered="false" title="📄 竞赛详情" class="section-card"><div class="description-text">{{ competition.description || '暂无详细描述' }}</div></t-card>
            <t-card v-if="competition.eligibility" :bordered="false" title="🎯 参赛资格" class="section-card"><p>{{ competition.eligibility }}</p></t-card>
            <t-card v-if="competition.awards" :bordered="false" title="🏆 奖项设置" class="section-card"><p>{{ competition.awards }}</p></t-card>
          </div>
          <div class="detail-sidebar">
            <t-card :bordered="false" title="📋 关键信息">
              <div class="info-list">
                <div class="info-item" v-if="competition.registration_start"><span class="info-label">报名开始</span><span class="info-value">{{ formatDate(competition.registration_start) }}</span></div>
                <div class="info-item" v-if="competition.registration_end"><span class="info-label">报名截止</span><span class="info-value highlight">{{ formatDate(competition.registration_end) }}</span></div>
                <div class="info-item" v-if="competition.competition_date"><span class="info-label">比赛时间</span><span class="info-value">{{ formatDate(competition.competition_date) }}</span></div>
                <div class="info-item" v-if="competition.contact_info"><span class="info-label">联系方式</span><span class="info-value">{{ competition.contact_info }}</span></div>
              </div>
            </t-card>
            <t-card :bordered="false" title="🏷️ 标签" class="section-card" v-if="competition.tags"><div class="tags-wrap"><t-tag v-for="tag in tagList" :key="tag" variant="light" class="tag-item">{{ tag }}</t-tag></div></t-card>
            <t-card :bordered="false" class="section-card" v-if="competition.official_url"><t-button theme="primary" block @click="openUrl(competition.official_url)"><t-icon name="link" /> 访问官方链接</t-button></t-card>
          </div>
        </div>

        <t-card :bordered="false" class="ai-panel">
          <template #title><div class="ai-panel-header"><span>🤖 AI 竞赛助手</span><t-tag size="small" theme="primary" variant="light">DeepSeek</t-tag></div></template>
          <div class="ai-chat-section">
            <div class="chat-messages" ref="chatRef">
              <div v-for="(msg, idx) in chatMessages" :key="idx" class="chat-msg" :class="msg.role"><span class="chat-role">{{ msg.role === 'user' ? '🧑 你' : '🤖 AI' }}</span><div class="chat-text" v-html="renderMd(msg.content)"></div></div>
              <div v-if="chatLoading" class="chat-msg ai"><span class="chat-role">🤖 AI</span><div class="chat-text typing">思考中...</div></div>
            </div>
            <div class="chat-input-row">
              <t-checkbox v-model="enableSearch" size="small">🔍 联网搜索</t-checkbox>
              <div class="chat-input-wrap"><t-input v-model="chatInput" placeholder="针对这个比赛提问，如：适合大一参加吗？" @enter="sendMessage" /><t-button theme="primary" size="small" :disabled="!chatInput.trim() || chatLoading" @click="sendMessage">发送</t-button></div>
            </div>
          </div>
        </t-card>
      </template>
    </t-loading>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { competitionApi, aiApi } from '@/api'
import type { Competition } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const route = useRoute()
const loading = ref(true)
const competition = ref<Competition | null>(null)

const chatMessages = ref<{ role: string; content: string }[]>([])
const chatInput = ref('')
const chatLoading = ref(false)
const enableSearch = ref(false)
const chatRef = ref<HTMLElement | null>(null)

const tagList = computed(() => { if (!competition.value?.tags) return []; return competition.value.tags.split(',').filter(Boolean) })

function formatDate(d: string | null) { if (!d) return '-'; return dayjs(d).format('YYYY-MM-DD') }
function formatDateTime(d: string | null) { if (!d) return ''; return dayjs(d).format('YYYY-MM-DD HH:mm') }
function isUpcoming(d: string | null) { if (!d) return false; const end = dayjs(d); return end.diff(dayjs(), 'day') <= 7 && end.diff(dayjs(), 'day') >= 0 }
function levelTheme(l: string) { const m: Record<string,string> = { A1:'danger',A2:'warning',A3:'primary',B1:'success',B2:'default' }; return m[l]||'default' }
function openUrl(url: string) { window.open(url, '_blank') }

function renderMd(text: string): string {
  if (!text) return ''
  let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  html = html.replace(/^### (.+)$/gm, '<h4 style="margin:8px 0 4px">$1</h4>')
  html = html.replace(/^## (.+)$/gm, '<h3 style="margin:10px 0 6px">$1</h3>')
  html = html.replace(/^- (.+)$/gm, '<li style="margin:3px 0">$1</li>')
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\n?)+)/g, '<ul style="padding-left:16px;margin:6px 0">$1</ul>')
  html = html.replace(/\n\n/g, '<br><br>')
  html = html.replace(/\n/g, '<br>')
  return html
}

async function sendMessage() {
  const msg = chatInput.value.trim(); if (!msg || chatLoading.value || !competition.value) return
  chatMessages.value.push({ role: 'user', content: msg }); chatInput.value = ''; chatLoading.value = true; await nextTick(); scrollChat()
  try { const { data } = await aiApi.chat(competition.value.id, msg, enableSearch.value); chatMessages.value.push({ role: 'ai', content: data.reply }) }
  catch (e: any) { chatMessages.value.push({ role: 'ai', content: '抱歉，AI 服务暂时不可用：' + (e?.response?.data?.detail || e.message) }) }
  finally { chatLoading.value = false; await nextTick(); scrollChat() }
}

function scrollChat() { if (chatRef.value) chatRef.value.scrollTop = chatRef.value.scrollHeight }

onMounted(async () => {
  const id = Number(route.params.id)
  try { const { data } = await competitionApi.getById(id); competition.value = data }
  catch (e) { MessagePlugin.error('加载竞赛详情失败') }
  finally { loading.value = false }
})
</script>

<style scoped>
.detail-page { max-width: 100%; }
.back-btn { margin-bottom: 16px; }
.header-card { margin-bottom: 24px; }
.title-row { display: flex; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 12px; }
.title-row h1 { font-size: 24px; font-weight: 700; flex: 1; min-width: 250px; color: #1a1a2e; }
.title-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.meta-row { display: flex; gap: 20px; color: #888; font-size: 14px; }
.detail-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
.detail-main { display: flex; flex-direction: column; gap: 16px; }
.summary-text { font-size: 15px; line-height: 1.8; color: #333; background: #f0f5ff; padding: 16px; border-radius: 8px; border-left: 4px solid #1a6fff; }
.description-text { font-size: 15px; line-height: 1.8; color: #333; white-space: pre-wrap; }
.section-card { margin-bottom: 0; }
.detail-sidebar { display: flex; flex-direction: column; gap: 16px; }
.info-list { display: flex; flex-direction: column; gap: 16px; }
.info-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #f0f0f0; }
.info-item:last-child { border-bottom: none; padding-bottom: 0; }
.info-label { color: #888; font-size: 14px; }
.info-value { font-weight: 500; font-size: 14px; color: #333; }
.info-value.highlight { color: #e0243f; font-weight: 600; }
.tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }

.ai-panel { margin-top: 24px; border: 1px solid #e0e0e0; }
.ai-panel-header { display: flex; align-items: center; gap: 8px; }
.chat-messages { max-height: 300px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 4px 0; }
.chat-msg { display: flex; flex-direction: column; gap: 4px; }
.chat-msg.user .chat-text { background: #1a6fff; color: #fff; align-self: flex-end; border-radius: 12px 12px 4px 12px; }
.chat-msg.ai .chat-text { background: #f3f3f3; border-radius: 12px 12px 12px 4px; }
.chat-text { padding: 10px 14px; max-width: 80%; font-size: 14px; line-height: 1.6; }
.chat-msg.user .chat-text { margin-left: auto; }
.chat-role { font-size: 12px; color: #888; }
.typing { opacity: 0.6; }
.chat-input-row { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
.chat-input-wrap { display: flex; gap: 8px; }
.chat-input-wrap .t-input { flex: 1; }

@media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } .title-row h1 { font-size: 20px; } }
</style>
