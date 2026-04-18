#!/bin/bash

# Docker Desktop 安装脚本
# 适用于 macOS Apple Silicon

set -e

echo "=== Docker Desktop 安装脚本 ==="
echo ""

# 检查系统架构
ARCH=$(uname -m)
if [ "$ARCH" = "arm64" ]; then
    echo "✅ 检测到 Apple Silicon (arm64)"
    DOCKER_URL="https://desktop.docker.com/mac/main/arm64/Docker.dmg"
else
    echo "✅ 检测到 Intel ($ARCH)"
    DOCKER_URL="https://desktop.docker.com/mac/main/amd64/Docker.dmg"
fi

# 检查是否已安装 Docker
if [ -d "/Applications/Docker.app" ]; then
    echo "✅ Docker Desktop 已安装"
    echo ""
    echo "启动 Docker Desktop..."
    open /Applications/Docker.app
    exit 0
fi

echo ""
echo "选择安装方式:"
echo "1. 使用 Homebrew 安装 (推荐)"
echo "2. 手动下载安装"
echo "3. 取消安装"
echo ""
read -p "请选择 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "=== 使用 Homebrew 安装 ==="
        
        # 检查 Homebrew
        if ! command -v brew &> /dev/null; then
            echo "❌ Homebrew 未安装"
            echo "请先安装 Homebrew:"
            echo "/bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            exit 1
        fi
        
        echo "✅ Homebrew 已安装"
        echo ""
        echo "正在安装 Docker Desktop..."
        echo "这可能需要几分钟时间，并且需要管理员密码"
        echo ""
        
        # 安装 Docker
        brew install --cask docker
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Docker Desktop 安装成功!"
            echo ""
            echo "启动 Docker Desktop..."
            open /Applications/Docker.app
        else
            echo ""
            echo "❌ 安装失败"
            echo "请尝试手动安装"
            exit 1
        fi
        ;;
        
    2)
        echo ""
        echo "=== 手动下载安装 ==="
        echo ""
        echo "请按照以下步骤操作:"
        echo ""
        echo "1. 下载 Docker Desktop:"
        echo "   $DOCKER_URL"
        echo ""
        echo "2. 打开下载的 Docker.dmg 文件"
        echo ""
        echo "3. 将 Docker 图标拖到 Applications 文件夹"
        echo ""
        echo "4. 打开 Applications 文件夹，双击 Docker 启动"
        echo ""
        echo "5. 首次启动时，系统可能会提示安全警告"
        echo "   前往: 系统设置 > 隐私与安全性 > 允许 Docker"
        echo ""
        
        # 询问是否打开下载页面
        read -p "是否打开下载页面? (y/n): " open_url
        if [ "$open_url" = "y" ] || [ "$open_url" = "Y" ]; then
            open "$DOCKER_URL"
        fi
        ;;
        
    3)
        echo ""
        echo "安装已取消"
        exit 0
        ;;
        
    *)
        echo ""
        echo "无效选择"
        exit 1
        ;;
esac

echo ""
echo "=== 安装完成 ==="
echo ""
echo "接下来的步骤:"
echo "1. 等待 Docker Desktop 启动完成"
echo "2. 验证安装: docker --version"
echo "3. 为比赛管理系统配置 MongoDB"
echo ""
echo "详细说明请查看: DOCKER_INSTALL.md"
echo ""
