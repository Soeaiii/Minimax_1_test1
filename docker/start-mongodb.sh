#!/bin/bash

# MongoDB Docker 启动脚本

set -e

echo "=== 启动 MongoDB Docker 容器 ==="
echo ""

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker 未运行"
    echo "请先启动 Docker Desktop"
    echo ""
    echo "启动方法:"
    echo "1. 从应用程序启动 Docker"
    echo "2. 或运行: open /Applications/Docker.app"
    exit 1
fi

echo "✅ Docker 正在运行"
echo ""

# 检查容器是否已存在
if docker ps -a --format '{{.Names}}' | grep -q '^match7-mongodb$'; then
    echo "容器 match7-mongodb 已存在"
    
    # 检查容器是否正在运行
    if docker ps --format '{{.Names}}' | grep -q '^match7-mongodb$'; then
        echo "✅ 容器已在运行"
    else
        echo "启动容器..."
        docker start match7-mongodb
        echo "✅ 容器已启动"
    fi
else
    echo "创建并启动容器..."
    docker-compose up -d
    echo "✅ 容器已创建并启动"
fi

echo ""
echo "=== MongoDB 连接信息 ==="
echo "容器名称: match7-mongodb"
echo "端口: 27017"
echo "用户名: admin"
echo "密码: password123"
echo "数据库: match7"
echo ""
echo "连接字符串:"
echo "mongodb://admin:password123@localhost:27017/match7?authSource=admin"
echo ""
echo "=== 验证连接 ==="
echo "等待 MongoDB 启动..."
sleep 5

# 测试连接
if docker exec match7-mongodb mongosh --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1; then
    echo "✅ MongoDB 连接成功!"
else
    echo "⚠️ MongoDB 可能还在启动中，请稍后重试"
fi

echo ""
echo "=== 常用命令 ==="
echo "查看容器状态: docker ps"
echo "查看日志: docker logs match7-mongodb"
echo "停止容器: docker stop match7-mongodb"
echo "重启容器: docker restart match7-mongodb"
echo "进入容器: docker exec -it match7-mongodb mongosh"
echo ""
