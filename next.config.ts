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
};

export default nextConfig;
