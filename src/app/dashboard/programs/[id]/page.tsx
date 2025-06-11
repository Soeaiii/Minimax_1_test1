import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { 
  ChevronLeft, 
  Edit, 
  Users, 
  Star, 
  FileText, 
  Play, 
  Pause, 
  CheckCircle,
  Trophy,
  Download,
  Calendar,
  Clock,
  Hash
} from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { ProgramStatusUpdater } from "@/components/dashboard/programs/ProgramStatusUpdater";
import { ScoreManager } from "@/components/dashboard/programs/ScoreManager";
import { ParticipantCard } from "@/components/dashboard/programs/ParticipantCard";
import { FileAttachmentList } from "@/components/dashboard/programs/FileAttachmentList";

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
    title: program ? `${program.name} - 节目详情` : "节目详情",
    description: "查看节目的详细信息，包括参与者、评分和相关文件"
  };
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const { id } = await params;
  
  // 检查用户登录状态
  // @ts-ignore
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/login?callbackUrl=/dashboard/programs/' + id);
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
          startTime: true,
          endTime: true,
          status: true,
        }
      },
      participants: true,
      attachments: true,
      scores: {
        include: {
          scoringCriteria: {
            select: {
              id: true,
              name: true,
              weight: true,
              maxScore: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      ranking: true,
    }
  });

  if (!program) {
    notFound();
  }

  // 权限检查
  const canEdit = session.user.role === 'ADMIN' || 
                  program.competition.organizerId === session.user.id;

  // 计算总分
  const totalScore = program.scores.reduce((sum, score) => {
    return sum + (score.value * score.scoringCriteria.weight);
  }, 0);

  // 获取状态信息
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'WAITING':
        return { label: '等待中', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
      case 'PERFORMING':
        return { label: '进行中', color: 'bg-blue-100 text-blue-800', icon: Play };
      case 'COMPLETED':
        return { label: '已完成', color: 'bg-green-100 text-green-800', icon: CheckCircle };
      default:
        return { label: '未知', color: 'bg-gray-100 text-gray-800', icon: Hash };
    }
  };

  const statusInfo = getStatusInfo(program.currentStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/programs">
              <ChevronLeft className="h-4 w-4 mr-1" />
              返回节目列表
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{program.name}</h1>
            <p className="text-muted-foreground">
              比赛: {program.competition.name} • 顺序: {program.order}
            </p>
          </div>
        </div>
        
        {canEdit && (
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <Link href={`/dashboard/programs/${program.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                编辑节目
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* 节目状态卡片 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <StatusIcon className="h-5 w-5" />
              <div>
                <CardTitle className="text-lg">节目状态</CardTitle>
                <CardDescription>当前状态和基本信息</CardDescription>
              </div>
            </div>
            <Badge className={statusInfo.color}>
              {statusInfo.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">创建时间</div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(program.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">更新时间</div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{format(new Date(program.updatedAt), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">参与人数</div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{program.participants.length} 名参与者</span>
              </div>
            </div>
          </div>
          
          {program.description && (
            <>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">节目描述</div>
                <p className="text-sm leading-relaxed">{program.description}</p>
              </div>
            </>
          )}
          
          {canEdit && (
            <>
              <Separator className="my-4" />
              <ProgramStatusUpdater 
                programId={program.id} 
                currentStatus={program.currentStatus}
                userId={session.user.id}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* 自定义字段区域 */}
      {/* @ts-ignore 忽略类型检查，因为customFields是动态添加的 */}
      {program.customFields && Object.keys((program as any).customFields).length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">自定义字段</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries((program as any).customFields).map(([key, value]) => (
              <div key={key} className="border p-4 rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground">{key}</h4>
                <p>{value as string}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 标签页内容 */}
      <Tabs defaultValue="participants" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participants" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>参与者</span>
          </TabsTrigger>
          <TabsTrigger value="scores" className="flex items-center space-x-2">
            <Star className="h-4 w-4" />
            <span>评分</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>附件</span>
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>排名</span>
          </TabsTrigger>
        </TabsList>

        {/* 参与者标签页 */}
        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>参与者 ({program.participants.length})</CardTitle>
              <CardDescription>本节目的所有参与者信息</CardDescription>
            </CardHeader>
            <CardContent>
              {program.participants.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {program.participants.map((participant) => (
                    <ParticipantCard 
                      key={participant.id} 
                      participant={{
                        ...participant,
                        bio: participant.bio ?? undefined,
                        team: participant.team ?? undefined,
                        contact: participant.contact ?? undefined
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">暂无参与者</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 评分标签页 */}
        <TabsContent value="scores">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>评分详情</CardTitle>
                  <CardDescription>所有评分标准的得分情况</CardDescription>
                </div>
                {totalScore > 0 && (
                  <div className="text-right">
                    <div className="text-2xl font-bold">{totalScore.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">总分</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScoreManager
                programId={program.id}
                competitionId={program.competitionId}
                initialScores={program.scores}
                canEdit={canEdit}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 文件附件标签页 */}
        <TabsContent value="files">
          <Card>
            <CardHeader>
              <CardTitle>文件附件 ({program.attachments.length})</CardTitle>
              <CardDescription>与此节目相关的所有文件</CardDescription>
            </CardHeader>
            <CardContent>
              <FileAttachmentList files={program.attachments} canEdit={canEdit} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 排名标签页 */}
        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle>排名信息</CardTitle>
              <CardDescription>本节目在比赛中的排名</CardDescription>
            </CardHeader>
            <CardContent>
              {program.ranking ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-800">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">第 {program.ranking.rank} 名</div>
                      <div className="text-muted-foreground">总分: {program.ranking.totalScore.toFixed(1)}</div>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">更新方式:</span>
                      <span className="ml-2">{program.ranking.updateType === 'AUTO' ? '自动' : '手动'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">更新时间:</span>
                      <span className="ml-2">
                        {format(new Date(program.ranking.updatedAt), 'MM-dd HH:mm', { locale: zhCN })}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">暂无排名信息</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 