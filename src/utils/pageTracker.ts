// utils/pageTracker.ts
let lastPagePath: string | null = null;

// 记录当前页面路径
export const setLastPagePath = (path: string) => {
  lastPagePath = path;
};

// 获取上一个页面路径
export const getLastPagePath = (): string | null => {
  return lastPagePath;
};
