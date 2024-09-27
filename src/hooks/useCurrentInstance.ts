import { ComponentInternalInstance, getCurrentInstance } from 'vue';

export default function useCurrentInstance() {
  const self = getCurrentInstance() as ComponentInternalInstance;
  const { appContext, proxy } = self;
  const globalProperties = appContext.config.globalProperties;

  return {
    self,
    proxy,
    global: globalProperties,
  };
}
