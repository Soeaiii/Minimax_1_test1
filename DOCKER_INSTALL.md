# Docker Desktop 安装指南

## 📋 系统信息
- **系统架构**: Apple Silicon (arm64)
- **macOS 版本**: 26.4.1
- **Homebrew**: 已安装

## 🚀 安装方法

### 方法1: 使用 Homebrew (推荐)

打开终端，执行以下命令：

```bash
# 安装 Docker Desktop
brew install --cask docker

# 安装完成后启动 Docker
open /Applications/Docker.app
```

**注意**: 安装过程中可能需要输入管理员密码。

### 方法2: 手动下载安装

1. **下载 Docker Desktop**
   - 访问: https://www.docker.com/products/docker-desktop/
   - 或直接下载: https://desktop.docker.com/mac/main/arm64/Docker.dmg

2. **安装步骤**
   - 双击下载的 `Docker.dmg` 文件
   - 将 Docker 图标拖到 Applications 文件夹
   - 打开 Applications 文件夹，双击 Docker 启动

3. **首次启动**
   - 系统可能会提示"来自身份不明的开发者"
   - 前往: 系统设置 > 隐私与安全性 > 允许 Docker

## ⚙️ 安装后配置

### 1. 启动 Docker Desktop
```bash
# 从应用程序启动
open /Applications/Docker.app

# 或者从终端启动
open -a Docker
```

### 2. 验证安装
```bash
# 检查 Docker 版本
docker --version

# 检查 Docker 是否运行
docker info

# 运行测试容器
docker run hello-world
```

### 3. 配置 Docker 资源限制 (可选)
- 点击菜单栏 Docker 图标
- 选择 "Preferences" 或 "Settings"
- 进入 "Resources" 选项卡
- 设置内存限制 (建议: 2-4 GB)
- 设置 CPU 限制 (建议: 2-4 核心)

## 📦 为比赛管理系统配置 MongoDB

### 1. 创建项目 Docker 配置
```bash
cd /Users/soea/progarm/Minimax_1_test1
mkdir -p docker
cd docker
```

### 2. 创建 docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:7.0
    container_name: match7-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password123
      - MONGO_INITDB_DATABASE=match7
    volumes:
      - mongodb_data:/data/db
    command: mongod --wiredTigerCacheSizeGB 0.25
    mem_limit: 512m

volumes:
  mongodb_data:
```

### 3. 启动 MongoDB
```bash
cd /Users/soea/progarm/Minimax_1_test1/docker
docker-compose up -d
```

### 4. 修改项目的 .env 文件
```env
DATABASE_URL=mongodb://admin:password123@localhost:27017/match7?authSource=admin
```

### 5. 启动比赛管理系统
```bash
cd /Users/soea/progarm/Minimax_1_test1
npm run dev
```

## 🔧 常用 Docker 命令

```bash
# 查看运行中的容器
docker ps

# 查看所有容器
docker ps -a

# 停止容器
docker stop match7-mongodb

# 启动容器
docker start match7-mongodb

# 重启容器
docker restart match7-mongodb

# 查看容器日志
docker logs match7-mongodb

# 进入容器
docker exec -it match7-mongodb mongosh

# 删除容器
docker rm match7-mongodb

# 查看 Docker 资源使用
docker stats
```

## 🐛 常见问题

### 1. Docker 命令未找到
**问题**: `docker: command not found`
**解决**:
```bash
# 检查 Docker 是否在 PATH 中
echo $PATH | grep -i docker

# 如果没有，手动添加
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"

# 或者重新启动终端
```

### 2. Docker Desktop 启动失败
**问题**: 无法启动 Docker Desktop
**解决**:
- 检查系统要求: macOS 11 或更高版本
- 检查虚拟化支持: 系统报告 > 软件 > 系统完整性保护
- 重启电脑后重试

### 3. 端口冲突
**问题**: `Port 27017 is already allocated`
**解决**:
```bash
# 查找占用端口的进程
lsof -i :27017

# 终止进程
kill -9 <进程ID>

# 或者修改 docker-compose.yml 中的端口映射
ports:
  - "27018:27017"  # 改用其他端口
```

### 4. 内存不足
**问题**: Docker 运行缓慢
**解决**:
- 增加 Docker Desktop 内存限制
- 关闭其他占用内存的应用
- 使用轻量级镜像

### 5. 权限问题
**问题**: `Permission denied`
**解决**:
```bash
# 将用户添加到 docker 组
sudo dseditgroup -o edit -a $(whoami) -t user docker

# 重新登录或重启终端
```

## 📞 获取帮助

### 官方文档
- Docker Desktop: https://docs.docker.com/desktop/install/mac-install/
- Docker Compose: https://docs.docker.com/compose/

### 社区支持
- Docker Forums: https://forums.docker.com/
- Stack Overflow: https://stackoverflow.com/questions/tagged/docker

### 检查 Docker 状态
```bash
# 查看详细信息
docker info

# 查看版本
docker version

# 查看系统信息
docker system df

# 清理未使用的资源
docker system prune
```

## 🎯 下一步

安装完成后，你可以:
1. 启动 MongoDB 容器
2. 配置比赛管理系统
3. 开始开发和测试

---

**提示**: Docker Desktop 首次启动可能需要几分钟时间来初始化。
