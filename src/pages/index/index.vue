<template>
  <view class="container" :style="containerStyle">
    <view
      class="settings-btn"
      :style="{ top: `${buttonTop}rpx` }"
      @click="openSettings"
    >
      <text class="settings-icon">⚙️</text>
    </view>

    <!-- 隐私协议弹窗组件 -->
    <PrivacyModal
      :visible="showPrivacyModal"
      @agree="handleAgree"
      @disagree="handleDisagree"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PrivacyModal from '@/components/PrivacyModal.vue';

const currentColor = ref({ r: 255, g: 255, b: 255 }); // 默认白色
const statusBarHeight = ref(0); // 状态栏高度
const dynamicTimer = ref<number | null>(null);
const dynamicColors = ref<Array<{ r: number; g: number; b: number }>>([]);
const currentDynamicIndex = ref(0);
const dynamicFrequency = ref(2);
const showPrivacyModal = ref(false); // 是否显示隐私协议弹窗

const stopDynamicLight = () => {
  if (dynamicTimer.value !== null) {
    clearInterval(dynamicTimer.value);
    dynamicTimer.value = null;
  }
  dynamicColors.value = [];
  currentDynamicIndex.value = 0;
};

const startDynamicLight = (
  colors: Array<{ r: number; g: number; b: number }>,
  frequency: number
) => {
  stopDynamicLight();
  if (colors.length === 0) return;

  dynamicColors.value = colors;
  dynamicFrequency.value = frequency;
  currentDynamicIndex.value = 0;
  currentColor.value = colors[0];

  dynamicTimer.value = setInterval(() => {
    currentDynamicIndex.value = (currentDynamicIndex.value + 1) % colors.length;
    currentColor.value = colors[currentDynamicIndex.value];
  }, frequency * 1000) as any;
};

// 检查隐私协议同意状态
const checkPrivacyAgreement = () => {
  const hasAgreed = uni.getStorageSync('privacyAgreed');
  if (!hasAgreed) {
    showPrivacyModal.value = true;
  }
};

// 处理不同意
const handleDisagree = () => {
  uni.showToast({
    title: '不同意请手动退出APP',
    icon: 'none',
    duration: 3000
  });
};

// 处理同意
const handleAgree = () => {
  // 缓存已同意状态到本地存储
  uni.setStorageSync('privacyAgreed', true);
  // 关闭弹窗
  showPrivacyModal.value = false;
};

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  
  // 检查隐私协议
  checkPrivacyAgreement();

  // 监听设置页面返回的颜色
  uni.$on('colorChanged', (color: { r: number; g: number; b: number }) => {
    stopDynamicLight();
    currentColor.value = color;
    // 同时保存到本地存储
    uni.setStorageSync('currentColor', color);
  });

  // 监听百变光源启动
  uni.$on(
    'startDynamicLight',
    (data: {
      colors: Array<{ r: number; g: number; b: number }>;
      frequency: number;
    }) => {
      startDynamicLight(data.colors, data.frequency);
    }
  );

  // 监听百变光源停止
  uni.$on('stopDynamicLight', () => {
    stopDynamicLight();
  });

  // 从存储中恢复颜色
  const savedColor = uni.getStorageSync('currentColor');
  if (savedColor) {
    currentColor.value = savedColor;
  }

  // 检查是否有百变光源设置
  const dynamicMode = uni.getStorageSync('dynamicMode');
  if (dynamicMode) {
    const dynamicSettings = uni.getStorageSync('dynamicSettings');
    if (
      dynamicSettings &&
      dynamicSettings.enabled &&
      dynamicSettings.colors.length > 0
    ) {
      startDynamicLight(dynamicSettings.colors, dynamicSettings.frequency);
    }
  }
});

onShow(() => {
  // 检查隐私协议（每次页面显示时都检查，如果没同意就弹窗）
  checkPrivacyAgreement();

  // 页面显示时，从存储中恢复颜色（防止从后台恢复时丢失）
  const savedColor = uni.getStorageSync('currentColor');
  if (savedColor) {
    currentColor.value = savedColor;
  }

  // 检查百变光源状态
  const dynamicMode = uni.getStorageSync('dynamicMode');
  if (dynamicMode) {
    const dynamicSettings = uni.getStorageSync('dynamicSettings');
    if (
      dynamicSettings &&
      dynamicSettings.enabled &&
      dynamicSettings.colors.length > 0
    ) {
      startDynamicLight(dynamicSettings.colors, dynamicSettings.frequency);
    }
  }
});

