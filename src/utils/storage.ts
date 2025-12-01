const TOKEN_KEY = 'sp_token'; // token
const USER_INFO_KEY = 'sp_user_info'; // 用户信息
export const SHOP_INFO_KEY = 'sp_shop_info'; // 门店信息
const LOGIN_FORM_KEY = 'sp_login_form'; // 登录账号密码
const USER_NOTICE_KEY = 'sp_user_notice'; // 用户隐私协议弹窗
const DICT_INFO_KEY = 'sp_dict_info'; // 字典
const PWD_IS_SAFE_KEY = 'sp_pwd_is_safe'; // 密码是否安全
interface Storage {
  [key: string]: any;
}
type StorageType = Storage | string;

export function storageDictInfo(dictInfo: StorageType) {
  set(DICT_INFO_KEY, dictInfo);
}

// 设置userToken
export function setToken(token: string) {
  set(TOKEN_KEY, token);
}
//设置密码的复杂情况，1表示需要强制修改密码，0表示不强制修改
export function setPwdIsSafeStorage(pwdIsSafe: '1' | '0') {
  set(PWD_IS_SAFE_KEY, pwdIsSafe);
}

// 设置用户信息
export function setUserInfo(userInfo: StorageType) {
  set(USER_INFO_KEY, userInfo);
}

export function setShopInfo(shopInfo: StorageType) {
  set(SHOP_INFO_KEY, shopInfo);
}

export function setLoginForm(loginForm: StorageType) {
  set(LOGIN_FORM_KEY, loginForm);
}

export function setUserNoticeFlag(flag: StorageType) {
  set(USER_NOTICE_KEY, flag);
}

export function getDictInfo(): any {
  return get(DICT_INFO_KEY) as string | null;
}

// 获取Token
export function getToken(): string | null {
  return get(TOKEN_KEY) as string | null;
}
//获取密码的复杂情况，1表示需要强制修改密码，0表示不强制修改
export function getPwdIsSafeStorage(): '1' | '0' | null {
  return get(PWD_IS_SAFE_KEY) as '1' | '0' | null;
}

// 获取用户信息
export function getUserInfo(): any {
  return get(USER_INFO_KEY) as string | null;
}

// 获取门店信息
export function getShopInfo(): any {
  return get(SHOP_INFO_KEY) as string | null;
}

export function getLoginForm(): any {
  return get(LOGIN_FORM_KEY) as string | null;
}

export function getUserNoticeFlag(): any {
  return get(USER_NOTICE_KEY) as string | null;
}

export function set(key: string, content: StorageType) {
  if (!content) return;
  if (typeof content === 'object') {
    content = JSON.stringify(content);
  }
  uni.setStorageSync(key, content);
}

export function get(key: string): null | string | Record<string, any> {
  const info = uni.getStorageSync(key);
  if (!info) return info;
  try {
    return JSON.parse(info);
  } catch (error) {
    return info;
  }
}

export function remove(key: any) {
  uni.removeStorage({ key });
}

export default {
  set,
  get,
  setToken,
  setUserInfo,
  getToken,
  getUserInfo,
  remove,
  SHOP_INFO_KEY
};
