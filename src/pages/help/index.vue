<template>
  <view class="help-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="navbar-content">
        <view class="navbar-left">
          <view class="back-btn" @click="goBack">
            <text class="back-icon">‹</text>
          </view>
          <text class="navbar-title">帮助中心</text>
        </view>
      </view>
    </view>

    <scroll-view class="help-content" scroll-y>
      <!-- 使用教程 -->
      <view class="help-section">
        <view class="section-title">📖 使用教程</view>
        <view class="tutorial-item">
          <view class="tutorial-title">1. 常用模式</view>
          <view class="tutorial-desc">
            在常用模式下，您可以快速选择预设的颜色，或通过RGB滑块自定义颜色。使用过的颜色会自动添加到常用列表。
          </view>
        </view>
        <view class="tutorial-item">
          <view class="tutorial-title">2. 收藏模式</view>
          <view class="tutorial-desc">
            在色彩库中点击心形图标收藏喜欢的颜色，收藏的颜色会显示在收藏模式中，方便快速访问。
          </view>
        </view>
        <view class="tutorial-item">
          <view class="tutorial-title">3. 百变光源</view>
          <view class="tutorial-desc">
            选择多个颜色，设置切换频率，开启后会自动循环切换颜色，营造动态光影效果。适合拍摄创意视频。
          </view>
        </view>
        <view class="tutorial-item">
          <view class="tutorial-title">4. 场景模式</view>
          <view class="tutorial-desc">
            提供阅读、睡眠、工作、护眼等场景模式，一键切换适合的颜色和亮度，满足不同使用场景。
          </view>
        </view>
        <view class="tutorial-item">
          <view class="tutorial-title">5. 亮度调节</view>
          <view class="tutorial-desc">
            通过亮度滑块调节亮度（10%-100%），适应不同环境光线需求。
          </view>
        </view>
        <view class="tutorial-item">
          <view class="tutorial-title">6. 定时关闭</view>
          <view class="tutorial-desc">
            开启定时关闭功能，设置时间后会自动关闭，适合睡前使用或长时间使用场景。
          </view>
        </view>
      </view>

      <!-- 常见问题 -->
      <view class="help-section">
        <view class="section-title">❓ 常见问题</view>
        <view class="faq-item" v-for="(faq, index) in faqs" :key="index">
          <view class="faq-question" @click="toggleFaq(index)">
            <text class="faq-icon">{{ expandedFaqs[index] ? '▼' : '▶' }}</text>
            <text class="faq-text">{{ faq.question }}</text>
          </view>
          <view v-if="expandedFaqs[index]" class="faq-answer">
            <text>{{ faq.answer }}</text>
          </view>
        </view>
      </view>

      <!-- 适用场景 -->
      <view class="help-section">
        <view class="section-title">💡 适用场景</view>
        <view class="scene-item" v-for="(scene, index) in scenes" :key="index">
          <view class="scene-icon">{{ scene.icon }}</view>
          <view class="scene-content">
            <view class="scene-name">{{ scene.name }}</view>
            <view class="scene-desc">{{ scene.desc }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const statusBarHeight = ref(0);
const expandedFaqs = ref<boolean[]>([]);

const faqs = [
  {
    question: '如何保存自定义颜色？',
    answer: '在常用模式下，调整好RGB颜色后，点击"保存为自定义"按钮，输入颜色名称即可保存。保存的颜色会显示在色彩库的"自定义"标签中。'
  },
  {
    question: '百变光源如何停止？',
    answer: '返回设置页面，关闭"开启百变光源"开关，或切换到其他模式即可停止。'
  },
  {
    question: '定时关闭功能如何使用？',
    answer: '在设置页面开启"定时关闭"开关，选择预设时间或输入自定义时间（1-120分钟），点击确定后定时器开始计时，时间到后会自动关闭。'
  },
  {
    question: '如何收藏颜色？',
    answer: '进入色彩库页面，找到喜欢的颜色，点击右侧的心形图标即可收藏。收藏的颜色会显示在"收藏"模式中。'
  },
  {
    question: '场景模式可以自定义吗？',
    answer: '场景模式提供预设的颜色和亮度，您可以在选择场景模式后，再手动调整RGB和亮度来微调效果。'
  },
  {
    question: '为什么颜色显示不准确？',
    answer: '颜色受手机屏幕显示效果影响，不同手机型号可能存在色差。建议在专业设备上使用时进行校准。'
  }
];

const scenes = [
  {
    icon: '📸',
    name: '专业摄影',
    desc: '人像拍摄、产品摄影、静物拍摄'
  },
  {
    icon: '📱',
    name: '自拍美妆',
    desc: '自拍补光、美妆直播、产品展示'
  },
  {
    icon: '🎬',
    name: '视频创作',
    desc: 'vlog拍摄、短视频制作、直播补光'
  },
  {
    icon: '📖',
    name: '阅读学习',
    desc: '夜间阅读、学习补光、护眼模式'
  },
  {
    icon: '🎃',
    name: '创意拍摄',
    desc: '节日主题、氛围营造、艺术创作'
  }
];

const toggleFaq = (index: number) => {
  expandedFaqs.value[index] = !expandedFaqs.value[index];
};

const goBack = () => {
  uni.navigateBack();
};

onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  expandedFaqs.value = new Array(faqs.length).fill(false);
});
</script>

<style scoped lang="scss">
.help-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.custom-navbar {
  background-color: #ffffff;
  border-bottom: 1rpx solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.back-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  font-weight: 300;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
}

.help-content {
  flex: 1;
  padding: 30rpx;
}

.help-section {
  margin-bottom: 60rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 40rpx;
}

.section-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 30rpx;
}

.tutorial-item {
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.tutorial-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 12rpx;
}

.tutorial-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.faq-item {
  margin-bottom: 20rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  overflow: hidden;
}

.faq-question {
  padding: 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #eeeeee;
  }
}

.faq-icon {
  font-size: 24rpx;
  color: #007aff;
  width: 32rpx;
  text-align: center;
}

.faq-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}

.faq-answer {
  padding: 0 24rpx 24rpx 72rpx;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.scene-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.scene-icon {
  font-size: 48rpx;
  width: 80rpx;
  text-align: center;
}

.scene-content {
  flex: 1;
}

.scene-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 8rpx;
}

.scene-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}
</style>

