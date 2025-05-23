'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ListMusic, Trophy, Users, BarChart3, Download } from "lucide-react";
import { Suspense } from "react";
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const CompetitionStats = dynamic(
  () => import("@/components/dashboard/competitions/CompetitionStats").then(mod => ({ default: mod.CompetitionStats })),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">正在加载统计数据...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

const ExportData = dynamic(
  () => import("@/components/dashboard/competitions/ExportData").then(mod => ({ default: mod.ExportData })),
  { 
    ssr: false,
    loading: () => (
      <Card>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <div className="text-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">正在加载导出功能...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
);

interface CompetitionTabsProps {
  competition: any;
  competitionId: string;
}

export function CompetitionTabs({ competition, competitionId }: CompetitionTabsProps) {
  return (
    <Tabs defaultValue="programs">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="programs" className="flex items-center gap-2">
          <ListMusic className="h-4 w-4" />
          <span className="hidden sm:inline-block">节目管理</span>
        </TabsTrigger>
        <TabsTrigger value="participants" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline-block">选手管理</span>
        </TabsTrigger>
        <TabsTrigger value="rankings" className="flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span className="hidden sm:inline-block">排名结果</span>
        </TabsTrigger>
        <TabsTrigger value="statistics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline-block">统计分析</span>
        </TabsTrigger>
        <TabsTrigger value="export" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline-block">数据导出</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="programs" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>节目管理</CardTitle>
              <CardDescription>管理该比赛的所有节目</CardDescription>
            </div>
            <Button size="sm" asChild>
              <Link href={`/dashboard/programs/new?competitionId=${competitionId}`}>
                添加节目
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {competition.programs && competition.programs.length > 0 ? (
              <div className="rounded-md border">
                {/* 这里渲染节目列表 */}
                <div className="grid grid-cols-5 bg-muted p-4 font-medium">
                  <div>节目名称</div>
                  <div>顺序</div>
                  <div>状态</div>
                  <div>选手</div>
                  <div>操作</div>
                </div>
                
                {competition.programs.map((program: any) => (
                  <div key={program.id} className="grid grid-cols-5 border-t p-4">
                    <div className="text-sm font-medium">{program.name}</div>
                    <div className="text-sm">{program.order}</div>
                    <div className="text-sm">
                      {program.currentStatus === 'WAITING' && <span className="text-yellow-600">等待中</span>}
                      {program.currentStatus === 'PERFORMING' && <span className="text-blue-600">进行中</span>}
                      {program.currentStatus === 'COMPLETED' && <span className="text-green-600">已完成</span>}
                    </div>
                    <div className="text-sm">{program.participants?.length || 0} 名选手</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/programs/${program.id}`}>管理</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">暂无节目数据</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="participants" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>选手管理</CardTitle>
              <CardDescription>管理该比赛的所有选手</CardDescription>
            </div>
            <Button size="sm" asChild>
              <Link href="/dashboard/participants/new">
                添加选手
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {competition.programs && competition.programs.some((p: any) => p.participants?.length > 0) ? (
              <div className="rounded-md border">
                {/* 这里渲染选手列表 */}
                <div className="grid grid-cols-4 bg-muted p-4 font-medium">
                  <div>选手名称</div>
                  <div>团队</div>
                  <div>参与节目</div>
                  <div>操作</div>
                </div>
                
                {/* 获取所有节目中的唯一选手 */}
                {Array.from(new Set(
                  competition.programs.flatMap((p: any) => p.participants || []).map((part: any) => part.id)
                )).map((participantId: any) => {
                  const participant = competition.programs
                    .flatMap((p: any) => p.participants || [])
                    .find((part: any) => part.id === participantId);
                  
                  const participantPrograms = competition.programs
                    .filter((p: any) => (p.participants || []).some((part: any) => part.id === participantId))
                    .map((p: any) => p.name);
                  
                  return (
                    <div key={participantId} className="grid grid-cols-4 border-t p-4">
                      <div className="text-sm font-medium">{participant.name}</div>
                      <div className="text-sm">{participant.team || '无'}</div>
                      <div className="text-sm">{participantPrograms.join(', ')}</div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/participants/${participantId}`}>查看</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">暂无选手数据</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="rankings" className="mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>排名结果</CardTitle>
              <CardDescription>查看该比赛的当前排名</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              刷新排名
            </Button>
          </CardHeader>
          <CardContent>
            {competition.rankings && competition.rankings.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-4 bg-muted p-4 font-medium">
                  <div>排名</div>
                  <div>节目</div>
                  <div>总分</div>
                  <div>更新类型</div>
                </div>
                
                {competition.rankings.map((ranking: any) => (
                  <div key={ranking.id} className="grid grid-cols-4 border-t p-4">
                    <div className="text-sm font-medium">{ranking.rank}</div>
                    <div className="text-sm">{ranking.program.name}</div>
                    <div className="text-sm">{ranking.totalScore}</div>
                    <div className="text-sm">
                      {ranking.updateType === 'AUTO' ? '自动计算' : '手动调整'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">暂无排名数据</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="statistics" className="mt-6">
        <Suspense fallback={
          <Card>
            <CardContent className="p-6">
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">正在加载统计数据...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        }>
          <CompetitionStats competitionId={competitionId} />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="export" className="mt-6">
        <Suspense fallback={
          <Card>
            <CardContent className="p-6">
              <div className="flex h-32 items-center justify-center">
                <div className="text-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">正在加载导出功能...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        }>
          <ExportData competitionId={competitionId} competitionName={competition.name} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
} 