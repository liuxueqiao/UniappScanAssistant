import type { ComponentInternalInstance } from 'vue';
import { getCurrentInstance } from 'vue';
export default function useGlobalProperties() {
  const { appContext } = getCurrentInstance() as ComponentInternalInstance;
  return appContext.config.globalProperties;
}
