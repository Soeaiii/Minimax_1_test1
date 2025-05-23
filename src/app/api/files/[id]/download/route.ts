import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 从数据库获取文件信息
    const file = await prisma.file.findUnique({
      where: { id },
    });

    if (!file) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    // 构建文件路径
    const filePath = path.join(process.cwd(), 'public', file.path);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { error: '文件已被删除' },
        { status: 404 }
      );
    }

    // 读取文件
    const fileBuffer = await readFile(filePath);

    // 返回文件
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.mimetype,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.filename)}"`,
        'Content-Length': file.size.toString(),
      },
    });
  } catch (error) {
    console.error('文件下载失败:', error);
    return NextResponse.json(
      { error: '文件下载失败' },
      { status: 500 }
    );
  }
} 