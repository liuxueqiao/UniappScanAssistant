import {
  isFastClick,
  parseUrl,
  restoreUrl,
  safeDecodeParams,
  safeEncodeParams
} from './shared';
import { getUrlType, h5HsqMap, needAuthPath, pagesMap } from './urlMap';

export function onUrlPage(e: any) {
  if (isFastClick()) return;
  const { url } = e.currentTarget.dataset;
  // url = 'http://m.dev.haoshiqi.net/v2/index?id=11&name=22'
  // url = 'https://topic.doweidu.com/?id=a9918e941a43233211fb7a8cfc7afbbd&origin=hsq_aliptmp'
  if (!url) return;
  const urlType = getUrlType(url);
  const { name, path, query } = parseUrl(url);
  if (urlType === 'topic') {
    // 专题页
    forward('topic', Object.assign({ url: path }, query));
  } else if (urlType === 'h5Hsq') {
    if (h5HsqMap.includes(name)) {
      if (needAuthPath.includes(name)) {
        return uni.reLaunch({
          url: '/pages/login/pwdLogin'
        });
      }
      // return forward('login');
      // h5页面
      forward('web-view', Object.assign({ url: path }, query));
    } else {
      // 原生页
      forward(name, query);
    }
  } else if (urlType === 'other' && pagesMap.find((i) => i.name === name)) {
    // 原生页
    forward(name, query);
  } else {
    // 不跳转
  }
}

export function forward(name: string, query: Types.Query = {}): any {
  if (needAuthPath.includes(name)) {
    return uni.reLaunch({
      url: '/pages/login/pwdLogin'
    });
  }
  //  return forward('login');
  const targetPage = pagesMap.find((i) => i.name === name);
  if (!targetPage) return;
  const isReplace = query.replace;
  delete query.replace;
  const { type, path } = targetPage;
  const url = restoreUrl(path, query);
  const params = { url };
  if (type === 'tabBarPage') return uni.switchTab(params);
  if (!isReplace) return uni.navigateTo(params);
  uni.redirectTo(params);
}

export function back(delta: number) {
  uni.navigateBack({
    delta
  });
}

export function backToTargetPage(pageRouter: string) {
  const pageArray = getCurrentPages();
  const pageIndex = pageArray.findIndex((it) => it.route === pageRouter);
  if (pageIndex < pageArray.length - 1) {
    back(pageArray.length - pageIndex - 1);
  }
}

/**
 * 安全的页面跳转方法 - 支持特殊字符传递
 * @param name 页面名称
 * @param query 查询参数
 * @returns
 */
export function safeForward(name: string, query: Types.Query = {}): any {
  if (needAuthPath.includes(name)) {
    return uni.reLaunch({
      url: '/pages/login/pwdLogin'
    });
  }

  const targetPage = pagesMap.find((i) => i.name === name);
  if (!targetPage) return;

  const isReplace = query.replace;
  delete query.replace;

  // 对参数进行安全编码，处理特殊字符
  const encodedQuery = safeEncodeParams(query);

  const { type, path } = targetPage;
  const url = restoreUrl(path, encodedQuery);
  const params = { url };

  if (type === 'tabBarPage') return uni.switchTab(params);
  if (!isReplace) return uni.navigateTo(params);
  uni.redirectTo(params);
}

/**
 * 获取页面参数并自动解码特殊字符
 * @param pageOptions 页面参数对象
 * @returns 解码后的参数对象
 */
export function getSafePageParams(pageOptions: any = {}): any {
  return safeDecodeParams(pageOptions);
}
