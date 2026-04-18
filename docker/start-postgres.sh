#!/bin/bash

# PostgreSQL Docker 启动脚本

set -e

echo "=== 启动 PostgreSQL Docker 容器 ==="
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
if docker ps -a --format '{{.Names}}' | grep -q '^match7-postgres$'; then
    echo "容器 match7-postgres 已存在"
    
    # 检查容器是否正在运行
    if docker ps --format '{{.Names}}' | grep -q '^match7-postgres$'; then
        echo "✅ 容器已在运行"
    else
        echo "启动容器..."
        docker start match7-postgres
        echo "✅ 容器已启动"
    fi
else
    echo "创建并启动容器..."
    docker-compose up -d
    echo "✅ 容器已创建并启动"
fi

echo ""
echo "=== PostgreSQL 连接信息 ==="
echo "容器名称: match7-postgres"
echo "端口: 5432"
echo "用户名: postgres"
echo "密码: password"
echo "数据库: match7"
echo ""
echo "连接字符串:"
echo "postgresql://postgres:password@localhost:5432/match7"
echo ""
echo "=== 验证连接 ==="
echo "等待 PostgreSQL 启动..."
sleep 10

# 测试连接
if docker exec match7-postgres pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL 连接成功!"
    
    # 检查数据库是否存在
    if docker exec match7-postgres psql -U postgres -lqt | cut -d \| -f 1 | grep -qw match7; then
        echo "✅ 数据库 'match7' 已存在"
    else
        echo "⚠️ 数据库 'match7' 不存在，正在创建..."
        docker exec match7-postgres psql -U postgres -c "CREATE DATABASE match7;"
        echo "✅ 数据库 'match7' 已创建"
    fi
else
    echo "⚠️ PostgreSQL 可能还在启动中，请稍后重试"
fi

echo ""
echo "=== 常用命令 ==="
echo "查看容器状态: docker ps"
echo "查看日志: docker logs match7-postgres"
echo "停止容器: docker stop match7-postgres"
echo "重启容器: docker restart match7-postgres"
echo "进入容器: docker exec -it match7-postgres psql -U postgres"
echo ""
echo "=== 下一步 ==="
echo "1. 更新项目的 .env 文件:"
echo "   DATABASE_URL=postgresql://postgres:password@localhost:5432/match7"
echo ""
echo "2. 生成 Prisma 客户端:"
echo "   npx prisma generate"
echo ""
echo "3. 推送数据库 schema:"
echo "   npx prisma db push"
echo ""
echo "4. 启动项目:"
echo "   npm run dev"
echo ""
