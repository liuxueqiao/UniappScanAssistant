<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">手机扫描仪</text>
      <view class="header-placeholder"></view>
    </view>

    <!-- 扫描预览区域 -->
    <view class="preview-area">
      <view v-if="!scannedImage" class="preview-placeholder">
        <text class="placeholder-icon">📷</text>
        <text class="placeholder-text">点击下方按钮开始扫描</text>
        <text class="placeholder-desc">智能去除杂乱背景，自动矫正弯曲页面</text>
      </view>
      <image 
        v-else 
        :src="scannedImage" 
        mode="aspectFit"
        class="scanned-image"
      />
    </view>

    <!-- 图像处理选项 -->
    <view v-if="scannedImage" class="filter-options">
      <view 
        v-for="filter in filters" 
        :key="filter.id"
        class="filter-item"
        :class="{ active: currentFilter === filter.id }"
        @click="applyFilter(filter.id)"
      >
        <text class="filter-icon">{{ filter.icon }}</text>
        <text class="filter-name">{{ filter.name }}</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @click="chooseImage">
        <text class="btn-icon">📸</text>
        <text class="btn-text">拍照</text>
      </view>
      <view class="action-btn" @click="selectFromAlbum">
        <text class="btn-icon">🖼️</text>
        <text class="btn-text">相册</text>
      </view>
      <view 
        v-if="scannedImage" 
        class="action-btn primary" 
        @click="saveDocument"
      >
        <text class="btn-icon">💾</text>
        <text class="btn-text">保存</text>
      </view>
      <view 
        v-if="scannedImage" 
        class="action-btn primary" 
        @click="exportPDF"
      >
        <text class="btn-icon">📄</text>
        <text class="btn-text">导出PDF</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const scannedImage = ref<string>('')
const currentFilter = ref<string>('original')

const filters = ref([
  { id: 'original', name: '原图', icon: '📄' },
  { id: 'hd', name: '智能高清', icon: '✨' },
  { id: 'sharpen', name: '增强锐化', icon: '🔍' },
  { id: 'removeShadow', name: '去阴影', icon: '☀️' },
  { id: 'brighten', name: '增亮', icon: '💡' }
])

const goBack = () => {
  uni.navigateBack()
}

const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      scannedImage.value = res.tempFilePaths[0]
      currentFilter.value = 'hd'
    },
    fail: (err) => {
      uni.showToast({
        title: '拍照失败',
        icon: 'none'
      })
    }
  })
}

const selectFromAlbum = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['album'],
    success: (res) => {
      scannedImage.value = res.tempFilePaths[0]
      currentFilter.value = 'hd'
    },
    fail: (err) => {
      uni.showToast({
        title: '选择失败',
        icon: 'none'
      })
    }
  })
}

const applyFilter = (filterId: string) => {
  currentFilter.value = filterId
  uni.showToast({
    title: `已应用${filters.value.find(f => f.id === filterId)?.name}`,
    icon: 'none',
    duration: 1500
  })
}

const saveDocument = () => {
  if (!scannedImage.value) return
  
  uni.saveFile({
    tempFilePath: scannedImage.value,
    success: (res) => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
      // 可以保存到文档管理
      uni.navigateTo({
        url: '/pages/document/document'
      })
    },
    fail: () => {
      uni.showToast({
        title: '保存失败',
        icon: 'none'
      })
    }
  })
}

const exportPDF = () => {
  if (!scannedImage.value) return
  
  uni.showToast({
    title: 'PDF导出功能开发中',
    icon: 'none'
  })
  // TODO: 实现PDF导出功能
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background: #F5F5F5;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #00BFA5;
  color: #FFFFFF;
  
  .header-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back-icon {
      font-size: 48rpx;
      font-weight: bold;
    }
  }
  
  .header-title {
    font-size: 36rpx;
    font-weight: 600;
  }
  
  .header-placeholder {
    width: 60rpx;
  }
}

.preview-area {
  margin: 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  min-height: 600rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .preview-placeholder {
    text-align: center;
    padding: 60rpx;
    
    .placeholder-icon {
      font-size: 120rpx;
      display: block;
      margin-bottom: 30rpx;
    }
    
    .placeholder-text {
      display: block;
      font-size: 32rpx;
      color: #333333;
      margin-bottom: 20rpx;
    }
    
    .placeholder-desc {
      display: block;
      font-size: 24rpx;
      color: #999999;
    }
  }
  
  .scanned-image {
    width: 100%;
    max-height: 600rpx;
    border-radius: 20rpx;
  }
}

.filter-options {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  background: #FFFFFF;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  
  .filter-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
    border-radius: 16rpx;
    transition: all 0.3s;
    
    &.active {
      background: #E0F2F1;
      
      .filter-name {
        color: #00BFA5;
        font-weight: 600;
      }
    }
    
    .filter-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }
    
    .filter-name {
      font-size: 24rpx;
      color: #666666;
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 30rpx;
    border-radius: 16rpx;
    background: #F5F5F5;
    min-width: 120rpx;
    
    &.primary {
      background: #00BFA5;
      
      .btn-icon,
      .btn-text {
        color: #FFFFFF;
      }
    }
    
    .btn-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }
    
    .btn-text {
      font-size: 24rpx;
      color: #333333;
    }
  }
}
</style>
