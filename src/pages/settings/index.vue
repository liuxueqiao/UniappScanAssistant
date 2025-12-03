<template>
  <view class="settings-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: `${statusBarHeight}px` }">
      <view class="navbar-content">
        <view class="navbar-left">
          <view class="back-btn" @click="goBack">
            <text class="back-icon">‹</text>
          </view>
          <text class="navbar-title">设置</text>
        </view>
        <view class="help-btn" @click="goToContact">
          <text class="help-icon">?</text>
        </view>
      </view>
    </view>
    <view class="settings-content">
      <!-- 模式选择 -->
      <view class="setting-item">
        <view class="setting-label">模式选择</view>
        <view class="mode-selector">
          <view
            class="mode-item"
            :class="{ active: mode === 'common' }"
            @click="switchMode('common')"
          >
            <text class="mode-text">常用</text>
          </view>
          <view
            class="mode-item"
            :class="{ active: mode === 'favorite' }"
            @click="switchMode('favorite')"
          >
            <text class="mode-text">收藏</text>
          </view>
          <view
            class="mode-item"
            :class="{ active: mode === 'dynamic' }"
            @click="switchMode('dynamic')"
          >
            <text class="mode-text">百变光源</text>
          </view>
        </view>
      </view>

      <!-- 常用模式 -->
      <view v-if="mode === 'common'" class="setting-item">
        <view class="setting-label-row">
          <text class="setting-label">常用</text>
          <text class="detail-btn" @click="goToColorList">色彩库</text>
        </view>
        
        <!-- 常用颜色卡片 -->
        <view class="color-cards">
          <view
            v-for="(color, index) in commonColors"
            :key="index"
            class="color-card"
            :class="{ active: isColorActive(color), 'light-color': isLightColor(color) }"
            :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }"
            @click="selectColor(color)"
          />
        </view>

        <!-- 自定义颜色 -->
        <view class="custom-color-section">
          <view class="custom-color-label">自定义颜色</view>
          <view class="custom-color-preview" :style="{ backgroundColor: `rgb(${localColor.r}, ${localColor.g}, ${localColor.b})` }" />
          <view class="rgb-controls">
            <view class="rgb-item">
              <text class="rgb-label">R</text>
              <view class="slider-wrapper">
                <slider
                  :value="localColor.r"
                  min="0"
                  max="255"
                  step="1"
                  activeColor="#ff0000"
                  backgroundColor="#e5e5e5"
                  block-color="#ffffff"
                  block-size="20"
                  @change="(e) => handleRgbChange('r', e.detail.value)"
                />
              </view>
              <input
                class="rgb-input"
                type="number"
                :value="localColor.r"
                min="0"
                max="255"
                @blur="(e) => handleRgbInput('r', e)"
                @confirm="(e) => handleRgbInput('r', e)"
              />
            </view>
            <view class="rgb-item">
              <text class="rgb-label">G</text>
              <view class="slider-wrapper">
                <slider
                  :value="localColor.g"
                  min="0"
                  max="255"
                  step="1"
                  activeColor="#00ff00"
                  backgroundColor="#e5e5e5"
                  block-color="#ffffff"
                  block-size="20"
                  @change="(e) => handleRgbChange('g', e.detail.value)"
                />
              </view>
              <input
                class="rgb-input"
                type="number"
                :value="localColor.g"
                min="0"
                max="255"
                @blur="(e) => handleRgbInput('g', e)"
                @confirm="(e) => handleRgbInput('g', e)"
              />
            </view>
            <view class="rgb-item">
              <text class="rgb-label">B</text>
              <view class="slider-wrapper">
                <slider
                  :value="localColor.b"
                  min="0"
                  max="255"
                  step="1"
                  activeColor="#0000ff"
                  backgroundColor="#e5e5e5"
                  block-color="#ffffff"
                  block-size="20"
                  @change="(e) => handleRgbChange('b', e.detail.value)"
                />
              </view>
              <input
                class="rgb-input"
                type="number"
                :value="localColor.b"
                min="0"
                max="255"
                @blur="(e) => handleRgbInput('b', e)"
                @confirm="(e) => handleRgbInput('b', e)"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 收藏模式 -->
      <view v-if="mode === 'favorite'" class="setting-item">
        <view class="setting-label-row">
          <text class="setting-label">收藏</text>
          <text class="detail-btn" @click="goToColorList">色彩库</text>
        </view>
        
        <view v-if="favoriteColors.length === 0" class="empty-tip">
          <text>暂无收藏的颜色，去色彩库收藏吧~</text>
        </view>
        
        <!-- 收藏颜色卡片 -->
        <view v-else class="color-cards">
          <view
            v-for="(color, index) in favoriteColors"
            :key="index"
            class="color-card"
            :class="{ active: isColorActive(color), 'light-color': isLightColor(color) }"
            :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }"
            @click="selectColor(color)"
          />
        </view>
      </view>

      <!-- 百变光源模式 -->
      <view v-if="mode === 'dynamic'" class="setting-item">
        <view class="setting-label">百变光源</view>
        
        <view class="dynamic-controls">
          <view class="switch-row">
            <text class="switch-label">开启百变光源</text>
            <switch
              :checked="dynamicEnabled"
              @change="handleDynamicSwitch"
              color="#007aff"
            />
          </view>

          <view v-if="dynamicEnabled" class="dynamic-content">
            <view class="setting-label">选择颜色</view>
            
            <view class="color-cards">
              <view
                v-for="(color, index) in allAvailableColors"
                :key="index"
                class="color-card"
                :class="{ selected: isDynamicColorSelected(color), 'light-color': isLightColor(color) }"
                :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }"
                @click="toggleDynamicColor(color)"
              />
            </view>

            <view v-if="selectedDynamicColors.length === 0" class="empty-tip">
              <text>请至少选择一个颜色</text>
            </view>

            <view class="frequency-input">
              <text class="frequency-label">切换频率（秒）</text>
              <input
                class="frequency-input-field"
                type="number"
                :value="switchFrequency"
                min="0.5"
                max="60"
                step="0.5"
                @blur="(e) => handleFrequencyInput(e)"
                @confirm="(e) => handleFrequencyInput(e)"
              />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="settings-footer">
      <button class="confirm-btn" @click="handleConfirm">确定</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';

