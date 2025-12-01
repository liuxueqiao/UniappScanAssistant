<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">证件扫描</text>
      <text class="header-subtitle">身份证/户口本/护照</text>
    </view>

    <!-- 证件类型选择 -->
    <view class="doc-type-bar">
      <view 
        v-for="type in docTypes" 
        :key="type.id"
        class="doc-type-item"
        :class="{ active: selectedType === type.id }"
        @click="selectType(type.id)"
      >
        <text class="type-name">{{ type.name }}</text>
      </view>
    </view>

    <!-- 扫描预览区域 -->
    <view class="preview-area">
      <view v-if="!scannedDoc" class="preview-placeholder">
        <text class="placeholder-icon">🆔</text>
        <text class="placeholder-text">请选择证件类型并开始扫描</text>
        <text class="placeholder-desc">选择定制模板1:1扫描完美复刻</text>
      </view>
      <view v-else class="scanned-doc">
        <image 
          :src="scannedDoc" 
          mode="aspectFit"
          class="doc-image"
        />
      </view>
    </view>

    <!-- 编辑工具 -->
    <view v-if="scannedDoc" class="edit-tools">
      <view class="tool-item" @click="addWatermark">
        <text class="tool-icon">💧</text>
        <text class="tool-name">添加水印</text>
      </view>
      <view class="tool-item" @click="crop">
        <text class="tool-icon">✂️</text>
        <text class="tool-name">裁剪</text>
      </view>
      <view class="tool-item" @click="applyFilter">
        <text class="tool-icon">🎨</text>
        <text class="tool-name">滤镜</text>
      </view>
      <view class="tool-item" @click="selectTemplate">
        <text class="tool-icon">📋</text>
        <text class="tool-name">模板</text>
      </view>
      <view class="tool-item" @click="saveDoc">
        <text class="tool-icon">✓</text>
        <text class="tool-name">保存</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @click="startScan">
        <text class="btn-icon">📷</text>
        <text class="btn-text">开始扫描</text>
      </view>
      <view 
        v-if="scannedDoc" 
        class="action-btn primary" 
        @click="saveToCloud"
      >
        <text class="btn-icon">☁️</text>
        <text class="btn-text">在线备份</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const selectedType = ref<string>('idcard')
const scannedDoc = ref<string>('')

const docTypes = ref([
  { id: 'all', name: '全部类型' },
  { id: 'general', name: '通用证件' },
  { id: 'idcard', name: '身份证' },
  { id: 'household', name: '户口本' },
  { id: 'passport', name: '护照' }
])

const goBack = () => {
  uni.navigateBack()
}

const selectType = (typeId: string) => {
  selectedType.value = typeId
}

const startScan = () => {
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    success: (res) => {
      scannedDoc.value = res.tempFilePaths[0]
      uni.showToast({
        title: '扫描成功',
        icon: 'success'
      })
    },
    fail: () => {
      uni.showToast({
        title: '扫描失败',
        icon: 'none'
      })
    }
  })
}

const addWatermark = () => {
  uni.showToast({
    title: '水印功能开发中',
    icon: 'none'
  })
}

const crop = () => {
  uni.showToast({
    title: '裁剪功能开发中',
    icon: 'none'
  })
}

const applyFilter = () => {
  uni.showToast({
    title: '滤镜功能开发中',
    icon: 'none'
  })
}

const selectTemplate = () => {
  uni.showToast({
    title: '模板选择功能开发中',
    icon: 'none'
  })
}

const saveDoc = () => {
  if (!scannedDoc.value) return
  
  uni.showToast({
    title: '保存成功',
    icon: 'success'
  })
}

const saveToCloud = () => {
  uni.showToast({
    title: '在线备份功能开发中',
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

.doc-type-bar {
  display: flex;
  background: #000000;
  padding: 0 20rpx;
  overflow-x: auto;
  
  .doc-type-item {
    padding: 30rpx 30rpx;
    color: #999999;
    white-space: nowrap;
    
    &.active {
      color: #FFFFFF;
      border-bottom: 4rpx solid #FFFFFF;
    }
    
    .type-name {
      font-size: 28rpx;
    }
  }
}

.preview-area {
  margin: 30rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  min-height: 500rpx;
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
  
  .scanned-doc {
    width: 100%;
    padding: 30rpx;
    
    .doc-image {
      width: 100%;
      max-height: 600rpx;
      border-radius: 10rpx;
    }
  }
}

.edit-tools {
  display: flex;
  justify-content: space-around;
  background: #FFFFFF;
  padding: 30rpx;
  margin: 0 30rpx 30rpx;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .tool-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .tool-icon {
      font-size: 40rpx;
      margin-bottom: 10rpx;
    }
    
    .tool-name {
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
  gap: 20rpx;
  padding: 30rpx;
  background: #FFFFFF;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.1);
  
  .action-btn {
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
