import { showLoading } from '@/config/serviceLoading';

export const showToast = (data: string, duration?) => {
  uni.showToast({
    title: data,
    icon: 'none',
    duration: duration || 1500
  });
};

export const showToastDelay = (msg: string, callback: Function) => {
  uni.showToast({
    title: msg,
    icon: 'none'
  });
  setTimeout(() => {
    callback();
  }, 500);
};

export const showUnFinishedToast = () => {
  showToast('程序员小哥哥小姐姐正在努力开发中，敬请期待');
};

/** 保留二位小数不做四舍五入
   * toFixedStringTwo(1); // 返回 "1"
    toFixedStringTwo('1.2'); // 返回 "1.2"
    toFixedStringTwo('1.23'); // 返回 "1.23"
    toFixedStringTwo(1.234); // 返回 "1.23"
    toFixedStringTwo('1.235'); // 返回 "1.23"
    toFixedStringTwo('abc'); // 返回 ""
**/
export const toFixedStringTwo = (num) => {
  if (!num) return '0';
  num = Number(num);
  if (isNaN(num)) {
    return '';
  }
  return num.toString().match(/^\d+(\.\d{0,2})?/)[0];
};

/**
 * 保留2位小数，四舍五入
 * @param num string或者number
 * @param fixed 保留几位小数，默认2
 * @param floor 是否四舍五入，默认要四舍五入。1不要四舍五入
 * @returns
 */
export function toFixed2(num, fixed = 2, floor = 0) {
  if (num) {
    if (floor === 1) {
      return `${Math.floor(+num * 10 ** fixed) / 10 ** fixed}`;
    } else {
      const roundedNum = Math.round(+num * 10 ** fixed) / 10 ** fixed;
      return roundedNum.toFixed(fixed);
    }
  }
  return '0.00';
}
/**
 * 格式商品单价(格式化最多6位，最少2位，不要四舍五入)
 *
 * @param amount 金额（number/string）
 * result---- 1.123456 1.123456
 result---- 1.12 1.12
 result---- 1.126 1.126
 result---- 1.123 1.123
 result---- 1.000001 1.000001
 result---- 1.0000001 1.00
 result---- 1.0000009 1.000001
 result---- 1 1.00
 result---- 1 1.00
 result---- 1.56 1.56
 result---- 1.560001 1
 */
export function formatUnitPrice(costPrice) {
  const temp = +toFixed2(costPrice, 6);
  const temp1 = +toFixed2(costPrice, 2, 1);
  let result = '';
  if (temp > temp1) {
    result = `${temp}`;
  } else {
    result = toFixed2(costPrice);
  }
  console.log('result----', costPrice, result);
  return result;
}
/**
 * 电话号码隐藏中间四位
 * @param phoneNum
 * @returns
 */
export function formatPhoneNum(phoneNum: string | undefined | null) {
  if (!phoneNum || typeof phoneNum !== 'string') {
    return '';
  }
  const numStr = phoneNum.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  return numStr;
}

/**
 * 安全获取设备ID（仅在用户同意隐私政策后）
 * @returns 设备ID，如果用户未同意隐私政策则返回空字符串
 */
export function getDeviceIdSafely(): string {
  // #ifdef APP-PLUS || APP-HARMONY
  try {
    // 检查用户是否已同意隐私政策
    const { getUserNoticeFlag } = require('@/utils/storage');
    const hasAgreed = getUserNoticeFlag();

    // 如果用户已同意隐私政策，才获取设备ID
    if (hasAgreed === '1' || hasAgreed === 1) {
      const deviceInfo = uni.getDeviceInfo();
      return deviceInfo?.deviceId || '';
    }

    // 用户未同意隐私政策，返回空字符串
    return '';
  } catch (error) {
    console.error('获取设备ID失败:', error);
    return '';
  }
  // #endif

  // #ifndef APP-PLUS && !APP-HARMONY
  return '';
  // #endif
}

