const { request } = require("../../utils/request");

Page({
  data: {
    id: "",
    article: null
  },

  onLoad(options) {
    const id = options?.id || "";
    this.setData({ id });
    this.loadArticle();
  },

  async loadArticle() {
    try {
      const data = await request({ path: `/api/articles/${this.data.id}`, method: "GET" });
      this.setData({ article: data.article || null });
      if (data?.article?.title) {
        wx.setNavigationBarTitle({ title: data.article.title });
      }
    } catch (err) {
      wx.showToast({ title: err.message || "加载失败", icon: "none" });
      this.setData({ article: null });
    }
  }
});

