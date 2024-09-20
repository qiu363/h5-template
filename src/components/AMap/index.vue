<template>
  <div class="map-wrap">
    <slot name="mapHeader"></slot>

    <div ref="mapContainer" class="map" :style="style"></div>

    <slot :map="mapRef"></slot>
  </div>
</template>

<script lang="ts">
  import {
    defineComponent,
    ref,
    watchEffect,
    shallowRef,
    PropType,
    CSSProperties,
    onUnmounted,
  } from 'vue'
  import { AmapSecurityConfig } from './config'
  import { useAMap } from '@/hooks/useAMap'

  const EVENT_LIST = [
    'click',
    'dblclick',
    'mousemove',
    'movestart',
    'mapmove',
    'moveend',
    'zoomstart',
    'zoomchange',
    'zoomend',
    'dragstart',
    'dragging',
    'dragend',
    'touchstart',
    'touchmove',
    'touchend',
    'resize',
  ]

  export default defineComponent({
    name: 'AMap',
    props: {
      mapKey: {
        type: String,
        default: AmapSecurityConfig.key,
      },
      mapSecret: {
        type: String,
        default: AmapSecurityConfig.secret,
      },
      option: {
        type: Object as PropType<AMap.MapOptions>,
        default: () => {},
      },
      plugins: {
        type: Array as PropType<string[]>,
        default: () => [],
      },
      style: {
        type: Object as PropType<CSSProperties>,
        default: () => {},
      },
      forceWebGL: {
        type: Boolean,
        default: false,
      },
    },
    emits: ['loadled', ...EVENT_LIST],
    setup(props, { emit }) {
      const mapContainer = ref<HTMLDivElement>()
      const mapRef = shallowRef<AMap.Map>()
      const { mapLoaded, initMap } = useAMap({
        securityConfig: {
          key: props.mapKey,
          secret: props.mapSecret,
        },
        plugins: props.plugins,
        forceWebGL: props.forceWebGL,
      })

      watchEffect(() => {
        if (mapLoaded.value && mapContainer.value && !mapRef.value) {
          // 初始化地图
          mapRef.value = initMap(mapContainer, props.option)
          // 地图事件
          EVENT_LIST.map((item: string) => {
            mapRef.value?.on(item as AMap.EventType, () => {
              emit(item, mapRef)
            })

            return item
          })

          emit('loadled', mapRef)
        }
      })

      onUnmounted(() => {
        // 地图事件
        EVENT_LIST.map((item: string) => {
          mapRef.value?.off(item as AMap.EventType, () => {})

          return item
        })

        mapRef.value?.destroy()
      })

      return {
        mapRef,
        mapContainer,
      }
    },
  })
</script>

<style lang="less" scoped>
  .map-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .map {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 100px;
  }
</style>
