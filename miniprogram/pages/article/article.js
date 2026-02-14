const { request } = require("../../utils/request");

Page({
  data: {
    id: "",
    article: null,
    loading: true,
  },

  onLoad(options) {
    const id = options?.id || "";
    this.setData({ id });
    this.loadArticle();
  },

  async loadArticle() {
    this.setData({ loading: true });
    try {
      const data = await request({
        path: `/api/articles/${this.data.id}`,
        method: "GET",
      });

      let article = data.article || null;
      if (article) {
        // Format date
        if (article.publishedAt) {
          const date = new Date(article.publishedAt);
          if (!isNaN(date.getTime())) {
            const y = date.getFullYear();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            article.publishedAt = `${y}-${m}-${d}`;
          }
        }
        
        // Mock views if missing
        if (!article.views) {
          article.views = Math.floor(Math.random() * 2000) + 50;
        }

        // Optimize rich text content for display
        if (article.content) {
          article.content = article.content
            .replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;border-radius:8px;margin:12px 0;"')
            .replace(/<p/gi, '<p style="margin-bottom: 20px;"');
        }
      }

      this.setData({ article });

      if (article?.title) {
        wx.setNavigationBarTitle({ title: article.title });
      }
    } catch (err) {
      console.error(err);
      wx.showToast({ title: err.message || "加载失败", icon: "none" });
      this.setData({ article: null });
    } finally {
      this.setData({ loading: false });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  onShareAppMessage() {
    if (this.data.article) {
      return {
        title: this.data.article.title,
        path: `/pages/article/article?id=${this.data.id}`,
        imageUrl: this.data.article.coverUrl || "",
      };
    }
  },

  onShareTimeline() {
    if (this.data.article) {
      return {
        title: this.data.article.title,
        query: `id=${this.data.id}`,
        imageUrl: this.data.article.coverUrl || ""
      };
    }
  }
});
