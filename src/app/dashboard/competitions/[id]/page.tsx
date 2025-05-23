import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Edit, Archive, Monitor } from "lucide-react";
import { CompetitionDetail } from "@/components/dashboard/competitions/CompetitionDetail";
import { CompetitionTabs } from "@/components/dashboard/competitions/CompetitionTabs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 使用直接数据库查询而不是API调用
async function getCompetition(id: string) {
  try {
    // 检查ID是否有效的ObjectId格式
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      throw new Error('无效的比赛ID格式');
    }
    
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        programs: {
          include: {
            participants: {
              select: {
                id: true,
                name: true,
                team: true,
                bio: true,
              }
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        scoringCriteria: {
          select: {
            id: true,
            name: true,
            weight: true,
            maxScore: true,
          },
        },
        rankings: {
          include: {
            program: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            rank: 'asc',
          },
        },
      },
    });
    
    if (!competition) {
      throw new Error('比赛不存在');
    }
    
    return competition;
  } catch (error) {
    console.error('获取比赛详情出错：', error);
    throw error;
  }
}

// 修复：直接解构params而不是使用use()
export default async function CompetitionDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 修复：在 Next.js 15 中 params 需要被 await
  const { id } = await params;
  
  // 检查用户是否已登录
  // @ts-ignore NextAuth类型兼容性问题
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // 用户未登录，重定向到登录页面
    console.log('用户未登录，重定向到登录页面');
    redirect(`/auth/login?callbackUrl=/dashboard/competitions/${id}`);
  }
  
  try {
    // 获取比赛详情数据
    const competition = await getCompetition(id);
    
    // 检查用户权限
    const hasPermission = 
      session.user.role === 'ADMIN' || 
      competition.organizerId === session.user.id ||
      session.user.role === 'JUDGE' ||
      ['ACTIVE', 'FINISHED'].includes(competition.status);
    
    if (!hasPermission) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" asChild className="self-start">
              <Link href="/dashboard/competitions">
                <ChevronLeft className="h-4 w-4 mr-1" />
                返回
              </Link>
            </Button>
            <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
              <h1 className="text-2xl font-bold text-destructive mb-2">访问被拒绝</h1>
              <p>您没有权限查看此比赛。</p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/competitions">返回比赛列表</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-2">
              <Link href="/dashboard/competitions">
                <ChevronLeft className="h-4 w-4 mr-1" />
                返回
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{competition.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/display/${id}`}>
                <Monitor className="h-4 w-4 mr-2" />
                大屏幕管理
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/competitions/${id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Link>
            </Button>
            {competition.status !== 'ARCHIVED' && (
              <Button variant="destructive" size="sm" asChild>
                <Link href={`/api/competitions/${id}?_method=DELETE`} prefetch={false}>
                  <Archive className="h-4 w-4 mr-2" />
                  归档
                </Link>
              </Button>
            )}
          </div>
        </div>

        <CompetitionDetail competition={competition} />
        
        {/* 使用客户端组件处理所有Tab内容 */}
        <CompetitionTabs competition={competition} competitionId={id} />
      </div>
    );
  } catch (error) {
    // 显示错误信息
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href="/dashboard/competitions">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回
            </Link>
          </Button>
          <div className="rounded-md border border-destructive bg-destructive/10 p-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">获取比赛详情失败</h1>
            <p>无法加载比赛信息，请确认该比赛存在且您有访问权限。</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/dashboard/competitions">返回比赛列表</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
} 