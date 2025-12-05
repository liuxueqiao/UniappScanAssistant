<template>
  <view v-if="visible" class="save-modal-overlay" @click.stop="handleCancel">
    <view class="save-modal" @click.stop>
      <view class="save-modal-header">
        <text class="save-modal-title">保存自定义颜色</text>
      </view>
      <view class="save-modal-body">
        <view
          class="save-color-preview"
          :style="{
            backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`
          }"
        />
        <view class="save-input-wrapper">
          <text class="save-input-label">颜色名称</text>
          <input
            class="save-input"
            v-model="colorName"
            type="text"
            placeholder="请输入颜色名称"
            maxlength="20"
          />
        </view>
      </view>
      <view class="save-modal-footer">
        <view class="save-btn cancel-btn" @click="handleCancel">
          <text class="save-btn-text">取消</text>
        </view>
        <view class="save-btn confirm-btn" @click="handleConfirm">
          <text class="save-btn-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Color {
  r: number;
  g: number;
  b: number;
}

interface Props {
  visible: boolean;
  color: Color;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'confirm', name: string): void;
  (e: 'cancel'): void;
}>();

const colorName = ref('');

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      colorName.value = '';
    }
  }
);

const handleConfirm = () => {
  const name = colorName.value.trim();
  if (!name) {
    uni.showToast({
      title: '请输入颜色名称',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  emit('confirm', name);
};

const handleCancel = () => {
  colorName.value = '';
  emit('cancel');
};
</script>

<style scoped lang="scss">
.save-modal-overlay {
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
  padding: 20rpx;
  box-sizing: border-box;
}

.save-modal {
  width: calc(100% - 40rpx);
  max-width: 600rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.save-modal-header {
  padding: 40rpx;
  border-bottom: 1rpx solid #e5e5e5;
}

.save-modal-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.save-modal-body {
  padding: 40rpx;
}

.save-color-preview {
  width: 100%;
  height: 120rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  border: 2rpx solid #e5e5e5;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.save-input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.save-input-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.save-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #ffffff;
  box-sizing: border-box;
}

.save-modal-footer {
  padding: 30rpx 40rpx;
  border-top: 1rpx solid #e5e5e5;
  display: flex;
  gap: 20rpx;
}

.save-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #f5f5f5;
  border: 1rpx solid #e5e5e5;

  &:active {
    background-color: #e5e5e5;
    transform: scale(0.98);
  }

  .save-btn-text {
    color: #333;
  }
}

.confirm-btn {
  background-color: #007aff;
  border: 1rpx solid #007aff;

  &:active {
    background-color: #0056cc;
    transform: scale(0.98);
  }

  .save-btn-text {
    color: #ffffff;
  }
}

.save-btn-text {
  font-size: 30rpx;
  font-weight: 500;
}
</style>


