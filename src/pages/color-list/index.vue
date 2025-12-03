<template>
  <view class="container">
    <!-- 选项卡 -->
    <view class="tabs">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'photographer' }"
        @click="switchTab('photographer')"
      >
        <text class="tab-text">摄影师</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'creator' }"
        @click="switchTab('creator')"
      >
        <text class="tab-text">摄影达人</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'halloween' }"
        @click="switchTab('halloween')"
      >
        <text class="tab-text">万圣节</text>
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'custom' }"
        @click="switchTab('custom')"
      >
        <text class="tab-text">自定义</text>
      </view>
    </view>

    <!-- 颜色列表 -->
    <view class="color-list">
      <!-- 自定义标签为空时的提示 -->
      <view v-if="activeTab === 'custom' && currentColorList.length === 0" class="empty-view">
        <text class="empty-icon">🎨</text>
        <text class="empty-text">暂无自定义颜色</text>
        <text class="empty-hint">去设置页面创建自定义颜色吧~</text>
      </view>
      
      <view
        v-for="(color, index) in currentColorList"
        :key="index"
        class="color-item"
      >
        <view
          class="color-card-large"
          :class="{ 'light-color': isLightColor(color) }"
          :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }"
        />
        <view class="color-info">
          <view class="color-name">{{ color.name }}</view>
          <view class="color-meta">
            <text v-if="color.temperature" class="meta-item">色温: {{ color.temperature }}</text>
            <text class="meta-item">RGB: ({{ color.r }}, {{ color.g }}, {{ color.b }})</text>
          </view>
          <view class="color-description">
            <view v-if="getSceneText(color)" class="description-line">
              <text class="description-label">适用场景：</text>
              <text class="description-text">{{ getSceneText(color) }}</text>
            </view>
            <view v-if="activeTab !== 'custom'" class="description-line">
              <text class="description-label">效果：</text>
              <text class="description-text">{{ getEffectText(color) }}</text>
            </view>
          </view>
        </view>
        <view class="action-buttons">
          <view
            class="favorite-btn"
            :class="{ favorited: isColorFavorited(color) }"
            @click="toggleFavorite(color)"
          >
            <text class="favorite-icon">{{ isColorFavorited(color) ? '★' : '☆' }}</text>
          </view>
          <view
            class="select-btn"
            :class="{ selected: isColorSelected(color) }"
            @click="selectColor(color)"
          >
            <text class="select-icon">✓</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

interface ColorDetail {
  name: string;
  temperature?: string;
  hex?: string;
  r: number;
  g: number;
  b: number;
  description: string;
}

const activeTab = ref<'photographer' | 'creator' | 'halloween' | 'custom'>('photographer');
const currentColor = ref<{ r: number; g: number; b: number } | null>(null);
const favoriteColors = ref<ColorDetail[]>([]);
const customColors = ref<ColorDetail[]>([]);

// 摄影师颜色列表
const photographerColors: ColorDetail[] = [
  {
    name: '标准日光',
    temperature: '5600K',
    r: 255,
    g: 255,
    b: 255,
    description: '正午阳光，最常用主光，白平衡基准'
  },
  {
    name: '暖调补光（柔光）',
    temperature: '4500K',
    r: 255,
    g: 245,
    b: 235,
    description: '室内自然光，肤色更柔和温暖'
  },
  {
    name: '钨丝灯（室内暖光）',
    temperature: '3200K',
    r: 255,
    g: 214,
    b: 170,
    description: '影视常用，营造温馨/复古氛围'
  },
  {
    name: '黄金时刻（日出日落）',
    temperature: '2500K',
    r: 255,
    g: 190,
    b: 120,
    description: '强烈暖调，用于剪影或情绪渲染'
  },
  {
    name: '阴天 daylight',
    temperature: '6500K',
    r: 230,
    g: 240,
    b: 255,
    description: '偏冷蓝调，模拟多云天气'
  },
  {
    name: '校正绿色荧光（去绿）',
    temperature: '—',
    r: 255,
    g: 230,
    b: 240,
    description: '用于抵消办公室荧光灯的绿色偏色（常配合品红 gel）'
  },
  {
    name: '电影夜景（月光感）',
    temperature: '7500K+',
    r: 200,
    g: 220,
    b: 255,
    description: '冷蓝色，模拟月光或夜晚街道'
  },
  {
    name: '肤色优化（浅琥珀）',
    temperature: '~4300K',
    r: 255,
    g: 235,
    b: 210,
    description: '商业人像常用，提亮肤色不显黄'
  },
  {
    name: '戏剧性暖背光',
    temperature: '2000K',
    r: 255,
    g: 160,
    b: 80,
    description: '强烈橙红，用于轮廓光或夕阳效果'
  },
  {
    name: '中性灰（测光/校准）',
    temperature: 'N/A',
    r: 128,
    g: 128,
    b: 128,
    description: '非补光色，但用于灰卡白平衡校准'
  }
];

