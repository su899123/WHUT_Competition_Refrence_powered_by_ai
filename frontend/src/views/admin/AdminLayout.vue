<template>
  <div class="admin-layout">
    <div class="admin-header">
      <t-button variant="text" @click="$router.push('/')">
        <t-icon name="chevron-left" /> 返回前台
      </t-button>
      <h2>后台管理</h2>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.admin-layout { max-width: 100%; }
.admin-header { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; }
.admin-header h2 { font-size: 20px; }
</style>
