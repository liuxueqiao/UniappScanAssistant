import env from '@/config/env';

export default defineStore({
  id: 'config',
  state: () => {
    return {
      ossHost: '',
      inventoryType: 0 // 1--门店盘点 2--仓库盘点
    } as {
      ossHost: string;
      inventoryType: number;
    };
  },
  getters: {
    getOssUrl: (state) => {
      if (!state.ossHost) {
        return env.ossUrl;
      }
      return state.ossHost + '/static/staff';
    },
    getOssHost: (state) => {
      if (!state.ossHost) {
        return env.ossHost;
      }
      return state.ossHost;
    },
    getInventoryType: (state) => {
      return state.inventoryType;
    }
  },
  actions: {
    setOssUrl(val: string) {
      this.ossHost = val;
    },
    setInventoryType(val: number) {
      this.inventoryType = val;
    }
  },
  persist: {
    enabled: true
  }
});
