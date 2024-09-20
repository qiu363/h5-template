import { _loadMap } from '@/utils/amap'
import { PlaceSearchOptions } from '#/amap-jsapi-types/plugins/PlaceSearch'
import {
  AutoComplateResult,
  AutoCompleteOptions,
} from '#/amap-jsapi-types/plugins/AutoComplete'
import { GeocoderOptions } from '#/amap-jsapi-types/plugins/Geocoder'
import {
  GeolocationError,
  GeolocationOptions,
  GeolocationResult,
} from '#/amap-jsapi-types/plugins/Geolocation'
import { AmapSecurityConfig } from '@/components/AMap/config'

function loadAMap(key: string, plugins: string[] = []) {
  const mapLoaded = ref<boolean>(false)

  onMounted(() => {
    _loadMap(key, plugins).then(() => {
      mapLoaded.value = true
    })
  })

  return mapLoaded
}

const useAMap = (
  mapOptions: {
    securityConfig?: {
      key: string
      secret?: string
    }
    plugins?: string[]
    forceWebGL?: boolean
  } = {
    securityConfig: {
      key: AmapSecurityConfig.key,
      secret: AmapSecurityConfig.secret,
    },
    plugins: [],
    forceWebGL: false,
  },
): {
  mapLoaded: Ref<boolean>
  initMap: (containerRef: Ref<HTMLDivElement | undefined>, options: AMap.MapOptions) => AMap.Map
  marker: (options: AMap.MarkerOptions) => AMap.Marker
  polyline: (options: AMap.PolylineOptions) => AMap.Polyline
  autoComplete: (options: AutoCompleteOptions) => {
    autocomplete: AMap.AutoComplete
    search: (keyword: string) => Promise<AutoComplateResult>
  }
  placeSearch: (options: PlaceSearchOptions) => {
    placesearch: AMap.PlaceSearch
    search: (keyword: string) => Promise<any>
  }
  geocoder: (options: GeocoderOptions) => {
    geocoderObj: AMap.Geocoder
    getLocation: (address: string) => Promise<any>
    getAddress: (location: AMap.LngLat | Array<AMap.LngLat>) => Promise<any>
  }
  geolocation: (options: GeolocationOptions) => {
    geolocationObj: AMap.Geolocation
    isSupported: () => boolean
    getCurrentPosition: () => Promise<GeolocationResult | GeolocationError>
  }
} => {
  const {
    plugins = [],
    securityConfig = {
      key: AmapSecurityConfig.key,
      secret: AmapSecurityConfig.secret,
    },
  } = mapOptions
  let mapRef: AMap.Map
  const mapLoaded = loadAMap(securityConfig.key, plugins)

  if (securityConfig.secret) {
    window._AMapSecurityConfig = {
      securityJsCode: securityConfig.secret,
    }
  }
  if (mapOptions.forceWebGL) {
    window.forceWebGL = true
  }

  /**
   * 初始化地图到dom
   * @param containerRef 地图容器
   * @param options 地图配置
   */
  const initMap = (containerRef: Ref<HTMLDivElement | undefined>, options: AMap.MapOptions) => {
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }
    if (containerRef.value) {
      mapRef = new AMap.Map(containerRef.value, options)
    }

    return mapRef
  }

  /**
   * marker
   * @param options AMap.MarkerOptions marker配置
   */
  const marker = (options: AMap.MarkerOptions) => {
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }

    const markerObj = new AMap.Marker(options)

    return markerObj
  }

  /**
   * polyline
   * @param options AMap.PolygonOptions polyline配置
   */
  const polyline = (options: AMap.PolylineOptions) => {
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }

    const polylineObj = new AMap.Polyline(options)

    return polylineObj
  }

  /**
   * 地点检索
   * @param options 搜索设置
   * @returns
   */
  const autoComplete = (options: AutoCompleteOptions) => {
    if (!plugins.includes('AMap.AutoComplete')) {
      const message = {
        message: '插件未初始化AutoComplete组件',
      }
      throw message
    }
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }

    const autocomplete = new AMap.AutoComplete(options)

    const search = (keyword: string) =>
      new Promise<AutoComplateResult>((resolve, reject) => {
        autocomplete.search(keyword, (_status, result) => {
          if (result.info === 'OK') {
            resolve(result)
          } else {
            reject(result)
          }
        })
      })

    return {
      autocomplete,
      search,
    }
  }

  /**
   * 地点检索
   * @param options 搜索设置
   * @returns
   */
  const placeSearch = (options: PlaceSearchOptions) => {
    if (!plugins.includes('AMap.PlaceSearch')) {
      const message = {
        message: '插件未初始化PlaceSearch组件',
      }
      throw message
    }
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }

    const placesearch = new AMap.PlaceSearch(options)

    const search = (keyword: string) =>
      new Promise((resolve, reject) => {
        placesearch.search(keyword, (_status, result) => {
          if (result.info === 'OK') {
            resolve(result)
          } else {
            reject(result)
          }
        })
      })

    return {
      placesearch,
      search,
    }
  }

  /**
   * 地址解析 geocode
   * @param options 搜索设置
   * @returns
   */
  const geocoder = (options: GeocoderOptions) => {
    if (!plugins.includes('AMap.Geocoder')) {
      const message = {
        message: '插件未初始化Geocoder组件',
      }
      throw message
    }
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }

    const geocoderObj = new AMap.Geocoder(options)

    const getLocation = (address: string) =>
      new Promise((resolve, reject) => {
        geocoderObj.getLocation(address, (_status, result) => {
          if (result.info === 'OK') {
            resolve(result)
          } else {
            reject(result)
          }
        })
      })

    const getAddress = (location: AMap.LngLat | Array<AMap.LngLat>) =>
      new Promise((resolve, reject) => {
        geocoderObj.getAddress(location, (_status, result) => {
          if (result.info === 'OK') {
            resolve(result)
          } else {
            reject(result)
          }
        })
      })

    return {
      geocoderObj,
      getLocation,
      getAddress,
    }
  }

  /**
   * 定位 geocode
   * @param options 搜索设置
   * @returns
   */
  const geolocation = (options: GeolocationOptions) => {
    if (!plugins.includes('AMap.Geolocation')) {
      const message = {
        message: '插件未初始化Geolocation组件',
      }
      throw message
    }
    if (!mapLoaded.value) {
      const message = {
        message: '地图尚未初始化完成',
      }
      throw message
    }

    const geolocationObj = new AMap.Geolocation(options)

    const isSupported = () => geolocationObj.isSupported()

    const getCurrentPosition = () =>
      new Promise<GeolocationResult | GeolocationError>((resolve, reject) => {
        geolocationObj.getCurrentPosition(
          (_status, result: GeolocationResult | GeolocationError) => {
            if (result.info === 'SUCCESS') {
              resolve(result as GeolocationResult)
            } else {
              reject(result)
            }
          },
        )
      })

    return {
      geolocationObj,
      isSupported,
      getCurrentPosition,
    }
  }

  return {
    mapLoaded,
    initMap,
    marker,
    polyline,
    placeSearch,
    autoComplete,
    geocoder,
    geolocation,
  }
}

export { useAMap }
