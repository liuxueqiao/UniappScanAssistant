const { request } = require("../../utils/request");

Page({
  data: {
    challenge: null,
    joining: false,
    rankItems: [],
    endDateKey: ""
  },

  onShow() {
    this.loadCurrent();
    this.loadRank();
  },

  async loadCurrent() {
    try {
      const data = await request({ path: "/api/challenges/current", method: "GET" });
      const challenge = data.challenge || null;
      const endDateKey = challenge?.endAt ? String(challenge.endAt).slice(0, 10) : "";
      this.setData({ challenge, endDateKey });
    } catch (err) {
      this.setData({ challenge: null, endDateKey: "" });
    }
  },

  async join() {
    if (this.data.joining) return;
    if (this.data.challenge?.joined) return;

    this.setData({ joining: true });
    try {
      await request({ path: "/api/challenges/join", method: "POST" });
      wx.showToast({ title: "报名成功", icon: "success" });
      this.loadCurrent();
      this.loadRank();
    } catch (err) {
      wx.showToast({ title: err.message || "报名失败", icon: "none" });
    } finally {
      this.setData({ joining: false });
    }
  },

  async loadRank() {
    try {
      const data = await request({ path: "/api/challenges/team-rank", method: "GET" });
      const items = (data.items || []).map((x) => ({
        ...x,
        deltaText: this.formatDelta(x.deltaKg),
        lossRateText: this.formatRate(x.lossRate)
      }));
      this.setData({ rankItems: items });
    } catch (err) {
      this.setData({ rankItems: [] });
    }
  },

  formatDelta(deltaKg) {
    if (typeof deltaKg !== "number") return "--";
    const n = Number(deltaKg.toFixed(2));
    if (n > 0) return `已减 ${n}kg`;
    if (n < 0) return `反弹 ${Math.abs(n)}kg`;
    return "无变化";
  },

  formatRate(rate) {
    if (typeof rate !== "number") return "--";
    return `${(rate * 100).toFixed(2)}%`;
  }
});

