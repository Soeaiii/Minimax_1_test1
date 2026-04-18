#!/bin/bash

# MongoDB Docker 停止脚本

set -e

echo "=== 停止 MongoDB Docker 容器 ==="
echo ""

# 检查容器是否正在运行
if docker ps --format '{{.Names}}' | grep -q '^match7-mongodb$'; then
    echo "停止容器..."
    docker stop match7-mongodb
    echo "✅ 容器已停止"
else
    echo "容器未在运行"
fi

echo ""
echo "=== 容器状态 ==="
docker ps -a --filter name=match7-mongodb

echo ""
echo "要重新启动容器，请运行: ./start-mongodb.sh"
echo ""
