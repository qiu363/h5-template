import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  shortcuts: [{ logo: 'w-6em h-6em transform transition-800' }],
  presets: [presetUno(), presetAttributify()],
})
