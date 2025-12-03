<template>
  <view class="contact-page">
    <view class="contact-header">
      <text class="contact-title">联系我们</text>
    </view>

    <view class="contact-content">
      <view class="contact-item" @click="openPrivacyPolicy">
        <view class="item-left">
          <text class="item-label">隐私政策</text>
        </view>
        <view class="item-right">
          <text class="arrow-icon">›</text>
        </view>
      </view>

      <view class="contact-item" @longpress="copyEmail">
        <view class="item-left">
          <text class="item-label">作者邮箱</text>
        </view>
        <view class="item-right">
          <text class="item-value">2207766467@qq.com</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const openPrivacyPolicy = () => {
  // 使用本地文件路径
  const url = '/static/privacy-policy.html';
  
  uni.navigateTo({
    url: `/pages/webview/index?url=${encodeURIComponent(url)}`
  });
};

const copyEmail = () => {
  const email = '2207766467@qq.com';
  uni.setClipboardData({
    data: email,
    success: () => {
      uni.showToast({
        title: '已复制到粘贴板',
        icon: 'success',
        duration: 2000
      });
    },
    fail: () => {
      uni.showToast({
        title: '复制失败',
        icon: 'none',
        duration: 2000
      });
    }
  });
};
</script>

<style scoped lang="scss">
.contact-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

.contact-header {
  background-color: #ffffff;
  padding: 40rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.contact-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.contact-content {
  margin-top: 20rpx;
  background-color: #ffffff;
}

.contact-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40rpx;
  border-bottom: 1rpx solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #f8f8f8;
  }

  &:last-child {
    border-bottom: none;
  }
}

.item-left {
  flex: 1;
}

.item-label {
  font-size: 32rpx;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.item-value {
  font-size: 28rpx;
  color: #666;
}

.arrow-icon {
  font-size: 40rpx;
  color: #999;
  font-weight: 300;
}
</style>

