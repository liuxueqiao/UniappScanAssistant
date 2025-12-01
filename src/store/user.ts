import {
  SHOP_INFO_KEY,
  getDictInfo,
  getLoginForm,
  getPwdIsSafeStorage,
  getShopInfo,
  getToken,
  getUserInfo,
  remove,
  setLoginForm,
  setPwdIsSafeStorage,
  setShopInfo,
  setToken,
  setUserInfo,
  storageDictInfo
} from '@/utils/storage';
import type { ShopOrgan } from '@/api/types/response/organResponse';
import type {
  DictEntity,
  DictResp,
  ResourceData,
  SystemListChild
} from '@/api/types/response/commonResponse';

import type { LoginReq } from '@/api/types/request/userRequest';
import { flatten } from '@/utils/common';
// import { ROUTER_DATA_INDEX, ROUTER_WORK_INDEX } from '@/config/constant';

const findPermission = (
  permissionArr: SystemListChild[],
  permissionStrArray: string[]
) => {
  if (!permissionArr) {
    return;
  }

  permissionArr.forEach((it) => {
    if (it.permission && !permissionStrArray.includes(it.permission)) {
      permissionStrArray.push(it.permission);
    }

    findPermission(it.children, permissionStrArray);
  });
};

export default defineStore({
  id: 'user',
  state: () => {
    return {
      userInfo: null,
      token: '',
      organShop: null,
      permissionInfo: {},
      loginForm: null,
      dictInfo: null,
      pwdIsControl: null
    } as {
      userInfo: User.UserInfo | null;
      token: string;
      organShop: ShopOrgan | null;
      permissionInfo: ResourceData;
      loginForm: LoginReq | null;
      dictInfo: DictResp | null;
      pwdIsControl: '1' | '0' | null;
    };
  },
  getters: {
    getPwdIsSafe: (state) => {
      if (!state.pwdIsControl) return getPwdIsSafeStorage();
      return state.pwdIsControl;
    },
    getUserInfo: (state) => {
      if (!state.userInfo) return getUserInfo();
      return state.userInfo;
    },
    getToken: (state) => {
      if (!state.token) return getToken();
      return state.token;
    },
    getOrganShop: (state) => {
      if (!state.organShop) return getShopInfo();
      return state.organShop;
    },
    getStoreId: (state) => {
      let organShop = state.organShop;
      if (!organShop) organShop = getShopInfo();
      if (
        organShop &&
        typeof organShop?.type === 'number' &&
        organShop?.type === 3 &&
        organShop?.mainId
      ) {
        return organShop.mainId;
      }
      return '';
      // return organShop?.id ?? '';
    },
    getEmployeeId: (state) => {
      if (state.userInfo && state.userInfo.employeeId) {
        return state.userInfo.employeeId;
      } else {
        return getUserInfo().employeeId;
      }
    },
    getPermissionInfo: (state) => {
      return state.permissionInfo;
    },
    getLoginForm: (state) => {
      if (!state.loginForm) return getLoginForm();
      return state.loginForm;
    }
  },
  actions: {
    getDictInfo(dictCode, code) {
      if (!dictCode) return {};
      if (!this.dictInfo) this.dictInfo = getDictInfo();
      const dictList = this.dictInfo![dictCode];
      if (dictList) {
        const flatDictList = flatten(dictList, 'children');
        return flatDictList.find((item) => item.code == code);
      }
      return {};
    },

    getDictList(dictCode): DictEntity[] {
      if (!this.dictInfo) this.dictInfo = getDictInfo();
      const dictList = this.dictInfo![dictCode];
      return dictList;
    },
    setDictInfo(val: DictResp) {
      this.dictInfo = val;
      storageDictInfo(val);
    },
    setUserToken(val: string) {
      this.token = val;
      setToken(val);
    },
    setPwdIsSafe(val: '1' | '0') {
      this.pwdIsControl = val;
      setPwdIsSafeStorage(val);
    },
    setOrgan(organ: ShopOrgan | null) {
      this.organShop = organ;
      if (!organ) {
        remove(SHOP_INFO_KEY);
      } else {
        setShopInfo(organ);
      }
    },
    async setUserInfo(userInfo: User.UserInfo) {
      this.userInfo = userInfo;
      // uni.$emit(CallbackEnum.ON_REFRESH_WATERMARK);
      setUserInfo(userInfo);
    },
    setPermissionInfo(permissionInfo: ResourceData) {
      this.permissionInfo = permissionInfo;
    },
    hasPermission(permission: string): boolean {
      let flag = false;

      this.permissionInfo.systemList?.forEach((it) => {
        if (['ERP', 'HIS'].includes(String(it.name)) && it.children != null) {
          const permissionStrArray: string[] = [];
          findPermission(it.children, permissionStrArray);
          flag = permissionStrArray.includes(permission);
        }
      });
      return flag;
    },
    setLoginForm(loginForm: LoginReq) {
      // );不再记住用户密码
      const tempData: LoginReq = loginForm;
      tempData.password = '';
      this.loginForm = tempData;
      setLoginForm(loginForm);
    },
    clearUserData() {
      this.setUserInfo({} as User.UserInfo);
      this.setUserToken('');
      this.setOrgan(null);
      uni.clearStorage();
    }
  }
});
