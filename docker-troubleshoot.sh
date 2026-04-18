#!/bin/bash

# Docker Desktop 故障排除脚本

echo "=== Docker Desktop 故障排除 ==="
echo ""

# 检查 Docker Desktop 是否运行
if pgrep -x "Docker Desktop" > /dev/null; then
    echo "✅ Docker Desktop 正在运行"
else
    echo "❌ Docker Desktop 未运行"
    echo ""
    echo "正在启动 Docker Desktop..."
    open -a Docker
    sleep 10
fi

# 检查 Docker 服务
echo ""
echo "检查 Docker 服务..."
if docker info > /dev/null 2>&1; then
    echo "✅ Docker 服务正常"
else
    echo "❌ Docker 服务异常"
    echo ""
    echo "尝试重置 Docker Desktop..."
    
    # 停止 Docker Desktop
    osascript -e 'quit app "Docker"'
    sleep 5
    
    # 清理 Docker 文件
    rm -f ~/Library/Containers/com.docker.docker/Data/vms/0/data/Docker.raw
    rm -rf ~/Library/Group\ Containers/group.com.docker/*
    
    # 重新启动
    open -a Docker
    echo "已重置 Docker Desktop，请等待启动..."
fi

echo ""
echo "=== 完成 ==="
echo ""
echo "如果问题仍然存在，请尝试:"
echo "1. 重启电脑"
echo "2. 重新安装 Docker Desktop"
echo "3. 检查系统更新"
