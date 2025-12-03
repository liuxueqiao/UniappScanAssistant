<template>
  <view class="container" :style="containerStyle">
    <view
      class="settings-btn"
      :style="{ top: `${buttonTop}rpx` }"
      @click="openSettings"
    >
      <text class="settings-icon">⚙️</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const currentColor = ref({ r: 255, g: 255, b: 255 }); // 默认白色
const statusBarHeight = ref(0); // 状态栏高度
const dynamicTimer = ref<number | null>(null);
const dynamicColors = ref<Array<{ r: number; g: number; b: number }>>([]);
const currentDynamicIndex = ref(0);
const dynamicFrequency = ref(2);

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

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;

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
</style>
