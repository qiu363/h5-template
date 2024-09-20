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

  const EVENT_LIST = ['click']

  export default defineComponent({
    name: 'AMapPolyline',
    props: {
      map: {
        type: Object as PropType<AMap.Map>,
        default: null,
      },
      path: {
        type: Array as PropType<[number, number][]>,
        default: () => [],
      },
      option: {
        type: Object as PropType<AMap.PolylineOptions>,
        default: () => {},
      },
    },
    emits: ['loadled', 'updatePaths', ...EVENT_LIST],
    setup(props, { emit }) {
      const mapRef = shallowRef<AMap.Map>(props.map)
      const polyline = shallowRef<AMap.Polyline>()

      watch(
        () => props.map,
        (value: AMap.Map) => {
          mapRef.value = unref(value)
        },
      )

      watch(
        () => props.path,
        (value) => {
          if (polyline.value) {
            polyline.value.setPath(value)
          }
        },
      )

      watchEffect(() => {
        if (mapRef.value && !polyline.value) {
          const path: AMap.LngLat[] = []
          if (props.path.length > 0) {
            props.path.map((item) => {
              path.push(new AMap.LngLat(item[0], item[1]))
              return item
            })
          }

          polyline.value = new AMap.Polyline({
            ...props.option,
            path,
          })

          mapRef.value.add(polyline.value)

          emit('loadled', polyline)
        }
      })

      onBeforeUnmount(() => {
        polyline.value?.destroy()
      })
    },
  })
</script>
