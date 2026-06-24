import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { withTenantContext } from '@/lib/tenant-context';
export const GET = withTenantContext(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');

    if (!filePath) {
      return NextResponse.json(
        { error: '缺少文件路径参数' },
        { status: 400 }
      );
    }

    // 通过数据库验证文件属于当前租户
    const file = await prisma.file.findFirst({
      where: {
        path: filePath,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    // 构建完整文件路径
    const fullPath = path.join(process.cwd(), 'public', filePath);

    if (!existsSync(fullPath)) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    // 读取文件
    const fileBuffer = await readFile(fullPath);
    
    // 根据文件扩展名确定MIME类型
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/jpeg'; // 默认
    
    switch (ext) {
      case '.png':
        mimeType = 'image/png';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.webp':
        mimeType = 'image/webp';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
      case '.jpg':
      case '.jpeg':
      default:
        mimeType = 'image/jpeg';
        break;
    }

    // 返回文件用于预览
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('文件预览失败:', error);
    return NextResponse.json(
      { error: '文件预览失败' },
      { status: 500 }
    );
  }
});