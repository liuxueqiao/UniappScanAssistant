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
        <view class="navbar-right">
          <view class="help-btn" @click="goToHelp">
            <text class="help-icon">?</text>
          </view>
          <view class="help-btn" @click="goToContact">
            <text class="help-icon">📧</text>
          </view>
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
          <view
            class="mode-item"
            :class="{ active: mode === 'scene' }"
            @click="switchMode('scene')"
          >
            <text class="mode-text">场景模式</text>
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
          <view class="custom-color-header">
            <text class="custom-color-label">自定义颜色</text>
            <view class="save-custom-color-btn" @click="showSaveColorModal">
              <text class="save-btn-text">保存为自定义</text>
            </view>
          </view>
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

      <!-- 保存自定义颜色弹窗组件 -->
      <SaveColorModal
        :visible="showSaveModal"
        :color="localColor"
        @confirm="handleSaveColorConfirm"
        @cancel="closeSaveModal"
      />

      <!-- 颜色选择弹窗组件 -->
      <ColorPickerModal
        :visible="showColorPicker"
        :selected-colors="selectedDynamicColors"
        :default-colors="halloweenColors"
        :all-colors="allAvailableColors"
        @confirm="handleColorPickerConfirm"
        @cancel="closeColorPicker"
      />

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
            <view class="frequency-presets">
              <view
                class="preset-btn"
                :class="{ active: switchFrequency === 1 }"
                @click="setFrequency(1)"
              >
                <text class="preset-text">节日</text>
              </view>
              <view
                class="preset-btn"
                :class="{ active: switchFrequency === 3 }"
                @click="setFrequency(3)"
              >
                <text class="preset-text">呼吸灯</text>
              </view>
              <view
                class="preset-btn"
                :class="{ active: switchFrequency === 0.2 }"
                @click="setFrequency(0.2)"
              >
                <text class="preset-text">舞台演出</text>
              </view>
              <view
                class="preset-btn"
                :class="{ active: switchFrequency === 0.08 }"
                @click="setFrequency(0.08)"
              >
                <text class="preset-text">爆闪</text>
              </view>
            </view>

            <view class="setting-label-row color-select-row">
              <text class="setting-label">选择颜色({{ selectedDynamicColors.length }})</text>
              <view class="add-color-btn" @click="showColorPickerModal">
                <text class="add-color-text">添加颜色</text>
              </view>
            </view>
            
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

            <!-- 渐变效果开关 -->
            <view class="switch-row" style="margin-top: 30rpx;">
              <text class="switch-label">平滑过渡</text>
              <switch
                :checked="gradientEnabled"
                @change="handleGradientSwitch"
                color="#007aff"
              />
            </view>
            <view v-if="gradientEnabled" class="gradient-tip">
              <text>开启后颜色切换将使用平滑渐变效果</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 场景模式 -->
      <view v-if="mode === 'scene'" class="setting-item">
        <view class="setting-label">场景模式</view>
        <view class="scene-cards">
          <view
            v-for="(scene, index) in sceneModes"
            :key="index"
            class="scene-card"
            :class="{ active: selectedScene === scene.id }"
            @click="selectScene(scene)"
          >
            <view class="scene-icon">{{ scene.icon }}</view>
            <text class="scene-name">{{ scene.name }}</text>
            <text class="scene-desc">{{ scene.description }}</text>
          </view>
        </view>
      </view>

      <!-- 亮度调节（所有模式通用） -->
      <view class="setting-item">
        <view class="setting-label-row">
          <text class="setting-label">亮度调节</text>
          <text class="brightness-value">{{ brightness }}%</text>
        </view>
        <view class="brightness-control">
          <slider
            :value="brightness"
            min="10"
            max="100"
            step="5"
            activeColor="#007aff"
            backgroundColor="#e5e5e5"
            block-color="#ffffff"
            block-size="20"
            @change="handleBrightnessChange"
          />
        </view>
      </view>

      <!-- 色温调节 -->
      <view class="setting-item">
        <view class="setting-label-row">
          <text class="setting-label">色温调节</text>
          <text class="temperature-value">{{ colorTemperature }}K</text>
        </view>
        <view class="temperature-control">
          <view class="temperature-presets">
            <view
              v-for="(preset, index) in temperaturePresets"
              :key="index"
              class="temperature-preset-btn"
              :class="{ active: colorTemperature === preset.value }"
              @click="setTemperature(preset.value)"
            >
              <text class="temperature-preset-text">{{ preset.label }}</text>
            </view>
          </view>
          <view class="temperature-slider">
            <slider
              :value="colorTemperature"
              min="2000"
              max="8000"
              step="100"
              activeColor="#ff9500"
              backgroundColor="#e5e5e5"
              block-color="#ffffff"
              block-size="20"
              @change="handleTemperatureChange"
            />
          </view>
        </view>
      </view>

      <!-- 定时功能 -->
      <view class="setting-item">
        <view class="setting-label-row">
          <text class="setting-label">定时关闭</text>
          <switch
            :checked="timerEnabled"
            @change="handleTimerSwitch"
            color="#007aff"
          />
        </view>
        <view v-if="timerEnabled" class="timer-controls">
          <view class="timer-presets">
            <view
              v-for="(preset, index) in timerPresets"
              :key="index"
              class="timer-preset-btn"
              :class="{ active: timerMinutes === preset.value }"
              @click="setTimer(preset.value)"
            >
              <text class="timer-preset-text">{{ preset.label }}</text>
            </view>
          </view>
          <view class="timer-custom">
            <text class="timer-label">自定义：</text>
            <input
              class="timer-input"
              type="number"
              :value="timerMinutes"
              min="1"
              max="120"
              placeholder="分钟"
              @blur="(e) => handleTimerInput(e)"
              @confirm="(e) => handleTimerInput(e)"
            />
            <text class="timer-unit">分钟</text>
          </view>
        </view>
      </view>

      <!-- 使用统计 -->
      <view class="setting-item">
        <view class="setting-label">使用统计</view>
        <view class="stats-content">
          <view class="stat-item">
            <text class="stat-label">总使用时长</text>
            <text class="stat-value">{{ formatDuration(totalUsageTime) }}</text>
          </view>
          <view class="stat-item">
            <text class="stat-label">最常用颜色</text>
            <view class="stat-color">
              <view
                v-if="mostUsedColor"
                class="color-preview"
                :style="{ backgroundColor: `rgb(${mostUsedColor.r}, ${mostUsedColor.g}, ${mostUsedColor.b})` }"
              />
              <text class="stat-color-name">{{ mostUsedColor?.name || '暂无' }}</text>
            </view>
          </view>
          <view class="stat-item">
            <text class="stat-label">使用次数</text>
            <text class="stat-value">{{ usageCount }}次</text>
          </view>
        </view>
      </view>

      <!-- 历史记录 -->
      <view class="setting-item">
        <view class="setting-label-row">
          <text class="setting-label">历史记录</text>
          <text class="clear-btn" @click="clearHistory">清空</text>
        </view>
        <view v-if="historyColors.length === 0" class="empty-tip">
          <text>暂无历史记录</text>
        </view>
        <view v-else class="history-cards">
          <view
            v-for="(color, index) in historyColors"
            :key="index"
            class="history-card"
            :class="{ 'light-color': isLightColor(color) }"
            :style="{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }"
            @click="selectHistoryColor(color)"
          >
            <view class="history-info">
              <text class="history-name">{{ color.name || '自定义颜色' }}</text>
              <text class="history-time">{{ formatTime(color.timestamp) }}</text>
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
import SaveColorModal from '@/components/SaveColorModal.vue';
import ColorPickerModal from '@/components/ColorPickerModal.vue';

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

