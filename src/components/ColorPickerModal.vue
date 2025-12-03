<template>
  <view v-if="visible" class="color-picker-overlay" @click.stop="handleCancel">
    <view class="color-picker-modal" @click.stop>
      <view class="color-picker-header">
        <text class="color-picker-title">选择颜色</text>
        <view class="color-picker-close" @click="handleCancel">
          <text class="close-icon">×</text>
        </view>
      </view>
      <view class="color-picker-search">
        <input
          class="color-picker-search-input"
          v-model="searchKeyword"
          type="text"
          placeholder="搜索颜色名称"
        />
      </view>
      <view class="color-picker-body">
        <view
          v-for="(color, index) in filteredColors"
          :key="index"
          class="color-picker-item"
          :class="{ selected: isColorSelected(color) }"
          @click="toggleSelection(color)"
        >
          <view
            class="color-picker-card"
            :class="{ 'light-color': isLightColor(color) }"
            :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }"
          />
          <text class="color-picker-name">{{ color.name }}</text>
          <view v-if="isColorSelected(color)" class="color-picker-check">
            <text class="check-icon">✓</text>
          </view>
        </view>
      </view>
      <view class="color-picker-footer">
        <view class="color-picker-btn cancel-btn" @click="handleCancel">
          <text class="btn-text">取消</text>
        </view>
        <view class="color-picker-btn confirm-btn" @click="handleConfirm">
          <text class="btn-text">确定</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface ColorDetail {
  name: string;
  temperature?: string;
  hex?: string;
  r: number;
  g: number;
  b: number;
  description: string;
}

interface Props {
  visible: boolean;
  selectedColors?: ColorDetail[];
  defaultColors?: ColorDetail[];
  allColors: ColorDetail[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedColors: () => [],
  defaultColors: () => []
});

const emit = defineEmits<{
  (e: 'confirm', colors: ColorDetail[]): void;
  (e: 'cancel'): void;
}>();

const searchKeyword = ref('');
const tempSelected = ref<ColorDetail[]>([]);

// 监听 visible 变化，初始化选中状态
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 初始化临时选中列表
      if (props.selectedColors && props.selectedColors.length > 0) {
        tempSelected.value = [...props.selectedColors];
      } else if (props.defaultColors && props.defaultColors.length > 0) {
        tempSelected.value = [...props.defaultColors];
      } else {
        tempSelected.value = [];
      }
      searchKeyword.value = '';
    } else {
      tempSelected.value = [];
      searchKeyword.value = '';
    }
  },
  { immediate: true }
);

// 获取所有系统颜色（包括自定义颜色）
const allSystemColors = computed(() => {
  const all: ColorDetail[] = [...props.allColors];
  
  // 添加自定义颜色（实时获取）
  const customColors = uni.getStorageSync('customColors') || [];
  if (Array.isArray(customColors) && customColors.length > 0) {
    all.push(...customColors);
  }
  
  // 去重
  const unique: ColorDetail[] = [];
  const seen = new Set<string>();
  all.forEach((color) => {
    const key = `${color.r}-${color.g}-${color.b}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(color);
    }
  });
  return unique;
});

// 过滤后的颜色（支持搜索）
const filteredColors = computed(() => {
  if (!searchKeyword.value.trim()) {
    return allSystemColors.value;
  }
  
  const keyword = searchKeyword.value.trim().toLowerCase();
  return allSystemColors.value.filter((color) => {
    return color.name.toLowerCase().includes(keyword);
  });
});

// 判断是否为浅色
const isLightColor = (color: ColorDetail): boolean => {
  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  return brightness > 200;
};

// 判断颜色是否已选中
const isColorSelected = (color: ColorDetail) => {
  return tempSelected.value.some(
    (c) => c.r === color.r && c.g === color.g && c.b === color.b
  );
};

// 切换选择状态
const toggleSelection = (color: ColorDetail) => {
  const index = tempSelected.value.findIndex(
    (c) => c.r === color.r && c.g === color.g && c.b === color.b
  );
  
  if (index > -1) {
    tempSelected.value.splice(index, 1);
  } else {
    tempSelected.value.push(color);
  }
};

// 确认选择
const handleConfirm = () => {
  emit('confirm', [...tempSelected.value]);
};

// 取消
const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped lang="scss">
.color-picker-overlay {
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

.color-picker-modal {
  width: calc(100% - 40rpx);
  max-width: 700rpx;
  max-height: 80vh;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.color-picker-header {
  padding: 30rpx 40rpx;
  border-bottom: 1rpx solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.color-picker-search {
  padding: 20rpx 40rpx;
  border-bottom: 1rpx solid #e5e5e5;
  flex-shrink: 0;
}

.color-picker-search-input {
  width: 100%;
  height: 70rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
  background-color: #f5f5f5;
  box-sizing: border-box;

  &::placeholder {
    color: #999;
  }
}

.color-picker-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.color-picker-close {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #f5f5f5;
  }
}

.close-icon {
  font-size: 48rpx;
  color: #666;
  line-height: 1;
}

.color-picker-body {
  flex: 1;
  overflow-y: auto;
  padding: 30rpx 40rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.color-picker-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2rpx solid transparent;

  &:active {
    background-color: #f5f5f5;
  }

  &.selected {
    background-color: #f0f7ff;
    border-color: #007aff;
  }
}

.color-picker-card {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
  flex-shrink: 0;
  border: 2rpx solid #e5e5e5;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

  &.light-color {
    border: 2rpx solid #d0d0d0;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
  }
}

.color-picker-name {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.color-picker-check {
  width: 40rpx;
  height: 40rpx;
  background-color: #007aff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.check-icon {
  font-size: 24rpx;
  color: #ffffff;
  font-weight: bold;
}

.color-picker-footer {
  padding: 30rpx 40rpx;
  border-top: 1rpx solid #e5e5e5;
  display: flex;
  gap: 20rpx;
  flex-shrink: 0;
}

.color-picker-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-picker-btn.cancel-btn {
  background-color: #f5f5f5;
  border: 1rpx solid #e5e5e5;

  &:active {
    background-color: #e5e5e5;
    transform: scale(0.98);
  }

  .btn-text {
    color: #333;
  }
}

.color-picker-btn.confirm-btn {
  background-color: #007aff;
  border: 1rpx solid #007aff;

  &:active {
    background-color: #0056cc;
    transform: scale(0.98);
  }

  .btn-text {
    color: #ffffff;
  }
}

.btn-text {
  font-size: 30rpx;
  font-weight: 500;
}
</style>