interface Color {
  r: number;
  g: number;
  b: number;
}

interface ColorDetail extends Color {
  name: string;
  temperature?: string;
  description: string;
}

type Mode = 'common' | 'favorite' | 'dynamic';

const mode = ref<Mode>('common');
const localColor = ref<Color>({ r: 255, g: 255, b: 255 });
const commonColors = ref<ColorDetail[]>([]);
const favoriteColors = ref<ColorDetail[]>([]);
const dynamicEnabled = ref(false);
const selectedDynamicColors = ref<ColorDetail[]>([]);
const switchFrequency = ref(2);
const statusBarHeight = ref(0);

// 摄影师颜色列表（完整）
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
    r: 255,
    g: 248,
    b: 240,
    description: '自拍、美妆、直播 - 肤色透亮，不黄不蓝，最安全显白'
  },
  {
    name: '日落暖橘',
    r: 255,
    g: 200,
    b: 140,
    description: '氛围感vlog、情侣照 - 温暖高级，像黄金时刻阳光'
  },
  {
    name: '柔雾粉',
    r: 255,
    g: 220,
    b: 225,
    description: '少女感自拍、开箱视频 - 甜美减龄，不荧光不土气'
  },
  {
    name: '日光冷白',
    r: 230,
    g: 240,
    b: 255,
    description: '学习直播、产品展示 - 清晰专业，略带冷调提神'
  },
  {
    name: '梦幻薰衣草紫',
    r: 220,
    g: 190,
    b: 255,
    description: '变装、音乐视频、夜拍 - 神秘浪漫，比荧光紫更高级'
  },
  {
    name: '薄荷冰蓝',
    r: 200,
    g: 240,
    b: 255,
    description: '夏日清凉、科技感内容 - 清爽干净，不显脸色发青'
  },
  {
    name: '复古暖黄',
    r: 255,
    g: 220,
    b: 170,
    description: '胶片感、咖啡馆打卡 - 怀旧电影感，柔和不刺眼'
  },
  {
    name: '燕麦奶油杏',
    r: 255,
    g: 235,
    b: 215,
    description: '穿搭博主、家居拍摄 - 低饱和温柔，ins风经典色'
  },
  {
    name: '落日橙红',
    r: 255,
    g: 160,
    b: 100,
    description: '剪影、情绪短片、户外 - 强烈氛围，适合背光轮廓'
  },
  {
    name: '中性纯净白',
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
    r: 139,
    g: 0,
    b: 0,
    description: '浓稠干涸的血液，比鲜红更阴森 - 吸血鬼妆、伤口特效、背景光'
  },
  {
    name: '毒南瓜橙',
    r: 255,
    g: 102,
    b: 0,
    description: '高饱和荧光橙，像发光的南瓜灯 - 南瓜雕刻、节日主视觉、服装'
  },
  {
    name: '墓地黑绿',
    r: 0,
    g: 51,
    b: 0,
    description: '深夜墓园苔藓色，压抑又诡异 - 背景布、道具、暗调滤镜'
  },
  {
    name: '幽灵青白',
    r: 200,
    g: 220,
    b: 255,
    description: '半透明鬼魂的冷光，带蓝调 - 幽灵特效、面部打光、烟雾'
  },
  {
    name: '巫毒紫',
    r: 75,
    g: 0,
    b: 130,
    description: '深邃神秘的靛紫，像魔法药水 - 巫师袍、魔法阵、灯光氛围'
  },
  {
    name: '腐尸绿',
    r: 102,
    g: 153,
    b: 0,
    description: '发霉尸体或毒液的颜色，令人不适 - 丧尸妆、怪物特效、恐怖海报'
  },
  {
    name: '午夜深黑',
    r: 10,
    g: 10,
    b: 15,
    description: '不是纯黑，带一丝蓝灰，更真实 - 背景底色、阴影增强、避免死黑'
  },
  {
    name: '蜡烛昏黄',
    r: 255,
    g: 220,
    b: 150,
    description: '微弱摇曳的烛光，营造不安感 - 室内布光、手持道具、复古感'
  },
  {
    name: '电击荧光绿',
    r: 50,
    g: 255,
    b: 50,
    description: '超高饱和，像放射性物质 - 外星怪物、科幻恐怖、霓虹灯牌'
  },
  {
    name: '骸骨惨白',
    r: 245,
    g: 245,
    b: 245,
    description: '干燥骷髅的哑光白，非亮白 - 骷髅道具、面具、高光提亮'
  }
];

