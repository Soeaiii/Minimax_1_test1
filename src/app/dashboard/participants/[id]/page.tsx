'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Users, 
  Mail, 
  Calendar,
  Edit,
  ArrowLeft,
  Trophy,
  Clock,
  UserRound,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Participant {
  id: string;
  name: string;
  bio?: string;
  team?: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
  programs: Array<{
    id: string;
    name: string;
    description?: string;
    order: number;
    currentStatus: string;
    competition: {
      id: string;
      name: string;
      status: string;
    };
  }>;
}

export default function ParticipantDetailPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // 获取选手详情
  const fetchParticipant = async () => {
    const participantId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!participantId) {
      setError('无效的选手ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/participants/${participantId}`);
      if (response.ok) {
        const data = await response.json();
        setParticipant(data);
      } else if (response.status === 404) {
        setError('选手不存在');
      } else {
        setError('获取选手信息失败');
      }
    } catch (error) {
      console.error('Error fetching participant:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipant();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{error || '选手不存在'}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
      </div>
    );
  }

  // 获取参与者类型
  const getParticipantType = () => {
    return participant.team ? '团队' : '个人选手';
  };

  // 获取参与者类型颜色
  const getParticipantTypeColor = () => {
    return participant.team 
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  // 获取节目状态颜色
  const getProgramStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'WAITING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PERFORMING': 'bg-blue-100 text-blue-800 border-blue-200',
      'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 获取节目状态文本
  const getProgramStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'WAITING': '等待中',
      'PERFORMING': '进行中',
      'COMPLETED': '已完成',
    };
    return statusMap[status] || status;
  };

  // 获取比赛状态颜色
  const getCompetitionStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'ACTIVE': 'bg-green-100 text-green-800 border-green-200',
      'FINISHED': 'bg-blue-100 text-blue-800 border-blue-200',
      'ARCHIVED': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // 获取比赛状态文本
  const getCompetitionStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'PENDING': '待开始',
      'ACTIVE': '进行中',
      'FINISHED': '已结束',
      'ARCHIVED': '已归档',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{participant.name}</h1>
            <p className="text-muted-foreground">选手详情</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchParticipant}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
          <Button asChild>
            <Link href={`/dashboard/participants/${participant.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              编辑选手
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 基本信息 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {participant.team ? (
                  <Users className="h-5 w-5" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
                <span>基本信息</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 头像区域 */}
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-muted h-24 w-24 flex items-center justify-center mb-4">
                  {participant.team ? (
                    <Users className="h-12 w-12 text-muted-foreground" />
                  ) : (
                    <UserRound className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{participant.name}</h2>
                <Badge className={getParticipantTypeColor()}>
                  {getParticipantType()}
                </Badge>
              </div>

              <Separator />

              {/* 详细信息 */}
              <div className="space-y-4">
                {participant.bio && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">简介</label>
                    <p className="text-sm mt-1">{participant.bio}</p>
                  </div>
                )}

                {participant.team && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">团队</label>
                    <div className="flex items-center mt-1">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{participant.team}</span>
                    </div>
                  </div>
                )}

                {participant.contact && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">联系方式</label>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-sm">{participant.contact}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-muted-foreground">创建时间</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(participant.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">更新时间</label>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(participant.updatedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 参与的节目 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>参与的节目 ({participant.programs.length})</span>
              </CardTitle>
              <CardDescription>
                该选手参与的所有比赛节目
              </CardDescription>
            </CardHeader>
            <CardContent>
              {participant.programs.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">暂未参与任何节目</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {participant.programs
                    .sort((a, b) => a.order - b.order)
                    .map((program) => (
                    <Card key={program.id} className="border-l-4 border-l-blue-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{program.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2 mt-1">
                              <span>比赛: {program.competition.name}</span>
                              <span>•</span>
                              <span>序号: {program.order}</span>
                            </CardDescription>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Badge className={getProgramStatusColor(program.currentStatus)}>
                              {getProgramStatusText(program.currentStatus)}
                            </Badge>
                            <Badge 
                              variant="outline"
                              className={getCompetitionStatusColor(program.competition.status)}
                            >
                              {getCompetitionStatusText(program.competition.status)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      {program.description && (
                        <CardContent className="pt-0">
                          <p className="text-sm text-muted-foreground">
                            {program.description}
                          </p>
                        </CardContent>
                      )}
                      <CardContent className="pt-2">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/programs/${program.id}`}>
                              查看节目
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/competitions/${program.competition.id}`}>
                              查看比赛
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 