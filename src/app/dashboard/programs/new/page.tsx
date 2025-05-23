import { Metadata } from "next";
import { ProgramForm } from "@/components/dashboard/programs/ProgramForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "创建节目 | 比赛管理系统",
  description: "创建新的节目",
};

export default async function NewProgramPage({
  searchParams,
}: {
  searchParams: Promise<{ competitionId?: string }>;
}) {
  // 检查用户是否已登录
  // @ts-ignore 忽略类型错误
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard/programs/new');
  }

  // 获取searchParams
  const params = await searchParams;
  
  // 获取比赛ID（如果有）
  const competitionId = params.competitionId;
  
  // 如果指定了比赛ID，验证比赛是否存在
  let competition = null;
  if (competitionId) {
    try {
      competition = await prisma.competition.findUnique({
        where: { id: competitionId },
        select: { id: true, name: true, organizerId: true },
      });
      
      // 如果比赛不存在，重定向到节目列表
      if (!competition) {
        return (
          <div className="space-y-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link href="/dashboard/programs">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  返回节目列表
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">比赛不存在</h1>
            </div>
            <div className="rounded-md border border-destructive bg-destructive/10 p-6">
              <p className="text-destructive">无法找到指定的比赛，请确认比赛ID是否正确。</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/competitions">返回比赛列表</Link>
              </Button>
            </div>
          </div>
        );
      }
      
      // 检查用户是否有权限为该比赛添加节目
      if (session.user.role !== 'ADMIN' && competition.organizerId !== session.user.id) {
        return (
          <div className="space-y-6">
            <div className="flex items-center">
              <Button variant="ghost" size="sm" asChild className="mr-2">
                <Link href={`/dashboard/competitions/${competitionId}`}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  返回比赛详情
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">无权限</h1>
            </div>
            <div className="rounded-md border border-destructive bg-destructive/10 p-6">
              <p className="text-destructive">您没有权限为此比赛添加节目，只有管理员或比赛组织者可以进行此操作。</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href={`/dashboard/competitions/${competitionId}`}>返回比赛详情</Link>
              </Button>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error('获取比赛详情失败:', error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href={competitionId 
              ? `/dashboard/competitions/${competitionId}`
              : "/dashboard/programs"
            }>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {competitionId ? '返回比赛详情' : '返回节目列表'}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {competitionId 
              ? `在${competition?.name || ''}中添加节目` 
              : '创建新节目'
            }
          </h1>
        </div>
      </div>
      
      <div className="border rounded-md p-6">
        <ProgramForm competitionId={competitionId} />
      </div>
    </div>
  );
} 