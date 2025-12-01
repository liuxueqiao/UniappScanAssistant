// 防止快速点击
let lastClickTime = 0;

export function isFastClick(num = 1000) {
  const time = new Date().getTime();
  if (time - lastClickTime > num) return false;
  lastClickTime = time;
  return true;
}

function isJSON(str) {
  if (typeof str != 'string') {
    return false;
  }

  try {
    const obj = JSON.parse(str);
    if (typeof obj == 'object' && obj) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

// 解析 path
export function parseUrl(fullPath: string) {
  const [path, queryStr] = fullPath.split('?');
  const name = path.slice(path.lastIndexOf('/') + 1);
  const query = {};
  queryStr
    ?.split('&')
    .map((i) => i.split('='))
    .forEach((i) => {
      let jsonStr = decodeURIComponent(i[1]);
      if (isJSON(jsonStr)) {
        jsonStr = jsonStr.replace(/@#@/gm, '&'); // 处理&字符
        jsonStr = jsonStr.replace(/@%@/gm, '='); // 处理=字符
        jsonStr = jsonStr.replace(/@@@/gm, '?'); // 处理?字符
        query[i[0]] = JSON.parse(jsonStr);
      } else {
        query[i[0]] = decodeURIComponent(i[1]);
      }
    });
  return {
    name,
    path,
    query
  };
}

// 还原url
export function restoreUrl(path: string, query: Object) {
  let count = 0;
  for (const key in query) {
    if (typeof query[key] === 'object') {
      let jsonStr = JSON.stringify(query[key]);
      jsonStr = jsonStr.replace(/&/gm, '@#@'); // 处理&字符
      jsonStr = jsonStr.replace(/=/g, '@%@'); // 处理=字符
      jsonStr = jsonStr.replace(/\?/g, '@@@'); // 处理?字符
      path += `${count === 0 ? '?' : '&'}${key}=${jsonStr}`;
    } else {
      path += `${count === 0 ? '?' : '&'}${key}=${query[key]}`;
    }
    count += 1;
  }
  return path;
}

// 安全的字符串编码函数 - 处理特殊字符（兼容小程序和App）
export function safeEncode(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  // 统一使用encodeURIComponent确保跨平台兼容性
  // 这是最安全、最兼容的方式，在所有平台都能正常工作
  try {
    return encodeURIComponent(str);
  } catch (e) {
    // 如果encodeURIComponent失败，返回原始字符串
    return str;
  }
}

// 安全的字符串解码函数 - 还原特殊字符（兼容小程序和App）
export function safeDecode(str: string): string {
  if (typeof str !== 'string') {
    return str;
  }

  // 统一使用decodeURIComponent确保跨平台兼容性
  // 这是最安全、最兼容的方式，在所有平台都能正常工作
  try {
    return decodeURIComponent(str);
  } catch (e) {
    // 如果decodeURIComponent失败，返回原始字符串
    return str;
  }
}

// 安全的参数编码函数 - 处理所有参数，确保正确传递
export function safeEncodeParams(params: any): any {
  if (!params || typeof params !== 'object') {
    return params;
  }

  const encodedParams = { ...params };

  for (const key in encodedParams) {
    const value = encodedParams[key];
    if (typeof value === 'string') {
      // 对所有字符串进行编码，确保任何特殊字符都能正确传递
      // 使用前缀标识编码的字符串，便于解码时识别
      encodedParams[key] = `__SAFE_ENCODED__${safeEncode(value)}`;
    } else if (typeof value === 'object' && value !== null) {
      // 对对象和数组进行JSON序列化后编码
      try {
        const jsonStr = JSON.stringify(value);
        encodedParams[key] = `__SAFE_OBJECT__${safeEncode(jsonStr)}`;
      } catch (e) {
        // 如果序列化失败，递归处理嵌套对象
        encodedParams[key] = safeEncodeParams(value);
      }
    }
  }

  return encodedParams;
}

// 安全的参数解码函数 - 还原编码的参数对象
export function safeDecodeParams(params: any): any {
  if (!params || typeof params !== 'object') {
    return params;
  }

  const decodedParams = { ...params };

  for (const key in decodedParams) {
    const value = decodedParams[key];
    if (typeof value === 'string') {
      if (value.startsWith('__SAFE_ENCODED__')) {
        // 解码安全编码的字符串
        const encodedValue = value.replace('__SAFE_ENCODED__', '');
        decodedParams[key] = safeDecode(encodedValue);
      } else if (value.startsWith('__SAFE_OBJECT__')) {
        // 解码安全编码的对象/数组
        try {
          const encodedValue = value.replace('__SAFE_OBJECT__', '');
          const jsonStr = safeDecode(encodedValue);
          decodedParams[key] = JSON.parse(jsonStr);
        } catch (e) {
          // 如果解析失败，保持原始值
          decodedParams[key] = value;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理嵌套对象
      decodedParams[key] = safeDecodeParams(value);
    }
  }

  return decodedParams;
}
