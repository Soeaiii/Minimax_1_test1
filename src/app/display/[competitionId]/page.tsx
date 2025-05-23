'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Trophy, Crown } from 'lucide-react';

interface Judge {
  id: string;
  name: string;
  avatar?: string;
}

interface JudgeScore {
  judge: Judge;
  totalScore: number;
  scores: Array<{
    criteriaId: string;
    criteriaName: string;
    value: number;
    weight: number;
    maxScore: number;
  }>;
}

interface Participant {
  id: string;
  name: string;
  team?: string;
}

interface Program {
  id: string;
  name: string;
  description?: string;
  order: number;
  participants: Participant[];
}

interface Competition {
  id: string;
  name: string;
  description?: string;
  status: string;
}

interface DisplaySettings {
  id: string;
  title?: string;
  subtitle?: string;
  showJudgeScores: boolean;
  showParticipants: boolean;
  showProgramInfo: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  theme: string;
  backgroundImageId?: string;
  titleColor?: string;
  subtitleColor?: string;
  judgeNameColor?: string;
  judgeScoreColor?: string;
  averageScoreColor?: string;
  programInfoColor?: string;
  backgroundImage?: {
    id: string;
    filename: string;
    path: string;
  };
}

interface DisplayData {
  settings: DisplaySettings;
  competition: Competition;
  currentProgram?: Program;
  judgeScores: JudgeScore[];
  judges: Judge[];
  programs: Program[];
}

