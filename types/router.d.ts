import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // 路由名称
    title: string
    // 是否验证登录
    auth?: boolean
    // 是否验证限定APP访问
    isApp?: boolean
  }
}
