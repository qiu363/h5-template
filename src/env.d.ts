/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare const wx: {
  miniProgram: {
    navigateTo: function
  }
}

declare const plus: {
  io: any
  isReady: boolean
  [key: string]: any
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_API: string
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_KEY: string
  readonly VITE_APP_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
