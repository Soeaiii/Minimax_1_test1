import { Metadata } from "next";
import { CompetitionForm } from "@/components/dashboard/competitions/CompetitionForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "编辑比赛 | 比赛管理系统",
  description: "编辑现有比赛信息",
};

// 获取比赛详情
async function getCompetition(id: string) {
  try {
    return await prisma.competition.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        scoringCriteria: true,
      },
    });
  } catch (error) {
    console.error('获取比赛详情失败:', error);
    return null;
  }
}

export default async function EditCompetitionPage({ params }: { params: Promise<{ id: string }> }) {
  // 解包 params Promise
  const { id } = await params;
  
  // 检查用户是否已登录
  // @ts-ignore 忽略类型错误
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect(`/auth/login?callbackUrl=/dashboard/competitions/${id}/edit`);
  }
  
  const competition = await getCompetition(id);
  
  if (!competition) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回比赛列表
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">比赛不存在</h1>
        </div>
        <div className="rounded-md border border-destructive bg-destructive/10 p-6">
          <p className="text-destructive">无法找到该比赛，请确认比赛ID是否正确。</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/competitions">返回比赛列表</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // 检查权限 - 仅管理员或比赛组织者可以编辑
  if (session.user.role !== 'ADMIN' && competition.organizerId !== session.user.id) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href={`/dashboard/competitions/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回比赛详情
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">无权限</h1>
        </div>
        <div className="rounded-md border border-destructive bg-destructive/10 p-6">
          <p className="text-destructive">您没有权限编辑此比赛，只有管理员或比赛组织者可以进行编辑。</p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href={`/dashboard/competitions/${id}`}>返回比赛详情</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href={`/dashboard/competitions/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回比赛详情
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">编辑比赛</h1>
        </div>
      </div>
      
      <div className="border rounded-md p-6">
        <CompetitionForm initialData={competition} isEditMode={true} />
      </div>
    </div>
  );
} 