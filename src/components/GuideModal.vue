<template>
  <view v-if="visible" class="guide-overlay" @click.stop>
    <!-- 高亮设置按钮区域 -->
    <view class="guide-highlight" :style="highlightStyle"></view>
    <!-- 提示文本（居中显示） -->
    <view class="guide-tip" @click.stop>
      <text class="guide-text">点击右上角的设置，选择一个自己喜欢的颜色吧~</text>
      <view class="guide-btn" @click="handleConfirm">
        <text class="guide-btn-text">我知道了</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  visible: boolean;
  buttonTop: number; // 设置按钮距离顶部的位置（rpx）
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();

// 计算高亮区域样式（围绕设置按钮）
const highlightStyle = computed(() => {
  const top = props.buttonTop;
  const right = 40;
  const width = 96;
  const height = 96;
  const padding = 20; // 高亮区域比按钮大一些
  
  return {
    top: `${top - padding}rpx`,
    right: `${right - padding}rpx`,
    width: `${width + padding * 2}rpx`,
    height: `${height + padding * 2}rpx`,
    borderRadius: '50%'
  };
});

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style scoped lang="scss">
/* 新手引导遮罩样式 */
.guide-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.guide-highlight {
  position: absolute;
  background-color: transparent;
  border: 4rpx solid #ffffff;
  box-shadow: 0 0 0 9999rpx rgba(0, 0, 0, 0.6);
  z-index: 1000;
  pointer-events: none;
}

.guide-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  z-index: 1001;
  max-width: 600rpx;
  text-align: center;
  pointer-events: auto;
}

.guide-text {
  font-size: 32rpx;
  color: #333;
  line-height: 1.6;
  display: block;
  margin-bottom: 30rpx;
}

.guide-btn {
  width: 100%;
  height: 80rpx;
  background-color: #007aff;
  border-radius: 12rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #0056b3;
    transform: scale(0.98);
  }
}

.guide-btn-text {
  font-size: 30rpx;
  color: #ffffff;
  font-weight: 500;
}
</style>


