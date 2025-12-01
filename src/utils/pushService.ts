/**
 * TencentCloud-Push 推送服务工具类
 * 封装推送服务的初始化、注册、绑定、解绑等功能
 */

// #ifdef APP-PLUS
import * as Push from '@/uni_modules/TencentCloud-Push';
import { bindTencentAccount } from '@/api/msg';
import { CallbackEnum } from '@/config/enums';

// 推送配置
const PUSH_CONFIG = {
  SDKAppID: 1600106787, // 您的 SDKAppID
  appKey: '27ZaVB8rpHWH7KkhOGDYyik8bbwxBjeJXwlzVakanXfaiVFtglyAWLIU5J3220Q7' // 客户端密钥
};

/**
 * 注册推送服务
 * @param onSuccess 注册成功回调
 * @param onError 注册失败回调
 * @returns Promise<string> 返回 registrationID
 */
export const registerPushService = ({ tenantId, employeeId }) => {
  Push.setRegistrationID(`${tenantId}-${employeeId}`, (res) => {
    console.log('===res', res);
  });
  setTimeout(() => {
    Push.registerPush(
      PUSH_CONFIG.SDKAppID,
      PUSH_CONFIG.appKey,
      (data) => {
        console.log('[PushService] registerPush 成功', data);
        Push.getRegistrationID((registrationID) => {
          console.log('[PushService] getRegistrationID 成功', registrationID);
        });
      },
      (errCode, errMsg) => {
        console.error('[PushService] registerPush 失败', errCode, errMsg);
      }
    );
  }, 2000);
};

/**
 * 绑定腾讯推送账号
 * 在绑定前会确保推送服务已注册
 * @returns Promise<boolean> 绑定是否成功
 */
export const bindPushAccount = async ({
  tenantId,
  employeeId,
  deviceCode
}): Promise<boolean> => {
  try {
    // 确保推送服务已注册
    await initPushService({
      tenantId,
      employeeId
    });
    // 调用绑定接口
    const result = await bindTencentAccount({
      tencentIMAccount: `${tenantId}-${employeeId}`,
      imei: deviceCode
    });

    if (result) {
      console.log('[PushService] 推送账号绑定成功');
      return true;
    } else {
      console.error('[PushService] 推送账号绑定失败');
      return false;
    }
  } catch (error) {
    console.error('[PushService] 绑定推送账号异常:', error);
    return false;
  }
};

/**
 * 通知栏点击事件处理
 */
const handleNotificationClicked = (res: any) => {
  console.log('[PushService] 通知栏点击', res);

  // 延迟切换到消息tab，确保页面完全加载，并传递参数标识来自通知栏
  setTimeout(() => {
    uni.setStorageSync('tabParams', {
      from: 'notification' // 自定义参数
    });
    uni.switchTab({
      url: '/pages/msg/index'
    });
  }, 1000);
};

/**
 * 在线推送消息接收处理
 */
const handleMessageReceived = (res: any) => {
  console.log('[PushService] 收到推送消息', res);

  const {
    getToDoUnReadCount,
    getVipUnReadCount,
    setToDoUnReadCount,
    setVipUnReadCount
  } = useStore('message');

  const messageExt = JSON.parse(res?.data?.ext || '{}');

  let toDoUnReadCount = getToDoUnReadCount.value;
  let vipUnReadCount = getVipUnReadCount.value;

  // 根据推送消息更新待办数量
  if (messageExt?.taskInfo?.taskTypeCounts?.length) {
    messageExt.taskInfo.taskTypeCounts.forEach((item: any) => {
      if (item.taskType === 1) {
        toDoUnReadCount = item.pendingCount || 0;
        setToDoUnReadCount(toDoUnReadCount);
      } else if (item.taskType === 2) {
        vipUnReadCount = item.pendingCount || 0;
        setVipUnReadCount(vipUnReadCount);
      }
    });
  }

  const total = toDoUnReadCount + vipUnReadCount;

  // 发送事件通知
  uni.$emit(CallbackEnum.ON_UPDATE_COUNT, {
    toDoUnReadCount: total,
    toDoIsDot: true,
    approvalUnReadCount: toDoUnReadCount,
    vipUnReadCount
  });

  // 更新 TabBar 角标
  if (total > 0) {
    uni.setTabBarBadge({
      index: 1, // 消息Tab的索引
      text: total > 99 ? '99+' : total.toString()
    });
  } else {
    // 移除角标
    uni.removeTabBarBadge({
      index: 1
    });
  }
};

/**
 * 推送消息撤回处理
 */
const handleMessageRevoked = (res: any) => {
  console.log('[PushService] 推送消息撤回', res);
};

/**
 * 设置推送监听器
 */
export const setupPushListeners = () => {
  // 监听通知栏点击事件
  Push.addPushListener(
    Push.EVENT.NOTIFICATION_CLICKED,
    handleNotificationClicked
  );

  // 监听在线推送
  Push.addPushListener(Push.EVENT.MESSAGE_RECEIVED, handleMessageReceived);

  // 监听在线推送被撤回
  Push.addPushListener(Push.EVENT.MESSAGE_REVOKED, handleMessageRevoked);

  console.log('[PushService] 推送监听器设置完成');
};

/**
 * 移除推送监听器
 */
export const removePushListeners = () => {
  Push.removePushListener(
    Push.EVENT.NOTIFICATION_CLICKED,
    handleNotificationClicked
  );
  Push.removePushListener(Push.EVENT.MESSAGE_RECEIVED, handleMessageReceived);
  Push.removePushListener(Push.EVENT.MESSAGE_REVOKED, handleMessageRevoked);

  console.log('[PushService] 推送监听器已移除');
};

/**
 * 获取通知扩展信息
 */
export const getNotificationExtInfo = () => {
  Push.getNotificationExtInfo((extInfo: any) => {
    console.log('[PushService] 获取通知扩展信息', extInfo);
  });
};

/**
 * 初始化推送服务（包括注册和设置监听器）
 * @returns Promise<string> 返回 registrationID
 */
export const initPushService = async ({ tenantId, employeeId }) => {
  try {
    // 注册推送服务
    registerPushService({ tenantId, employeeId });
    setupPushListeners();
    console.log('[PushService] 推送服务初始化完成');
    return 'success';
  } catch (error) {
    console.error('[PushService] 推送服务初始化失败', error);
    return '';
  }
};

// #endif
