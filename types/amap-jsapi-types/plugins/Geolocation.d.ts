import '../index';

export interface GeolocationOptions {
  /** 是否使用高精度定位，默认：true */
  enableHighAccuracy?: boolean;
  /** 设置定位超时时间，默认：无穷大 */
  timeout?: number;
  /** 定位结果缓存0毫秒，默认：0 */
  maximumAge?: string;
  /** 自动偏移坐标，偏移后的坐标为高德坐标，默认：true */
  convert?: boolean;
  /** 示定位按钮，默认：true */
  showButton?: boolean;
  /** 定位按钮停靠位置， “LT”：左上角 “LB”：左下角 “RT”：右上角 “RB”：右下角 默认：'LB'，左下角 */
  buttonPosition?: 'LT' | 'LB' | 'RT' | 'RB';
  /** //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20) */
  buttonOffset?: AMap.Pixel;
  /** 定位成功后在定位到的位置显示点标记，默认：true */
  showMarker?: boolean;
  /** 定位成功后用圆圈表示定位精度范围，默认：true */
  showCircle?: boolean;
  /** 定位成功后将定位到的位置作为地图中心点，默认：true */
  panToLocation?: boolean;
  /** 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false */
  zoomToAccuracy?: boolean;
  /** extensions用来设定是否需要周边POI、道路交叉口等信息，可选值'base'、'all'。 */
  extensions?: 'base' | 'all';
  /**
   * 是否禁止使用IP定位，默认值为0，可选值0-3
   * 0: 可以使用IP定位
   * 1: 手机设备禁止使用IP定位
   * 2: PC上禁止使用IP定位
   * 3: 所有终端禁止使用IP定位
   */
  noIpLocate?: 0 | 1 | 2 | 3;
  /**
   * 是否禁止使用浏览器Geolocation定位，默认值为0，可选值0-3
   * 0: 可以使用浏览器定位
   * 1: 手机设备禁止使用浏览器定位
   * 2: PC上禁止使用浏览器定位
   * 3: 所有终端禁止使用浏览器定位
   */
  noGeoLocation?: 0 | 1 | 2 | 3;
  /** 默认为false，设置为true的时候可以调整PC端为优先使用浏览器定位，失败后使用IP定位 */
  GeoLocationFirst?: boolean;
  /** 是否使用安卓定位sdk用来进行定位，默认：false */
  useNative?: boolean;
  [key: string]: any;
}

export interface GeolocationCitySearchResult {
  city: string;
  bounds: AMap.Bounds;
}

export interface GeolocationResult {
  /** 定位结果 */
  position: AMap.LngLat;
  /** 精度范围，单位：米 */
  accuracy: number;
  /** 定位结果的来源，可能的值有:'html5'、'ip'、'sdk' */
  location_type: 'html5' | 'ip' | 'sdk' | string;
  /** 形成当前定位结果的一些信息 */
  message: string;
  /** 是否经过坐标纠偏 */
  isConverted: boolean;
  /** 状态信息 "SUCCESS" */
  info: string;
  /** 地址信息 */
  addressComponent: object;
  /** 地址 */
  formattedAddress: string;
  /** 定位点附近的POI信息，extensions等于'base'的时候为空 */
  pois: array;
  /** 定位点附近的道路信息，extensions等于'base'的时候为空 */
  roads: array;
  /** 定位点附近的道路交叉口信息，extensions等于'base'的时候为空 */
  crosses: array;
}

export interface GeolocationError {
  /** 错误信息 */
  info: string;
  /** 造成定位失败结果的一些有用信息 */
  message: string;
}

export class _Geolocation {
  constructor(options: GeolocationOptions);

  /**
   * 是否支持浏览器定位，当不支持是getCurrentPosition也会使用尝试进行精确IP定位
   */
  isSupported: () => boolean;

  /**
   * 获取用户当前的精确位置信息
   * @param address 地址详细信息
   * @param callback function 结果回调函数
   */
  getCurrentPosition: (callback: (status: string, result: T) => void) => void;

  /**
   * 使用浏览器定位接口监控当前位置，移动端有效。在监控过程中，每隔一段时间会自动调用定位成功或失败的回调函数。
   * @returns data number watchId
   */
  watchPosition: () => number;

  /**
   * 取消对当前位置的监控
   * @param watchId number
   */
  clearWatch: (watchId: number) => void;

  /**
   * 进行IP城市查询
   * status为complete的时候表示查询成功，result包含省、市、adcode、citycode、城市中心点center等信息；
   * status为error的时候表示查询失败
   */
  getCityInfo: (callback: (status: string, result: GeolocationCitySearchResult) => void) => void;
}
