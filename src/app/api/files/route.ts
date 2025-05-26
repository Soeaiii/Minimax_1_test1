import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: '未授权访问' },
        { status: 401 }
      );
    }

    const { fileIds } = await request.json();

    if (!Array.isArray(fileIds) || fileIds.length === 0) {
      return NextResponse.json(
        { error: '请提供要删除的文件ID' },
        { status: 400 }
      );
    }

    // 获取要删除的文件信息
    const filesToDelete = await prisma.file.findMany({
      where: {
        id: {
          in: fileIds,
        },
      },
      include: {
        programs: true,
        competitions: true,
      },
    });

    if (filesToDelete.length === 0) {
      return NextResponse.json(
        { error: '没有找到要删除的文件' },
        { status: 404 }
      );
    }

    // 检查权限 - 如果有文件被使用且用户不是管理员/组织者，则不允许删除
    const filesWithAssociations = filesToDelete.filter(file => 
      file.programs.length > 0 || file.competitions.length > 0
    );
    
    if (filesWithAssociations.length > 0 && session.user.role !== 'ADMIN' && session.user.role !== 'ORGANIZER') {
      return NextResponse.json(
        { error: `有 ${filesWithAssociations.length} 个文件正在使用中，无法删除` },
        { status: 400 }
      );
    }

    let deletedCount = 0;
    const physicalDeleteErrors: string[] = [];

    // 批量删除文件
    for (const file of filesToDelete) {
      try {
        // 构建文件路径
        const filePath = path.join(process.cwd(), 'public', file.path);
        
        // 删除物理文件
        try {
          if (existsSync(filePath)) {
            await unlink(filePath);
          } else {
            console.warn('物理文件不存在:', filePath);
          }
        } catch (fileError) {
          console.error('删除物理文件失败:', file.filename, fileError);
          physicalDeleteErrors.push(file.filename);
          // 继续删除数据库记录，即使物理文件删除失败
        }

        // 删除数据库记录
        await prisma.file.delete({
          where: { id: file.id },
        });

        // 记录审计日志
        try {
          await prisma.auditLog.create({
            data: {
              userId: session.user.id,
              action: 'DELETE_FILE',
              targetId: file.id,
              details: {
                filename: file.filename,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype,
                batchOperation: true,
              },
            },
          });
        } catch (auditError) {
          console.error('记录审计日志失败:', auditError);
        }

        deletedCount++;
      } catch (error) {
        console.error('删除文件失败:', file.filename, error);
      }
    }

    let message = `成功删除 ${deletedCount} 个文件`;
    if (physicalDeleteErrors.length > 0) {
      message += `，但有 ${physicalDeleteErrors.length} 个物理文件删除失败: ${physicalDeleteErrors.join(', ')}`;
    }

    return NextResponse.json({ 
      message,
      deletedCount,
      physicalDeleteErrors,
    });
  } catch (error) {
    console.error('批量删除文件失败:', error);
    return NextResponse.json(
      { error: '批量删除文件失败' },
      { status: 500 }
    );
  }
} 