import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const { id } = await params;

    // 从数据库获取文件信息（验证租户）
    const file = await prisma.file.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
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

    // 只允许预览图片文件
    if (!file.mimetype.startsWith('image/')) {
      return NextResponse.json(
        { error: '该文件类型不支持预览' },
        { status: 400 }
      );
    }

    // 读取文件
    const fileBuffer = await readFile(filePath);

    // 返回文件用于预览
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': file.mimetype,
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
} 