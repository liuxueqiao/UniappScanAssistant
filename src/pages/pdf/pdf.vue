<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">PDF工具</text>
      <view class="header-placeholder"></view>
    </view>

    <!-- 功能列表 -->
    <view class="function-list">
      <view 
        v-for="func in functions" 
        :key="func.id"
        class="function-item"
        @click="handleFunction(func)"
      >
        <view class="func-icon" :style="{ backgroundColor: func.color }">
          <text class="icon-text">{{ func.icon }}</text>
        </view>
        <view class="func-info">
          <text class="func-title">{{ func.title }}</text>
          <text class="func-desc">{{ func.desc }}</text>
        </view>
        <text class="func-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface PDFFunction {
  id: string
  title: string
  desc: string
  icon: string
  color: string
  path?: string
  action?: () => void
}

const functions = ref<PDFFunction[]>([
  {
    id: 'edit',
    title: 'PDF编辑修改',
    desc: '页面删除、顺序调整、插入、合并等操作',
    icon: '✏️',
    color: '#2196F3',
    path: '/pages/pdf/edit'
  },
  {
    id: 'convert',
    title: 'PDF格式转换',
    desc: 'PDF、Word、Excel、PPT和图像文档之间转换',
    icon: '🔄',
    color: '#4CAF50',
    path: '/pages/pdf/convert'
  },
  {
    id: 'merge',
    title: 'PDF合并',
    desc: '将多个PDF文件合并为一个',
    icon: '📚',
    color: '#FF9800',
    path: '/pages/pdf/merge'
  },
  {
    id: 'split',
    title: 'PDF拆分',
    desc: '将一个PDF文件拆分为多个',
    icon: '✂️',
    color: '#9C27B0',
    path: '/pages/pdf/split'
  },
  {
    id: 'watermark',
    title: '添加水印',
    desc: '为PDF添加文字或图片水印',
    icon: '💧',
    color: '#00BCD4',
    path: '/pages/pdf/watermark'
  },
  {
    id: 'signature',
    title: '添加签名',
    desc: '在PDF上添加电子签名',
    icon: '✍️',
    color: '#F44336',
    path: '/pages/pdf/signature'
  },
  {
    id: 'compress',
    title: 'PDF压缩',
    desc: '减小PDF文件大小',
    icon: '🗜️',
    color: '#795548',
    path: '/pages/pdf/compress'
  },
  {
    id: 'encrypt',
    title: 'PDF加密',
    desc: '为PDF添加密码保护',
    icon: '🔒',
    color: '#607D8B',
    path: '/pages/pdf/encrypt'
  }
])

const goBack = () => {
  uni.navigateBack()
}

const handleFunction = (func: PDFFunction) => {
  if (func.path) {
    uni.navigateTo({
      url: func.path
    })
  } else if (func.action) {
    func.action()
  } else {
    uni.showToast({
      title: `${func.title}功能开发中`,
      icon: 'none'
    })
  }
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

.function-list {
  padding: 30rpx;
}

.function-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  margin-bottom: 20rpx;
  background: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .func-icon {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    margin-right: 20rpx;
    
    .icon-text {
      font-size: 40rpx;
    }
  }
  
  .func-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    
    .func-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333333;
      margin-bottom: 10rpx;
    }
    
    .func-desc {
      font-size: 24rpx;
      color: #999999;
    }
  }
  
  .func-arrow {
    font-size: 36rpx;
    color: #CCCCCC;
    margin-left: 20rpx;
  }
}
</style>
