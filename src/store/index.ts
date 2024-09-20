import { createPinia } from 'pinia'
import persistence from './plugin/persistence.plugin'

const store = createPinia()
store.use(persistence)

export default store
