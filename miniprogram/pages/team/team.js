const { request } = require("../../utils/request");

Page({
  data: {
    team: null,
    createName: "",
    inviteCode: "",
    creating: false,
    joining: false,
  },

  onShow() {
    this.loadTeam();
  },

  onShareAppMessage() {
    const code = this.data.team?.inviteCode || "";
    return {
      title: "加入我的瘦身圈小队，一起打卡坚持",
      path: `/pages/team/team?inviteCode=${code}`,
    };
  },

  onLoad(options) {
    if (options?.inviteCode) {
      this.setData({ inviteCode: options.inviteCode });
    }
  },

  onInputCreateName(e) {
    this.setData({ createName: e.detail.value });
  },

  onInputInviteCode(e) {
    this.setData({ inviteCode: e.detail.value });
  },

  async loadTeam() {
    try {
      const data = await request({ path: "/api/teams/me", method: "GET" });
      const team = data.team || null;
      if (team?.members?.length) {
        team.members = team.members.map((m) => ({
          ...m,
          weekDeltaText: this.formatDelta(m.weekDeltaKg),
        }));
      }
      this.setData({ team });
    } catch (err) {
      this.setData({ team: null });
    }
  },

  formatDelta(deltaKg) {
    if (typeof deltaKg !== "number") return "--";
    const n = Number(deltaKg.toFixed(2));
    if (n > 0) return `已减 ${n}kg`;
    if (n < 0) return `反弹 ${Math.abs(n)}kg`;
    return "无变化";
  },

  async create() {
    if (this.data.creating) return;
    const name = String(this.data.createName || "").trim();
    if (!name) {
      wx.showToast({ title: "请输入小队名称", icon: "none" });
      return;
    }

    this.setData({ creating: true });
    try {
      await request({ path: "/api/teams", method: "POST", data: { name } });
      wx.showToast({ title: "创建成功", icon: "success" });
      this.setData({ createName: "" });
      this.loadTeam();
    } catch (err) {
      wx.showToast({ title: err.message || "创建失败", icon: "none" });
    } finally {
      this.setData({ creating: false });
    }
  },

  async join() {
    if (this.data.joining) return;
    const inviteCode = String(this.data.inviteCode || "").trim();
    if (!inviteCode) {
      wx.showToast({ title: "请输入邀请码", icon: "none" });
      return;
    }

    this.setData({ joining: true });
    try {
      await request({
        path: "/api/teams/join",
        method: "POST",
        data: { inviteCode },
      });
      wx.showToast({ title: "加入成功", icon: "success" });
      this.setData({ inviteCode: "" });
      this.loadTeam();
    } catch (err) {
      wx.showToast({ title: err.message || "加入失败", icon: "none" });
    } finally {
      this.setData({ joining: false });
    }
  },

  async leave() {
    try {
      await request({ path: "/api/teams/leave", method: "POST" });
      wx.showToast({ title: "已退出", icon: "success" });
      this.loadTeam();
    } catch (err) {
      wx.showToast({ title: err.message || "操作失败", icon: "none" });
    }
  },
});
