import 'pinia';

export interface PersistenceConfig {
  key?: string; // 存储key前缀
  storage?: Storage; // 存储方式
  states?: string[]; // 需要持久化存储state名称
}

export interface PersistenceOptions {
  enable: boolean; // 是否开启
  option?: PersistenceConfig[]; // 配置列表
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface DefineStoreOptionsBase<S, Store> {
    persistence?: PersistenceOptions; // pinia持久化存储配置
  }
}
