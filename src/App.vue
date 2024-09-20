<template>
  <div class="continer-wrap">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
      </keep-alive>
      <component :is="Component" v-if="!$route.meta.keepAlive" />
    </router-view>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less">
  @import './less/index.less';

  .continer-wrap {
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }
</style>