// 数字转中文
export function numberToChinese(num: number) {
  const chnNumChar = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九'
  ];
  const chnUnitChar = ['', '十', '百', '千'];
  let strIns = '';
  let chnStr = '';
  let unitPos = 0;
  let zero = true;
  while (num > 0) {
    const v = num % 10;
    if (v === 0) {
      if (!zero) {
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    } else {
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
      chnStr = chnStr.replace(/^一十/, '十');
    }
    unitPos++;
    num = Math.floor(num / 10);
  }
  return chnStr;
}
// 防抖
export function useDebounceFn(fn, delay = 300) {
  let timeout;
  const debouncedFn = (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
  return debouncedFn;
}

// 节流
export function useThrottleFn(fn: Function, delay = 300) {
  let timeout;

  const throttleFn = function (this: object, ...args) {
    if (timeout) {
      return;
    }

    fn.apply(this, args);

    timeout = setTimeout(() => {
      timeout = null;
      clearTimeout(timeout);
    }, delay);
  };

  return throttleFn;
}

// 深拷贝
export function deepClone(obj) {
  // 如果 obj 是 null、undefined 或者不是对象类型，直接返回 obj
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  // 如果 obj 是数组，先创建一个空数组，然后递归克隆数组中的每个元素
  if (Array.isArray(obj)) {
    const clone = [] as any;
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepClone(obj[i]);
    }
    return clone;
  }
  // 如果 obj 是对象，先创建一个空对象，然后递归克隆对象的每个属性
  const clone = {};
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

/**
 * 格式化金额数字
 * @param data
 */
export function formatMoney(data, field = '') {
  const keys = [
    'saleOrderNo_2_0_0',
    // 'saleAmt',
    // 'saleReferenceGross',
    'proCode_2_0_0',
    'ERP-03-01',
    'ERP-03-02',
    'ERP-04-01',
    'APP-GOODS-CLASS-INVENTORY',
    'PF-305-02',
    'PF-305-04'
  ];
  if (!data) {
    return 0;
  }

  if (typeof data !== 'number') {
    return data;
  }

  if (data < 10000 && data > -10000) {
    /// return keys.includes(field) ? data.toFixed(0) : data.toFixed(2);
    // return data.toFixed(2);
    return data;
  }

  const prefix = (data / 10000).toFixed(2);

  const suffix = '万';

  return prefix + suffix;
}

export const getRandomNum = (): string => {
  const str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFJHIJKLMNOPQRSTUVWXYZ';
  let randomNum = '';
  for (let i = 0; i < 32; i++) {
    randomNum += str.charAt(Math.floor(Math.random() * str.length));
  }
  return randomNum;
};

export const filterNullValues = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
};
export const getPlatformParam = () => {
  let platformParam = '';
  if (uni.getSystemInfoSync().platform === 'ios') {
    platformParam = 'yaoudpro-ios';
  } else if (uni.getSystemInfoSync().platform === 'android') {
    platformParam = 'yaoudppro-android';
  } else if (uni.getSystemInfoSync().platform === 'harmonyos') {
    platformParam = 'yaoudppro-android';
  } else {
    platformParam = 'emp-mini';
  }
  // #ifdef MP || MP-WEIXIN
  platformParam = 'emp-mini';
  // #endif
  return platformParam;
};
// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      func(...args);
    }
  };
};
// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: any = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// 数组对象扁平化
export const flatten = (arr, children = 'children') => {
  let result: any = [];
  arr.forEach((item) => {
    result.push(item);
    if (Array.isArray(item[children])) {
      result = result.concat(flatten(item[children]));
    }
  });
  return result;
};

export const getDictInfo = (dictList, dictCode: string) => {
  if (dictList) {
    const flatDictList = flatten(dictList, 'children');
    return flatDictList.find((item) => item.code == dictCode);
  }
  return {};
};

// 是否标识为erp系统
export const isErpSystem = () => {
  const { getOrganShop } = useStore('user');
  return getOrganShop.value.systemId === 1;
};

// 阿拉伯转中文
export const arabicToChinese = (num: number) => {
  if (num === 0) {
    return '零';
  }
  const chineseNumbers = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九'
  ];
  const chineseUnits = ['', '十', '百', '千', '万', '亿'];
  let result = '';
  let isZero = true;
  if (num < 0) {
    result += '负';
    num = Math.abs(num);
  }
  const numStr = num.toString();
  for (let i = 0; i < numStr.length; i++) {
    const digit = numStr[i];
    if (digit === '0') {
      if (!isZero) {
        isZero = true;
      }
    } else {
      result += chineseNumbers[digit];

      result += chineseUnits[numStr.length - i - 1];
      isZero = false;
    }
  }
  return result;
};
export const logout = () => {
  const { clearAllCashierCache } = useStore('cashier');
  const { clearUserData } = useStore('user');
  clearUserData();
  clearAllCashierCache();
  uni.reLaunch({
    url: '/pages/login/pwdLogin'
  });
};

export const getLocation = (callback: Function) => {
  showLoading(true);
  uni.getLocation({
    isHighAccuracy: true,
    async success(res) {
      const longitude = res.longitude;
      const latitude = res.latitude;
      console.log(`当前位置的经度1：${longitude}`);
      console.log(`当前位置的纬度1：${latitude}`);
      callback(longitude, latitude);
      showLoading(false);
    },
    fail(result) {
      // showToast('获取定位失败，请开启GPS定位后重试!');
      callback('', '');
      showLoading(false);
      console.log('error:', result);
    }
  });
};

// 生成随机字符串
export const randomString = (length = 18) => {
  const chars =
    '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

export const hasNumericValue = (value: any): boolean => {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
};

export const useGetContainerHeightHooks = (
  instance: any,
  className: string
) => {
  const getNeedHeight = async () => {
    return new Promise((resolve) => {
      nextTick(async () => {
        const systemInfo = uni.getSystemInfoSync() as any;
        const safeHeight =
          systemInfo?.safeArea?.height + systemInfo?.safeArea?.top;
        const query = uni.createSelectorQuery().in(instance);
        query
          .select(className)
          .boundingClientRect((data: any) => {
            resolve(safeHeight - data.top);
          })
          .exec();
      });
    });
  };
  return {
    getNeedHeight
  };
};
