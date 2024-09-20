import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    meta: {
      title: '首页',
    },
    component: () => import('@/views/index.vue'),
  },
]

export default routes
