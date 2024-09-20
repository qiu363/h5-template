import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import routerGuard from './routerGuard'

const routerModules: any = import.meta.glob('./modules/*.ts', { eager: true })
let modules: RouteRecordRaw[] = []
for (const path in routerModules) {
  modules = [...modules, ...routerModules[path].default]
}

const routes: Array<RouteRecordRaw> = [
  ...modules,

  {
    path: '/404',
    name: '404',
    meta: { title: '404' },
    component: () => import('@/views/404/index.vue'),
  },

  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes as RouteRecordRaw[],
})

// 路由守卫
routerGuard(router)

export default router
