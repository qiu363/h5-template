<template>
  <div></div>
</template>

<script lang="ts">
  import {
    defineComponent,
    unref,
    watchEffect,
    shallowRef,
    PropType,
    watch,
    onBeforeUnmount,
  } from 'vue'
  import {
    MarkerOptions,
    MarkerClustererOptions,
  } from '#/amap-jsapi-types/plugins/MarkerClusterer'

  export default defineComponent({
    name: 'AMapMarkerClusterer',
    props: {
      map: {
        type: Object as PropType<AMap.Map>,
        default: null,
      },
      points: {
        type: Array as PropType<MarkerOptions[]>,
        default: () => [],
      },
      option: {
        type: Object as PropType<MarkerClustererOptions>,
        default: () => {},
      },
    },
    emits: ['loadled', 'click'],
    setup(props, { emit }) {
      const mapRef = shallowRef<AMap.Map>(props.map)
      const markerClusterer = shallowRef<AMap.MarkerClusterer>()

      watch(
        () => props.map,
        (value: AMap.Map) => {
          mapRef.value = unref(value)
        },
      )

      watchEffect(() => {
        if (mapRef.value && !markerClusterer.value) {
          if (AMap.MarkerClusterer) {
            markerClusterer.value = new AMap.MarkerClusterer(
              mapRef.value,
              props.points,
              props.option,
            )

            markerClusterer.value.on('click', (ev) => {
              emit('click', ev)
            })
            emit('loadled', markerClusterer)
          } else {
            const message = {
              message: '插件 MarkerClusterer 初始化失败，请在plugins中添加 AMap.MarkerClusterer',
            }
            throw message
          }
        }
      })

      onBeforeUnmount(() => {
        markerClusterer.value?.off('click', () => {})

        markerClusterer.value = undefined
      })
    },
  })
</script>