type Mode = 'common' | 'favorite' | 'dynamic' | 'scene';

const mode = ref<Mode>('common');
const localColor = ref<Color>({ r: 255, g: 255, b: 255 });
const commonColors = ref<ColorDetail[]>([]);
const favoriteColors = ref<ColorDetail[]>([]);
const dynamicEnabled = ref(false);
const selectedDynamicColors = ref<ColorDetail[]>([]);
const switchFrequency = ref(2);
const statusBarHeight = ref(0);
const showSaveModal = ref(false);
const showColorPicker = ref(false);
const brightness = ref(100); // 亮度 10-100
const timerEnabled = ref(false);
const timerMinutes = ref(30);
const selectedScene = ref<string | null>(null);
const timerId = ref<number | null>(null);
const totalUsageTime = ref(0); // 总使用时长（秒）
const usageCount = ref(0); // 使用次数
const mostUsedColor = ref<ColorDetail | null>(null); // 最常用颜色
const historyColors = ref<Array<ColorDetail & { timestamp: number }>>([]); // 历史记录
const colorTemperature = ref(5600); // 色温 2000-8000K
const gradientEnabled = ref(false); // 渐变效果开关
const compareEnabled = ref(false); // 颜色对比开关
const compareColor = ref<Color>({ r: 255, g: 255, b: 255 }); // 对比颜色
const presets = ref<Array<{
  name: string;
  color: Color;
  brightness: number;
  temperature: number;
  mode: Mode;
}>>([]); // 预设方案

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

