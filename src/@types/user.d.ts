declare namespace User {
  interface UserInfo {
    user_id: number;
    employeeId: number;
    employee: string;
    tenantId: string;
    tenantName?: string;
  }
}
declare interface DeviceScreenInfo {
  width: number;
  height: number;
  navTop: number;
  statusBarHeight?: number;
  bottomPadding?: number;
  [key: string]: any;
}
