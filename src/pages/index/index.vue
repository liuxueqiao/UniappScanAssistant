<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-content">
        <text class="app-title">扫描全能王</text>
        <text class="app-subtitle">全球智能扫描引领者</text>
      </view>
    </view>

    <!-- 功能入口网格 -->
    <view class="features-grid">
      <view 
        v-for="feature in features" 
        :key="feature.id"
        class="feature-item"
        @click="navigateToFeature(feature.path)"
      >
        <view class="feature-icon" :style="{ backgroundColor: feature.color }">
          <text class="icon-text">{{ feature.icon }}</text>
        </view>
        <text class="feature-title">{{ feature.title }}</text>
        <text class="feature-desc">{{ feature.desc }}</text>
      </view>
    </view>

    <!-- 底部统计信息 -->
    <view class="footer-stats">
      <text class="stats-text">全球累积总下载量 17 余亿</text>
      <text class="stats-text">用户遍布全球 200 多个国家和地区</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const features = ref([
  {
    id: 1,
    title: '手机扫描仪',
    desc: '智能扫描文档',
    icon: '📷',
    color: '#00BFA5',
    path: '/pages/scan/scan'
  },
  {
    id: 2,
    title: '图片转文字',
    desc: 'OCR文字识别',
    icon: '🔤',
    color: '#2196F3',
    path: '/pages/ocr/ocr'
  },
  {
    id: 3,
    title: '证件扫描',
    desc: '身份证/护照等',
    icon: '🆔',
    color: '#FF9800',
    path: '/pages/idcard/idcard'
  },
  {
    id: 4,
    title: '试卷还原',
    desc: '擦除手写笔记',
    icon: '📝',
    color: '#9C27B0',
    path: '/pages/testpaper/testpaper'
  },
  {
    id: 5,
    title: '文档管理',
    desc: '一站式管理',
    icon: '📁',
    color: '#4CAF50',
    path: '/pages/document/document'
  },
  {
    id: 6,
    title: 'PDF工具',
    desc: '编辑转换合并',
    icon: '📄',
    color: '#F44336',
    path: '/pages/pdf/pdf'
  }
])

const navigateToFeature = (path: string) => {
  uni.navigateTo({
    url: path
  })
}
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background: linear-gradient(180deg, #00BFA5 0%, #E0F2F1 100%);
  padding-bottom: 40rpx;
}

.header {
  padding: 80rpx 40rpx 60rpx;
  text-align: center;
  
  .header-content {
    .app-title {
      display: block;
      font-size: 64rpx;
      font-weight: bold;
      color: #FFFFFF;
      margin-bottom: 20rpx;
    }
    
    .app-subtitle {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.9);
    }
  }
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30rpx;
  padding: 0 30rpx;
  margin-bottom: 40rpx;
}

.feature-item {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
  
  .feature-icon {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20rpx;
    
    .icon-text {
      font-size: 56rpx;
    }
  }
  
  .feature-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 10rpx;
  }
  
  .feature-desc {
    font-size: 24rpx;
    color: #999999;
  }
}

.footer-stats {
  text-align: center;
  padding: 40rpx 30rpx;
  
  .stats-text {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 10rpx;
  }
}
</style>