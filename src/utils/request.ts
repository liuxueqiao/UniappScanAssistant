import { isDevelopment, isH5 } from './platform';
import env from '@/config/env';
import { hideLoading, showLoading } from '@/config/serviceLoading';
import { unbindTencentAccount } from '@/api/msg';
import { getDeviceIdSafely } from './common';
const { getRegistrationID } = useStore('message');
const errorMsg = '网络请求错误，请重试';

function reject(err: { code: number; msg: string }, showError: boolean) {
  const { msg = errorMsg, code = -1 } = err;
  switch (code) {
    case 10000:
      // 特殊异常处理
      // forward('login');
      uni.reLaunch({
        url: '/pages/login/pwdLogin'
      });
      break;

    default:
      if (showError) {
        setTimeout(() => {
          uni.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
          });
        }, 500);
      }
      break;
  }
}

const getTenantId = (url) => {
  const { getUserInfo } = useStore('user');
  if (url === 'auth/oauth2/token') {
    return '';
  } else {
    return getUserInfo.value?.tenantId || '';
  }
};

// h5环境开启代理
const apiBaseUrl = isH5 && isDevelopment ? '/api/' : env.apiBaseUrl;

export function baseRequest<T>(
  method:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
    | undefined,
  url: string,
  data,
  headers?,
  loading = true,
  showError = true,
  loadingMask = false,
  customBaseUrl?: string // 支持自定义 baseUrl，用于 AI 服务等
) {
  // isInterceptMsg = false
  const { clearAllCashierCache } = useStore('cashier');
  const { getToken, clearUserData } = useStore('user');

  return new Promise<T>((resolve) => {
    if (loading) {
      showLoading(true, loadingMask);
    }
    const finalHeader = Object.assign(
      {
        'Client-Tom': 'Y',
        'TENANT-ID': getTenantId(url),
        Authorization: getToken.value,
        skipToken: true,
        'content-type':
          url === 'auth/oauth2/token'
            ? 'application/x-www-form-urlencoded'
            : 'application/json; charset=utf-8'
      },
      headers
    );
    if (!getTenantId(url)) {
      delete finalHeader['TENANT-ID'];
    }
    // showLoading(data.isLoading);
    // delete data.isLoading;
    let responseData: T;
    // 使用自定义 baseUrl 或默认的 apiBaseUrl
    const finalBaseUrl = customBaseUrl || apiBaseUrl;
    uni.request({
      url: finalBaseUrl + url,
      method,
      timeout: 30000,
      header: finalHeader,
      data,
      success: (res: any) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          responseData = res.data;
          if (url === 'auth/oauth2/token') {
            // 登录接口单独处理
            if (res.data.code && res.data.code === 1) {
              reject(res.data, showError);
            }
          } else {
            if (res.data.code !== 0) {
              reject(res.data, showError);
            }
          }
        } else {
          reject(
            {
              code: res.statusCode,
              msg: res.data.msg
            },
            showError
          );

          if (res.statusCode === 401 || res.statusCode === 424) {
            const pages = getCurrentPages();
            if (pages[pages.length - 1].route === 'pages/login/pwdLogin') {
              return;
            }
            clearUserData();
            clearAllCashierCache();
            // token失效
            // forward('login');
            // #ifdef APP-PLUS
            const { getUserInfo } = useStore('user');
            const tenantId = getUserInfo.value?.tenantId;
            const employeeId = getUserInfo.value?.employeeId;
            const deviceCode = getDeviceIdSafely();
            if (res.statusCode === 424 && deviceCode) {
              unbindTencentAccount({
                tencentIMAccount: `${tenantId}-${employeeId}`,
                imei: deviceCode
              }).then(() => {
                console.log('解绑成功>>>');
              });
            }
            // #endif
            uni.reLaunch({
              url: '/pages/login/pwdLogin'
            });
          }
        }
      },
      fail: () => {
        reject(
          {
            code: -1,
            msg: errorMsg
          },
          showError
        );
      },
      complete: (data) => {
        resolve(responseData);
        hideLoading();
      }
    });
  });
}

export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      obj[key].forEach((item) => {
        if (typeof item === 'string') {
          parameters += `${key}=${encodeURIComponent(item as string)}&`;
        }
      });
    } else {
      parameters += `${key}=${encodeURIComponent(obj[key])}&`;
    }
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, '?') + parameters;
}

const http = {
  get: <T>(
    api: string,
    params?: any,
    headers?: any,
    loading = true,
    showError = true,
    loadingMask = false,
    customBaseUrl?: string
  ) =>
    baseRequest(
      'GET',
      api,
      params,
      headers,
      loading,
      showError,
      loadingMask,
      customBaseUrl
    ) as Http.BaseResponse<T>,
  post: <T>(
    api: string,
    params?: any,
    headers?: any,
    loading = true,
    showError = true,
    loadingMask = false,
    customBaseUrl?: string
  ) =>
    baseRequest(
      'POST',
      api,
      params,
      headers,
      loading,
      showError,
      loadingMask,
      customBaseUrl
    ) as Http.BaseResponse<T>,
  put: <T>(
    api: string,
    params?: any,
    headers?: any,
    loading = true,
    showError = true,
    loadingMask = false,
    customBaseUrl?: string
  ) =>
    baseRequest(
      'PUT',
      api,
      params,
      headers,
      loading,
      showError,
      loadingMask,
      customBaseUrl
    ) as Http.BaseResponse<T>
};

// 导出 AI 专用的 http 实例，使用 aiBaseUrl
export const aiHttp = {
  get: <T>(
    api: string,
    params?: any,
    headers?: any,
    loading = true,
    showError = true,
    loadingMask = false
  ) =>
    baseRequest(
      'GET',
      api,
      params,
      headers,
      loading,
      showError,
      loadingMask,
      env.aiBaseUrl
    ) as Http.BaseResponse<T>,
  post: <T>(
    api: string,
    params?: any,
    headers?: any,
    loading = true,
    showError = true,
    loadingMask = false
  ) =>
    baseRequest(
      'POST',
      api,
      params,
      headers,
      loading,
      showError,
      loadingMask,
      env.aiBaseUrl
    ) as Http.BaseResponse<T>,
  put: <T>(
    api: string,
    params?: any,
    headers?: any,
    loading = true,
    showError = true,
    loadingMask = false
  ) =>
    baseRequest(
      'PUT',
      api,
      params,
      headers,
      loading,
      showError,
      loadingMask,
      env.aiBaseUrl
    ) as Http.BaseResponse<T>
};

export default http;
