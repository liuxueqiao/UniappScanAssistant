export default defineStore({
  id: 'message',
  state: () => {
    return {
      toDoUnReadCount: 0, //审批待办数
      vipUnReadCount: 0, // 会员维系待办数
      registrationID: ''
    } as {
      toDoUnReadCount: number;
      vipUnReadCount: number;
      registrationID: string;
    };
  },
  getters: {
    getToDoUnReadCount: (state) => {
      return state.toDoUnReadCount;
    },
    getVipUnReadCount: (state) => {
      return state.vipUnReadCount;
    },
    getRegistrationID: (state) => {
      return state.registrationID;
    }
  },
  actions: {
    setToDoUnReadCount(val: number) {
      this.toDoUnReadCount = val;
    },
    setVipUnReadCount(val: number) {
      this.vipUnReadCount = val;
    },
    setRegistrationID(val: string) {
      this.registrationID = val;
    }
  },
  persist: {
    enabled: true
  }
});
