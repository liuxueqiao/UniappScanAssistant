# uni-app + vue3.x  项目工程化搭建

## 简介

`uni-app + vue3.x` 项目工程化搭建，集成 `ESLint`、`Prettier`、`Stylelint`、`husky`、`lint-staged` 、`commitlint`等，同时实现了 pinia 在 uniapp 中的持久化插件[pinia-plugin-persist-uni](https://github.com/Allen-1998/pinia-plugin-persist-uni)以及 storeToRefs 增强插件[pinia-auto-refs](https://github.com/Allen-1998/pinia-auto-refs)。

[相关文章 - pinia-plugin-persist-uni 在 uni-app 中持久化存储 pinia](https://juejin.cn/post/7081275565008748552)

[相关文章 - 受够了手动 storeToRefs？来试试这个 vite 插件吧](https://juejin.cn/post/7097893752030625828)

[仓库地址 - uni-vue3-vite-ts-pinia](https://github.com/Allen-1998/uni-vue3-vite-ts-pinia)

## 所用技术栈

- 依赖管理：node v16.x, 如果你已经使用 nvm，可以参考 [Github: nvm](https://github.com/nvm-sh/nvm#deeper-shell-integration) 来实现 node 版本的自动切换
- 小程序框架： [uni-app](https://uniapp.dcloud.io/)
- 构建工具： [Vite](https://vitejs.dev/)
- 前端框架： [Vue3.x](https://v3.cn.vuejs.org/)
- 编程语言： [TypeScript](https://www.typescriptlang.org/)
- 代码规范：
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
  - [Stylelint](https://stylelint.io/)
- css 预处理器： [scss](https://sass-lang.com/)
- 状态管理工具：[pinia](https://pinia.vuejs.org/)
- pinia 数据持久化插件：[pinia-plugin-persist-uni](https://allen-1998.github.io/pinia-plugin-persist-uni/)
- vite 插件：
  - [pinia-auto-refs](https://github.com/Allen-1998/pinia-auto-refs)
  - [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import)
  - [unplugin-vue-components](https://github.com/antfu/unplugin-vue-components)
  - [unocss](https://github.com/unocss/unocss)
  - [auto-import-types](https://github.com/Allen-1998/auto-import-types)

项目规范：
1、页面A跳转页面B，页面B处理完成之后，如果需要回调，采用uni.$emit(CallbackEnum.ON_SELECT_BATCH, result);
其中CallbackEnum为回调函数的key的枚举类型，result为回调数据，页面A可以在onLoad函数中用：
uni.$on(CallbackEnum.ON_SELECT_BATCH, (data) => {
if (data) {

}
});
注意！！！！需要在onUnload方法调用uni.$off(CallbackEnum.ON_SELECT_BATCH) 取消监听
如果多页面注册相同监听，需要向发起emit页面传递fromType区分从哪个页面来，再到相应的uni.$on方法中根据fromType区分处理。

2、页面参数传递：
在setup下 const pageInfo = ref({}), 然后在 onload 里 pageInfo.value = useInit();
[在你需要用到的时候再从 useInit 里解构](https://sdsada?dddddd)

3、小程序/app showToast紧接着页面关闭或者跳转，toast不显示，请调用showToastDelay方法。

4、弹窗统一适用confirm-dialog；如果只有一个确认按钮，cancelText传'none'；

5、页面跳转统一用forward方法，页面回退用back方法，router.ts文件中；

6、<input>组件在使用的时候用v-model双向绑定数据，:value的方式在浏览器可以，手机不起作用
