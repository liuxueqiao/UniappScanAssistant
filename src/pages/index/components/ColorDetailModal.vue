<template>
  <view v-if="visible" class="modal-overlay" @click="handleClose">
    <view class="modal-content" @click.stop>
      <view class="modal-header">
        <text class="modal-title">颜色详情</text>
      </view>
      <view class="modal-body">
        <view class="color-preview" :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }" />
        <view class="info-item">
          <text class="info-label">名称</text>
          <text class="info-value">{{ color.name }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">色温</text>
          <text class="info-value">{{ color.temperature || 'N/A' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">RGB值</text>
          <text class="info-value">({{ color.r }}, {{ color.g }}, {{ color.b }})</text>
        </view>
        <view class="info-item description">
          <text class="info-label">说明</text>
          <text class="info-value">{{ color.description }}</text>
        </view>
      </view>
      <view class="modal-footer">
        <button class="confirm-btn" @click="handleClose">我晓得了</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface ColorDetail {
  name: string;
  temperature?: string;
  r: number;
  g: number;
  b: number;
  description: string;
}

interface Props {
  visible: boolean;
  color: ColorDetail;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const handleClose = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 600rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-header {
  padding: 40rpx;
  border-bottom: 1rpx solid #e5e5e5;
  text-align: center;
}

.modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.modal-body {
  padding: 40rpx;
}

.color-preview {
  width: 100%;
  height: 200rpx;
  border-radius: 12rpx;
  margin-bottom: 40rpx;
  border: 2rpx solid #e5e5e5;
}

.info-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 30rpx;

  &.description {
    margin-bottom: 0;
  }
}

.info-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.info-value {
  font-size: 32rpx;
  color: #333;
  line-height: 1.6;
}

.modal-footer {
  padding: 40rpx;
  border-top: 1rpx solid #e5e5e5;
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #0056b3;
  }
}
</style>


