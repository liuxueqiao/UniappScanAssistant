<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">试卷还原</text>
      <text class="header-subtitle">擦除手写笔记，还原空白试卷</text>
    </view>

    <!-- 图片选择区域 -->
    <view class="image-section">
      <view v-if="!selectedImage" class="image-placeholder" @click="selectImage">
        <text class="placeholder-icon">📝</text>
        <text class="placeholder-text">选择试卷图片</text>
        <text class="placeholder-desc">自动清除字迹笔迹，精准还原空白试卷</text>
      </view>
      <view v-else class="image-preview">
        <image 
          :src="selectedImage" 
          mode="aspectFit"
          class="preview-image"
        />
        <view v-if="processing" class="processing-overlay">
          <text class="processing-text">处理中...</text>
        </view>
      </view>
    </view>

    <!-- 处理选项 -->
    <view v-if="selectedImage && !processing" class="process-options">
      <view class="option-item" @click="processImage">
        <text class="option-icon">✨</text>
        <text class="option-text">开始还原</text>
      </view>
      <view class="option-item" @click="adjustSettings">
        <text class="option-icon">⚙️</text>
        <text class="option-text">调整参数</text>
      </view>
    </view>

    <!-- 处理结果 -->
    <view v-if="processedImage" class="result-section">
      <view class="result-header">
        <text class="result-title">还原结果</text>
        <text class="result-desc">手写笔记已清除</text>
      </view>
      <view class="result-image">
        <image 
          :src="processedImage" 
          mode="aspectFit"
          class="result-img"
        />
      </view>
      <view class="result-actions">
        <view class="result-btn" @click="saveResult">
          <text class="btn-text">保存图片</text>
        </view>
        <view class="result-btn primary" @click="exportPDF">
          <text class="btn-text">导出PDF</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-button" @click="selectImage">
        <text class="btn-icon">📸</text>
        <text class="btn-text">选择图片</text>
      </view>
      <view 
        v-if="selectedImage && !processedImage" 
        class="action-button primary" 
        @click="processImage"
      >
        <text class="btn-icon">✨</text>
        <text class="btn-text">开始还原</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedImage = ref<string>('')
const processedImage = ref<string>('')
const processing = ref<boolean>(false)

const goBack = () => {
  uni.navigateBack()
}

const selectImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera', 'album'],
    success: (res) => {
      selectedImage.value = res.tempFilePaths[0]
      processedImage.value = ''
    }
  })
}

const processImage = () => {
  if (!selectedImage.value) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'none'
    })
    return
  }

  processing.value = true
  uni.showLoading({
    title: '处理中...'
  })

  // 模拟处理过程（实际项目中需要调用图像处理API）
  setTimeout(() => {
    // 这里应该调用实际的图像处理算法来清除手写笔记
    // 暂时使用原图作为示例
    processedImage.value = selectedImage.value
    processing.value = false
    uni.hideLoading()
    uni.showToast({
      title: '还原成功',
      icon: 'success'
    })
  }, 3000)
}

const adjustSettings = () => {
  uni.showToast({
    title: '参数调整功能开发中',
    icon: 'none'
  })
}

const saveResult = () => {
  if (!processedImage.value) return
  
  uni.saveFile({
    tempFilePath: processedImage.value,
    success: () => {
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }
  })
}

const exportPDF = () => {
  uni.showToast({
    title: 'PDF导出功能开发中',
    icon: 'none'
  })
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background: #F5F5F5;
  padding-bottom: 160rpx;
}

.header {
  background: #00BFA5;
  color: #FFFFFF;
  padding: 40rpx 30rpx 30rpx;
  
  .header-back {
    margin-bottom: 20rpx;
    
    .back-icon {
      font-size: 48rpx;
      font-weight: bold;
    }
  }
  
  .header-title {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
  }
  
  .header-subtitle {
    display: block;
    font-size: 24rpx;
    opacity: 0.9;
  }
}

.image-section {
  margin: 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .image-placeholder {
    min-height: 500rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx;
    
    .placeholder-icon {
      font-size: 120rpx;
      margin-bottom: 30rpx;
    }
    
    .placeholder-text {
      font-size: 32rpx;
      color: #333333;
      margin-bottom: 20rpx;
    }
    
    .placeholder-desc {
      font-size: 24rpx;
      color: #999999;
    }
  }
  
  .image-preview {
    position: relative;
    
    .preview-image {
      width: 100%;
      max-height: 600rpx;
    }
    
    .processing-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      
      .processing-text {
        color: #FFFFFF;
        font-size: 32rpx;
      }
    }
  }
}

.process-options {
  display: flex;
  gap: 20rpx;
  margin: 0 30rpx 30rpx;
  
  .option-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    
    .option-icon {
      font-size: 48rpx;
      margin-bottom: 15rpx;
    }
    
    .option-text {
      font-size: 28rpx;
      color: #333333;
    }
  }
}

.result-section {
  margin: 0 30rpx 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .result-header {
    margin-bottom: 20rpx;
    
    .result-title {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #333333;
      margin-bottom: 10rpx;
    }
    
    .result-desc {
      display: block;
      font-size: 24rpx;
      color: #999999;
    }
  }
  
  .result-image {
    margin-bottom: 30rpx;
    
    .result-img {
      width: 100%;
      max-height: 600rpx;
      border-radius: 10rpx;
    }
  }
  
  .result-actions {
    display: flex;
    gap: 20rpx;
    
    .result-btn {
      flex: 1;
      padding: 24rpx;
      background: #F5F5F5;
      border-radius: 16rpx;
      text-align: center;
      
      &.primary {
        background: #00BFA5;
        
        .btn-text {
          color: #FFFFFF;
        }
      }
      
      .btn-text {
        font-size: 28rpx;
        color: #333333;
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 30rpx;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .action-button {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30rpx;
    background: #F5F5F5;
    border-radius: 16rpx;
    
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
      font-size: 28rpx;
      color: #333333;
    }
  }
}
</style>
