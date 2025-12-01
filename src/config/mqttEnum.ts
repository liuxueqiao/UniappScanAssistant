/**
 * mqtt注册信息, 每个调用的地方需要新增一条注册信息方便管理
 */
export enum msgCBEnum {
  /**
   * 消息总待办数
   */
  MESSAGE_NOTIFY_TOTAL = 'messageNotifyTotal',

  /**
   * 消息中心入口初始化的时候调用
   */
  MESSAGE_INIT = 'messageInit'
}
