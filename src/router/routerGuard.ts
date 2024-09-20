import type { Router } from 'vue-router'
import { UserStore } from '@/store/modules/users'

export default (router: Router) => {
  router.beforeEach((to, _, next) => {
    const userStore = UserStore()

    if (to.meta.title) {
      document.title = String(to.meta.title)
    }
    if (!userStore.token) {
      userStore.setUserInfo({})
    }

    if (to.meta.auth && !userStore.token) {
      // 跳转登录
    }

    next()
  })
}
