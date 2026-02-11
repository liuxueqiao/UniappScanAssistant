const { request } = require("../../utils/request");

Page({
  data: {
    loading: false,
    devLoading: false,
    isDevtools: false,
    adminKey: ""
  },

  onLoad() {
    const platform = wx.getSystemInfoSync()?.platform || "";
    const isDevtools = platform === "devtools";
    const adminKey = wx.getStorageSync("dev_admin_key") || "";
    this.setData({ isDevtools, adminKey });
  },

  async doLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const profile = await this.getUserProfile();
      const code = await this.wxLoginCode();

      const resp = await request({
        path: "/api/auth/wx-login",
        method: "POST",
        data: {
          code,
          nickname: profile?.userInfo?.nickName || "",
          avatarUrl: profile?.userInfo?.avatarUrl || ""
        }
      });

      const token = resp.token;
      wx.setStorageSync("token", token);
      const app = getApp();
      app.globalData.token = token;

      wx.showToast({ title: "登录成功", icon: "success" });
      wx.navigateBack();
    } catch (err) {
      wx.showToast({ title: err.message || "登录失败", icon: "none" });
    } finally {
      this.setData({ loading: false });
    }
  },

  onInputAdminKey(e) {
    this.setData({ adminKey: e.detail.value });
    wx.setStorageSync("dev_admin_key", e.detail.value);
  },

  async doDevLogin() {
    if (this.data.devLoading) return;
    const adminKey = String(this.data.adminKey || "").trim();
    if (!adminKey) {
      wx.showToast({ title: "请输入 Admin Key", icon: "none" });
      return;
    }

    this.setData({ devLoading: true });
    try {
      const resp = await request({
        path: "/api/auth/dev-login",
        method: "POST",
        data: { nickname: "开发用户" },
        headers: { "x-admin-key": adminKey }
      });

      const token = resp.token;
      wx.setStorageSync("token", token);
      const app = getApp();
      app.globalData.token = token;

      wx.showToast({ title: "登录成功", icon: "success" });
      wx.navigateBack();
    } catch (err) {
      wx.showToast({ title: err.message || "登录失败", icon: "none" });
    } finally {
      this.setData({ devLoading: false });
    }
  },

  getUserProfile() {
    return new Promise((resolve, reject) => {
      wx.getUserProfile({
        desc: "用于展示昵称与头像",
        success: resolve,
        fail: reject
      });
    });
  },

  wxLoginCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 8000,
        success(res) {
          if (res.code) resolve(res.code);
          else reject(new Error("wx.login failed"));
        },
        fail: reject
      });
    });
  }
});
