import { PiniaPluginContext, Store } from 'pinia';
import { PersistenceConfig } from '#/pinia';

const updateStorage = (config: PersistenceConfig, store: Store): void => {
  const storage = config.storage || localStorage;
  const storeKey = config.key || store.$id;

  if (config.states) {
    const partialState = config.states.reduce((finalObj, key) => {
      finalObj[key] = store.$state[key];
      return finalObj;
    }, {} as PersistenceConfig);

    storage.setItem(storeKey, JSON.stringify(partialState));
  } else {
    storage.setItem(storeKey, JSON.stringify(store.$state));
  }
};

// store 持久化工具
const persistence = ({ options, store }: PiniaPluginContext): void => {
  if (options.persistence?.enable) {
    const defaultStrat: PersistenceConfig[] = [
      {
        key: store.$id,
        storage: localStorage,
      },
    ];

    const configs = options.persistence?.option?.length
      ? options.persistence?.option
      : defaultStrat;

    configs.map((item) => {
      const storage = item.storage || localStorage;
      const storeKey = item.key || store.$id;
      const storageRes = storage.getItem(storeKey);

      if (storageRes) {
        try {
          // 同步storage数据到store
          store.$patch(JSON.parse(storageRes));
        } catch (_e) {}
      }
    });

    store.$subscribe(() => {
      configs.map((item) => {
        updateStorage(item, store);
      });
    });
  }
};

export default persistence;
