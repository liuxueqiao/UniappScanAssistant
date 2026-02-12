# 瘦身圈后端（MVP）

## 本地启动

1. 启动 MongoDB

```bash
cd ..
docker compose up -d
```

如果本机没有 Docker，可使用内存版 MongoDB（仅用于开发/演示）：

```bash
cd backend
cp .env.example .env
sed -i '' 's/MONGO_IN_MEMORY=0/MONGO_IN_MEMORY=1/' .env
```

2. 安装依赖并启动

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## 环境变量

参考 [.env.example](file:///Users/liuxueqiao/qiao/mine_practice/UniappScanAssistant/backend/.env.example)。

## 接口概览

- `GET /health`
- `POST /api/auth/wx-login`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/weights/check-in`
- `GET /api/weights/history`
- `POST /api/teams`
- `POST /api/teams/join`
- `POST /api/teams/leave`
- `GET /api/teams/me`
- `GET /api/challenges/current`
- `POST /api/challenges/join`
- `GET /api/challenges/team-rank`
- `GET /api/articles/latest`
- `GET /api/articles/:id`
- `POST /api/articles`（管理员，header: `x-admin-key`）
- `PATCH /api/articles/:id`（管理员，header: `x-admin-key`）
- `GET /api/cos/sts`



<!--secret 7009ec900408803529b78dc3f372258c -->