const { request } = require("../../utils/request");

Page({
  data: {
    articles: [],
    hasToken: false
  },

  onShow() {
    const token = wx.getStorageSync("token") || "";
    this.setData({ hasToken: !!token });
    this.loadArticles();
  },

  async loadArticles() {
    try {
      const data = await request({ path: "/api/articles/latest", method: "GET", query: { limit: 3 } });
      this.setData({ articles: data.items || [] });
    } catch (err) {
      this.setData({ articles: [] });
    }
  },

  ensureLogin() {
    const token = wx.getStorageSync("token") || "";
    if (!token) {
      wx.navigateTo({ url: "/pages/login/login" });
      return false;
    }
    return true;
  },

  goLogin() {
    wx.navigateTo({ url: "/pages/login/login" });
  },

  goCheckin() {
    if (!this.ensureLogin()) return;
    wx.navigateTo({ url: "/pages/checkin/checkin" });
  },

  goTeam() {
    if (!this.ensureLogin()) return;
    wx.navigateTo({ url: "/pages/team/team" });
  },

  goChallenge() {
    if (!this.ensureLogin()) return;
    wx.navigateTo({ url: "/pages/challenge/challenge" });
  },

  goProfile() {
    if (!this.ensureLogin()) return;
    wx.navigateTo({ url: "/pages/profile/profile" });
  },

  openArticle(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/article/article?id=${id}` });
  }
});

