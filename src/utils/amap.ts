import AMapLoader from '@amap/amap-jsapi-loader'

// 异步加载地图
const _loadMap = (key = '', plugins: string[] = []) =>
  new Promise((resolve, reject) => {
    AMapLoader.load({
      key,
      version: '2.0',
      plugins,
    })
      .then((AMap) => {
        resolve(AMap)
      })
      .catch((e) => {
        reject(e)
      })
  })

export { _loadMap }
