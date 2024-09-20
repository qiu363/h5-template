<template>
  <section class="index">
    Hello World!

    <VanButton type="primary">按钮</VanButton>

    <div class="h-44px">aaaaa</div>

    <div class="bg-dark-500 text-size-12px text-cool-gray-300 border-t p-10px">unocss</div>

    <div class="py-10px">
      <div class="text-base">{{ a }}</div>
      <AMap />
    </div>
  </section>
</template>

<script lang="ts" name="Index" setup>
  const a = ref('自动引入测试')
  console.log(a)
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
