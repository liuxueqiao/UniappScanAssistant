import { RosterFieldSetting } from '@/api/types/response/personalInfo';
export default defineStore({
  id: 'personal',
  state: () => {
    return {
      ehrDict: {},
      rosterField: [],
      employeeId: '',
      versionId: '',
      isRefresh: false,
      isChange: false,
      //首页业绩看板是否刷新
      isCommissionRefresh: false,
      // 盘点录入 是否有已盘商品
      hasInventoryBeenChecked: false
    } as {
      ehrDict: any;
      rosterField: RosterFieldSetting[];
      employeeId: String | null;
      versionId: String | null;
      isRefresh: Boolean;
      isChange: Boolean;
      isCommissionRefresh: Boolean;
      hasInventoryBeenChecked: Boolean;
    };
  },
  getters: {
    getEhrDict: (state) => {
      return state.ehrDict;
    },
    getRosterField: (state) => {
      return state.rosterField;
    },
    getEmployeeId: (state) => {
      return state.employeeId;
    },
    getVersionId: (state) => {
      return state.versionId;
    },
    getIsRefresh: (state) => {
      return state.isRefresh;
    },
    getIsChange: (state) => {
      return state.isChange;
    },
    getIsCommissionRefresh: (state) => {
      return state.isCommissionRefresh;
    },
    getHasInventoryBeenChecked: (state) => {
      return state.hasInventoryBeenChecked;
    }
  },
  actions: {
    setEhrDict(ehrDict) {
      this.ehrDict = ehrDict;
    },
    setRosterField(rosterField) {
      this.rosterField = rosterField;
    },
    setEmployeeId(employeeId) {
      this.employeeId = employeeId;
    },
    setVersionId(versionId) {
      this.versionId = versionId;
    },
    setIsRefresh(isRefresh) {
      this.isRefresh = isRefresh;
    },
    setIsChange(isChange) {
      this.isChange = isChange;
    },
    setIsCommissionRefresh(isCommissionRefresh) {
      this.isCommissionRefresh = isCommissionRefresh;
    },
    setHasInventoryBeenChecked(hasInventoryBeenChecked) {
      this.hasInventoryBeenChecked = hasInventoryBeenChecked;
    }
  }
});
