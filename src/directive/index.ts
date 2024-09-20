import type { App } from 'vue'

type LongpressEl = Element & { instance: Record<string, any> | null }

const install = (app: App<Element>) => {
  app.directive('longpress', {
    mounted(el: LongpressEl, binding: any) {
      if (typeof binding.value !== 'function') {
        console.warn('长按事件参数必须为函数类型')
        return false
      }

      el.instance = el.instance || {}
      // 支持自定义传入长按响应时间
      const PRESS_TIME = binding.arg * 1 || 520 // 长按时间
      let startTime = 0

      let pressTimer: number
      const start = (ev: Event): void => {
        startTime = Date.now()

        console.log('touchstart')
        cancel()
        pressTimer = window.setTimeout(() => {
          //alert(binding.instance.bShow)
          //alert('run')
          handler(ev)
        }, PRESS_TIME)
      }
      const cancel = (): void => {
        clearTimeout(pressTimer)
      }
      const handler = (ev: Event): void => {
        binding.value(ev, binding.arg)
      }

      const touchend = (ev: Event) => {
        console.log('touch' + ev.type, Date.now() - startTime, PRESS_TIME)

        if (Date.now() - startTime >= PRESS_TIME) {
          //alert(ev.type)
          ev.preventDefault()
        }
        cancel()
      }

      el.instance.start = start
      el.instance.cancel = cancel
      el.instance.touchend = touchend
      el.instance.touchcancel = touchend

      el.addEventListener('touchstart', start)
      el.addEventListener('touchend', touchend)
      el.addEventListener('touchmove', cancel)
      el.addEventListener('touchcancel', touchend)
    },
    beforeUnmount(el: LongpressEl) {
      if (el.instance?.start) {
        el.removeEventListener('touchstart', el.instance.start)
        el.removeEventListener('touchmove', el.instance.cancel)
        el.removeEventListener('touchcancel', el.instance.touchend)
        el.removeEventListener('touchend', el.instance.touchend)
        el.instance = null
      }
    },
  })
}

export default install
