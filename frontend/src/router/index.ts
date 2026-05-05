import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
    },
    {
      path: '/competition/:id',
      name: 'competition-detail',
      component: () => import('@/views/CompetitionDetail.vue'),
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/views/CompetitionCalendar.vue'),
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('@/views/Statistics.vue'),
    },
    {
      path: '/compare',
      name: 'compare',
      component: () => import('@/views/Comparison.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      children: [
        {
          path: '',
          name: 'admin-list',
          component: () => import('@/views/admin/CompetitionList.vue'),
        },
        {
          path: 'create',
          name: 'admin-create',
          component: () => import('@/views/admin/CompetitionForm.vue'),
        },
        {
          path: 'edit/:id',
          name: 'admin-edit',
          component: () => import('@/views/admin/CompetitionForm.vue'),
        },
      ],
    },
  ],
})

export default router
