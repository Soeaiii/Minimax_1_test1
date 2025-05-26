'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Scale, Star, Clock, CheckCircle, Eye, User } from 'lucide-react';
import Link from 'next/link';
import { JudgeHeader } from '@/components/judge/JudgeHeader';

interface Competition {
  id: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: string;
  programsCount: number;
  scoredCount: number;
}

interface JudgeProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export default function JudgeDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [profile, setProfile] = useState<JudgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/judge/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.role !== 'JUDGE') {
      router.push('/judge/login');
      return;
    }

    if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, session, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 获取裁判的比赛列表
      const competitionsResponse = await fetch('/api/judge/competitions');
      if (competitionsResponse.ok) {
        const competitionsData = await competitionsResponse.json();
        setCompetitions(competitionsData);
      }

      // 获取裁判个人资料
      const profileResponse = await fetch('/api/judge/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setProfile(profileData);
      }
    } catch (error) {
      setError('加载数据失败');
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="default" className="bg-green-600 hover:bg-green-700">进行中</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">待开始</Badge>;
      case 'FINISHED':
        return <Badge variant="outline">已结束</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Scale className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'FINISHED':
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <JudgeHeader />
        <div className="container mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated' || session?.user?.role !== 'JUDGE') {
    return null;
  }

  const displayName = profile?.name || session?.user?.name || '评委';
  const displayAvatar = profile?.avatar ? (
    // 检查是否是MongoDB ObjectId (24位字符)
    profile.avatar.length === 24
      ? `/api/files/${profile.avatar}/preview`
      : profile.avatar.startsWith('/uploads/')
        ? `/api/files/preview?path=${encodeURIComponent(profile.avatar)}`
        : profile.avatar
  ) : session?.user?.image || undefined;

  return (
    <div className="min-h-screen bg-background">
      <JudgeHeader />
      
      <div className="container mx-auto p-6">
        {/* 欢迎区域 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage 
                src={displayAvatar} 
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {displayName.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                欢迎回来，{displayName}
              </h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                裁判打分系统 - 您有 {competitions.filter(c => c.status === 'ACTIVE').length} 个活跃比赛
              </p>
            </div>
          </div>
          
          {profile?.bio && (
            <Card className="bg-gradient-to-r from-primary/5 to-blue-50 border-primary/20">
              <CardContent className="pt-4">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {profile.bio}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 px-4 py-3 text-sm text-destructive mb-6">
            {error}
          </div>
        )}

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总比赛数</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{competitions.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                参与的所有比赛
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">活跃比赛</CardTitle>
              <Scale className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {competitions.filter(c => c.status === 'ACTIVE').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                正在进行中的比赛
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待评分</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {competitions.reduce((sum, c) => sum + (c.programsCount - c.scoredCount), 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                等待评分的节目
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已评分</CardTitle>
              <Star className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {competitions.reduce((sum, c) => sum + c.scoredCount, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                已完成评分的节目
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 比赛列表 */}
        <Card>
          <CardHeader>
            <CardTitle>我的比赛</CardTitle>
            <CardDescription>
              您被分配为裁判的比赛列表
            </CardDescription>
          </CardHeader>
          <CardContent>
            {competitions.length === 0 ? (
              <div className="text-center py-12">
                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg mb-2">还没有分配给您的比赛</p>
                <p className="text-sm text-muted-foreground">
                  请联系管理员为您分配比赛评委任务
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {competitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(competition.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold">{competition.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {competition.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Scale className="h-3 w-3" />
                            节目数: {competition.programsCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            已评分: {competition.scoredCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            待评分: {competition.programsCount - competition.scoredCount}
                          </span>
                          {competition.scoredCount > 0 && (
                            <span className="text-blue-600 font-medium">
                              完成度: {Math.round((competition.scoredCount / competition.programsCount) * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {getStatusBadge(competition.status)}
                      
                      <div className="flex gap-2">
                        <Link href={`/judge/competitions/${competition.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            查看
                          </Button>
                        </Link>
                        
                        {competition.status === 'ACTIVE' && (
                          <Link href={`/judge/competitions/${competition.id}/scoring`}>
                            <Button size="sm">
                              <Star className="h-4 w-4 mr-2" />
                              开始评分
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 