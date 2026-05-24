<template>
  <div class="calendar-page">
    <t-card :bordered="false" title="📅 竞赛日历" class="calendar-card">
      <div class="calendar-header">
        <t-button variant="outline" size="small" @click="prevPeriod"><t-icon name="chevron-left" /></t-button>
        <span class="current-period">{{ currentPeriodLabel }}</span>
        <t-button variant="outline" size="small" @click="nextPeriod"><t-icon name="chevron-right" /></t-button>
        <t-button variant="text" size="small" @click="goToday">今天</t-button>
      </div>
      <t-loading :loading="loading" text="加载中...">
        <div class="calendar-body">
          <div class="calendar-sidebar">
            <div class="sidebar-title"><t-icon name="list" /> 本月竞赛日程 <t-tag size="small" theme="primary" variant="light">{{ monthEvents.length }}</t-tag></div>
            <div v-if="monthEvents.length === 0" class="sidebar-empty">本月暂无竞赛日程</div>
            <div class="sidebar-list">
              <div v-for="(evt, idx) in monthEvents" :key="evt.id" class="sidebar-item" @click="goDetail(evt.id)">
                <span class="seq-badge">{{ idx + 1 }}</span>
                <div class="sidebar-item-info"><span class="sidebar-item-title">{{ evt.title }}</span><span class="sidebar-item-date">{{ evt.date }}</span></div>
                <t-tag :theme="levelTheme(evt.level)" variant="light" size="small">{{ evt.level }}</t-tag>
              </div>
            </div>
          </div>
          <div class="calendar-grid">
            <div class="weekday-header"><div v-for="day in weekDays" :key="day" class="weekday-cell">{{ day }}</div></div>
            <div class="days-grid">
              <div v-for="(day, idx) in calendarDays" :key="idx" class="day-cell" :class="{ 'other-month': !day.isCurrentMonth, 'is-today': day.isToday }">
                <span class="day-number">{{ day.date }}</span>
                <div v-if="day.events.length > 0" class="day-dots">
                  <span v-for="evt in day.events" :key="evt.id" class="day-dot" :title="evt.title" @click="goDetail(evt.id)">{{ evt.seq }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </t-loading>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { competitionApi } from '@/api'
import type { Competition } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'
import dayjs from 'dayjs'

const router = useRouter()
const loading = ref(true)
const currentDate = ref(dayjs())
const competitions = ref<Competition[]>([])
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

interface DayEvent { id: number; title: string; level: string; seq: number }
interface CalendarDay { date: number; isCurrentMonth: boolean; isToday: boolean; fullDate: string; events: DayEvent[] }
interface MonthEvent { id: number; title: string; level: string; organizer: string; date: string; seq: number }

const currentPeriodLabel = computed(() => currentDate.value.format('YYYY年 M月'))

const monthEvents = computed<MonthEvent[]>(() => {
  const list = competitions.value.filter(c => { const d = c.registration_end || c.competition_date || c.registration_start; return d ? dayjs(d).isValid() && dayjs(d).isSame(currentDate.value, 'month') : false })
    .map(c => ({ id: c.id, title: c.title, level: c.level, organizer: c.organizer, date: (c.registration_end || c.competition_date || c.registration_start)!, seq: 0 }))
    .sort((a, b) => a.date.localeCompare(b.date))
  list.forEach((item, idx) => { item.seq = idx + 1 })
  return list
})

const dateSeqMap = computed(() => { const map: Record<string, DayEvent[]> = {}; for (const evt of monthEvents.value) { if (!map[evt.date]) map[evt.date] = []; map[evt.date].push({ id: evt.id, title: evt.title, level: evt.level, seq: evt.seq }) } return map })

const calendarDays = computed<CalendarDay[]>(() => {
  const start = currentDate.value.startOf('month'); const end = currentDate.value.endOf('month')
  const startDay = start.day(); const daysInMonth = end.date(); const today = dayjs().format('YYYY-MM-DD'); const evtMap = dateSeqMap.value; const days: CalendarDay[] = []
  const prevMonthEnd = start.subtract(1, 'day').date()
  for (let i = startDay - 1; i >= 0; i--) { const ds = start.subtract(i + 1, 'day').format('YYYY-MM-DD'); days.push({ date: prevMonthEnd - i, isCurrentMonth: false, isToday: false, fullDate: ds, events: evtMap[ds] || [] }) }
  for (let i = 1; i <= daysInMonth; i++) { const ds = start.date(i).format('YYYY-MM-DD'); days.push({ date: i, isCurrentMonth: true, isToday: ds === today, fullDate: ds, events: evtMap[ds] || [] }) }
  const rem = 42 - days.length
  for (let i = 1; i <= rem; i++) { const ds = end.add(i, 'day').format('YYYY-MM-DD'); days.push({ date: i, isCurrentMonth: false, isToday: false, fullDate: ds, events: evtMap[ds] || [] }) }
  return days
})

function levelTheme(level: string) { const map: Record<string, string> = { A1: 'danger', A2: 'warning', A3: 'primary', B1: 'success', B2: 'default' }; return map[level] || 'default' }
function prevPeriod() { currentDate.value = currentDate.value.subtract(1, 'month') }
function nextPeriod() { currentDate.value = currentDate.value.add(1, 'month') }
function goToday() { currentDate.value = dayjs() }
function goDetail(id: number) { router.push(`/competition/${id}`) }

onMounted(async () => {
  loading.value = true
  try { const { data } = await competitionApi.list({ page_size: 100, status: 'active' }); competitions.value = data.items }
  catch (e) { MessagePlugin.error('加载日历事件失败') }
  finally { loading.value = false }
})
</script>

<style scoped>
.calendar-page { max-width: 100%; }
.calendar-card { overflow: visible; }
.calendar-header { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }
.current-period { font-size: 17px; font-weight: 700; min-width: 130px; text-align: center; color: #333; }
.calendar-body { display: flex; gap: 20px; align-items: flex-start; }
.calendar-sidebar { width: 280px; flex-shrink: 0; border: 1px solid #e7e7e7; border-radius: 10px; overflow: hidden; background: #fff; }
.sidebar-title { display: flex; align-items: center; gap: 8px; padding: 14px 16px; font-weight: 600; font-size: 14px; background: #f8f9fa; border-bottom: 1px solid #e7e7e7; }
.sidebar-empty { padding: 40px 16px; text-align: center; color: #999; font-size: 13px; }
.sidebar-list { max-height: 540px; overflow-y: auto; }
.sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; border-bottom: 1px solid #f5f5f5; transition: background 0.15s; }
.sidebar-item:hover { background: #f0f5ff; }
.sidebar-item:last-child { border-bottom: none; }
.seq-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; background: #e0243f; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.sidebar-item-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.sidebar-item-title { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #333; }
.sidebar-item-date { font-size: 11px; color: #999; }
.calendar-grid { flex: 1; min-width: 0; }
.weekday-header { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: 600; color: #666; padding: 8px 0; border-bottom: 2px solid #e7e7e7; font-size: 13px; }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); border-left: 1px solid #f0f0f0; border-top: 1px solid #f0f0f0; }
.day-cell { aspect-ratio: 1; padding: 3px; border-right: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; display: flex; flex-direction: column; align-items: center; gap: 1px; cursor: default; position: relative; }
.day-cell.other-month .day-number { color: #ccc; }
.day-cell.is-today { background: #e6f4ff; }
.day-cell.is-today .day-number { background: #1a6fff; color: #fff; border-radius: 50%; width: 28px; height: 28px; font-weight: 700; }
.day-number { font-size: 13px; font-weight: 500; width: 28px; height: 28px; display: inline-flex; align-items: center; justify-content: center; color: #333; }
.day-dots { display: flex; flex-wrap: wrap; gap: 3px; justify-content: center; margin-top: 1px; }
.day-dot { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: #e0243f; color: #fff; font-size: 11px; font-weight: 700; cursor: pointer; transition: transform 0.15s; line-height: 1; }
.day-dot:hover { transform: scale(1.25); background: #c9353f; }
@media (max-width: 768px) { .calendar-body { flex-direction: column-reverse; } .calendar-sidebar { width: 100%; } .sidebar-list { max-height: 200px; } .day-cell { aspect-ratio: auto; min-height: 50px; padding: 2px; } }
</style>
