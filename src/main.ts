import { createApp } from 'vue'
import type { App } from 'vue'
import type { Emitter, EventType } from 'mitt'
import 'uno.css'
import '@unocss/reset/normalize.css'
import 'vant/es/dialog/style'
import 'vant/es/toast/style'
import 'vant/es/notify/style'
import 'vant/es/image-preview/style'
import mitt from 'mitt'
import Router from '@/router'
import Store from '@/store'
import Directive from '@/directive'
import { Lazyload } from 'vant'
import Main from './App.vue'

const app: App<Element> = createApp(Main)

const eventBus: Emitter<Record<EventType, unknown>> = mitt()
app.config.globalProperties.$eventBus = eventBus

app.use(Store)
app.use(Lazyload)
app.use(Router)
app.use(Directive)

app.mount('#app')
