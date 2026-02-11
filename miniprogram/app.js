App({
  globalData: {
    token: "",
    apiBaseUrl: ""
  },

  onLaunch() {
    const token = wx.getStorageSync("token") || "";
    this.globalData.token = token;
  }
});

