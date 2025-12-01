<template>
  <view class="container">
    <!-- 顶部标题栏 -->
    <view class="header">
      <view class="header-back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="header-title">文档管理</text>
      <view class="header-actions">
        <text class="action-icon" @click="showSearch">🔍</text>
        <text class="action-icon" @click="showSort">☰</text>
      </view>
    </view>

    <!-- 分类标签 -->
    <view class="category-bar">
      <view 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        <text class="category-name">{{ category.name }}</text>
        <text v-if="category.count" class="category-count">({{ category.count }})</text>
      </view>
    </view>

    <!-- 文档列表 -->
    <view class="document-list">
      <view 
        v-for="doc in filteredDocuments" 
        :key="doc.id"
        class="document-item"
        @click="openDocument(doc)"
      >
        <view class="doc-icon">
          <text class="icon-text">{{ doc.type === 'pdf' ? '📄' : '🖼️' }}</text>
        </view>
        <view class="doc-info">
          <text class="doc-name">{{ doc.name }}</text>
          <text class="doc-meta">{{ doc.date }} · {{ doc.size }}</text>
        </view>
        <view class="doc-actions" @click.stop="showDocMenu(doc)">
          <text class="more-icon">⋯</text>
        </view>
      </view>
      
      <view v-if="filteredDocuments.length === 0" class="empty-state">
        <text class="empty-icon">📁</text>
        <text class="empty-text">暂无文档</text>
        <text class="empty-desc">扫描或导入文档开始管理</text>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-bar">
      <view class="action-btn" @click="importDocument">
        <text class="btn-icon">📥</text>
        <text class="btn-text">导入</text>
      </view>
      <view class="action-btn" @click="createFolder">
        <text class="btn-icon">📁</text>
        <text class="btn-text">新建文件夹</text>
      </view>
      <view class="action-btn" @click="scanDocument">
        <text class="btn-icon">📷</text>
        <text class="btn-text">扫描</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'image'
  date: string
  size: string
  category: string
}

const selectedCategory = ref<string>('all')
const documents = ref<Document[]>([
  {
    id: '1',
    name: '身份证扫描件.pdf',
    type: 'pdf',
    date: '2024-01-15',
    size: '2.3MB',
    category: 'idcard'
  },
  {
    id: '2',
    name: '合同文档.pdf',
    type: 'pdf',
    date: '2024-01-14',
    size: '1.8MB',
    category: 'work'
  },
  {
    id: '3',
    name: '发票.jpg',
    type: 'image',
    date: '2024-01-13',
    size: '856KB',
    category: 'invoice'
  }
])

const categories = ref([
  { id: 'all', name: '全部', count: documents.value.length },
  { id: 'idcard', name: '证件', count: 1 },
  { id: 'work', name: '工作', count: 1 },
  { id: 'invoice', name: '发票', count: 1 },
  { id: 'study', name: '学习', count: 0 }
])

const filteredDocuments = computed(() => {
  if (selectedCategory.value === 'all') {
    return documents.value
  }
  return documents.value.filter(doc => doc.category === selectedCategory.value)
})

const goBack = () => {
  uni.navigateBack()
}

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId
}

const showSearch = () => {
  uni.showToast({
    title: '搜索功能开发中',
    icon: 'none'
  })
}

const showSort = () => {
  uni.showActionSheet({
    itemList: ['按时间排序', '按名称排序', '按大小排序'],
    success: (res) => {
      uni.showToast({
        title: `已选择：${['按时间排序', '按名称排序', '按大小排序'][res.tapIndex]}`,
        icon: 'none'
      })
    }
  })
}

const openDocument = (doc: Document) => {
  uni.showToast({
    title: `打开：${doc.name}`,
    icon: 'none'
  })
  // TODO: 实现文档打开功能
}

const showDocMenu = (doc: Document) => {
  uni.showActionSheet({
    itemList: ['重命名', '移动', '删除', '分享'],
    success: (res) => {
      const actions = ['重命名', '移动', '删除', '分享']
      uni.showToast({
        title: `${actions[res.tapIndex]}：${doc.name}`,
        icon: 'none'
      })
    }
  })
}

const importDocument = () => {
  uni.chooseFile({
    count: 1,
    type: 'file',
    success: (res) => {
      uni.showToast({
        title: '导入成功',
        icon: 'success'
      })
    },
    fail: () => {
      uni.showToast({
        title: '导入失败',
        icon: 'none'
      })
    }
  })
}

const createFolder = () => {
  uni.showModal({
    title: '新建文件夹',
    placeholderText: '请输入文件夹名称',
    editable: true,
    success: (res) => {
      if (res.confirm && res.content) {
        uni.showToast({
          title: `已创建：${res.content}`,
          icon: 'success'
        })
      }
    }
  })
}

const scanDocument = () => {
  uni.navigateTo({
    url: '/pages/scan/scan'
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 30rpx;
  background: #00BFA5;
  color: #FFFFFF;
  
  .header-back {
    width: 60rpx;
    
    .back-icon {
      font-size: 48rpx;
      font-weight: bold;
    }
  }
  
  .header-title {
    font-size: 36rpx;
    font-weight: 600;
  }
  
  .header-actions {
    display: flex;
    gap: 30rpx;
    
    .action-icon {
      font-size: 36rpx;
    }
  }
}

.category-bar {
  display: flex;
  background: #FFFFFF;
  padding: 20rpx 30rpx;
  overflow-x: auto;
  white-space: nowrap;
  
  .category-item {
    display: inline-flex;
    align-items: center;
    padding: 12rpx 24rpx;
    margin-right: 20rpx;
    background: #F5F5F5;
    border-radius: 30rpx;
    
    &.active {
      background: #00BFA5;
      
      .category-name,
      .category-count {
        color: #FFFFFF;
      }
    }
    
    .category-name {
      font-size: 26rpx;
      color: #333333;
    }
    
    .category-count {
      font-size: 24rpx;
      color: #999999;
      margin-left: 8rpx;
    }
  }
}

.document-list {
  padding: 20rpx 30rpx;
  
  .document-item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background: #FFFFFF;
    border-radius: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    
    .doc-icon {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #E0F2F1;
      border-radius: 16rpx;
      margin-right: 20rpx;
      
      .icon-text {
        font-size: 40rpx;
      }
    }
    
    .doc-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .doc-name {
        font-size: 30rpx;
        color: #333333;
        margin-bottom: 10rpx;
      }
      
      .doc-meta {
        font-size: 24rpx;
        color: #999999;
      }
    }
    
    .doc-actions {
      padding: 10rpx;
      
      .more-icon {
        font-size: 36rpx;
        color: #999999;
      }
    }
  }
  
  .empty-state {
    text-align: center;
    padding: 120rpx 30rpx;
    
    .empty-icon {
      font-size: 120rpx;
      display: block;
      margin-bottom: 30rpx;
    }
    
    .empty-text {
      display: block;
      font-size: 32rpx;
      color: #333333;
      margin-bottom: 15rpx;
    }
    
    .empty-desc {
      display: block;
      font-size: 24rpx;
      color: #999999;
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
    padding: 20rpx;
    background: #F5F5F5;
    border-radius: 16rpx;
    
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
