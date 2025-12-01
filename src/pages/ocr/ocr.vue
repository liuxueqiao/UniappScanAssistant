<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">文字识别</text>
      <text class="header-subtitle">智能提取文字，可识别41种语言</text>
    </view>

    <!-- 图片选择区域 -->
    <view class="image-section">
      <view v-if="!selectedImage" class="image-placeholder" @click="selectImage">
        <text class="placeholder-icon">📷</text>
        <text class="placeholder-text">点击选择图片或拍照</text>
      </view>
      <image 
        v-else 
        :src="selectedImage" 
        mode="aspectFit"
        class="selected-image"
      />
    </view>

    <!-- 识别结果区域 -->
    <view v-if="ocrResult" class="result-section">
      <view class="result-header">
        <text class="result-title">识别结果</text>
        <view class="result-actions">
          <text class="action-btn" @click="copyText">复制</text>
          <text class="action-btn" @click="editText">编辑</text>
          <text class="action-btn" @click="exportWord">导出Word</text>
        </view>
      </view>
      <view class="result-content">
        <text class="result-text">{{ ocrResult }}</text>
      </view>
    </view>

    <!-- 语言选择 -->
    <view class="language-section">
      <text class="section-title">识别语言</text>
      <view class="language-tags">
        <text 
          v-for="lang in languages" 
          :key="lang.code"
          class="language-tag"
          :class="{ active: selectedLanguage === lang.code }"
          @click="selectLanguage(lang.code)"
        >
          {{ lang.name }}
        </text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-button" @click="selectImage">
        <text class="btn-icon">📸</text>
        <text class="btn-text">选择图片</text>
      </view>
      <view 
        v-if="selectedImage && !ocrResult" 
        class="action-button primary" 
        @click="recognizeText"
      >
        <text class="btn-icon">🔍</text>
        <text class="btn-text">开始识别</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedImage = ref<string>('')
const ocrResult = ref<string>('')
const selectedLanguage = ref<string>('zh')

const languages = ref([
  { code: 'zh', name: '中文' },
  { code: 'en', name: '英文' },
  { code: 'ja', name: '日文' },
  { code: 'ko', name: '韩文' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'fr', name: '法语' }
])

const goBack = () => {
  uni.navigateBack()
}

const selectImage = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera', 'album'],
    success: (res) => {
      selectedImage.value = res.tempFilePaths[0]
      ocrResult.value = ''
    }
  })
}

const selectLanguage = (code: string) => {
  selectedLanguage.value = code
}

const recognizeText = () => {
  if (!selectedImage.value) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'none'
    })
    return
  }

  uni.showLoading({
    title: '识别中...'
  })

  // 模拟OCR识别（实际项目中需要调用OCR API）
  setTimeout(() => {
    ocrResult.value = `这是从图片中识别出的文字内容。\n\n在实际项目中，这里会调用OCR API（如百度OCR、腾讯OCR等）来识别图片中的文字。\n\n支持识别中、英、日、韩、葡、法等41种语言，还能一键复制、编辑图片上的文字，支持导出为 Word/Text 格式。`
    uni.hideLoading()
    uni.showToast({
      title: '识别成功',
      icon: 'success'
    })
  }, 2000)
}

const copyText = () => {
  if (!ocrResult.value) return
  
  // #ifdef H5
  navigator.clipboard.writeText(ocrResult.value).then(() => {
    uni.showToast({
      title: '复制成功',
      icon: 'success'
    })
  })
  // #endif
  
  // #ifndef H5
  uni.setClipboardData({
    data: ocrResult.value,
    success: () => {
      uni.showToast({
        title: '复制成功',
        icon: 'success'
      })
    }
  })
  // #endif
}

const editText = () => {
  uni.navigateTo({
    url: `/pages/ocr/edit?text=${encodeURIComponent(ocrResult.value)}`
  })
}

const exportWord = () => {
  uni.showToast({
    title: 'Word导出功能开发中',
    icon: 'none'
  })
  // TODO: 实现Word导出功能
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
    min-height: 400rpx;
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
      font-size: 28rpx;
      color: #999999;
    }
  }
  
  .selected-image {
    width: 100%;
    max-height: 600rpx;
  }
}

.result-section {
  margin: 0 30rpx 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 20rpx;
    border-bottom: 1rpx solid #F0F0F0;
    
    .result-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #333333;
    }
    
    .result-actions {
      display: flex;
      gap: 20rpx;
      
      .action-btn {
        font-size: 24rpx;
        color: #00BFA5;
        padding: 8rpx 16rpx;
        border: 1rpx solid #00BFA5;
        border-radius: 8rpx;
      }
    }
  }
  
  .result-content {
    .result-text {
      font-size: 28rpx;
      color: #333333;
      line-height: 1.8;
      white-space: pre-wrap;
    }
  }
}

.language-section {
  margin: 0 30rpx 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .section-title {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 20rpx;
  }
  
  .language-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    
    .language-tag {
      padding: 12rpx 24rpx;
      background: #F5F5F5;
      border-radius: 30rpx;
      font-size: 24rpx;
      color: #666666;
      
      &.active {
        background: #00BFA5;
        color: #FFFFFF;
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
