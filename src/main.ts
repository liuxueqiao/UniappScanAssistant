import 'uno.css';
import { createSSRApp } from 'vue';
import App from './App.vue';
import store from '@/store';
export function createApp() {
  const app = createSSRApp(App).use(store);
  return {
    app
  };
}

//#ifndef MP
//uni.connectSocket promisify 兼容问题
const originalConnectSocket = uni.connectSocket;
uni.connectSocket = function (options: any) {
  options.success = options.success || function () {};
  return originalConnectSocket.call(this, options);
};
//#endif
