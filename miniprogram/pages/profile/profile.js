const { request } = require("../../utils/request");

Page({
  data: {
    initialWeightKg: "",
    targetWeightKg: "",
    heightCm: "",
    bmi: "",
    bmiStatus: "",
    saving: false,
    history: [],
  },

  onShow() {
    this.loadMe();
    this.loadHistory();
  },

  onPullDownRefresh() {
    Promise.all([this.loadMe(), this.loadHistory()]).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  async loadHistory() {
    try {
      const res = await request({
        path: "/api/weights/history?limit=7",
        method: "GET",
      });
      const list = res.items || [];
      this.setData({ history: list });
      if (list.length > 1) {
        // Chart needs oldest -> newest
        const chartData = [...list].reverse();
        this.drawChart(chartData);
      }
    } catch (e) {
      console.error("Load history failed", e);
    }
  },

  drawChart(data) {
    const query = wx.createSelectorQuery();
    query
      .select("#weightChart")
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0]) return;
        const canvas = res[0].node;
        const ctx = canvas.getContext("2d");
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = res[0].width * dpr;
        canvas.height = res[0].height * dpr;
        ctx.scale(dpr, dpr);

        const width = res[0].width;
        const height = res[0].height;
        const padding = 20;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Find Min/Max
        const weights = data.map((d) => d.weightKg);
        let min = Math.min(...weights);
        let max = Math.max(...weights);
        if (min === max) {
          min -= 1;
          max += 1;
        }
        const range = max - min;

        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = "#07c160";
        ctx.lineWidth = 2;
        
        data.forEach((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
          const y =
            height -
            padding -
            ((d.weightKg - min) / range) * (height - 2 * padding);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          
          // Draw Point
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          
          // Draw Text
          ctx.fillStyle = "#666";
          ctx.font = "10px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(d.weightKg, x, y - 8);
        });
        
        ctx.stroke();
      });
  },

  async loadMe() {
    try {
      const data = await request({ path: "/api/users/me", method: "GET" });
      const u = data.user || {};
      this.setData({
        initialWeightKg:
          u.initialWeightKg != null ? String(u.initialWeightKg) : "",
        targetWeightKg:
          u.targetWeightKg != null ? String(u.targetWeightKg) : "",
        heightCm: u.heightCm != null ? String(u.heightCm) : "",
      });
      this.calculateBMI();
    } catch (err) {
      wx.showToast({ title: err.message || "加载失败", icon: "none" });
    }
  },

  onInputInitial(e) {
    this.setData({ initialWeightKg: e.detail.value });
    this.calculateBMI();
  },

  onInputTarget(e) {
    this.setData({ targetWeightKg: e.detail.value });
  },

  onInputHeight(e) {
    this.setData({ heightCm: e.detail.value });
    this.calculateBMI();
  },

  calculateBMI() {
    const weight = parseFloat(this.data.initialWeightKg);
    const heightCm = parseFloat(this.data.heightCm);

    if (
      !weight ||
      !heightCm ||
      weight <= 0 ||
      heightCm <= 0 ||
      !Number.isFinite(weight) ||
      !Number.isFinite(heightCm)
    ) {
      this.setData({ bmi: "", bmiStatus: "" });
      return;
    }

    const heightM = heightCm / 100;
    const bmiVal = weight / (heightM * heightM);
    const bmi = bmiVal.toFixed(1);

    let status = "";
    if (bmiVal < 18.5) {
      status = "偏瘦";
    } else if (bmiVal < 24) {
      status = "正常";
    } else if (bmiVal < 28) {
      status = "偏胖";
    } else {
      status = "肥胖";
    }

    this.setData({ bmi, bmiStatus: status });
  },

  async save() {
    if (this.data.saving) return;

    const initialWeightKg =
      this.data.initialWeightKg === ""
        ? null
        : Number(this.data.initialWeightKg);
    const targetWeightKg =
      this.data.targetWeightKg === "" ? null : Number(this.data.targetWeightKg);
    const heightCm =
      this.data.heightCm === "" ? null : Number(this.data.heightCm);

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
        data: { initialWeightKg, targetWeightKg, heightCm },
      });
      wx.showToast({ title: "已保存", icon: "success" });
      wx.vibrateShort();
    } catch (err) {
      wx.showToast({ title: err.message || "保存失败", icon: "none" });
    } finally {
      this.setData({ saving: false });
    }
  },

  logout() {
    wx.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync("token");
          const app = getApp();
          if (app.globalData) {
            app.globalData.token = null;
          }
          wx.reLaunch({
            url: "/pages/index/index",
          });
        }
      },
    });
  },
});