// 摄影达人颜色列表
const creatorColors: ColorDetail[] = [
  {
    name: '奶白色',
    hex: '#FFF8F0',
    r: 255,
    g: 248,
    b: 240,
    description: '自拍、美妆、直播 - 肤色透亮，不黄不蓝，最安全显白'
  },
  {
    name: '日落暖橘',
    hex: '#FFC88C',
    r: 255,
    g: 200,
    b: 140,
    description: '氛围感vlog、情侣照 - 温暖高级，像黄金时刻阳光'
  },
  {
    name: '柔雾粉',
    hex: '#FFDCDD',
    r: 255,
    g: 220,
    b: 225,
    description: '少女感自拍、开箱视频 - 甜美减龄，不荧光不土气'
  },
  {
    name: '日光冷白',
    hex: '#E6F0FF',
    r: 230,
    g: 240,
    b: 255,
    description: '学习直播、产品展示 - 清晰专业，略带冷调提神'
  },
  {
    name: '梦幻薰衣草紫',
    hex: '#DCBEFF',
    r: 220,
    g: 190,
    b: 255,
    description: '变装、音乐视频、夜拍 - 神秘浪漫，比荧光紫更高级'
  },
  {
    name: '薄荷冰蓝',
    hex: '#C8F0FF',
    r: 200,
    g: 240,
    b: 255,
    description: '夏日清凉、科技感内容 - 清爽干净，不显脸色发青'
  },
  {
    name: '复古暖黄',
    hex: '#FFDCAA',
    r: 255,
    g: 220,
    b: 170,
    description: '胶片感、咖啡馆打卡 - 怀旧电影感，柔和不刺眼'
  },
  {
    name: '燕麦奶油杏',
    hex: '#FFEFD7',
    r: 255,
    g: 235,
    b: 215,
    description: '穿搭博主、家居拍摄 - 低饱和温柔，ins风经典色'
  },
  {
    name: '落日橙红',
    hex: '#FFA064',
    r: 255,
    g: 160,
    b: 100,
    description: '剪影、情绪短片、户外 - 强烈氛围，适合背光轮廓'
  },
  {
    name: '中性纯净白',
    hex: '#FAFAFA',
    r: 250,
    g: 250,
    b: 250,
    description: '网课、面试、证件照 - 接近自然光，真实无修饰'
  }
];

// 万圣节颜色列表
const halloweenColors: ColorDetail[] = [
  {
    name: '血猩红',
    hex: '#8B0000',
    r: 139,
    g: 0,
    b: 0,
    description: '浓稠干涸的血液，比鲜红更阴森 - 吸血鬼妆、伤口特效、背景光'
  },
  {
    name: '毒南瓜橙',
    hex: '#FF6600',
    r: 255,
    g: 102,
    b: 0,
    description: '高饱和荧光橙，像发光的南瓜灯 - 南瓜雕刻、节日主视觉、服装'
  },
  {
    name: '墓地黑绿',
    hex: '#003300',
    r: 0,
    g: 51,
    b: 0,
    description: '深夜墓园苔藓色，压抑又诡异 - 背景布、道具、暗调滤镜'
  },
  {
    name: '幽灵青白',
    hex: '#C8DCFF',
    r: 200,
    g: 220,
    b: 255,
    description: '半透明鬼魂的冷光，带蓝调 - 幽灵特效、面部打光、烟雾'
  },
  {
    name: '巫毒紫',
    hex: '#4B0082',
    r: 75,
    g: 0,
    b: 130,
    description: '深邃神秘的靛紫，像魔法药水 - 巫师袍、魔法阵、灯光氛围'
  },
  {
    name: '腐尸绿',
    hex: '#669900',
    r: 102,
    g: 153,
    b: 0,
    description: '发霉尸体或毒液的颜色，令人不适 - 丧尸妆、怪物特效、恐怖海报'
  },
  {
    name: '午夜深黑',
    hex: '#0A0A0F',
    r: 10,
    g: 10,
    b: 15,
    description: '不是纯黑，带一丝蓝灰，更真实 - 背景底色、阴影增强、避免死黑'
  },
  {
    name: '蜡烛昏黄',
    hex: '#FFDC96',
    r: 255,
    g: 220,
    b: 150,
    description: '微弱摇曳的烛光，营造不安感 - 室内布光、手持道具、复古感'
  },
  {
    name: '电击荧光绿',
    hex: '#32FF32',
    r: 50,
    g: 255,
    b: 50,
    description: '超高饱和，像放射性物质 - 外星怪物、科幻恐怖、霓虹灯牌'
  },
  {
    name: '骸骨惨白',
    hex: '#F5F5F5',
    r: 245,
    g: 245,
    b: 245,
    description: '干燥骷髅的哑光白，非亮白 - 骷髅道具、面具、高光提亮'
  }
];

