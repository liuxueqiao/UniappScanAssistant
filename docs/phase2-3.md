# 阶段二/三扩展设计（草案）

## 目标

- 阶段二：把“熟人社交 + 每周挑战”做成可持续留存的闭环（榜单、激励、内容、回访）
- 阶段三：提升可信度与规模化能力（反作弊、运营后台、数据分析）

## 数据模型建议

### 打卡与体重

- `WeightRecord`（已有）：`userId + dateKey` 唯一
- 新增 `CheckIn`（可选）：从“体重打卡”抽象出更通用的“行为打卡”
  - 字段：`userId`, `dateKey`, `type`（weight/steps/diet/...）, `payload`（对象）
  - 用途：后续扩展不局限于体重

### 挑战体系

- `Challenge`（已有）：支持更多类型
  - `type`: `weight_loss_weekly | weight_loss_monthly | habit_streak | steps_weekly`
  - `rules`: `{ metric, target, unit, ranking }`（可扩展）
  - `visibility`: `team_only | public`
- `ChallengeParticipation`（建议拆表）
  - 现状 participants 内嵌可用，但规模化后建议拆出以便索引与统计
  - 字段：`challengeId`, `userId`, `teamId`, `startValue`, `endValue`, `delta`, `score`, `rank`, `status`

### 小队与关系

- `Team`（已有）
- 新增 `TeamInvite`（可选）
  - 字段：`teamId`, `code`, `createdBy`, `expiresAt`, `usedBy`, `usedAt`
  - 用于邀请码过期与防刷

### 激励与成长

- `Achievement`
  - 字段：`key`, `name`, `desc`, `iconUrl`, `criteria`（规则）
- `UserAchievement`
  - 字段：`userId`, `achievementKey`, `unlockedAt`
- `PointLedger`（可选积分体系）
  - 字段：`userId`, `type`, `points`, `ref`, `createdAt`

### 内容体系

- `Article`（已有）
- 新增 `ArticleView`
  - 字段：`userId`, `articleId`, `viewedAt`
  - 用于推荐与埋点

### 风控与可信度（阶段三）

- `Proof`
  - 字段：`userId`, `dateKey`, `type`（scale_photo / screenshot）, `cosKey`, `status`, `reviewedBy`, `reviewedAt`
- `DeviceFingerprint`（可选）
  - 字段：`userId`, `deviceIdHash`, `createdAt`, `lastSeenAt`

## API 扩展建议

### 挑战

- `GET /api/challenges`：挑战列表（按 team/public、周/月过滤）
- `POST /api/challenges/:id/join`：报名
- `GET /api/challenges/:id/leaderboard`：榜单
- `GET /api/challenges/:id/me`：我的进度（展示原始值仅自己可见）

### 小队

- `POST /api/teams/invite`：生成可过期邀请码
- `GET /api/teams/:id/summary`：成员统计（打卡率、周趋势）

### 内容

- `GET /api/articles/feed`：个性化/小队热门 feed
- `POST /api/articles/:id/view`：埋点

### 风控（阶段三）

- `POST /api/proofs`：提交凭证（配合 COS STS）
- `GET /api/admin/proofs`：审核队列
- `PATCH /api/admin/proofs/:id`：审核通过/拒绝

## 隐私与权限原则

- 原始体重只对本人可见；他人只展示变化值（delta）与比例（lossRate）
- 榜单默认小队内；公开榜单需单独开关并提供匿名化展示选项
- 任何与 COS 上传相关的临时凭证都应限制 `allowPrefix` 到用户目录或业务前缀

