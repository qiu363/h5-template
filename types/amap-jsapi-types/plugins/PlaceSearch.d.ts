export interface PlaceSearchOptions {
  /** 单页结果数 */
  pageSize?: number;
  /** 页码 */
  pageIndex?: number;
  /** 兴趣点城市 */
  city?: string;
  /** 是否强制限制在设置的城市内搜索 */
  citylimit?: boolean;
  /** 结果展示地图实例 */
  map?: AMap.Map;
  /** 结果展示容器ID */
  panel?: string;
  /** 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围 */
  autoFitView?: boolean;
}

export class _PlaceSearch {
  constructor(
    options: PlaceSearchOptions = {
      pageIndex: 1,
      pageSize: 10,
    },
  );

  /**
   * 获取poi地点详情
   * @param poiid string poi地点id
   * @param callback function 结果回调函数
   */
  getDetails: (poiid: string, callback: (status: string, result: T) => void) => void;

  /**
   * 关键字搜索
   * @param keyword string 地点关键字
   * @param callback function 结果回调函数
   */
  search: (keyword: string, callback: (status: string, result: T) => void) => void;
}
