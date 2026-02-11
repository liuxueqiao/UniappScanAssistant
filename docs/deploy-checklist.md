# 部署与发布 Checklist（MVP）

## 后端

- 环境变量
  - `MONGO_URI`（生产推荐外部 MongoDB）
  - `JWT_SECRET`、`ADMIN_KEY`（生产必须更换为强随机字符串）
  - `WX_APPID`、`WX_SECRET`
  - COS 相关变量（如启用上传）
- 安全
  - 仅在服务端保存敏感密钥，不在前端代码中出现
  - 管理接口仅内网或加网关鉴权（当前使用 `x-admin-key`）
- 运行
  - `npm ci` / `npm install`
  - `npm run lint`
  - `npm start`

## 小程序

- `API_BASE_URL` 指向线上 API 域名
- 小程序后台配置 request 合法域名（HTTPS）
- 登录、打卡、创建/加入小队、挑战周榜、内容页联调自测

