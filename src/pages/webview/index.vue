<template>
  <view class="webview-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="navbar-content">
        <view class="navbar-left">
          <view class="back-btn" @click="goBack">
            <text class="back-icon">‹</text>
          </view>
          <text class="navbar-title">隐私政策</text>
        </view>
      </view>
    </view>
    <scroll-view class="content-scroll" scroll-y>
      <view class="privacy-content">
        <view class="privacy-container">
          <view class="privacy-title">隐私政策</view>
          <view class="update-date">最后更新日期：2024年12月</view>
          
          <view class="privacy-section">
            <text class="privacy-text">欢迎使用"LumaKit"（以下简称"本应用"）。我们非常重视您的隐私保护，本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。</text>
          </view>
          
          <view class="highlight-box">
            <text class="highlight-text"><text class="highlight-label">重要提示：</text>在使用本应用前，请您仔细阅读本隐私政策。如果您不同意本政策的内容，请停止使用本应用。继续使用本应用即表示您同意本隐私政策的全部内容。</text>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">一、信息收集</view>
            <view class="subsection">
              <view class="subsection-title">1.1 我们收集的信息类型</view>
              <text class="privacy-text">本应用是一款本地运行的补光工具，我们仅收集以下必要信息：</text>
              <view class="privacy-list">
                <view class="list-item">
                  <text class="list-label">设备信息：</text>
                  <text class="list-text">为了适配不同设备的屏幕显示，我们可能会获取设备的基本信息（如屏幕尺寸、系统版本等），这些信息仅用于优化应用显示效果。</text>
                </view>
                <view class="list-item">
                  <text class="list-label">使用偏好：</text>
                  <text class="list-text">我们会在您的设备本地存储您的颜色选择、常用颜色、收藏颜色等使用偏好设置，这些数据仅存储在您的设备本地，不会上传到服务器。</text>
                </view>
              </view>
            </view>
            <view class="subsection">
              <view class="subsection-title">1.2 我们不收集的信息</view>
              <text class="privacy-text">本应用不会收集以下信息：</text>
              <view class="privacy-list">
                <view class="list-item">个人身份信息（姓名、身份证号、手机号等）</view>
                <view class="list-item">位置信息</view>
                <view class="list-item">通讯录、短信、通话记录</view>
                <view class="list-item">照片、视频等媒体文件</view>
                <view class="list-item">其他应用的使用数据</view>
              </view>
            </view>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">二、信息使用</view>
            <view class="subsection">
              <view class="subsection-title">2.1 使用目的</view>
              <text class="privacy-text">我们使用收集的信息仅用于以下目的：</text>
              <view class="privacy-list">
                <view class="list-item">提供和优化应用功能</view>
                <view class="list-item">改善用户体验</view>
                <view class="list-item">适配不同设备的显示效果</view>
                <view class="list-item">保存您的个人设置和偏好</view>
              </view>
            </view>
            <view class="subsection">
              <view class="subsection-title">2.2 数据存储</view>
              <text class="privacy-text">所有数据均存储在您的设备本地，我们不会将您的任何数据上传到服务器或第三方平台。</text>
            </view>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">三、信息共享与披露</view>
            <text class="privacy-text">我们承诺：</text>
            <view class="privacy-list">
              <view class="list-item">不会向任何第三方出售、交易或转让您的个人信息</view>
              <view class="list-item">不会在未经您同意的情况下共享您的个人信息</view>
              <view class="list-item">不会将您的数据用于任何商业目的</view>
            </view>
            <text class="privacy-text">仅在以下情况下，我们可能会披露您的信息：</text>
            <view class="privacy-list">
              <view class="list-item">法律法规要求</view>
              <view class="list-item">司法机关或行政机关依法要求</view>
              <view class="list-item">为保护我们的合法权益</view>
            </view>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">四、数据安全</view>
            <text class="privacy-text">我们采用以下措施保护您的数据安全：</text>
            <view class="privacy-list">
              <view class="list-item">所有数据仅存储在您的设备本地</view>
              <view class="list-item">使用系统提供的安全存储机制</view>
              <view class="list-item">不进行网络传输，避免数据泄露风险</view>
            </view>
            <text class="privacy-text">请注意，虽然我们采取了合理的安全措施，但没有任何系统是绝对安全的。请您妥善保管您的设备，避免设备丢失或被盗。</text>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">五、您的权利</view>
            <text class="privacy-text">您对自己的数据享有以下权利：</text>
            <view class="privacy-list">
              <view class="list-item">
                <text class="list-label">访问权：</text>
                <text class="list-text">您可以随时查看应用存储的本地数据</text>
              </view>
              <view class="list-item">
                <text class="list-label">删除权：</text>
                <text class="list-text">您可以随时清除应用数据或卸载应用来删除所有本地数据</text>
              </view>
              <view class="list-item">
                <text class="list-label">控制权：</text>
                <text class="list-text">您可以随时修改应用设置和偏好</text>
              </view>
            </view>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">六、未成年人保护</view>
            <text class="privacy-text">本应用不面向未满18周岁的未成年人。如果您是未成年人，请在监护人的陪同下阅读本隐私政策，并在获得监护人同意后使用本应用。</text>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">七、隐私政策更新</view>
            <text class="privacy-text">我们可能会不定期更新本隐私政策。更新后的隐私政策将在本页面发布，并在显著位置标注更新日期。我们建议您定期查看本隐私政策，以了解最新的隐私保护措施。</text>
            <text class="privacy-text">如果您继续使用本应用，即表示您同意更新后的隐私政策。</text>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">八、联系我们</view>
            <view class="contact-info-box">
              <text class="privacy-text">如果您对本隐私政策有任何疑问、意见或建议，或需要行使您的相关权利，请通过以下方式联系我们：</text>
              <view class="contact-item-text">
                <text class="contact-label">应用名称：</text>
                <text class="contact-value">LumaKit</text>
              </view>
              <view class="contact-item-text">
                <text class="contact-label">联系方式：</text>
                <text class="contact-value">2207766467@qq.com</text>
              </view>
              <text class="privacy-text">我们会在收到您的反馈后尽快回复。</text>
            </view>
          </view>
          
          <view class="privacy-section">
            <view class="section-title">九、适用法律</view>
            <text class="privacy-text">本隐私政策的解释、执行和争议解决均适用中华人民共和国法律法规。</text>
          </view>
          
          <view class="privacy-footer">
            <text class="footer-text">本隐私政策自发布之日起生效</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const statusBarHeight = ref(0);