onUnmounted(() => {
  stopDynamicLight();
  uni.$off('colorChanged');
  uni.$off('startDynamicLight');
  uni.$off('stopDynamicLight');
});

// 计算容器的样式
const containerStyle = computed(() => {
  const { r, g, b } = currentColor.value;
  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`
  };
});

// 计算按钮的top值，考虑状态栏高度
const buttonTop = computed(() => {
  return statusBarHeight.value * 2 + 40; // statusBarHeight是px，需要转换为rpx（乘以2）
});

const openSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/index'
  });
};
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: background-color 0.3s ease;
}

.settings-btn {
  position: absolute;
  top: var(--button-top, 120rpx);
  right: 40rpx;
  width: 96rpx;
  height: 96rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  border: 2rpx solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.35);
  z-index: 100;
  cursor: pointer;
  backdrop-filter: blur(8rpx);
  -webkit-backdrop-filter: blur(8rpx);
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.55);
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.45);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.65);
    transform: scale(0.94);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);
  }
}

.settings-icon {
  font-size: 54rpx;
  color: #ffffff;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
}

/* 隐私协议弹窗样式 */
.privacy-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
}

.privacy-modal {
  width: 80vw;
  max-width: 80vw;
  max-height: 68vh;
  background-color: #ffffff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.privacy-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.privacy-modal-body {
  padding: 40rpx;
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
}

.privacy-modal-footer {
  padding: 30rpx 40rpx;
  border-top: 1rpx solid #e5e5e5;
  display: flex;
  gap: 20rpx;
  flex-shrink: 0;
}

.privacy-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.privacy-btn-disagree {
  background-color: #f5f5f5;
  border: 1rpx solid #e5e5e5;
  
  &:active {
    background-color: #e5e5e5;
    transform: scale(0.98);
  }
}

.privacy-btn-agree {
  background-color: #007aff;
  border: 1rpx solid #007aff;
  
  &:active {
    background-color: #0056cc;
    transform: scale(0.98);
  }
}

.privacy-btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.privacy-btn-disagree .privacy-btn-text {
  color: #333;
}

.privacy-btn-agree .privacy-btn-text {
  color: #ffffff;
}

/* 隐私政策内容样式 */
.privacy-title {
  font-size: 48rpx;
  color: #007aff;
  margin-bottom: 30rpx;
  text-align: center;
  border-bottom: 4rpx solid #007aff;
  padding-bottom: 20rpx;
  font-weight: 600;
}

.update-date {
  text-align: right;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 30rpx;
}

.privacy-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  color: #333;
  margin-top: 40rpx;
  margin-bottom: 20rpx;
  padding-left: 16rpx;
  border-left: 6rpx solid #007aff;
  font-weight: 600;
}

.subsection {
  margin-top: 30rpx;
}

.subsection-title {
  font-size: 32rpx;
  color: #555;
  margin-top: 30rpx;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.privacy-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 20rpx;
  text-align: justify;
}

.highlight-box {
  background-color: #fff3cd;
  padding: 24rpx;
  border-left: 6rpx solid #ffc107;
  margin: 30rpx 0;
  border-radius: 8rpx;
}

.highlight-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
}

.highlight-label {
  font-weight: 600;
  color: #333;
}

.privacy-list {
  margin-left: 40rpx;
  margin-bottom: 20rpx;
}

.list-item {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
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
  padding: 30rpx;
  border-radius: 12rpx;
  margin-top: 40rpx;
}

.contact-item-text {
  margin: 12rpx 0;
  display: flex;
  flex-wrap: wrap;
}

.contact-label {
  font-weight: 600;
  color: #333;
  margin-right: 12rpx;
}

.contact-value {
  color: #333;
}

.privacy-footer {
  margin-top: 60rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid #e5e5e5;
  text-align: center;
}

.footer-text {
  color: #999;
  font-size: 24rpx;
}
</style>
