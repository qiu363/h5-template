import type { Emitter, EventType } from 'mitt'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $eventBus: Emitter<Record<EventType, unknown>>
    [key: string]: any
  }
}
