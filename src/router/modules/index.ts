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
  {
    path: '/three',
    name: 'Three',
    meta: {
      title: '3D',
    },
    component: () => import('@/views/three.vue'),
  },
]

export default routes
