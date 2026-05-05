<template>
  <div class="admin-layout">
    <div class="admin-header">
      <t-button variant="text" @click="$router.push('/')">
        <t-icon name="chevron-left" /> 返回前台
      </t-button>
      <h2>后台管理</h2>
    </div>
    <t-tabs :value="activeTab" @change="onTabChange">
      <t-tab-panel value="list" label="竞赛管理" />
      <t-tab-panel value="create" label="新建竞赛" />
    </t-tabs>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeTab = computed(() => {
  if (route.name === 'admin-create') return 'create'
  return 'list'
})

function onTabChange(value: string) {
  if (value === 'create') {
    router.push('/admin/create')
  } else {
    router.push('/admin')
  }
}
</script>

<style scoped>
.admin-layout {
  max-width: 100%;
}

.admin-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.admin-header h2 {
  font-size: 20px;
}
</style>
