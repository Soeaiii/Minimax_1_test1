import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 启用 App Router 的 serverActions
    serverActions: {
      bodySizeLimit: '50mb'
    }
  },
  // 静态文件优化
  images: {
    domains: ['localhost'],
    // 图片优化配置
    formats: ['image/webp', 'image/avif'],
  },
  // 允许局域网访问
  allowedDevOrigins: ['127.0.0.1:3000', '192.168.1.103:3000', 'localhost:3000'],
};

export default nextConfig;
