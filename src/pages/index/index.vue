<template>
  <view class="container" :style="containerStyle">
    <view
      class="settings-btn"
      :style="{ top: `${buttonTop}rpx` }"
      @click="openSettings"
    >
      <text class="settings-icon">⚙️</text>
    </view>

    <!-- 摄像头视图 -->
    <view v-if="cameraEnabled" class="camera-container">
      <camera
        id="camera"
        class="camera-view"
        device-position="front"
        flash="off"
        @error="handleCameraError"
        @initdone="handleCameraInitDone"
        @stop="handleCameraStop"
      />
      <view class="camera-controls">
        <view class="camera-btn" @click="takePhoto">
          <text class="camera-btn-icon">📷</text>
        </view>
        <view class="camera-btn close-btn" @click="toggleCamera">
          <text class="camera-btn-icon">✕</text>
        </view>
      </view>
    </view>

    <!-- 开启摄像头按钮 -->
    <view v-if="!cameraEnabled" class="camera-toggle-btn" @click="toggleCamera">
      <text class="camera-toggle-icon">📷</text>
      <text class="camera-toggle-text">开启自拍</text>
    </view>

    <!-- 隐私协议弹窗组件 -->
    <PrivacyModal
      :visible="showPrivacyModal"
      @agree="handleAgree"
      @disagree="handleDisagree"
    />

    <!-- 新手引导组件 -->
    <GuideModal
      :visible="showGuide"
      :button-top="buttonTop"
      @confirm="closeGuide"
    />
  </view>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import PrivacyModal from '@/components/PrivacyModal.vue';
import GuideModal from '@/components/GuideModal.vue';

const currentColor = ref({ r: 255, g: 255, b: 255 }); // 默认白色
const brightness = ref(100); // 亮度 10-100
const statusBarHeight = ref(0); // 状态栏高度
const dynamicTimer = ref<number | null>(null);
const dynamicColors = ref<Array<{ r: number; g: number; b: number }>>([]);
const currentDynamicIndex = ref(0);
const dynamicFrequency = ref(2);
const showPrivacyModal = ref(false); // 是否显示隐私协议弹窗
const showGuide = ref(false); // 是否显示新手引导
const cameraEnabled = ref(false); // 是否启用摄像头
const cameraContext = ref<any>(null); // 摄像头上下文

const stopDynamicLight = () => {
  if (dynamicTimer.value !== null) {
    clearInterval(dynamicTimer.value);
    dynamicTimer.value = null;
  }
  dynamicColors.value = [];
  currentDynamicIndex.value = 0;
};

const startDynamicLight = (
  colors: Array<{ r: number; g: number; b: number }>,
  frequency: number,
  useGradient: boolean = false
) => {
  stopDynamicLight();
  if (colors.length === 0) return;

  dynamicColors.value = colors;
  dynamicFrequency.value = frequency;
  currentDynamicIndex.value = 0;
  currentColor.value = colors[0];

  if (useGradient && colors.length > 1) {
    // 使用渐变效果
    let step = 0;
    const steps = 20; // 渐变步数
    const stepTime = (frequency * 1000) / steps;
    
    const animateGradient = () => {
      const currentIdx = currentDynamicIndex.value;
      const nextIdx = (currentIdx + 1) % colors.length;
      const current = colors[currentIdx];
      const next = colors[nextIdx];
      
      const r = Math.round(current.r + (next.r - current.r) * (step / steps));
      const g = Math.round(current.g + (next.g - current.g) * (step / steps));
      const b = Math.round(current.b + (next.b - current.b) * (step / steps));
      
      currentColor.value = { r, g, b };
      step++;
      
      if (step > steps) {
        step = 0;
        currentDynamicIndex.value = nextIdx;
        currentColor.value = next;
      }
    };
    
    dynamicTimer.value = setInterval(animateGradient, stepTime) as any;
  } else {
    // 普通切换
    dynamicTimer.value = setInterval(() => {
      currentDynamicIndex.value = (currentDynamicIndex.value + 1) % colors.length;
      currentColor.value = colors[currentDynamicIndex.value];
    }, frequency * 1000) as any;
  }
};

