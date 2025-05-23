import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "比赛管理 | 比赛管理系统",
  description: "管理所有比赛",
};

// 获取比赛列表
async function getCompetitions() {
  try {
    return await prisma.competition.findMany({
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        programs: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('获取比赛列表失败:', error);
    return [];
  }
}

export default async function CompetitionsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  // 检查用户是否已登录
  // @ts-ignore 忽略类型错误
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard/competitions');
  }

  const competitions = await getCompetitions();
  
  // 获取searchParams
  const params = await searchParams;
  
  // 过滤状态
  const statusFilter = params.status?.toUpperCase();
  const filteredCompetitions = statusFilter
    ? competitions.filter(comp => comp.status === statusFilter)
    : competitions;

  // 获取比赛状态标签
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      PENDING: { label: '待开始', variant: 'secondary' },
      ACTIVE: { label: '进行中', variant: 'default' },
      FINISHED: { label: '已结束', variant: 'outline' },
      ARCHIVED: { label: '已归档', variant: 'destructive' },
    };
    
    const statusInfo = statusMap[status] || { label: '未知状态', variant: 'outline' };
    
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">比赛管理</h1>
        <Button asChild>
          <Link href="/dashboard/competitions/new">
            <PlusCircle className="h-4 w-4 mr-2" />
            创建比赛
          </Link>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索比赛名称..."
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/competitions" className={!statusFilter ? "font-medium" : ""}>
            全部
          </Link>
          <Link href="/dashboard/competitions?status=pending" className={statusFilter === "PENDING" ? "font-medium" : ""}>
            待开始
          </Link>
          <Link href="/dashboard/competitions?status=active" className={statusFilter === "ACTIVE" ? "font-medium" : ""}>
            进行中
          </Link>
          <Link href="/dashboard/competitions?status=finished" className={statusFilter === "FINISHED" ? "font-medium" : ""}>
            已结束
          </Link>
          <Link href="/dashboard/competitions?status=archived" className={statusFilter === "ARCHIVED" ? "font-medium" : ""}>
            已归档
          </Link>
        </div>
      </div>
      
      {filteredCompetitions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground mb-4">当前没有比赛数据</p>
            <Button asChild>
              <Link href="/dashboard/competitions/new">创建第一个比赛</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="overflow-hidden">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{competition.name}</CardTitle>
                    <CardDescription className="line-clamp-1">
                      组织者: {competition.organizer?.name}
                    </CardDescription>
                  </div>
                  {getStatusBadge(competition.status)}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>开始时间:</span>
                    <span>{format(new Date(competition.startTime), 'yyyy-MM-dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>结束时间:</span>
                    <span>{format(new Date(competition.endTime), 'yyyy-MM-dd')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>节目数量:</span>
                    <span>{competition.programs.length} 个</span>
                  </div>
                  <div className="flex justify-between">
                    <span>排名更新:</span>
                    <span>{competition.rankingUpdateMode === 'REALTIME' ? '实时' : '批量'}</span>
                  </div>
                </div>
                <div className="mt-4 space-x-2 flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/competitions/${competition.id}`}>查看详情</Link>
                  </Button>
                  {(session.user.role === 'ADMIN' || competition.organizerId === session.user.id) && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/competitions/${competition.id}/edit`}>编辑</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 