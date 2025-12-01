import { parseUrl } from '@/utils/shared';

export function useInit() {
  onShow(() => {});
  onHide(() => {});
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  // @ts-expect-error
  const { fullPath } = page.$page;
  const {
    name: pageName,
    path: pagePath,
    query: pageQuery
  } = parseUrl(fullPath);

  return {
    pageName,
    pagePath,
    pageQuery
  };
}