// 检查隐私协议同意状态
const checkPrivacyAgreement = () => {
  const hasAgreed = uni.getStorageSync('privacyAgreed');
  if (!hasAgreed) {
    showPrivacyModal.value = true;
  }
};

// 处理不同意
const handleDisagree = () => {
  uni.showToast({
    title: '不同意请手动退出APP',
    icon: 'none',
    duration: 3000
  });
};

// 处理同意
const handleAgree = () => {
  // 缓存已同意状态到本地存储
  uni.setStorageSync('privacyAgreed', true);
  // 关闭弹窗
  showPrivacyModal.value = false;
  
  // 检查是否是首次同意，如果是则显示引导
  const hasShownGuide = uni.getStorageSync('hasShownGuide');
  if (!hasShownGuide) {
    // 延迟一下，等隐私弹窗完全关闭后再显示引导
    setTimeout(() => {
      showGuide.value = true;
      uni.setStorageSync('hasShownGuide', true);
    }, 300);
  }
};

// 关闭引导
const closeGuide = () => {
  showGuide.value = false;
};

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync();
  statusBarHeight.value = systemInfo.statusBarHeight || 0;
  
  // 检查隐私协议
  checkPrivacyAgreement();

  // 监听设置页面返回的颜色和亮度
  uni.$on('colorChanged', (color: { r: number; g: number; b: number }) => {
    stopDynamicLight();
    currentColor.value = color;
    // 同时保存到本地存储
    uni.setStorageSync('currentColor', color);
  });
  
  // 监听亮度变化
  uni.$on('brightnessChanged', (value: number) => {
    brightness.value = value;
    uni.setStorageSync('brightness', value);
  });

  // 监听百变光源启动
  uni.$on(
    'startDynamicLight',
    (data: {
      colors: Array<{ r: number; g: number; b: number }>;
      frequency: number;
      gradient?: boolean;
    }) => {
      startDynamicLight(data.colors, data.frequency, data.gradient);
    }
  );

  // 监听百变光源停止
  uni.$on('stopDynamicLight', () => {
    stopDynamicLight();
  });

  // 从存储中恢复颜色
  const savedColor = uni.getStorageSync('currentColor');
  if (savedColor && savedColor.r !== undefined && savedColor.g !== undefined && savedColor.b !== undefined) {
    // 如果存储的颜色不是黑色（可能是定时关闭导致的），则使用存储的颜色
    if (savedColor.r !== 0 || savedColor.g !== 0 || savedColor.b !== 0) {
      currentColor.value = savedColor;
    }
    // 如果是黑色，保持默认白色
  } else {
    // 如果没有保存的颜色，使用默认白色并保存
    uni.setStorageSync('currentColor', currentColor.value);
  }
  
  // 从存储中恢复亮度
  const savedBrightness = uni.getStorageSync('brightness');
  if (savedBrightness !== undefined && savedBrightness !== null) {
    brightness.value = savedBrightness;
  } else {
    // 如果没有保存的亮度，使用默认100%并保存
    uni.setStorageSync('brightness', brightness.value);
  }

  // 检查是否有百变光源设置
  const dynamicMode = uni.getStorageSync('dynamicMode');
  if (dynamicMode) {
    const dynamicSettings = uni.getStorageSync('dynamicSettings');
    if (
      dynamicSettings &&
      dynamicSettings.enabled &&
      dynamicSettings.colors.length > 0
    ) {
      startDynamicLight(dynamicSettings.colors, dynamicSettings.frequency);
    }
  }
});

onShow(() => {
  // 检查隐私协议（每次页面显示时都检查，如果没同意就弹窗）
  checkPrivacyAgreement();

  // 页面显示时，从存储中恢复颜色（防止从后台恢复时丢失）
  const savedColor = uni.getStorageSync('currentColor');
  if (savedColor && savedColor.r !== undefined && savedColor.g !== undefined && savedColor.b !== undefined) {
    // 如果存储的颜色不是黑色（可能是定时关闭导致的），则使用存储的颜色
    if (savedColor.r !== 0 || savedColor.g !== 0 || savedColor.b !== 0) {
      currentColor.value = savedColor;
    } else {
      // 如果是黑色，恢复为默认白色
      currentColor.value = { r: 255, g: 255, b: 255 };
      uni.setStorageSync('currentColor', currentColor.value);
    }
  } else {
    // 如果没有保存的颜色，使用默认白色并保存
    currentColor.value = { r: 255, g: 255, b: 255 };
    uni.setStorageSync('currentColor', currentColor.value);
  }

  // 检查百变光源状态
  const dynamicMode = uni.getStorageSync('dynamicMode');
  if (dynamicMode) {
    const dynamicSettings = uni.getStorageSync('dynamicSettings');
    if (
      dynamicSettings &&
      dynamicSettings.enabled &&
      dynamicSettings.colors.length > 0
    ) {
      startDynamicLight(
        dynamicSettings.colors,
        dynamicSettings.frequency,
        dynamicSettings.gradient
      );
    }
  }
});

