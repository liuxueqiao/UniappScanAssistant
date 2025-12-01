import { ref } from 'vue';

export const useCountdown = () => {
  /**
   * 倒计时
   */
  const timeCount = ref<number>(0);
  const countDown = ref();
  const countDownFn = async () => {
    // uni.showToast({
    //   title: '获取验证码成功',
    //   icon: 'success',
    //   duration: 3000
    // });
    const mins = 60;
    if (!countDown.value) {
      timeCount.value = mins;
      countDown.value = setInterval(() => {
        if (timeCount.value > 0 && timeCount.value <= mins) {
          timeCount.value--;
        } else {
          clearInterval(countDown.value);
          countDown.value = null;
        }
      }, 1000);
    }
  };
  onUnmounted(() => {
    if (countDown.value) {
      console.log('---onUnmounted-----');
      clearInterval(countDown.value);
      countDown.value = null;
    }
  });
  return {
    countDownFn,
    timeCount,
    countDown
  };
};
