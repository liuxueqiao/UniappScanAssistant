const { API_BASE_URL } = require("./config");

function getToken() {
  const app = getApp();
  return app?.globalData?.token || wx.getStorageSync("token") || "";
}

function request({ path, method, data, query, headers }) {
  const token = getToken();
  const url = buildUrl(`${API_BASE_URL}${path}`, query);

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers || {}),
      },
      success(res) {
        if (res.statusCode === 401) {
          wx.removeStorageSync("token");
          wx.showToast({ title: "登录已过期", icon: "none" });
          setTimeout(() => {
            wx.reLaunch({ url: "/pages/login/login" });
          }, 1500);
          reject(new Error("Unauthorized"));
          return;
        }

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
          return;
        }
        const msg = res?.data?.error?.message || "请求失败";
        reject(new Error(msg));
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

function buildUrl(url, query) {
  if (!query) return url;
  const pairs = Object.keys(query)
    .filter(
      (k) => query[k] !== undefined && query[k] !== null && query[k] !== ""
    )
    .map(
      (k) => `${encodeURIComponent(k)}=${encodeURIComponent(String(query[k]))}`
    );
  if (!pairs.length) return url;
  return `${url}?${pairs.join("&")}`;
}

module.exports = { request };
