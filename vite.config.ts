import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import postCssPxToVw from 'postcss-px-to-viewport-8-plugin'
import postcssPresetEnv from 'postcss-preset-env'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import { viteMockServe } from 'vite-plugin-mock'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteVConsole } from 'vite-plugin-vconsole'
import { visualizer } from 'rollup-plugin-visualizer'
import autoComponents from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import autoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
const baseLess = path.join(__dirname, './src/less/base.less')

function visualizerConfig(mode: string) {
  if (mode === 'report') {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  }
  return []
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const DROP_CONSOLE_MODE = ['development', 'test']
  const buildMinify: boolean | 'terser' | 'esbuild' | undefined = 'terser'
  const env = loadEnv(mode, './')

  const manualChunks = {
    vue: ['vue', 'vue-router', 'pinia'],
  }
  if (mode !== 'production') {
    manualChunks['vconsole'] = ['vconsole']
  }

  return {
    base: `/${env.VITE_BASE_PATH}`,
    build: {
      outDir: env.VITE_OUT_DIR || 'dist',
      minify: buildMinify,
      terserOptions: {
        compress: {
          drop_console: !DROP_CONSOLE_MODE.includes(mode),
          drop_debugger: true,
        },
      },
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks,
        },
      },
    },
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '#': path.join(__dirname, './types'),
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import "${baseLess}"`,
          },
        },
      },
      postcss: {
        plugins: [
          postcssPresetEnv(),
          postCssPxToVw({
            unitToConvert: 'px', // 要转化的单位
            viewportWidth: 375, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750
            viewportHeight: 667, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置
            unitPrecision: 2, // 指定`px`转换为视窗单位值的小数位数
            propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw
            fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
            selectorBlackList: ['.ignore'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
            mediaQuery: false, // 允许在媒体查询中转换`px`
            replace: true, // 是否转换后直接更换属性值
            landscape: true, // 是否处理横屏情况
            landscapeUnit: 'vh', // (String) 横屏时使用的单位
            landscapeWidth: 375, // (Number) 横屏时使用的视口宽度
          }),
        ],
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3002,
      proxy: {
        '/api': {
          target: 'http://localhost',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/api/mock`), '/mock'),
        },
      },
      open: true,
    },
    plugins: [
      vue(),
      vueJsx(),
      autoComponents({
        dts: 'types/components.d.ts',
        dirs: ['src/components'],
        resolvers: [VantResolver()],
      }),
      autoImport({
        dts: 'types/auto-imports.d.ts',
        imports: ['vue', 'vue-router', 'pinia', 'vitest'],
      }),
      legacy({
        targets: ['since 2015', 'not dead', '> 0.25%'],
        polyfills: ['es.promise.finally', 'es/map', 'es/set'],
        modernPolyfills: ['es.promise.finally'],
      }),
      viteMockServe({
        mockPath: 'mock',
      }),
      createHtmlPlugin({
        inject: {
          data: {
            title: '',
          },
        },
      }),
      viteVConsole({
        entry: path.resolve('src/main.ts'),
        localEnabled: mode !== 'production',
        enabled: mode !== 'production',
        config: {
          maxLogNumber: 1000,
          theme: 'dark',
        },
      }),
      visualizerConfig(mode),
      UnoCSS({
        configFile: './uno.config.ts',
      }),
    ],
    test: {
      environment: 'happy-dom',
      deps: {
        inline: ['vant'],
      },
    },
  }
})
