let loadingCount = 0;

export function showLoading(isLoading: boolean, loadingMask = false) {
  if (isLoading && loadingCount === 0) {
    uni.showLoading({ mask: loadingMask });
    loadingCount = loadingCount + 1;
  }
}

export function hideLoading() {
  if (loadingCount === 1) {
    uni.hideLoading();
    loadingCount = loadingCount - 1;
  }
}
