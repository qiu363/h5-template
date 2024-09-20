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

  const EVENT_LIST = ['click', 'touchstart', 'touchend']

  export default defineComponent({
    name: 'AMapMarker',
    props: {
      map: {
        type: Object as PropType<AMap.Map>,
        default: null,
      },
      option: {
        type: Object as PropType<AMap.MarkerOptions>,
        default: () => {},
      },
    },
    emits: ['loadled', ...EVENT_LIST],
    setup(props, { emit }) {
      const mapRef = shallowRef<AMap.Map>(props.map)
      const marker = shallowRef<AMap.Marker>()

      watch(
        () => props.map,
        (value: AMap.Map) => {
          mapRef.value = unref(value)
        },
      )

      watchEffect(() => {
        if (mapRef.value && !marker.value) {
          marker.value = new AMap.Marker(props.option)

          mapRef.value.add(marker.value)

          let touchStartTouch: any = {}
          marker.value?.on('touchstart', (e: any) => {
            touchStartTouch = e.originEvent?.touches[0]
          })
          marker.value?.on('touchend', (e: any) => {
            const touchEndTouch = e?.originEvent?.changedTouches[0]
            if (
              touchStartTouch.clientX === touchEndTouch.clientX &&
              touchStartTouch.clientY === touchEndTouch.clientY
            ) {
              emit('click', mapRef)
              return
            }

            emit('touchend', mapRef)
          })

          emit('loadled', marker)
        }
      })

      onBeforeUnmount(() => {
        EVENT_LIST.map((item: string) => {
          marker.value?.off(item as AMap.EventType, () => {})

          return item
        })

        marker.value?.destroy()
      })
    },
  })
</script>