export default function DisplayPage() {
  const params = useParams();
  const competitionId = params.competitionId as string;

  const [displayData, setDisplayData] = useState<DisplayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  // 监听网络状态
  useEffect(() => {
    const handleOnline = () => setConnectionStatus('online');
    const handleOffline = () => setConnectionStatus('offline');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 初始状态
    setConnectionStatus(navigator.onLine ? 'online' : 'offline');

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getErrorType = (error: string) => {
    if (error.includes('Failed to fetch') || error.includes('NetworkError')) {
      return '网络连接失败';
    }
    if (error.includes('404')) {
      return '比赛不存在或已删除';
    }
    if (error.includes('403') || error.includes('401')) {
      return '访问权限不足';
    }
    if (error.includes('500')) {
      return '服务器内部错误';
    }
    return '未知错误';
  };

  const fetchDisplayData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('正在获取比赛ID:', competitionId, '的显示数据...');
      
      const response = await fetch(`/api/display/${competitionId}/data`);
      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('获取到显示数据:', data);
      setDisplayData(data);
      setError(null);
      setRetryCount(0);
    } catch (error) {
      console.error('获取显示数据失败:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      setError(errorMessage);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisplayData();
  }, [competitionId]);

  // 自动重试机制
  useEffect(() => {
    if (error && retryCount < 3) {
      const retryTimeout = setTimeout(() => {
        console.log(`自动重试第 ${retryCount + 1} 次...`);
        fetchDisplayData();
      }, 2000 * retryCount); // 递增延迟: 2s, 4s, 6s

      return () => clearTimeout(retryTimeout);
    }
  }, [error, retryCount]);

  // 自动刷新
  useEffect(() => {
    if (!displayData?.settings.autoRefresh) return;

    const interval = setInterval(() => {
      fetchDisplayData();
    }, (displayData.settings.refreshInterval || 5) * 1000);

    return () => clearInterval(interval);
  }, [displayData?.settings.autoRefresh, displayData?.settings.refreshInterval]);

  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case 'CLASSIC':
        return 'bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900';
      case 'MINIMAL':
        return 'bg-gradient-to-br from-gray-100 via-white to-gray-100';
      case 'ELEGANT':
        return 'bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900';
      default: // MODERN
        return 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
    }
  };

  const getTextColor = (theme: string) => {
    switch (theme) {
      case 'MINIMAL':
        return 'text-gray-900';
      default:
        return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl mb-2">加载显示数据...</p>
          <p className="text-white/60 text-sm">比赛ID: {competitionId}</p>
          {retryCount > 0 && (
            <p className="text-yellow-400 text-sm mt-2">重试中... ({retryCount}/3)</p>
          )}
        </div>
      </div>
    );
  }

  if (error || !displayData) {
    const errorType = error ? getErrorType(error) : '无数据';
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-300 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">{errorType}</h2>
          <p className="text-red-200 mb-4">{error || '无法加载显示数据'}</p>
          
          {/* 网络状态 */}
          {connectionStatus === 'offline' && (
            <div className="bg-yellow-800/30 rounded-lg p-3 mb-4">
              <p className="text-yellow-200 text-sm">
                🔌 网络连接已断开，请检查网络设置
              </p>
            </div>
          )}
          
          {/* 调试信息 */}
          <div className="bg-red-800/30 rounded-lg p-4 mb-4 text-left">
            <p className="text-red-200 text-sm">
              <strong>比赛ID:</strong> {competitionId}
            </p>
            <p className="text-red-200 text-sm">
              <strong>重试次数:</strong> {retryCount}
            </p>
            <p className="text-red-200 text-sm">
              <strong>网络状态:</strong> {connectionStatus === 'online' ? '已连接' : '已断开'}
            </p>
            <p className="text-red-200 text-sm">
              <strong>API地址:</strong> /api/display/{competitionId}/data
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={fetchDisplayData}
              disabled={connectionStatus === 'offline'}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connectionStatus === 'offline' ? '等待网络连接...' : '重新加载'}
            </button>
            
            {retryCount > 2 && (
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors w-full"
              >
                刷新页面
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const { settings, competition, currentProgram, judgeScores } = displayData;
  
  const backgroundStyle = settings.backgroundImage
    ? { backgroundImage: `url(${settings.backgroundImage.path})` }
    : {};

  return (
    <div
      className={`min-h-screen ${getThemeStyles(settings.theme)} ${getTextColor(settings.theme)} relative overflow-hidden`}
      style={{
        ...backgroundStyle,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* 背景遮罩 */}
      {settings.backgroundImage && (
        <div className="absolute inset-0 bg-black/40"></div>
      )}

      <div className="relative z-10 p-8">
        {/* 标题区域 */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: settings.titleColor || '#ffffff' }}
          >
            {settings.title || competition.name}
          </h1>
          {settings.subtitle && (
            <p 
              className="text-lg opacity-90"
              style={{ color: settings.subtitleColor || '#ffffff' }}
            >
              {settings.subtitle}
            </p>
          )}
        </div>

        {/* 当前节目信息 */}
        {currentProgram && settings.showProgramInfo && (
          <div className="mb-12">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-white flex items-center justify-center">
                  <Trophy className="h-8 w-8 mr-3" />
                  当前节目
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <Badge variant="outline" className="text-xl px-4 py-2 bg-white/20 text-white border-white/30">
                      第 {currentProgram.order} 号
                    </Badge>
                    <h2 className="text-4xl font-bold text-white">
                      {currentProgram.name}
                    </h2>
                  </div>
                  
                  {settings.showParticipants && currentProgram.participants.length > 0 && (
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-6 w-6 text-white/80" />
                      <span className="text-xl text-white/90">参赛者：</span>
                      <div className="flex flex-wrap gap-2">
                        {currentProgram.participants.map((participant) => (
                          <Badge
                            key={participant.id}
                            variant="secondary"
                            className="text-lg px-3 py-1 bg-white/20 text-white"
                          >
                            {participant.name}
                            {participant.team && ` (${participant.team})`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {currentProgram.description && (
                    <p className="text-xl text-white/80">{currentProgram.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 裁判评分卡片 */}
        {settings.showJudgeScores && judgeScores.length > 0 && (
          <div className="mb-8">
            {/* 评委卡片 - 水平排列 */}
            <div className="flex justify-center mb-6">
              <div className="flex flex-wrap justify-center gap-10 max-w-7xl">
                {judgeScores.map((judgeScore) => (
                  <div
                    key={judgeScore.judge.id}
                    className="bg-white/90 backdrop-blur-md rounded-lg p-8 text-center w-72 shadow-lg"
                  >
                    <div className="space-y-6">
                      <Avatar className="w-44 h-44 mx-auto border-4 border-white">
                        <AvatarImage
                          src={judgeScore.judge.avatar ? (
                            judgeScore.judge.avatar.startsWith('/uploads/') 
                              ? judgeScore.judge.avatar 
                              : `/uploads/${judgeScore.judge.avatar}`
                          ) : undefined}
                          alt={judgeScore.judge.name}
                        />
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {judgeScore.judge.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p 
                          className="text-xl font-medium truncate"
                          style={{ color: settings.judgeNameColor || '#1f2937' }}
                        >
                          {judgeScore.judge.name}
                        </p>
                        <p 
                          className="text-4xl font-bold"
                          style={{ color: settings.judgeScoreColor || '#1f2937' }}
                        >
                          {judgeScore.totalScore.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 选手信息和平均分 */}
            <div className="flex justify-center">
              <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 max-w-4xl w-full ml-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 选手信息 */}
                  {currentProgram && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="font-medium"
                          style={{ color: settings.programInfoColor || '#ffffff' }}
                        >
                          选手序号：
                        </span>
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: settings.programInfoColor || '#ffffff' }}
                        >
                          {currentProgram.order}
                        </span>
                      </div>
                      {currentProgram.participants.length > 0 && (
                        <div className="flex items-center space-x-3">
                          <span 
                            className="font-medium"
                            style={{ color: settings.programInfoColor || '#ffffff' }}
                          >
                            选手姓名：
                          </span>
                          <span 
                            className="text-xl font-bold"
                            style={{ color: settings.programInfoColor || '#ffffff' }}
                          >
                            {currentProgram.participants.map(p => p.name).join('、')}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-3">
                        <span 
                          className="font-medium"
                          style={{ color: settings.programInfoColor || '#ffffff' }}
                        >
                          展演作品：
                        </span>
                        <span 
                          className="text-lg font-medium"
                          style={{ color: settings.programInfoColor || '#ffffff' }}
                        >
                          {currentProgram.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* 平均分 */}
                  <div className="flex items-center justify-center md:justify-end">
                    <div className="text-center">
                      <p 
                        className="font-medium mb-2"
                        style={{ color: settings.averageScoreColor || '#ffffff' }}
                      >
                        平均分：
                      </p>
                      <span 
                        className="text-6xl font-bold"
                        style={{ color: settings.averageScoreColor || '#ffffff' }}
                      >
                        {judgeScores.length > 0 
                          ? (judgeScores.reduce((sum, js) => sum + js.totalScore, 0) / judgeScores.length).toFixed(2)
                          : '0.00'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 无数据提示 */}
        {(!currentProgram || !settings.showProgramInfo) && 
         (!judgeScores.length || !settings.showJudgeScores) && (
          <div className="text-center">
            <div className="mb-8">
              <Crown className="h-24 w-24 mx-auto mb-4 text-white/60" />
              <h2 className="text-4xl font-bold text-white/80 mb-2">比赛准备中</h2>
              <p className="text-xl text-white/60">请等待比赛开始...</p>
            </div>
          </div>
        )}

        {/* 自动刷新指示器 */}
        {settings.autoRefresh && (
          <div className="fixed bottom-4 right-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white/80 text-sm">
              每 {settings.refreshInterval} 秒自动刷新
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 