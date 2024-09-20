export interface GeocoderOptions {
  /** 所在城市 */
  city?: string;
  /** 查询半径 单位：米 */
  radius?: number;
  /** 语言类型 */
  lang?: string;
  /** 是否批量查询 */
  batch?: boolean;
  /** 逆地理编码时，返回信息的详略 base: 基本信息 all: 返回地址信息及附近poi、道路、道路交叉口等信息 默认base */
  extensions?: string;
}

export class _Geocoder {
  constructor(options: GeocoderOptions);

  /**
   * 根据给定的地址描述进行解析
   * @param address 地址详细信息
   * @param callback function 结果回调函数
   */
  getLocation: (address: string, callback: (status: string, result: T) => void) => void;

  /**
   * 地理编码时，设置地址描述所在城市
   * @param city string 城市名
   */
  setCity: (city: string) => void;

  /**
   * 根据给定坐标进行解析
   * @param location
   */
  getAddress: (
    location: AMap.LngLat | Array<AMap.LngLat>,
    callback: (status: string, result: T) => void,
  ) => void;
}
