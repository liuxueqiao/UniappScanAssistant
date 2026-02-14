# 使用 Node.js 官方轻量级镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖 (仅生产环境)
RUN npm ci --only=production

# 复制源代码
COPY . .

# 暴露端口 (微信云托管通常使用 80 端口，但我们可以通过环境变量配置)
ENV PORT=80
EXPOSE 80

# 启动命令
CMD ["npm", "start"]
