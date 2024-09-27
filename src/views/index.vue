<template>
  <section class="index">
    Hello World!

    <VanButton type="primary" @click="toThree">按钮</VanButton>

    <div class="h-44px">aaaaa</div>

    <div class="bg-dark-500 text-size-12px text-cool-gray-300 border-t p-10px">unocss</div>

    <div class="py-10px">
      <AMap />
    </div>
  </section>
</template>

<script lang="ts" name="Index" setup>
  import { routerPush } from '@/utils/utils'
  import useCurrentInstance from '@/hooks/useCurrentInstance'

  const { global } = useCurrentInstance()

  const toThree = () => {
    routerPush('/three', '3D 页面')
  }

  onMounted(() => {
    global.$eventBus.on('plusReady', plusInit)
  })

  const plusInit = () => {
    let first: null | number = null
    const webview = plus.webview.currentWebview()
    plus.key.addEventListener('backbutton', function () {
      webview.canBack(function (e) {
        console.log(e, 'canBack')
        if (e.canBack) {
          webview.back()
        } else {
          if (!first) {
            first = new Date().getTime()
            plus.nativeUI.toast('再按一次退出应用', {
              duration: 'short',
            })
            setTimeout(function () {
              first = null
            }, 1000)
          } else {
            if (new Date().getTime() - first < 1000) {
              plus.runtime.quit()
            }
          }
        }
      })
    })
  }
</script>

<style lang="less" scoped>
  .index {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    min-height: 100vh;
    font-size: 36px;
  }
</style>