// 场景模式定义
interface SceneMode {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: Color;
  brightness?: number;
}

const sceneModes: SceneMode[] = [
  {
    id: 'reading',
    name: '阅读模式',
    icon: '📖',
    description: '护眼暖光，适合长时间阅读',
    color: { r: 255, g: 240, b: 220 },
    brightness: 60
  },
  {
    id: 'sleep',
    name: '睡眠模式',
    icon: '🌙',
    description: '低亮度暖光，助眠放松',
    color: { r: 255, g: 200, b: 150 },
    brightness: 20
  },
  {
    id: 'work',
    name: '工作模式',
    icon: '💼',
    description: '明亮白光，提升专注力',
    color: { r: 255, g: 255, b: 255 },
    brightness: 90
  },
  {
    id: 'eye',
    name: '护眼模式',
    icon: '👁️',
    description: '防蓝光，减少眼疲劳',
    color: { r: 255, g: 250, b: 240 },
    brightness: 50
  },
  {
    id: 'relax',
    name: '放松模式',
    icon: '🧘',
    description: '柔和暖光，舒缓心情',
    color: { r: 255, g: 230, b: 200 },
    brightness: 40
  },
  {
    id: 'focus',
    name: '专注模式',
    icon: '🎯',
    description: '冷白光，提高注意力',
    color: { r: 240, g: 245, b: 255 },
    brightness: 80
  }
];

// 定时预设
const timerPresets = [
  { label: '5分钟', value: 5 },
  { label: '15分钟', value: 15 },
  { label: '30分钟', value: 30 },
  { label: '60分钟', value: 60 }
];

// 色温预设
const temperaturePresets = [
  { label: '暖光', value: 3000 },
  { label: '自然', value: 5600 },
  { label: '冷光', value: 6500 }
];

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
  } else {
    // 如果没有保存的设置，默认选中万圣节颜色
    selectedDynamicColors.value = [...halloweenColors];
  }
};

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
    // 根据当前颜色更新色温显示
    updateTemperatureFromColor();
  }

  // 加载亮度
  const savedBrightness = uni.getStorageSync('brightness');
  if (savedBrightness !== undefined && savedBrightness !== null) {
    brightness.value = savedBrightness;
  }

  // 加载定时设置
  const savedTimerEnabled = uni.getStorageSync('timerEnabled');
  if (savedTimerEnabled !== undefined) {
    timerEnabled.value = savedTimerEnabled;
  }
  const savedTimerMinutes = uni.getStorageSync('timerMinutes');
  if (savedTimerMinutes !== undefined) {
    timerMinutes.value = savedTimerMinutes;
  }

  // 加载场景模式
  const savedScene = uni.getStorageSync('selectedScene');
  if (savedScene) {
    selectedScene.value = savedScene;
    const scene = sceneModes.find(s => s.id === savedScene);
    if (scene) {
      localColor.value = { ...scene.color };
      if (scene.brightness !== undefined) {
        brightness.value = scene.brightness;
      }
    }
  }

  // 加载当前模式
  const savedMode = uni.getStorageSync('colorMode');
  if (savedMode) {
    mode.value = savedMode;
  }
  
  // 加载使用统计
  loadUsageStats();
});

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
  // 颜色改变时更新色温显示
  updateTemperatureFromColor();
};

