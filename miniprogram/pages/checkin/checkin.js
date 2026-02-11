const { request } = require("../../utils/request");

Page({
  data: {
    weightKg: "",
    submitting: false,
    history: [],
    streakDays: 0
  },

  onShow() {
    this.loadMe();
    this.loadHistory();
  },

  onInputWeight(e) {
    this.setData({ weightKg: e.detail.value });
  },

  async loadMe() {
    try {
      const data = await request({ path: "/api/users/me", method: "GET" });
      this.setData({ streakDays: data.user?.streakDays || 0 });
    } catch (err) {
      this.setData({ streakDays: 0 });
    }
  },

  async loadHistory() {
    try {
      const data = await request({ path: "/api/weights/history", method: "GET", query: { limit: 30 } });
      this.setData({ history: data.items || [] });
    } catch (err) {
      this.setData({ history: [] });
    }
  },

  async submit() {
    if (this.data.submitting) return;

    const weightKg = Number(this.data.weightKg);
    if (!Number.isFinite(weightKg)) {
      wx.showToast({ title: "请输入体重", icon: "none" });
      return;
    }

    this.setData({ submitting: true });
    try {
      const resp = await request({
        path: "/api/weights/check-in",
        method: "POST",
        data: { weightKg }
      });
      this.setData({ streakDays: resp.streakDays || 0, weightKg: "" });
      wx.showToast({ title: "打卡成功", icon: "success" });
      this.loadHistory();
    } catch (err) {
      wx.showToast({ title: err.message || "打卡失败", icon: "none" });
    } finally {
      this.setData({ submitting: false });
    }
  }
});

