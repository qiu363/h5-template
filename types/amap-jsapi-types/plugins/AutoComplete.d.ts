export interface AutoCompleteOptions {
  /** 兴趣点城市 */
  city?: string;
  /** 绑定输入框ID */
  input?: string;
}

export interface AutoComplateTips {
  id: number;
  name: string;
  district: string;
  adcode: string;
  location: string;
  address: string;
}

export interface AutoComplateResult {
  status: number;
  info: string;
  count: number;
  tips: AutoComplateTips[];
}

export class _AutoComplete {
  constructor(
    options: AutoCompleteOptions = {
      pageIndex: 1,
      pageSize: 10,
    },
  );

  /**
   * 关键字搜索
   * @param keyword string 地点关键字
   * @param callback function 结果回调函数
   */
  search: (keyword: string, callback: (status: string, result: AutoComplateResult) => void) => void;
}
