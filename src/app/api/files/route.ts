import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const files = await prisma.file.findMany({
      include: {
        programs: {
          select: {
            id: true,
            name: true,
          },
        },
        competitions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(files);
  } catch (error) {
    console.error('获取文件列表失败:', error);
    return NextResponse.json(
      { error: '获取文件列表失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { fileIds } = await request.json();

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: '请提供要删除的文件ID' },
        { status: 400 }
      );
    }

    // 删除数据库记录
    await prisma.file.deleteMany({
      where: {
        id: {
          in: fileIds,
        },
      },
    });

    // TODO: 删除物理文件
    // 这里应该删除实际的文件，但需要根据存储策略实现

    return NextResponse.json({ 
      message: `成功删除 ${fileIds.length} 个文件` 
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    );
  }
} 