// 当前显示的颜色列表
const currentColorList = computed(() => {
  if (activeTab.value === 'photographer') {
    return photographerColors;
  }
  if (activeTab.value === 'creator') {
    return creatorColors;
  }
  if (activeTab.value === 'halloween') {
    return halloweenColors;
  }
  if (activeTab.value === 'custom') {
    return customColors.value;
  }
  return photographerColors;
});

onLoad(() => {
  // 获取当前选中的颜色
  const savedColor = uni.getStorageSync('currentColor');
  if (savedColor) {
    currentColor.value = savedColor;
  }
  // 加载收藏的颜色
  loadFavorites();
  // 加载自定义颜色
  loadCustomColors();
});

const loadFavorites = () => {
  const saved = uni.getStorageSync('favoriteColors');
  if (saved && Array.isArray(saved)) {
    favoriteColors.value = saved;
  }
};

const loadCustomColors = () => {
  const saved = uni.getStorageSync('customColors');
  if (saved && Array.isArray(saved)) {
    customColors.value = saved;
  } else {
    customColors.value = [];
  }
};

onShow(() => {
  // 重新加载自定义颜色（可能已更新）
  loadCustomColors();
});

const isColorFavorited = (color: ColorDetail) => {
  return favoriteColors.value.some(
    (fav) => fav.r === color.r && fav.g === color.g && fav.b === color.b
  );
};

const toggleFavorite = (color: ColorDetail) => {
  const index = favoriteColors.value.findIndex(
    (fav) => fav.r === color.r && fav.g === color.g && fav.b === color.b
  );
  if (index > -1) {
    // 取消收藏
    favoriteColors.value.splice(index, 1);
  } else {
    // 添加收藏
    favoriteColors.value.push({ ...color });
  }
  // 保存到本地存储
  uni.setStorageSync('favoriteColors', favoriteColors.value);
};

const switchTab = (tab: 'photographer' | 'creator' | 'halloween' | 'custom') => {
  activeTab.value = tab;
};

const isColorSelected = (color: ColorDetail) => {
  if (!currentColor.value) return false;
  return (
    currentColor.value.r === color.r &&
    currentColor.value.g === color.g &&
    currentColor.value.b === color.b
  );
};

const selectColor = (color: ColorDetail) => {
  // 保存选中的颜色到本地存储
  const selectedColor = {
    r: color.r,
    g: color.g,
    b: color.b
  };
  uni.setStorageSync('selectedColor', selectedColor);
  currentColor.value = selectedColor;
  // 记录到常用颜色
  recordCommonColor(color);
  // 返回设置页面
  uni.navigateBack();
};

const recordCommonColor = (color: ColorDetail) => {
  let commonColors: ColorDetail[] = uni.getStorageSync('commonColors') || [];
  // 检查是否已存在
  const exists = commonColors.some(
    (c) => c.r === color.r && c.g === color.g && c.b === color.b
  );
  if (!exists) {
    // 添加到最前面
    commonColors.unshift({ ...color });
    // 最多保存20个
    if (commonColors.length > 20) {
      commonColors = commonColors.slice(0, 20);
    }
    uni.setStorageSync('commonColors', commonColors);
  }
};

