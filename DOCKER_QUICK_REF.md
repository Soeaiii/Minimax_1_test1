# Docker 快速参考卡

## 🚀 安装 Docker

### 方法1: 使用脚本 (推荐)
```bash
cd /Users/soea/progarm/Minimax_1_test1
./install-docker.sh
```

### 方法2: 手动安装
1. 访问: https://www.docker.com/products/docker-desktop/
2. 下载 Docker Desktop for Mac (Apple Silicon)
3. 安装并启动

## 📦 启动 MongoDB

### 快速启动
```bash
cd /Users/soea/progarm/Minimax_1_test1/docker
./start-mongodb.sh
```

### 手动启动
```bash
cd /Users/soea/progarm/Minimax_1_test1/docker
docker-compose up -d
```

## 🔗 连接信息

| 项目 | 值 |
|------|-----|
| 容器名称 | match7-mongodb |
| 端口 | 27017 |
| 用户名 | admin |
| 密码 | password123 |
| 数据库 | match7 |
| 连接字符串 | `mongodb://admin:password123@localhost:27017/match7?authSource=admin` |

## 📝 配置项目

### 修改 .env 文件
```env
DATABASE_URL=mongodb://admin:password123@localhost:27017/match7?authSource=admin
```

### 启动项目
```bash
cd /Users/soea/progarm/Minimax_1_test1
npm run dev
```

## 🔧 常用命令

### Docker 命令
```bash
# 查看容器状态
docker ps

# 查看所有容器
docker ps -a

# 查看日志
docker logs match7-mongodb

# 停止容器
docker stop match7-mongodb

# 启动容器
docker start match7-mongodb

# 重启容器
docker restart match7-mongodb

# 进入容器
docker exec -it match7-mongodb mongosh

# 删除容器
docker rm match7-mongodb
```

### MongoDB 命令
```bash
# 连接 MongoDB
docker exec -it match7-mongodb mongosh

# 查看数据库
show dbs

# 切换数据库
use match7

# 查看集合
show collections

# 退出
exit
```

## 📁 文件结构

```
/Users/soea/progarm/Minimax_1_test1/
├── install-docker.sh          # Docker 安装脚本
├── DOCKER_INSTALL.md          # Docker 安装指南
├── STARTUP.md                 # 项目启动指南
└── docker/
    ├── docker-compose.yml     # Docker Compose 配置
    ├── .env                   # Docker 环境变量
    ├── start-mongodb.sh       # 启动脚本
    └── stop-mongodb.sh        # 停止脚本
```

## 🐛 故障排除

### 1. Docker 未运行
```bash
# 启动 Docker Desktop
open /Applications/Docker.app
```

### 2. 端口冲突
```bash
# 查找占用端口的进程
lsof -i :27017

# 终止进程
kill -9 <进程ID>
```

### 3. 容器无法启动
```bash
# 查看容器日志
docker logs match7-mongodb

# 重新创建容器
docker-compose down
docker-compose up -d
```

### 4. 连接失败
```bash
# 检查容器状态
docker ps

# 检查端口映射
docker port match7-mongodb

# 测试连接
docker exec match7-mongodb mongosh --eval "db.runCommand({ ping: 1 })"
```

## 📞 获取帮助

### 文档
- `STARTUP.md` - 项目启动指南
- `DOCKER_INSTALL.md` - Docker 安装指南
- Docker 官方文档: https://docs.docker.com/

### 检查状态
```bash
# 检查 Docker
docker info

# 检查 MongoDB
docker exec match7-mongodb mongosh --eval "db.runCommand({ ping: 1 })"

# 检查项目
curl http://localhost:3000
```

---

**提示**: 首次启动可能需要下载镜像，请耐心等待。
