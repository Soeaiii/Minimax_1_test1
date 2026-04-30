import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// 删除单个文件
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const params = await context.params;

    // 从数据库获取文件信息（验证租户）
    const file = await prisma.file.findUnique({
      where: {
        id: params.id,
        tenantId: session.user.tenantId,
      },
      include: {
        participantPrograms: true,
        competitions: true,
      },
    });

    if (!file) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    // 检查文件是否被使用（如果有关联的节目或比赛，可能需要额外权限检查）
    const hasAssociations = file.programs.length > 0 || file.competitions.length > 0;

    if (hasAssociations && session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: '文件正在使用中，无法删除' },
        { status: 400 }
      );
    }

    // 构建文件路径
    const filePath = path.join(process.cwd(), 'public', file.path);

    try {
      // 删除物理文件（如果存在）
      if (existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (fileError) {
      console.error('删除物理文件失败:', fileError);
      // 继续删除数据库记录，即使物理文件删除失败
    }

    // 删除数据库记录
    await prisma.file.delete({
      where: { id: params.id },
    });

    // 记录审计日志
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          tenantId: session.user.tenantId,
          action: 'DELETE_FILE',
          targetId: params.id,
          details: {
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
          },
        },
      });
    } catch (auditError) {
      console.error('记录审计日志失败:', auditError);
    }

    return NextResponse.json({
      message: '文件删除成功',
      deletedFile: {
        id: file.id,
        filename: file.filename,
      }
    });
  } catch (error) {
    console.error('删除文件失败:', error);
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    );
  }
}