onLoad(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
});

const goBack = () => {
  uni.navigateBack();
};
</script>

<style scoped lang="scss">
.webview-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.custom-navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40rpx;
  position: relative;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  font-weight: 300;
  line-height: 1;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.content-scroll {
  flex: 1;
  width: 100%;
  display: flex;
  overflow-y: auto;
}

.privacy-content {
  padding: 0;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  background-color: #f5f5f5;
  min-height: 100%;
}

.privacy-container {
  max-width: 800rpx;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 0 40rpx;
  padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  border-radius: 0;
  box-shadow: none;
}

.privacy-title {
  font-size: 64rpx;
  color: #007aff;
  margin-bottom: 60rpx;
  text-align: center;
  border-bottom: 6rpx solid #007aff;
  padding-bottom: 30rpx;
  font-weight: 600;
}

.update-date {
  text-align: right;
  color: #999;
  font-size: 28rpx;
  margin-bottom: 60rpx;
}

.privacy-section {
  margin-bottom: 60rpx;
}

.section-title {
  font-size: 48rpx;
  color: #333;
  margin-top: 60rpx;
  margin-bottom: 30rpx;
  padding-left: 20rpx;
  border-left: 8rpx solid #007aff;
  font-weight: 600;
}

.subsection {
  margin-top: 40rpx;
}

.subsection-title {
  font-size: 40rpx;
  color: #555;
  margin-top: 40rpx;
  margin-bottom: 20rpx;
  font-weight: 500;
}

.privacy-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 30rpx;
  text-align: justify;
}

.highlight-box {
  background-color: #fff3cd;
  padding: 30rpx;
  border-left: 8rpx solid #ffc107;
  margin: 40rpx 0;
  border-radius: 8rpx;
}

.highlight-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.8;
}

.highlight-label {
  font-weight: 600;
  color: #333;
}

.privacy-list {
  margin-left: 60rpx;
  margin-bottom: 30rpx;
}

.list-item {
  font-size: 32rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.list-label {
  font-weight: 600;
  color: #333;
}

.list-text {
  color: #333;
}

.contact-info-box {
  background-color: #f8f9fa;
  padding: 40rpx;
  border-radius: 16rpx;
  margin-top: 60rpx;
}

.contact-item-text {
  margin: 16rpx 0;
  display: flex;
  flex-wrap: wrap;
}

.contact-label {
  font-weight: 600;
  color: #333;
  margin-right: 16rpx;
}

.contact-value {
  color: #333;
}

.privacy-footer {
  margin-top: 80rpx;
  padding-top: 40rpx;
  border-top: 2rpx solid #e5e5e5;
  text-align: center;
}

.footer-text {
  color: #999;
  font-size: 28rpx;
}
</style>

