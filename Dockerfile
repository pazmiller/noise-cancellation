# 第一阶段：构建 React 应用
FROM node:18 AS react-builder

WORKDIR /app

# 复制依赖文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制项目代码并构建 React 前端
COPY . . 
RUN npm run build:react

# 第二阶段：构建 Electron 主进程
FROM node:18 AS electron-builder

WORKDIR /app

# 复制 React 构建产物
COPY --from=react-builder /app/react-build /app/react-build

# 复制依赖文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制主进程代码和 tsconfig.json
COPY tsconfig.json .
COPY src/ ./src/  

# 运行 Electron 主进程编译
RUN npm run build:electron

# 第三阶段：最终镜像
FROM node:18 AS final

WORKDIR /app

# 复制构建产物
COPY --from=electron-builder /app/electron-build /app/electron-build
COPY --from=react-builder /app/react-build /app/react-build

# 复制依赖文件并安装生产依赖
COPY package*.json ./
RUN npm install --only=production

# 启动 Electron
CMD ["npx", "electron", "electron-build/main.js"]
