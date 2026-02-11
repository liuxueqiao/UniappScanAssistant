# 鸿蒙摄像头预览插件

## 说明

本插件基于您提供的原生鸿蒙代码实现，使用 `@ohos.multimedia.camera` + `XComponent` 实现画中画效果。

## 当前状态

✅ **UTS插件已实现**：`utssdk/index.uts` 中已实现完整的摄像头预览逻辑，完全基于您提供的原生代码。

❌ **XComponent在vue中不可用**：uni-app的vue页面不支持直接使用 `XComponent` 组件（这是原生鸿蒙组件）。

## 解决方案

### 方案1：使用nvue页面（推荐）

创建nvue页面，在nvue中可以使用原生组件：

1. 创建 `pages/camera/index.nvue`
2. 在nvue中使用XComponent
3. 调用UTS插件初始化摄像头

### 方案2：原生插件封装

需要开发一个原生插件，将XComponent封装为uni-app组件。

### 方案3：等待uni-app支持

等待uni-app官方支持鸿蒙的XComponent组件。

## 使用方法（nvue方案）

```vue
<!-- pages/camera/index.nvue -->
<template>
  <view class="container">
    <x-component
      id="cameraXComponent"
      type="surface"
      :controller="xcompController"
      @load="onXComponentLoad"
    />
    <button @click="takePhoto">拍照</button>
  </view>
</template>

<script>
import { initCameraPreview, takePhoto } from '@/uni_modules/harmony-camera-preview/utssdk/index.uts'

export default {
  data() {
    return {
      xcompController: null
    }
  },
  onLoad() {
    // 初始化XComponent控制器
    this.xcompController = new XComponentController()
  },
  methods: {
    onXComponentLoad(e) {
      const surfaceId = e.surfaceId
      initCameraPreview({
        surfaceId: surfaceId,
        cameraType: 1 // 前置摄像头
      })
    },
    async takePhoto() {
      const path = await takePhoto()
      // 处理照片
    }
  }
}
</script>
```

## 注意事项

1. **必须在真机上运行**：模拟器不支持摄像头
2. **需要权限**：确保在 `module.json5` 中声明了 `ohos.permission.CAMERA` 权限
3. **API版本**：需要 HarmonyOS 3.1+ (API 9+)
4. **Stage模型**：必须是 Stage 模型，FA 模型不支持
