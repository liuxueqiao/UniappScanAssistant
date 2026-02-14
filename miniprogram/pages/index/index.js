const { request } = require("../../utils/request");

Page({
  data: {
    articles: [],
    hasToken: false,
    user: {
      nickname: "",
      avatarUrl: "",
      streakDays: 0,
      weightChange: 0,
    },
  },

  onShow() {
    const token = wx.getStorageSync("token") || "";
    this.setData({ hasToken: !!token });
    if (token) {
      this.loadData();
    } else {
        // Reset user data when logged out
        this.setData({
            user: {
                nickname: "",
                avatarUrl: "",
                streakDays: 0,
                weightChange: 0,
            }
        });
    }
    this.loadArticles();
  },

  async loadData() {
    try {
      // Parallel fetch for user profile and weight history
      const [userRes, historyRes] = await Promise.all([
        request({ path: "/api/users/me", method: "GET" }).catch(() => ({
          user: {},
        })),
        request({
          path: "/api/weights/history",
          method: "GET",
          query: { limit: 1 },
        }).catch(() => ({ items: [] })),
      ]);

      const user = userRes.user || {};
      const latestWeight =
        historyRes.items && historyRes.items.length > 0
          ? historyRes.items[0].weightKg
          : null;

      let weightChange = 0;
      if (user.initialWeightKg && latestWeight) {
        weightChange = (latestWeight - user.initialWeightKg).toFixed(1);
      }

      this.setData({
        user: {
          nickname: user.nickname,
          avatarUrl: user.avatarUrl || "",
          streakDays: user.streakDays || 0,
          weightChange: weightChange,
        },
      });
    } catch (err) {
      console.error("Load data failed", err);
    }
  },

  async loadArticles() {
    try {
      const data = await request({
        path: "/api/articles/latest",
        method: "GET",
        query: { limit: 3 },
      });
      this.setData({ articles: data.items || [] });
    } catch (err) {
      this.setData({ articles: [] });
    }
  },

  openArticle(e) {
      const id = e.currentTarget.dataset.id;
      if (id) {
          wx.navigateTo({ url: `/pages/article/article?id=${id}` });
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
    wx.switchTab({ url: "/pages/profile/profile" }).catch(() => {
        // If switchTab fails (maybe not a tab bar page), try navigateTo
        wx.navigateTo({ url: "/pages/profile/profile" });
    });
  }
});
