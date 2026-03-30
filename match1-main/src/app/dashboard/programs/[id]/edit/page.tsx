import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "@/components/dashboard/programs/ProgramForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const program = await prisma.program.findUnique({
    where: { id },
    select: { name: true }
  });

  return {
    title: program ? `编辑 ${program.name}` : "编辑节目",
    description: "编辑节目的基本信息、参与者和其他设置"
  };
}

export default async function EditProgramPage({ params }: PageProps) {
  const { id } = await params;
  
  // 检查用户登录状态
  // @ts-ignore
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard/programs/' + id + '/edit');
  }

  // 获取节目详细信息
  const program = await prisma.program.findUnique({
    where: { id },
    include: {
      competition: {
        select: {
          id: true,
          name: true,
          organizerId: true,
        }
      },
      participants: {
        select: {
          id: true,
          name: true,
          team: true,
        }
      },
    }
  });

  if (!program) {
    notFound();
  }

  // 权限检查 - 只有管理员或比赛组织者可以编辑
  const canEdit = session.user.role === 'ADMIN' || 
                  program.competition.organizerId === session.user.id;

  if (!canEdit) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href={`/dashboard/programs/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回节目详情
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">权限不足</h1>
        </div>
        <div className="rounded-md border border-destructive bg-destructive/10 p-6">
          <p className="text-destructive">
            您没有权限编辑此节目。只有管理员或比赛组织者可以进行此操作。
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={`/dashboard/programs/${id}`}>返回节目详情</Link>
          </Button>
        </div>
      </div>
    );
  }

  // 准备表单初始数据
  const initialData = {
    id: program.id,
    name: program.name,
    description: program.description || '',
    competitionId: program.competitionId,
    order: program.order,
    currentStatus: program.currentStatus,
    participantIds: program.participants.map(p => p.id),
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/programs/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回节目详情
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">编辑节目</h1>
            <p className="text-muted-foreground">
              修改 "{program.name}" 的信息
            </p>
          </div>
        </div>
      </div>

      {/* 表单区域 */}
      <div className="border rounded-lg p-6">
        <ProgramForm 
          initialData={initialData}
          isEditMode={true}
          competitionId={program.competitionId}
        />
      </div>
    </div>
  );
} 