// 默认摄影师颜色（用于初始化常用颜色）
const defaultPhotographerColors = photographerColors;

// 获取所有可用颜色（用于百变光源选择）- 包含色彩库中的所有颜色
const allAvailableColors = computed(() => {
  const all: ColorDetail[] = [];
  // 合并所有色彩库颜色
  all.push(...photographerColors);
  all.push(...creatorColors);
  all.push(...halloweenColors);
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

onLoad(() => {
  // 获取状态栏高度
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  
  // 加载常用颜色
  loadCommonColors();
  // 加载收藏颜色
  loadFavoriteColors();
  // 加载百变光源设置
  loadDynamicSettings();
  
  // 尝试从首页获取当前颜色
  try {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      const prevPage = pages[pages.length - 2];
      if (prevPage && (prevPage as any).$vm) {
        const prevColor = (prevPage as any).$vm.currentColor;
        if (prevColor) {
          localColor.value = { ...prevColor };
          return;
        }
      }
    }
  } catch (e) {
    console.log('获取上一页颜色失败:', e);
  }
  
  // 如果获取不到，尝试从存储中获取
  const savedColor = uni.getStorageSync('currentColor');
  if (savedColor) {
    localColor.value = savedColor;
  }
  
  // 加载当前模式
  const savedMode = uni.getStorageSync('colorMode');
  if (savedMode) {
    mode.value = savedMode;
  }
});

const loadCommonColors = () => {
  const saved = uni.getStorageSync('commonColors');
  if (saved && Array.isArray(saved) && saved.length > 0) {
    commonColors.value = saved;
  } else {
    // 如果没有常用颜色，使用默认摄影师颜色
    commonColors.value = [...defaultPhotographerColors];
  }
};

const loadFavoriteColors = () => {
  const saved = uni.getStorageSync('favoriteColors');
  if (saved && Array.isArray(saved)) {
    favoriteColors.value = saved;
  }
};

const loadDynamicSettings = () => {
  const saved = uni.getStorageSync('dynamicSettings');
  if (saved) {
    dynamicEnabled.value = saved.enabled || false;
    selectedDynamicColors.value = saved.colors || [];
    switchFrequency.value = saved.frequency || 2;
  }
};

const switchMode = (newMode: Mode) => {
  mode.value = newMode;
  uni.setStorageSync('colorMode', newMode);
};

onShow(() => {
  // 重新加载收藏颜色（可能已更新）
  loadFavoriteColors();
  // 重新加载常用颜色（可能已更新）
  loadCommonColors();
  
  // 监听从色彩列表页面返回的颜色选择
  const selectedColor = uni.getStorageSync('selectedColor');
  if (selectedColor) {
    localColor.value = selectedColor;
    uni.removeStorageSync('selectedColor');
  }
});

const handleRgbChange = (channel: 'r' | 'g' | 'b', value: number) => {
  localColor.value[channel] = Math.max(0, Math.min(255, Number(value)));
};

const handleRgbInput = (channel: 'r' | 'g' | 'b', e: any) => {
  const value = parseInt(e.detail?.value || e.target?.value || '0', 10);
  if (!isNaN(value)) {
    localColor.value[channel] = Math.max(0, Math.min(255, value));
  }
};

const selectColor = (color: ColorDetail) => {
  localColor.value = {
    r: color.r,
    g: color.g,
    b: color.b
  };
};

const isColorActive = (color: ColorDetail) => {
  return (
    localColor.value.r === color.r &&
    localColor.value.g === color.g &&
    localColor.value.b === color.b
  );
};

const isDynamicColorSelected = (color: ColorDetail) => {
  return selectedDynamicColors.value.some(
    (c) => c.r === color.r && c.g === color.g && c.b === color.b
  );
};

const toggleDynamicColor = (color: ColorDetail) => {
  const index = selectedDynamicColors.value.findIndex(
    (c) => c.r === color.r && c.g === color.g && c.b === color.b
  );
  if (index > -1) {
    selectedDynamicColors.value.splice(index, 1);
  } else {
    selectedDynamicColors.value.push({ ...color });
  }
};

const handleDynamicSwitch = (e: any) => {
  dynamicEnabled.value = e.detail.value;
};

const handleFrequencyInput = (e: any) => {
  const value = parseFloat(e.detail?.value || e.target?.value || '2');
  if (!isNaN(value)) {
    switchFrequency.value = Math.max(0.5, Math.min(60, value));
  }
};

const goToColorList = () => {
  // 保存当前颜色，以便色彩列表页面判断选中状态
  uni.setStorageSync('currentColor', { ...localColor.value });
  uni.navigateTo({
    url: '/pages/color-list/index'
  });
};

const goToContact = () => {
  uni.navigateTo({
    url: '/pages/contact/index'
  });
};

const goBack = () => {
  uni.navigateBack();
};

// 判断是否为浅色（用于添加边框）
const isLightColor = (color: ColorDetail): boolean => {
  // 计算亮度 (使用相对亮度公式)
  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  // 如果亮度大于200，认为是浅色
  return brightness > 200;
};

const handleConfirm = () => {
  // 保存模式设置
  uni.setStorageSync('colorMode', mode.value);
  
  // 保存百变光源设置
  if (mode.value === 'dynamic') {
    uni.setStorageSync('dynamicSettings', {
      enabled: dynamicEnabled.value,
      colors: selectedDynamicColors.value,
      frequency: switchFrequency.value
    });
    
    // 如果开启了百变光源，启动循环
    if (dynamicEnabled.value && selectedDynamicColors.value.length > 0) {
      uni.setStorageSync('dynamicMode', true);
      uni.$emit('startDynamicLight', {
        colors: selectedDynamicColors.value,
        frequency: switchFrequency.value
      });
    } else {
      uni.setStorageSync('dynamicMode', false);
      uni.$emit('stopDynamicLight');
    }
  } else {
    // 关闭百变光源
    uni.setStorageSync('dynamicMode', false);
    uni.$emit('stopDynamicLight');
    
    // 保存当前颜色到存储
    uni.setStorageSync('currentColor', { ...localColor.value });
    // 通过事件通知首页更新颜色
    uni.$emit('colorChanged', { ...localColor.value });
  }
  
  uni.navigateBack();
};
</script>

<style scoped lang="scss">
.settings-page {
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  justify-content: space-between;
  align-items: center;
  padding: 0 40rpx;
  position: relative;
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
  transition: all 0.3s ease;

  &:active {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

.back-icon {
  font-size: 48rpx;
  color: #333;
  font-weight: 300;
  line-height: 1;
}

.navbar-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.help-btn {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #e5e5e5;
    transform: scale(0.95);
  }
}

.help-icon {
  font-size: 36rpx;
  color: #666;
  font-weight: bold;
}

.settings-content {
  flex: 1;
  padding: 40rpx;
  overflow-y: auto;
  padding-bottom: 20rpx;
}

.setting-item {
  margin-bottom: 60rpx;
}

.mode-selector {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.mode-item {
  flex: 1;
  padding: 24rpx;
  text-align: center;
  border-radius: 12rpx;
  background-color: #f5f5f5;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &.active {
    background-color: #007aff;
    border-color: #007aff;

    .mode-text {
      color: #ffffff;
      font-weight: 600;
    }
  }
}

.mode-text {
  font-size: 28rpx;
  color: #666;
  transition: color 0.3s ease;
}

.empty-tip {
  padding: 60rpx 20rpx;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}

.dynamic-controls {
  margin-top: 20rpx;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
}

.switch-label {
  font-size: 30rpx;
  color: #333;
}

.dynamic-content {
  margin-top: 30rpx;
}

.frequency-input {
  margin-top: 40rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.frequency-label {
  font-size: 28rpx;
  color: #333;
  min-width: 200rpx;
}

.frequency-input-field {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #333;
  text-align: center;
  background-color: #ffffff;
}

.setting-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.setting-label {
  font-size: 32rpx;
  font-weight: 500;
  color: #333;
}

.detail-btn {
  font-size: 28rpx;
  color: #007aff;
  padding: 8rpx 20rpx;
  border: 1rpx solid #007aff;
  border-radius: 8rpx;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #007aff;
    color: #ffffff;
  }
}

.slider-wrapper {
  flex: 1;
  width: 100%;
  min-width: 0;
}

.slider-wrapper slider {
  width: 100%;
}

.color-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.color-card {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  border: 4rpx solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);

  // 浅色/白色色卡添加深色边框
  &.light-color {
    border: 2rpx solid #d0d0d0;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.15);
  }

  &.active {
    border-color: #007aff;
    transform: scale(1.1);
    box-shadow: 0 4rpx 8rpx rgba(0, 122, 255, 0.3);
  }

  &.selected {
    border-color: #007aff;
    border-width: 4rpx;
    box-shadow: 0 0 0 4rpx rgba(0, 122, 255, 0.2);
  }
}

.custom-color-section {
  margin-top: 40rpx;
}

.custom-color-label {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 20rpx;
}

.custom-color-preview {
  width: 100%;
  height: 120rpx;
  border-radius: 12rpx;
  margin-bottom: 30rpx;
  border: 2rpx solid #e5e5e5;
  box-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.rgb-controls {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.rgb-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.rgb-item .slider-wrapper {
  flex: 1;
  width: 100%;
  min-width: 0;
}

.rgb-item .slider-wrapper slider {
  width: 100%;
}

.rgb-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  min-width: 40rpx;
}

.rgb-input {
  width: 100rpx;
  height: 60rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #333;
  text-align: center;
  background-color: #ffffff;
}

.settings-footer {
  padding: 40rpx;
  padding-left: 40rpx;
  padding-right: 40rpx;
  padding-bottom: calc(40rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
  border-top: 1rpx solid #e5e5e5;
  background-color: #ffffff;
  position: sticky;
  bottom: 0;
  z-index: 10;
  flex-shrink: 0;
}

.confirm-btn {
  width: 100%;
  height: 88rpx;
  background-color: #007aff;
  color: #ffffff;
  border: none;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #0056b3;
  }
}
</style>