onUnmounted(() => {
  stopDynamicLight();
  uni.$off('colorChanged');
  uni.$off('startDynamicLight');
  uni.$off('stopDynamicLight');
});

// 计算容器的样式（应用亮度）
const containerStyle = computed(() => {
  const { r, g, b } = currentColor.value;
  // 根据亮度调整颜色（0-100映射到0-1）
  const brightnessFactor = brightness.value / 100;
  const adjustedR = Math.round(r * brightnessFactor);
  const adjustedG = Math.round(g * brightnessFactor);
  const adjustedB = Math.round(b * brightnessFactor);
  return {
    backgroundColor: `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`
  };
});

// 计算按钮的top值，考虑状态栏高度
const buttonTop = computed(() => {
  return statusBarHeight.value * 2 + 40; // statusBarHeight是px，需要转换为rpx（乘以2）
});



const openSettings = () => {
  uni.navigateTo({
    url: '/pages/settings/index'
  });
};

// 鸿蒙平台使用plus API调用原生摄像头
const takePhotoWithPlusCamera = () => {
  // #ifdef APP-PLUS
  // @ts-ignore
  if (typeof plus !== 'undefined' && plus.camera) {
    try {
      // @ts-ignore
      const camera = plus.camera.getCamera();
      if (camera) {
        // 使用前置摄像头
        // @ts-ignore
        camera.captureImage((path: string) => {
          // 保存到相册
          uni.saveImageToPhotosAlbum({
            filePath: path,
            success: () => {
              uni.showToast({
                title: '照片已保存到相册',
                icon: 'success',
                duration: 2000
              });
            },
            fail: (err: any) => {
              console.error('保存照片失败:', err);
              uni.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }, (err: any) => {
          console.error('拍照失败:', err);
          uni.showToast({
            title: '拍照失败',
            icon: 'none',
            duration: 2000
          });
        }, {
          index: 1 // 前置摄像头
        });
      } else {
        throw new Error('无法获取摄像头');
      }
    } catch (e: any) {
      console.error('调用plus摄像头失败:', e);
      uni.showToast({
        title: '摄像头功能不可用',
        icon: 'none',
        duration: 2000
      });
    }
  } else {
    // 如果plus API不可用，尝试使用camera组件
    cameraEnabled.value = true;
  }
  // #endif
  
  // #ifndef APP-PLUS
  // 非APP平台，使用chooseImage
  uni.chooseImage({
    count: 1,
    sourceType: ['camera'],
    camera: 'front',
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0];
      uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          uni.showToast({
            title: '照片已保存到相册',
            icon: 'success',
            duration: 2000
          });
        },
        fail: (err: any) => {
          console.error('保存照片失败:', err);
          uni.showToast({
            title: '保存失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    fail: (err: any) => {
      console.error('调用相机失败:', err);
      if (!err.errMsg || !err.errMsg.includes('cancel')) {
        uni.showToast({
          title: '调用相机失败',
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
  // #endif
};

// 切换摄像头
const toggleCamera = () => {
  // #ifdef APP-HARMONY
  // 鸿蒙平台：直接使用系统相机（nvue页面可能有问题，先使用降级方案）
  takePhotoWithPlusCamera();
  return;
  // #endif
  
  cameraEnabled.value = !cameraEnabled.value;
  
  if (cameraEnabled.value) {
    // 开启摄像头
    nextTick(() => {
      // 注意：需要在camera组件渲染后才能创建context
      // 使用setTimeout确保组件已渲染
      setTimeout(() => {
        // #ifdef APP-HARMONY
        // 鸿蒙平台：检查camera组件是否真的能工作
        // 先等待一段时间，看是否有错误事件
        setTimeout(() => {
          // 检查是否有错误发生
          if (!cameraContext.value) {
            console.log('鸿蒙平台：等待3秒后，camera组件可能无法正常工作');
            // 如果3秒后还是黑屏，提示用户
            uni.showModal({
              title: '摄像头预览不可用',
              content: '当前平台暂不支持实时预览功能。您可以使用系统相机进行拍照，是否调用系统相机？',
              success: (res) => {
                if (res.confirm) {
                  cameraEnabled.value = false;
                  takePhotoWithPlusCamera();
                } else {
                  // 用户选择不调用，保持当前状态让用户手动关闭
                }
              }
            });
          }
        }, 3000);
        
        // 尝试创建context
        try {
          if (typeof uni.createCameraContext === 'function') {
            cameraContext.value = uni.createCameraContext('camera');
            console.log('鸿蒙平台：摄像头上下文创建成功');
          } else {
            console.log('鸿蒙平台：createCameraContext不可用，camera组件可能无法正常工作');
            // 如果context不可用，很可能camera组件也无法正常工作
          }
        } catch (e: any) {
          console.error('鸿蒙平台：创建摄像头上下文失败:', e);
        }
        // #endif
        
        // #ifndef APP-HARMONY
        // 其他平台：正常创建context
        try {
          if (typeof uni.createCameraContext !== 'function') {
            uni.showToast({
              title: '当前平台不支持实时预览',
              icon: 'none',
              duration: 2000
            });
            cameraEnabled.value = false;
            return;
          }
          
          cameraContext.value = uni.createCameraContext('camera');
          
          if (!cameraContext.value) {
            throw new Error('创建摄像头上下文失败');
          }
          
          console.log('摄像头上下文创建成功');
        } catch (e: any) {
          console.error('创建摄像头上下文失败:', e);
          uni.showToast({
            title: '摄像头初始化失败，请检查权限',
            icon: 'none',
            duration: 2000
          });
          cameraEnabled.value = false;
          cameraContext.value = null;
        }
        // #endif
      }, 500); // 增加延迟时间确保组件完全渲染
    });
  } else {
    // 关闭摄像头
    cameraContext.value = null;
  }
};

// 拍照
const takePhoto = () => {
  if (!cameraContext.value) {
    // 如果上下文不存在，尝试重新创建
    try {
      if (typeof uni.createCameraContext === 'function') {
        cameraContext.value = uni.createCameraContext('camera');
      } else {
        uni.showToast({
          title: '摄像头功能不可用',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    } catch (e) {
      console.error('重新创建摄像头上下文失败:', e);
      uni.showToast({
        title: '摄像头未就绪',
        icon: 'none',
        duration: 2000
      });
      return;
    }
  }

  if (!cameraContext.value) {
    uni.showToast({
      title: '摄像头未就绪',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  try {
    cameraContext.value.takePhoto({
      quality: 'high',
      success: (res: any) => {
        // 保存照片到相册
        uni.saveImageToPhotosAlbum({
          filePath: res.tempImagePath,
          success: () => {
            uni.showToast({
              title: '照片已保存到相册',
              icon: 'success',
              duration: 2000
            });
          },
          fail: (err: any) => {
            console.error('保存照片失败:', err);
            // 如果用户拒绝授权，提示用户
            if (err.errMsg && err.errMsg.includes('auth deny')) {
              uni.showModal({
                title: '需要相册权限',
                content: '保存照片需要访问相册权限，请在设置中开启',
                showCancel: false
              });
            } else {
              uni.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              });
            }
          }
        });
      },
      fail: (err: any) => {
        console.error('拍照失败:', err);
        uni.showToast({
          title: '拍照失败: ' + (err.errMsg || '未知错误'),
          icon: 'none',
          duration: 2000
        });
      }
    });
  } catch (e) {
    console.error('调用拍照接口失败:', e);
    uni.showToast({
      title: '拍照功能异常',
      icon: 'none',
      duration: 2000
    });
  }
};

// 摄像头初始化完成（鸿蒙平台）
const handleCameraInitDone = (e: any) => {
  console.log('摄像头初始化完成:', JSON.stringify(e));
  // 在鸿蒙平台上，camera组件初始化完成后，尝试创建context
  // #ifdef APP-HARMONY
  try {
    if (typeof uni.createCameraContext === 'function') {
      cameraContext.value = uni.createCameraContext('camera');
      console.log('鸿蒙平台：摄像头上下文创建成功');
    } else {
      console.log('鸿蒙平台：createCameraContext不可用，将使用其他方式拍照');
      // 如果context不可用，提示用户可以使用系统相机
      setTimeout(() => {
        uni.showModal({
          title: '提示',
          content: '当前平台暂不支持实时预览，但可以使用系统相机拍照。是否调用系统相机？',
          success: (res) => {
            if (res.confirm) {
              cameraEnabled.value = false;
              takePhotoWithPlusCamera();
            }
          }
        });
      }, 1000);
    }
  } catch (err) {
    console.error('鸿蒙平台：创建摄像头上下文失败:', err);
  }
  // #endif
};

// 摄像头错误处理
const handleCameraError = (e: any) => {
  console.error('摄像头错误:', JSON.stringify(e));
  const errorDetail = e?.detail || e?.errMsg || e?.message || '未知错误';
  console.error('错误详情:', errorDetail);
  
  // #ifdef APP-HARMONY
  // 鸿蒙平台：camera组件可能不支持，提供降级方案
  if (errorDetail.includes('permission') || errorDetail.includes('权限')) {
    uni.showModal({
      title: '需要摄像头权限',
      content: '请在设置中开启摄像头权限',
      showCancel: false,
      success: () => {
        cameraEnabled.value = false;
      }
    });
  } else if (errorDetail.includes('not support') || errorDetail.includes('不支持') || errorDetail.includes('fail')) {
    // 如果不支持，直接提示使用系统相机
    uni.showModal({
      title: '实时预览不可用',
      content: '当前平台暂不支持摄像头实时预览功能。您可以使用系统相机进行拍照，是否调用系统相机？',
      success: (res) => {
        cameraEnabled.value = false;
        if (res.confirm) {
          takePhotoWithPlusCamera();
        }
      }
    });
  } else {
    uni.showModal({
      title: '摄像头错误',
      content: '错误信息: ' + errorDetail + '\n\n是否使用系统相机拍照？',
      success: (res) => {
        cameraEnabled.value = false;
        if (res.confirm) {
          takePhotoWithPlusCamera();
        }
      }
    });
  }
  // #endif
  
  // #ifndef APP-HARMONY
  uni.showToast({
    title: '摄像头错误',
    icon: 'none',
    duration: 2000
  });
  // #endif
};
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: background-color 0.3s ease;
}

.settings-btn {
  position: absolute;
  top: var(--button-top, 120rpx);
  right: 40rpx;
  width: 96rpx;
  height: 96rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  border: 2rpx solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 6rpx 16rpx rgba(0, 0, 0, 0.15);
  z-index: 100;
  cursor: pointer;
  backdrop-filter: blur(8rpx);
  -webkit-backdrop-filter: blur(8rpx);
  transition: background-color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 8rpx 20rpx rgba(0, 0, 0, 0.2);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.5);
    transform: scale(0.94);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }
}

.settings-icon {
  font-size: 54rpx;
  color: #333333;
  text-shadow: none;
}

// 摄像头容器
.camera-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600rpx;
  height: 800rpx;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: flex;
  flex-direction: column;
  background-color: #000;
}

.camera-view {
  width: 100%;
  height: 100%;
  flex: 1;
}

.camera-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
}

.camera-btn {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.3);

  &:active {
    transform: scale(0.95);
    background-color: rgba(255, 255, 255, 0.7);
  }
}

.camera-btn.close-btn {
  background-color: rgba(255, 59, 48, 0.9);

  &:active {
    background-color: rgba(255, 59, 48, 0.7);
  }
}

// 鸿蒙平台提示
.camera-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 40rpx;
  border-radius: 16rpx;
  text-align: center;
  z-index: 10;
  max-width: 80%;
}

.tip-text {
  color: #ffffff;
  font-size: 28rpx;
  line-height: 1.6;
  margin-bottom: 30rpx;
  display: block;
}

.tip-btn {
  background-color: #007aff;
  color: #ffffff;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:active {
    background-color: #0056b3;
  }
}

.tip-btn-text {
  color: #ffffff;
  font-size: 28rpx;
}

.camera-btn-icon {
  font-size: 48rpx;
  color: #333;
}

.close-btn .camera-btn-icon {
  color: #fff;
}

// 开启摄像头按钮
.camera-toggle-btn {
  position: fixed;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12rpx;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.2);
  z-index: 10;

  &:active {
    transform: translateX(-50%) scale(0.95);
    background-color: rgba(255, 255, 255, 0.7);
  }
}

.camera-toggle-icon {
  font-size: 80rpx;
  color: #333;
}

.camera-toggle-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

/* 隐私协议弹窗样式 */
.privacy-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx;
}

.privacy-modal {
  width: 80vw;
  max-width: 80vw;
  max-height: 68vh;
  background-color: #ffffff;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.3);
}

.privacy-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.privacy-modal-body {
  padding: 40rpx;
  font-size: 28rpx;
  line-height: 1.8;
  color: #333;
}

.privacy-modal-footer {
  padding: 30rpx 40rpx;
  border-top: 1rpx solid #e5e5e5;
  display: flex;
  gap: 20rpx;
  flex-shrink: 0;
}

.privacy-btn {
  flex: 1;
  height: 88rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12rpx;
  cursor: pointer;
  transition: all 0.2s ease;
}

.privacy-btn-disagree {
  background-color: #f5f5f5;
  border: 1rpx solid #e5e5e5;
  
  &:active {
    background-color: #e5e5e5;
    transform: scale(0.98);
  }
}

.privacy-btn-agree {
  background-color: #007aff;
  border: 1rpx solid #007aff;
  
  &:active {
    background-color: #0056cc;
    transform: scale(0.98);
  }
}

.privacy-btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.privacy-btn-disagree .privacy-btn-text {
  color: #333;
}

.privacy-btn-agree .privacy-btn-text {
  color: #ffffff;
}

/* 隐私政策内容样式 */
.privacy-title {
  font-size: 48rpx;
  color: #007aff;
  margin-bottom: 30rpx;
  text-align: center;
  border-bottom: 4rpx solid #007aff;
  padding-bottom: 20rpx;
  font-weight: 600;
}

.update-date {
  text-align: right;
  color: #999;
  font-size: 24rpx;
  margin-bottom: 30rpx;
}

.privacy-section {
  margin-bottom: 40rpx;
}

.section-title {
  font-size: 36rpx;
  color: #333;
  margin-top: 40rpx;
  margin-bottom: 20rpx;
  padding-left: 16rpx;
  border-left: 6rpx solid #007aff;
  font-weight: 600;
}

.subsection {
  margin-top: 30rpx;
}

.subsection-title {
  font-size: 32rpx;
  color: #555;
  margin-top: 30rpx;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.privacy-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 20rpx;
  text-align: justify;
}

.highlight-box {
  background-color: #fff3cd;
  padding: 24rpx;
  border-left: 6rpx solid #ffc107;
  margin: 30rpx 0;
  border-radius: 8rpx;
}

.highlight-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
}

.highlight-label {
  font-weight: 600;
  color: #333;
}

.privacy-list {
  margin-left: 40rpx;
  margin-bottom: 20rpx;
}

.list-item {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  margin-bottom: 12rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.list-label {
  font-weight: 600;
  color: #333;
}

.list-text {
  color: #333;
}

.contact-info-box {
  background-color: #f8f9fa;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-top: 40rpx;
}

.contact-item-text {
  margin: 12rpx 0;
  display: flex;
  flex-wrap: wrap;
}

.contact-label {
  font-weight: 600;
  color: #333;
  margin-right: 12rpx;
}

.contact-value {
  color: #333;
}

.privacy-footer {
  margin-top: 60rpx;
  padding-top: 30rpx;
  border-top: 2rpx solid #e5e5e5;
  text-align: center;
}

.footer-text {
  color: #999;
  font-size: 24rpx;
}
</style>