const handleRgbInput = (channel: 'r' | 'g' | 'b', e: any) => {
  const value = parseInt(e.detail?.value || e.target?.value || '0', 10);
  if (!isNaN(value)) {
    localColor.value[channel] = Math.max(0, Math.min(255, value));
    // 颜色改变时更新色温显示
    updateTemperatureFromColor();
  }
};

const selectColor = (color: ColorDetail) => {
  localColor.value = {
    r: color.r,
    g: color.g,
    b: color.b
  };
  // 选择颜色时更新色温显示
  updateTemperatureFromColor();
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

const setFrequency = (value: number) => {
  switchFrequency.value = value;
};

// 显示颜色选择弹窗
const showColorPickerModal = () => {
  showColorPicker.value = true;
};

// 关闭颜色选择弹窗
const closeColorPicker = () => {
  showColorPicker.value = false;
};

// 处理颜色选择确认
const handleColorPickerConfirm = (colors: ColorDetail[]) => {
  selectedDynamicColors.value = colors;
  closeColorPicker();
};

const goToColorList = () => {
  // 保存当前颜色，以便色彩列表页面判断选中状态
  uni.setStorageSync('currentColor', { ...localColor.value });
  uni.navigateTo({
    url: '/pages/color-list/index'
  });
};

const goToHelp = () => {
  uni.navigateTo({
    url: '/pages/help/index'
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

// 显示保存自定义颜色弹窗
const showSaveColorModal = () => {
  showSaveModal.value = true;
};

// 关闭保存弹窗
const closeSaveModal = () => {
  showSaveModal.value = false;
};

// 处理保存颜色确认
const handleSaveColorConfirm = (name: string) => {
  // 获取已有的自定义颜色
  const customColors = uni.getStorageSync('customColors') || [];
  
  // 创建新的自定义颜色对象
  const newColor: ColorDetail = {
    name: name,
    r: localColor.value.r,
    g: localColor.value.g,
    b: localColor.value.b,
    description: '自定义颜色'
  };

  // 检查是否已存在相同RGB的颜色
  const exists = customColors.some(
    (c: ColorDetail) => c.r === newColor.r && c.g === newColor.g && c.b === newColor.b
  );

  if (exists) {
    uni.showToast({
      title: '该颜色已存在',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 添加到自定义颜色列表
  customColors.push(newColor);
  uni.setStorageSync('customColors', customColors);

  uni.showToast({
    title: '保存成功',
    icon: 'success',
    duration: 2000
  });

  closeSaveModal();
};

// 判断是否为浅色（用于添加边框）
const isLightColor = (color: ColorDetail): boolean => {
  // 计算亮度 (使用相对亮度公式)
  const brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
  // 如果亮度大于200，认为是浅色
  return brightness > 200;
};

// 场景模式选择
const selectScene = (scene: SceneMode) => {
  selectedScene.value = scene.id;
  localColor.value = { ...scene.color };
  if (scene.brightness !== undefined) {
    brightness.value = scene.brightness;
  }
  // 更新色温显示
  updateTemperatureFromColor();
  // 实时通知首页更新亮度
  uni.$emit('brightnessChanged', brightness.value);
};

// 亮度调节
const handleBrightnessChange = (e: any) => {
  brightness.value = Math.max(10, Math.min(100, Number(e.detail.value)));
};

// 定时功能
const handleTimerSwitch = (e: any) => {
  timerEnabled.value = e.detail.value;
  if (!timerEnabled.value) {
    // 关闭定时器
    if (timerId.value !== null) {
      clearTimeout(timerId.value);
      timerId.value = null;
    }
  }
};

const setTimer = (minutes: number) => {
  timerMinutes.value = minutes;
};

const handleTimerInput = (e: any) => {
  const value = parseInt(e.detail?.value || e.target?.value || '30', 10);
  if (!isNaN(value)) {
    timerMinutes.value = Math.max(1, Math.min(120, value));
  }
};

// 加载使用统计
const loadUsageStats = () => {
  const saved = uni.getStorageSync('usageStats');
  if (saved) {
    totalUsageTime.value = saved.totalTime || 0;
    usageCount.value = saved.count || 0;
    mostUsedColor.value = saved.mostUsedColor || null;
  }
  
  // 加载历史记录
  const history = uni.getStorageSync('colorHistory');
  if (history && Array.isArray(history)) {
    historyColors.value = history.slice(0, 20); // 只显示最近20条
  }
};

// 格式化时长
const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}分钟`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  }
};

// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) {
    return '刚刚';
  } else if (minutes < 60) {
    return `${minutes}分钟前`;
  } else if (hours < 24) {
    return `${hours}小时前`;
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// 选择历史颜色
const selectHistoryColor = (color: ColorDetail & { timestamp: number }) => {
  localColor.value = {
    r: color.r,
    g: color.g,
    b: color.b
  };
  // 更新色温显示
  updateTemperatureFromColor();
};

// 清空历史记录
const clearHistory = () => {
  uni.showModal({
    title: '确认清空',
    content: '确定要清空所有历史记录吗？',
    success: (res) => {
      if (res.confirm) {
        historyColors.value = [];
        uni.removeStorageSync('colorHistory');
        uni.showToast({
          title: '已清空',
          icon: 'success',
          duration: 2000
        });
      }
    }
  });
};

// 色温调节
const handleTemperatureChange = (e: any) => {
  const temp = Math.max(2000, Math.min(8000, Number(e.detail.value)));
  colorTemperature.value = temp;
  // 根据色温计算RGB值
  const rgb = temperatureToRgb(temp);
  localColor.value = rgb;
};

const setTemperature = (temp: number) => {
  colorTemperature.value = temp;
  const rgb = temperatureToRgb(temp);
  localColor.value = rgb;
};

// RGB转色温（估算）
const rgbToTemperature = (r: number, g: number, b: number): number => {
  // 简化算法：基于RGB值估算色温
  // 如果颜色接近白色，根据蓝/红比例估算
  const avg = (r + g + b) / 3;
  if (avg < 50) return 2000; // 太暗，返回最低值
  
  // 计算色温（简化算法）
  // 暖色（红多）-> 低色温，冷色（蓝多）-> 高色温
  const redRatio = r / (r + g + b + 1);
  const blueRatio = b / (r + g + b + 1);
  
  if (redRatio > 0.4) {
    // 偏暖色
    return Math.max(2000, Math.min(4000, 3000 + (redRatio - 0.4) * 2000));
  } else if (blueRatio > 0.35) {
    // 偏冷色
    return Math.max(5000, Math.min(8000, 5500 + (blueRatio - 0.35) * 5000));
  } else {
    // 中性色
    return 5600;
  }
};

// 更新色温显示（基于当前颜色）
const updateTemperatureFromColor = () => {
  const temp = rgbToTemperature(localColor.value.r, localColor.value.g, localColor.value.b);
  colorTemperature.value = Math.round(temp / 100) * 100; // 取整到100
};

// 色温转RGB算法
const temperatureToRgb = (kelvin: number): Color => {
  const temp = kelvin / 100;
  let r, g, b;

  if (temp <= 66) {
    r = 255;
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
    if (g < 0) g = 0;
    if (g > 255) g = 255;
    if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
      if (b < 0) b = 0;
      if (b > 255) b = 255;
    }
  } else {
    r = temp - 60;
    r = 329.698727446 * (r ** -0.1332047592);
    if (r < 0) r = 0;
    if (r > 255) r = 255;

    g = temp - 60;
    g = 288.1221695283 * (g ** -0.0755148492);
    if (g < 0) g = 0;
    if (g > 255) g = 255;

    b = 255;
  }

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b)
  };
};

// 渐变效果开关
const handleGradientSwitch = (e: any) => {
  gradientEnabled.value = e.detail.value;
};

// 颜色对比
const toggleCompare = () => {
  compareEnabled.value = !compareEnabled.value;
  if (!compareEnabled.value) {
    compareColor.value = { r: 255, g: 255, b: 255 };
  }
};

const setCompareColor = () => {
  compareColor.value = { ...localColor.value };
  uni.showToast({
    title: '已设为对比颜色',
    icon: 'success',
    duration: 2000
  });
};

const swapColors = () => {
  const temp = { ...localColor.value };
  localColor.value = { ...compareColor.value };
  compareColor.value = temp;
  // 更新色温显示
  updateTemperatureFromColor();
  uni.showToast({
    title: '已交换颜色',
    icon: 'success',
    duration: 2000
  });
};

// 预设方案
const savePreset = () => {
  uni.showModal({
    title: '保存预设方案',
    editable: true,
    placeholderText: '请输入方案名称',
    success: (res) => {
      if (res.confirm && res.content) {
        const preset = {
          name: res.content,
          color: { ...localColor.value },
          brightness: brightness.value,
          temperature: colorTemperature.value,
          mode: mode.value
        };
        presets.value.push(preset);
        uni.setStorageSync('presets', presets.value);
        uni.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      }
    }
  });
};

const loadPreset = (preset: (typeof presets.value)[0]) => {
  localColor.value = { ...preset.color };
  brightness.value = preset.brightness;
  colorTemperature.value = preset.temperature;
  mode.value = preset.mode;
  // 更新色温显示
  updateTemperatureFromColor();
  // 实时通知首页更新亮度
  uni.$emit('brightnessChanged', brightness.value);
  uni.showToast({
    title: '已加载方案',
    icon: 'success',
    duration: 2000
  });
};

const showPresetList = () => {
  // 这里可以打开一个管理弹窗，暂时用简单方式
  if (presets.value.length === 0) {
    uni.showToast({
      title: '暂无预设方案',
      icon: 'none',
      duration: 2000
    });
  }
};

const deletePreset = (index: number) => {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除"${presets.value[index].name}"吗？`,
    success: (res) => {
      if (res.confirm) {
        presets.value.splice(index, 1);
        uni.setStorageSync('presets', presets.value);
        uni.showToast({
          title: '已删除',
          icon: 'success',
          duration: 2000
        });
      }
    }
  });
};

const sharePreset = (preset: typeof presets.value[0]) => {
  const shareText = `LumaKit预设方案：${preset.name}\nRGB: (${preset.color.r}, ${preset.color.g}, ${preset.color.b})\n亮度: ${preset.brightness}%\n色温: ${preset.temperature}K`;
  uni.setClipboardData({
    data: shareText,
    success: () => {
      uni.showToast({
        title: '已复制到剪贴板',
        icon: 'success',
        duration: 2000
      });
    }
  });
};

const handleConfirm = () => {
  // 保存模式设置
  uni.setStorageSync('colorMode', mode.value);
  
  // 保存亮度设置
  uni.setStorageSync('brightness', brightness.value);
  
  // 保存色温设置
  uni.setStorageSync('colorTemperature', colorTemperature.value);
  
  // 保存渐变设置
  uni.setStorageSync('gradientEnabled', gradientEnabled.value);
  
  // 保存场景模式
  if (mode.value === 'scene' && selectedScene.value) {
    uni.setStorageSync('selectedScene', selectedScene.value);
  }
  
  // 保存定时设置
  uni.setStorageSync('timerEnabled', timerEnabled.value);
  uni.setStorageSync('timerMinutes', timerMinutes.value);
  
  // 如果开启了定时，启动定时器
  if (timerEnabled.value && timerMinutes.value > 0) {
    if (timerId.value !== null) {
      clearTimeout(timerId.value);
    }
    timerId.value = setTimeout(() => {
      uni.$emit('stopDynamicLight');
      // 定时关闭时，恢复为默认白色，而不是黑色
      const defaultColor = { r: 255, g: 255, b: 255 };
      uni.setStorageSync('currentColor', defaultColor);
      uni.$emit('colorChanged', defaultColor);
      uni.showToast({
        title: '定时关闭',
        icon: 'none',
        duration: 2000
      });
      timerId.value = null;
    }, timerMinutes.value * 60 * 1000) as any;
  }
  
  // 保存百变光源设置
  if (mode.value === 'dynamic') {
    uni.setStorageSync('dynamicSettings', {
      enabled: dynamicEnabled.value,
      colors: selectedDynamicColors.value,
      frequency: switchFrequency.value,
      gradient: gradientEnabled.value
    });
    
    // 如果开启了百变光源，启动循环
    if (dynamicEnabled.value && selectedDynamicColors.value.length > 0) {
      uni.setStorageSync('dynamicMode', true);
      uni.$emit('startDynamicLight', {
        colors: selectedDynamicColors.value,
        frequency: switchFrequency.value,
        gradient: gradientEnabled.value
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
    // 通过事件通知首页更新颜色和亮度
    uni.$emit('colorChanged', { ...localColor.value });
    uni.$emit('brightnessChanged', brightness.value);
    
    // 记录使用历史
    const history = uni.getStorageSync('colorHistory') || [];
    const newHistoryItem: ColorDetail & { timestamp: number } = {
      ...localColor.value,
      name: mode.value === 'scene' && selectedScene.value
        ? sceneModes.find(s => s.id === selectedScene.value)?.name || '自定义颜色'
        : '自定义颜色',
      description: '',
      timestamp: Date.now()
    };
    history.unshift(newHistoryItem);
    // 只保留最近50条
    const limitedHistory = history.slice(0, 50);
    uni.setStorageSync('colorHistory', limitedHistory);
    
    // 更新使用统计
    const stats = uni.getStorageSync('usageStats') || { totalTime: 0, count: 0, colorUsage: {} };
    stats.count = (stats.count || 0) + 1;
    const colorKey = `${localColor.value.r}-${localColor.value.g}-${localColor.value.b}`;
    stats.colorUsage = stats.colorUsage || {};
    stats.colorUsage[colorKey] = (stats.colorUsage[colorKey] || 0) + 1;
    
    // 找出最常用颜色
    let maxCount = 0;
    let mostUsed = null;
    for (const key in stats.colorUsage) {
      if (stats.colorUsage[key] > maxCount) {
        maxCount = stats.colorUsage[key];
        const [r, g, b] = key.split('-').map(Number);
        mostUsed = { r, g, b, name: '自定义颜色', description: '' } as ColorDetail;
      }
    }
    stats.mostUsedColor = mostUsed as ColorDetail | null;
    uni.setStorageSync('usageStats', stats);
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

.navbar-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
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

.frequency-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 20rpx;
}

.preset-btn {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    background-color: #007aff;
    border-color: #007aff;

    .preset-text {
      color: #ffffff;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.preset-text {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.setting-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.color-select-row {
  margin-top: 40rpx;
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

.custom-color-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.custom-color-label {
  font-size: 28rpx;
  color: #666;
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
  width: 100%;
  box-sizing: border-box;
  // gap: 16rpx;
}

.rgb-item .slider-wrapper {
  flex: 1;
  min-width: 0;
  max-width: 100%;
  padding: 0;
  flex-shrink: 1;
}

.rgb-item .slider-wrapper slider {
  width: 80%;
  box-sizing: border-box;
}

.rgb-label {
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  width: 32rpx;
  flex-shrink: 0;
  text-align: center;
}

.rgb-input {
  width: 100rpx;
  min-width: 100rpx;
  max-width: 100rpx;
  height: 60rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #333;
  text-align: center;
  background-color: #ffffff;
  flex-shrink: 0;
  flex-grow: 0;
  box-sizing: border-box;
}

.save-custom-color-btn {
  padding: 12rpx 24rpx;
  background-color: #ffffff;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #f0f7ff;
    transform: scale(0.98);
  }
}

.save-btn-text {
  font-size: 26rpx;
  color: #007aff;
  font-weight: 500;
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

.add-color-btn {
  padding: 10rpx 20rpx;
  background-color: transparent;
  border-radius: 8rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #f0f7ff;
    transform: scale(0.98);
  }
}

.add-color-text {
  font-size: 26rpx;
  color: #007aff;
  font-weight: 500;
}

// 场景模式样式
.scene-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-top: 20rpx;
}

.scene-card {
  padding: 30rpx;
  border-radius: 16rpx;
  background-color: #f8f8f8;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;

  &.active {
    background-color: #e6f3ff;
    border-color: #007aff;
  }

  &:active {
    transform: scale(0.98);
  }
}

.scene-icon {
  font-size: 60rpx;
  margin-bottom: 8rpx;
}

.scene-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.scene-desc {
  font-size: 24rpx;
  color: #666;
  text-align: center;
  line-height: 1.4;
}

// 亮度调节样式
.brightness-value {
  font-size: 28rpx;
  color: #007aff;
  font-weight: 600;
}

.brightness-control {
  margin-top: 20rpx;
  padding: 0 10rpx;
}

// 定时功能样式
.timer-controls {
  margin-top: 20rpx;
}

.timer-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.timer-preset-btn {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  &.active {
    background-color: #007aff;
    border-color: #007aff;

    .timer-preset-text {
      color: #ffffff;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.timer-preset-text {
  font-size: 26rpx;
  color: #333;
  transition: color 0.3s ease;
}

.timer-custom {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 20rpx;
}

.timer-label {
  font-size: 28rpx;
  color: #333;
}

.timer-input {
  flex: 1;
  height: 60rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
  color: #333;
  text-align: center;
  background-color: #ffffff;
  max-width: 200rpx;
}

.timer-unit {
  font-size: 28rpx;
  color: #666;
}

// 使用统计样式
.stats-content {
  margin-top: 20rpx;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
}

.stat-label {
  font-size: 28rpx;
  color: #666;
}

.stat-value {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.stat-color {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.color-preview {
  width: 40rpx;
  height: 40rpx;
  border-radius: 8rpx;
  border: 2rpx solid #e5e5e5;
}

.stat-color-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.clear-btn {
  font-size: 26rpx;
  color: #007aff;
  padding: 8rpx 16rpx;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:active {
    opacity: 0.6;
  }
}

// 历史记录样式
.history-cards {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.history-card {
  padding: 24rpx;
  border-radius: 12rpx;
  border: 2rpx solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 100rpx;

  &.light-color {
    border-color: rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.history-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.history-time {
  font-size: 24rpx;
  color: rgba(0, 0, 0, 0.6);
}

// 色温调节样式
.temperature-value {
  font-size: 28rpx;
  color: #ff9500;
  font-weight: 600;
}

.temperature-control {
  margin-top: 20rpx;
}

.temperature-presets {
  display: flex;
  gap: 16rpx;
  margin-bottom: 20rpx;
}

.temperature-preset-btn {
  flex: 1;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  background-color: #f5f5f5;
  border: 2rpx solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;

  &.active {
    background-color: #fff4e6;
    border-color: #ff9500;

    .temperature-preset-text {
      color: #ff9500;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

.temperature-preset-text {
  font-size: 26rpx;
  color: #333;
  transition: color 0.3s ease;
}

.temperature-slider {
  padding: 0 10rpx;
}

// 渐变效果样式
.gradient-tip {
  margin-top: 16rpx;
  padding: 16rpx;
  background-color: #f0f7ff;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666;
}

// 预设方案样式
.preset-actions {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  font-size: 26rpx;
  color: #007aff;
  padding: 8rpx 16rpx;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:active {
    opacity: 0.6;
  }
}

.preset-list {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.preset-item {
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    background-color: #eeeeee;
  }
}

.preset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.preset-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.preset-ops {
  display: flex;
  gap: 16rpx;
}

.preset-op-btn {
  font-size: 24rpx;
  color: #007aff;
  padding: 4rpx 12rpx;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &.delete {
    color: #ff3b30;
  }

  &:active {
    opacity: 0.6;
  }
}

.preset-preview {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.preset-color {
  width: 60rpx;
  height: 60rpx;
  border-radius: 12rpx;
  border: 2rpx solid #e5e5e5;
}

.preset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.preset-desc {
  font-size: 24rpx;
  color: #666;
}

// 颜色对比样式
.compare-btn {
  font-size: 26rpx;
  color: #007aff;
  padding: 8rpx 16rpx;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:active {
    opacity: 0.6;
  }
}

.compare-view {
  margin-top: 20rpx;
  padding: 24rpx;
  background-color: #f8f8f8;
  border-radius: 12rpx;
}

.compare-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.compare-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
}

.compare-color {
  width: 120rpx;
  height: 120rpx;
  border-radius: 16rpx;
  border: 3rpx solid #e5e5e5;
}

.compare-rgb {
  font-size: 24rpx;
  color: #666;
  font-family: monospace;
}

.compare-actions {
  display: flex;
  gap: 20rpx;
  width: 100%;
  margin-top: 10rpx;
}

.compare-action-btn {
  flex: 1;
  padding: 16rpx;
  background-color: #007aff;
  color: #ffffff;
  border-radius: 8rpx;
  text-align: center;
  font-size: 26rpx;
  cursor: pointer;
  transition: all 0.3s ease;

  &:active {
    background-color: #0056b3;
    transform: scale(0.98);
  }
}

</style>
