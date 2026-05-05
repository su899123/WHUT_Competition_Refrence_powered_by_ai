<template>
  <div class="calendar-page">
    <t-card :bordered="false" title="📅 竞赛日历">
      <template #actions>
        <t-radio-group v-model="viewMode" variant="default-filled" size="small">
          <t-radio-button value="month">月视图</t-radio-button>
          <t-radio-button value="list">列表视图</t-radio-button>
        </t-radio-group>
      </template>

      <div class="calendar-header">
        <t-button variant="text" @click="prevPeriod">
          <t-icon name="chevron-left" />
        </t-button>
        <span class="current-period">{{ currentPeriodLabel }}</span>
        <t-button variant="text" @click="nextPeriod">
          <t-icon name="chevron-right" />
        </t-button>
        <t-button variant="text" @click="goToday">今天</t-button>
      </div>

      <!-- 月视图 -->
      <div v-if="viewMode === 'month'" class="month-grid">
        <div class="weekday-header">
          <div v-for="day in weekDays" :key="day" class="weekday-cell">{{ day }}</div>
        </div>
        <div class="days-grid">
          <div
            v-for="(day, idx) in calendarDays"
            :key="idx"
            class="day-cell"
            :class="{
              'other-month': !day.isCurrentMonth,
              'is-today': day.isToday,
              'has-events': day.events.length > 0,
            }"
          >
            <span class="day-number">{{ day.date }}</span>
            <div class="day-events">
              <div
                v-for="evt in day.events"
                :key="evt.id"
                class="event-dot"
                @click="goDetail(evt.id)"
                :title="evt.title"
              >
                <span class="dot" :class="'dot-' + levelTheme(evt.level)"></span>
                <span class="event-title">{{ evt.title }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="viewMode === 'list'" class="event-list">
        <div v-if="monthEvents.length === 0" class="empty-state">本月暂无竞赛日程</div>
        <div
          v-for="evt in monthEvents"
          :key="evt.id"
          class="event-item"
          @click="goDetail(evt.id)"
        >
          <div class="event-date">
            <span class="date-day">{{ dayjs(evt.date).format('DD') }}</span>
            <span class="date-week">{{ dayjs(evt.date).format('ddd') }}</span>
          </div>
          <div class="event-info">
            <div class="event-name">
              {{ evt.title }}
              <t-tag :theme="levelTheme(evt.level)" variant="light" size="small">
                {{ evt.level }}
              </t-tag>
            </div>
            <div class="event-meta">
              <span>{{ evt.organizer }}</span>
            </div>
          </div>
        </div>
      </div>
    </t-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { competitionApi } from '@/api'
import type { Competition } from '@/types'
import dayjs from 'dayjs'

const router = useRouter()
const viewMode = ref<'month' | 'list'>('month')
const currentDate = ref(dayjs())
const competitions = ref<Competition[]>([])
const weekDays = ['日', '一', '二', '三', '四', '五', '六']

interface CalendarDay {
  date: number
  isCurrentMonth: boolean
  isToday: boolean
  fullDate: string
  events: { id: number; title: string; level: string }[]
}

interface MonthEvent {
  id: number
  title: string
  level: string
  organizer: string
  date: string
}

const currentPeriodLabel = computed(() => currentDate.value.format('YYYY年 M月'))

// 预计算：日期 → 事件列表 的映射
const eventsByDate = computed(() => {
  const map: Record<string, { id: number; title: string; level: string }[]> = {}
  for (const c of competitions.value) {
    for (const d of [c.registration_end, c.competition_date, c.registration_start]) {
      if (d) {
        if (!map[d]) map[d] = []
        map[d].push({ id: c.id, title: c.title, level: c.level })
      }
    }
  }
  return map
})

const calendarDays = computed<CalendarDay[]>(() => {
  const start = currentDate.value.startOf('month')
  const end = currentDate.value.endOf('month')
  const startDay = start.day()
  const daysInMonth = end.date()
  const today = dayjs().format('YYYY-MM-DD')
  const evtMap = eventsByDate.value

  const days: CalendarDay[] = []

  // 上月填充
  const prevMonthEnd = start.subtract(1, 'day').date()
  for (let i = startDay - 1; i >= 0; i--) {
    const d = start.subtract(i + 1, 'day')
    const dateStr = d.format('YYYY-MM-DD')
    days.push({
      date: prevMonthEnd - i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: dateStr,
      events: evtMap[dateStr] || [],
    })
  }

  // 本月
  for (let i = 1; i <= daysInMonth; i++) {
    const d = start.date(i)
    const dateStr = d.format('YYYY-MM-DD')
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: dateStr === today,
      fullDate: dateStr,
      events: evtMap[dateStr] || [],
    })
  }

  // 下月填充
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = end.add(i, 'day')
    const dateStr = d.format('YYYY-MM-DD')
    days.push({
      date: i,
      isCurrentMonth: false,
      isToday: false,
      fullDate: dateStr,
      events: evtMap[dateStr] || [],
    })
  }

  return days
})

