const { request } = require("../../utils/request");

Page({
  data: {
    initialWeightKg: "",
    targetWeightKg: "",
    heightCm: "",
    saving: false
  },

  onShow() {
    this.loadMe();
  },

  async loadMe() {
    try {
      const data = await request({ path: "/api/users/me", method: "GET" });
      const u = data.user || {};
      this.setData({
        initialWeightKg: u.initialWeightKg != null ? String(u.initialWeightKg) : "",
        targetWeightKg: u.targetWeightKg != null ? String(u.targetWeightKg) : "",
        heightCm: u.heightCm != null ? String(u.heightCm) : ""
      });
    } catch (err) {
      wx.showToast({ title: err.message || "加载失败", icon: "none" });
    }
  },

  onInputInitial(e) {
    this.setData({ initialWeightKg: e.detail.value });
  },

  onInputTarget(e) {
    this.setData({ targetWeightKg: e.detail.value });
  },

  onInputHeight(e) {
    this.setData({ heightCm: e.detail.value });
  },

  async save() {
    if (this.data.saving) return;

    const initialWeightKg = this.data.initialWeightKg === "" ? null : Number(this.data.initialWeightKg);
    const targetWeightKg = this.data.targetWeightKg === "" ? null : Number(this.data.targetWeightKg);
    const heightCm = this.data.heightCm === "" ? null : Number(this.data.heightCm);

    if (initialWeightKg != null && !Number.isFinite(initialWeightKg)) {
      wx.showToast({ title: "初始体重格式错误", icon: "none" });
      return;
    }
    if (targetWeightKg != null && !Number.isFinite(targetWeightKg)) {
      wx.showToast({ title: "目标体重格式错误", icon: "none" });
      return;
    }
    if (heightCm != null && !Number.isFinite(heightCm)) {
      wx.showToast({ title: "身高格式错误", icon: "none" });
      return;
    }

    this.setData({ saving: true });
    try {
      await request({
        path: "/api/users/me",
        method: "PATCH",
        data: { initialWeightKg, targetWeightKg, heightCm }
      });
      wx.showToast({ title: "已保存", icon: "success" });
    } catch (err) {
      wx.showToast({ title: err.message || "保存失败", icon: "none" });
    } finally {
      this.setData({ saving: false });
    }
  }
});