// 判断是否为浅色（用于添加边框）
const isLightColor = (color: ColorDetail): boolean => {
  // 计算亮度 (使用相对亮度公式)
  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  // 如果亮度大于200，认为是浅色
  return brightness > 200;
};

// 解析描述，获取适用场景
const getSceneText = (color: ColorDetail): string => {
  const desc = color.description || '';
  const parts = desc.split(' - ');
  if (parts.length > 1) {
    // 万圣节颜色的格式是：效果 - 适用场景，需要取第二部分
    const isHalloween = halloweenColors.some(
      (c) => c.r === color.r && c.g === color.g && c.b === color.b
    );
    if (isHalloween) {
      return parts[1].trim();
    }
    // 其他颜色格式是：适用场景 - 效果，取第一部分
    return parts[0].trim();
  }
  return '';
};

// 解析描述，获取效果
const getEffectText = (color: ColorDetail): string => {
  const desc = color.description || '';
  const parts = desc.split(' - ');
  if (parts.length > 1) {
    // 万圣节颜色的格式是：效果 - 适用场景，需要取第一部分
    const isHalloween = halloweenColors.some(
      (c) => c.r === color.r && c.g === color.g && c.b === color.b
    );
    if (isHalloween) {
      return parts[0].trim();
    }
    // 其他颜色格式是：适用场景 - 效果，取第二部分
    return parts[1].trim();
  }
  return desc.trim();
};
</script>

<style scoped lang="scss">
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  padding-top: calc(20rpx + constant(safe-area-inset-top));
  padding-top: calc(20rpx + env(safe-area-inset-top));
  padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.tabs {
  display: flex;
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 8rpx;
  margin: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  gap: 8rpx;
  position: sticky;
  top: calc(20rpx + constant(safe-area-inset-top));
  top: calc(20rpx + env(safe-area-inset-top));
  z-index: 10;
}

.tab-item {
  flex: 1;
  padding: 20rpx;
  text-align: center;
  border-radius: 12rpx;
  transition: all 0.3s ease;
  cursor: pointer;

  &.active {
    background-color: #007aff;

    .tab-text {
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.tab-text {
  font-size: 30rpx;
  color: #666;
  transition: color 0.3s ease;
}

.color-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 20rpx;
  flex: 1;
  overflow-y: auto;
}

.color-item {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  padding-right: 40rpx;
  display: flex;
  gap: 30rpx;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

.color-card-large {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e5e5e5;
  flex-shrink: 0;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

  // 浅色/白色色卡添加深色边框
  &.light-color {
    border: 2rpx solid #d0d0d0;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
  }
}

.color-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  min-width: 0;
  padding-right: 20rpx;
}

.color-name {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}

.color-meta {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.meta-item {
  font-size: 26rpx;
  color: #666;
}

.color-description {
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  margin-top: 8rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.description-line {
  display: flex;
  flex-wrap: wrap;
  line-height: 1.4;
}

.description-label {
  font-weight: 500;
  color: #666;
  margin-right: 8rpx;
  flex-shrink: 0;
}

.description-text {
  color: #333;
  flex: 1;
}

.select-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #e5e5e5;
  border: 2rpx solid #cccccc;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &.selected {
    background-color: #007aff;
    border-color: #007aff;

    .select-icon {
      color: #ffffff;
      opacity: 1;
    }
  }

  &:active {
    transform: scale(0.95);
  }
}

.select-icon {
  color: #999999;
  font-size: 36rpx;
  font-weight: bold;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.select-btn.selected .select-icon {
  color: #ffffff;
  opacity: 1;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  flex-shrink: 0;
}

.favorite-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 2rpx solid #e5e5e5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &.favorited {
    background-color: #ffd700;
    border-color: #ffd700;
  }

  &:active {
    transform: scale(0.95);
  }
}

.favorite-icon {
  font-size: 36rpx;
  color: #999999;
  transition: all 0.3s ease;
}

.favorite-btn.favorited .favorite-icon {
  color: #ffffff;
}

.empty-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  min-height: 400rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 500;
  margin-bottom: 16rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #999;
  text-align: center;
}
</style>