const monthEvents = computed<MonthEvent[]>(() => {
  const monthPrefix = currentDate.value.format('YYYY-MM')
  return competitions.value
    .filter((c) => {
      const d = c.registration_end || c.competition_date || c.registration_start
      if (!d) return false
      return d.startsWith(monthPrefix)
    })
    .map((c) => ({
      id: c.id,
      title: c.title,
      level: c.level,
      organizer: c.organizer,
      date: c.registration_end || c.competition_date || c.registration_start || '',
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
})

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

function prevPeriod() {
  currentDate.value = currentDate.value.subtract(1, 'month')
}

function nextPeriod() {
  currentDate.value = currentDate.value.add(1, 'month')
}

function goToday() {
  currentDate.value = dayjs()
}

function goDetail(id: number) {
  router.push(`/competition/${id}`)
}

onMounted(async () => {
  try {
    const { data } = await competitionApi.list({
      page_size: 100,
      status: 'active',
    })
    competitions.value = data.items
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.current-period {
  font-size: 16px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.debug-info {
  text-align: center;
  padding: 6px 12px;
  margin-bottom: 12px;
  background: #e6f4ff;
  border-radius: 6px;
  font-size: 13px;
  color: #0052d9;
}

.weekday-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  color: #666;
  padding: 8px 0;
  border-bottom: 1px solid #e7e7e7;
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.day-cell {
  min-height: 100px;
  padding: 6px;
  border: 1px solid #f0f0f0;
  cursor: default;
  transition: background 0.2s;
}

.day-cell.other-month {
  background: #fafafa;
  opacity: 0.5;
}

.day-cell.is-today {
  background: #e6f4ff;
}

.day-cell.is-today .day-number {
  background: #0052d9;
  color: #fff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 14px;
  font-weight: 500;
}

.day-events {
  margin-top: 4px;
}

.event-dot {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 1px 0;
  cursor: pointer;
  font-size: 11px;
  overflow: hidden;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.dot-danger { background: #e34d59; }
.dot-warning { background: #ed7b2f; }
.dot-primary { background: #0052d9; }
.dot-success { background: #2ba471; }
.dot-default { background: #bbb; }

.event-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.more-events {
  font-size: 11px;
  color: #0052d9;
  cursor: pointer;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.event-item {
  display: flex;
  gap: 16px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.event-item:hover {
  background: #f5f7fa;
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 48px;
}

.date-day {
  font-size: 24px;
  font-weight: 700;
  color: #0052d9;
}

.date-week {
  font-size: 12px;
  color: #999;
}

.event-info {
  flex: 1;
}

.event-name {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.event-meta {
  font-size: 13px;
  color: #888;
}

@media (max-width: 768px) {
  .day-cell {
    min-height: 60px;
    padding: 2px;
  }

  .event-dot .event-title {
    display: none;
  }
}
</style>
