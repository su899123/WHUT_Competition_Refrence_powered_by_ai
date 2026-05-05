<template>
  <div class="admin-list">
    <div class="toolbar">
      <t-input
        v-model="keyword"
        placeholder="搜索竞赛..."
        clearable
        class="search-input"
        @enter="fetchList"
        @clear="fetchList"
      >
        <template #prefix-icon><t-icon name="search" /></template>
      </t-input>
      <t-button theme="primary" @click="$router.push('/admin/create')">
        <t-icon name="add" /> 新建竞赛
      </t-button>
    </div>

    <t-table
      :data="competitions"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      hover
      stripe
      @page-change="onPageChange"
    >
      <template #title="{ row }">
        <span class="row-title" @click="goDetail(row.id)">{{ row.title }}</span>
      </template>
      <template #level="{ row }">
        <t-tag :theme="levelTheme(row.level)" variant="light" size="small">
          {{ row.level }}
        </t-tag>
      </template>
      <template #status="{ row }">
        <t-tag :theme="row.status === 'active' ? 'success' : 'default'" variant="light" size="small">
          {{ row.status === 'active' ? '进行中' : row.status === 'closed' ? '已截止' : '已归档' }}
        </t-tag>
      </template>
      <template #actions="{ row }">
        <t-space>
          <t-link theme="primary" @click="editCompetition(row.id)">编辑</t-link>
          <t-popconfirm content="确认删除该竞赛？" @confirm="deleteCompetition(row.id)">
            <t-link theme="danger">删除</t-link>
          </t-popconfirm>
          <t-link
            v-if="row.status === 'active'"
            theme="warning"
            @click="updateStatus(row.id, 'closed')"
          >
            标记截止
          </t-link>
          <t-link
            v-if="row.status === 'closed'"
            theme="success"
            @click="updateStatus(row.id, 'active')"
          >
            重新开放
          </t-link>
        </t-space>
      </template>
    </t-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { competitionApi } from '@/api'
import type { Competition } from '@/types'
import { MessagePlugin } from 'tdesign-vue-next'

const router = useRouter()
const loading = ref(false)
const keyword = ref('')
const competitions = ref<Competition[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

const columns = [
  { colKey: 'id', title: 'ID', width: 60 },
  { colKey: 'title', title: '竞赛名称', width: 220 },
  { colKey: 'level', title: '级别', width: 80 },
  { colKey: 'category', title: '类别', width: 80 },
  { colKey: 'status', title: '状态', width: 80 },
  { colKey: 'organizer', title: '主办方', width: 150, ellipsis: true },
  { colKey: 'created_at', title: '创建时间', width: 160 },
  { colKey: 'actions', title: '操作', width: 240, fixed: 'right' as const },
]

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showJumper: true,
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

async function fetchList() {
  loading.value = true
  try {
    const { data } = await competitionApi.list({
      page: currentPage.value,
      page_size: pageSize.value,
      keyword: keyword.value || undefined,
      status: undefined, // 管理端看全部
    })
    competitions.value = data.items
    total.value = data.total
    pagination.value.total = data.total
    pagination.value.current = currentPage.value
    pagination.value.pageSize = pageSize.value
  } catch (e) {
    MessagePlugin.error('加载竞赛列表失败')
  } finally {
    loading.value = false
  }
}

function onPageChange(pageInfo: { current: number; pageSize: number }) {
  currentPage.value = pageInfo.current
  pageSize.value = pageInfo.pageSize
  fetchList()
}

function goDetail(id: number) {
  router.push(`/competition/${id}`)
}

function editCompetition(id: number) {
  router.push(`/admin/edit/${id}`)
}

async function deleteCompetition(id: number) {
  try {
    await competitionApi.delete(id)
    MessagePlugin.success('删除成功')
    fetchList()
  } catch (e) {
    MessagePlugin.error('删除失败')
  }
}

async function updateStatus(id: number, status: string) {
  try {
    await competitionApi.update(id, { status })
    MessagePlugin.success('状态更新成功')
    fetchList()
  } catch (e) {
    MessagePlugin.error('更新失败')
  }
}

onMounted(fetchList)
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  width: 300px;
}

.row-title {
  color: #0052d9;
  cursor: pointer;
}

.row-title:hover {
  text-decoration: underline;
}
</style>
