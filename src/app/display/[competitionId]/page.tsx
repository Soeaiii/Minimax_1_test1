'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Crown } from 'lucide-react';
import { useScoreStream } from '@/hooks/useScoreStream';

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
  judgeCardWidth?: number;
  judgeCardPadding?: number;
  judgeCardGap?: number;
  judgeAvatarSize?: number;
  judgeNameFontSize?: number;
  judgeScoreFontSize?: number;
  showBackgroundOverlay?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  selectedJudgeIds?: string[];
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
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string>('');
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'online' | 'offline'>('online');

  // 使用实时评分流
  const {
    data: scoreStreamData,
    isConnected: streamConnected,
    error: streamError,
    reconnectCount,
  } = useScoreStream(competitionId, undefined, {
    enabled: true,
    onError: (error) => {
      console.error('实时评分连接错误:', error);
      // 不在控制台显示错误，避免干扰用户
    },
    onReconnect: () => {
      console.log('正在重新连接实时评分...');
    },
  });

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

  // 初始加载数据
  useEffect(() => {
    fetchDisplayData();
  }, [competitionId]);

  // 监听背景图片变化，只在背景图片ID变化时更新背景URL
  useEffect(() => {
    if (displayData?.settings.backgroundImage?.id) {
      const newBackgroundUrl = `/api/files/${displayData.settings.backgroundImage.id}/preview`;
      if (backgroundImageUrl !== newBackgroundUrl) {
        console.log('背景图片发生变化，预加载新背景:', newBackgroundUrl);
        setBackgroundLoading(true);
        
        // 预加载图片
        const img = new Image();
        img.onload = () => {
          console.log('背景图片加载完成:', newBackgroundUrl);
          setBackgroundImageUrl(newBackgroundUrl);
          setBackgroundLoading(false);
        };
        img.onerror = () => {
          console.error('背景图片加载失败:', newBackgroundUrl);
          setBackgroundLoading(false);
        };
        img.src = newBackgroundUrl;
      }
    } else if (backgroundImageUrl) {
      console.log('移除背景图片');
      setBackgroundImageUrl('');
      setBackgroundLoading(false);
    }
  }, [displayData?.settings.backgroundImage?.id, backgroundImageUrl]);

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



  // 自动刷新 - 只刷新数据，不重新加载背景图片
  useEffect(() => {
    if (!displayData?.settings.autoRefresh) return;

    const interval = setInterval(() => {
      console.log('自动刷新数据（背景图片不会重新加载）');
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
  
  // 使用独立的背景图片URL状态，避免重复加载
  const backgroundStyle = backgroundImageUrl
    ? { backgroundImage: `url(${backgroundImageUrl})` }
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
      {backgroundImageUrl && settings.showBackgroundOverlay && (
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: settings.overlayColor || '#000000',
            opacity: settings.overlayOpacity || 0.4
          }}
        ></div>
      )}

      <div className="relative z-10 p-4">
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
        {(scoreStreamData || currentProgram) && settings.showProgramInfo && (
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
                      第 {scoreStreamData?.programOrder || currentProgram?.order} 号
                    </Badge>
                    <h2 className="text-4xl font-bold text-white">
                      {scoreStreamData?.programName || currentProgram?.name}
                    </h2>
                  </div>
                  
                  {settings.showParticipants && (scoreStreamData?.participants || currentProgram?.participants || []).length > 0 && (
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-6 w-6 text-white/80" />
                      <span className="text-xl text-white/90">参赛者：</span>
                      <div className="flex flex-wrap gap-2">
                        {(scoreStreamData?.participants || currentProgram?.participants || []).map((participant) => (
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
                  
                  {currentProgram?.description && (
                    <p className="text-xl text-white/80">{currentProgram.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 评委卡片 - 上方水平排列 */}
        {settings.showJudgeScores && (scoreStreamData?.judgeScores || judgeScores).length > 0 && (
          <div className="flex justify-center mb-8">
            <div 
              className="flex flex-wrap justify-center max-w-none"
              style={{ gap: `${settings.judgeCardGap || 50}px` }}
            >
              {(scoreStreamData?.judgeScores || judgeScores).map((judgeScore) => (
                <div
                  key={judgeScore.judge.id}
                  className="bg-white/90 backdrop-blur-md rounded-lg text-center shadow-lg"
                  style={{
                    width: `${settings.judgeCardWidth || 350}px`,
                    padding: `${settings.judgeCardPadding || 40}px`,
                  }}
                >
                  <div className="space-y-6">
                    <Avatar 
                      className="mx-auto border-4 border-white"
                      style={{
                        width: `${settings.judgeAvatarSize || 200}px`,
                        height: `${settings.judgeAvatarSize || 200}px`,
                      }}
                    >
                      <AvatarImage
                        src={judgeScore.judge.avatar ? (
                          // 检查是否是MongoDB ObjectId (24位字符)
                          judgeScore.judge.avatar.length === 24
                            ? `/api/files/${judgeScore.judge.avatar}/preview`
                            : judgeScore.judge.avatar.startsWith('/api/files/')
                              ? judgeScore.judge.avatar 
                              : judgeScore.judge.avatar.startsWith('/uploads/')
                                ? `/api/files/preview?path=${encodeURIComponent(judgeScore.judge.avatar)}`
                                : `/uploads/${judgeScore.judge.avatar}`
                        ) : undefined}
                        alt={judgeScore.judge.name}
                      />
                      <AvatarFallback 
                        className="font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        style={{ fontSize: `${Math.max((settings.judgeAvatarSize || 176) * 0.2, 16)}px` }}
                      >
                        {judgeScore.judge.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p 
                        className="font-medium truncate"
                        style={{ 
                          color: settings.judgeNameColor || '#1f2937',
                          fontSize: `${settings.judgeNameFontSize || 24}px`,
                        }}
                      >
                        {judgeScore.judge.name}
                      </p>
                      <p 
                        className="font-bold"
                        style={{ 
                          color: settings.judgeScoreColor || '#1f2937',
                          fontSize: `${settings.judgeScoreFontSize || 42}px`,
                        }}
                      >
                        {judgeScore.totalScore.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 选手信息和平均分 - 固定在底部的横向大卡片 */}
        {(scoreStreamData || currentProgram) && (
          <div className="fixed bottom-4 left-2 right-2 z-20">
            <div className="bg-white/20 backdrop-blur-md rounded-lg py-12 px-10 w-full">
              <div className="flex items-center justify-between">
                {/* 左侧：选手信息 - 垂直布局 */}
                <div className="flex-1 space-y-8">
                  <div className="flex items-center space-x-4">
                    <span 
                      className="font-medium text-7xl whitespace-nowrap min-w-fit"
                      style={{ color: settings.programInfoColor || '#ffffff' }}
                    >
                      展演序号:
                    </span>
                    <span 
                      className="text-7xl font-bold"
                      style={{ color: settings.programInfoColor || '#ffffff' }}
                    >
                      {scoreStreamData?.programOrder || currentProgram?.order}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span 
                      className="font-medium text-7xl whitespace-nowrap min-w-fit"
                      style={{ color: settings.programInfoColor || '#ffffff' }}
                    >
                      展演作品:
                    </span>
                    <span 
                      className="text-7xl font-bold"
                      style={{ color: settings.programInfoColor || '#ffffff' }}
                    >
                      {scoreStreamData?.programName || currentProgram?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span 
                      className="font-medium text-7xl whitespace-nowrap min-w-fit"
                      style={{ color: settings.programInfoColor || '#ffffff' }}
                    >
                      选送机构:
                    </span>
                    <span 
                      className="text-7xl font-bold"
                      style={{ color: settings.programInfoColor || '#ffffff' }}
                    >
                      {(scoreStreamData?.participants || currentProgram?.participants || []).map(p => p.team).filter(Boolean).join('、') || '暂无'}
                    </span>
                  </div>
                </div>
                
                {/* 右侧：平均分 */}
                <div className="flex items-center justify-center mr-32">
                  <div className="text-center">
                    <p 
                      className="font-medium mb-8 text-6xl"
                      style={{ color: settings.averageScoreColor || '#ffffff' }}
                    >
                      平均分:
                    </p>
                    <div className="relative">
                      {/* 显示平均分或等待状态 */}
                      {scoreStreamData?.allJudgesScored || (!scoreStreamData && judgeScores.length > 0) ? (
                        <span 
                          className="text-[12rem] font-bold transition-all duration-500 leading-none"
                          style={{ color: settings.averageScoreColor || '#ffffff' }}
                        >
                          {scoreStreamData?.averageScore?.toFixed(2) || 
                           (judgeScores.length > 0 
                             ? (judgeScores.reduce((sum, js) => sum + js.totalScore, 0) / judgeScores.length).toFixed(2)
                             : '0.00'
                           )
                          }
                        </span>
                      ) : (
                        <div className="text-center">
                          <span 
                            className="text-[10rem] font-bold text-yellow-400 leading-none"
                            style={{ color: settings.averageScoreColor || '#ffffff' }}
                          >
                            等待中...
                          </span>
                          {scoreStreamData && (
                            <p className="text-3xl text-white/60 mt-6">
                              已打分: {scoreStreamData.scoredJudges}/{scoreStreamData.totalJudges} 位评委
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 无数据提示 */}
        {(!scoreStreamData && !currentProgram || !settings.showProgramInfo) && 
         (!(scoreStreamData?.judgeScores || judgeScores).length || !settings.showJudgeScores) && (
          <div className="text-center">
            <div className="mb-8">
              <Crown className="h-24 w-24 mx-auto mb-4 text-white/60" />
              <h2 className="text-4xl font-bold text-white/80 mb-2">比赛准备中</h2>
              <p className="text-xl text-white/60">请等待比赛开始...</p>
            </div>
          </div>
        )}

        {/* 状态指示器 */}
        <div className="fixed top-4 right-4 flex gap-2 z-30">
          {backgroundLoading && (
            <div className="bg-blue-500/20 backdrop-blur-md rounded-full px-4 py-2 text-blue-300 text-sm flex items-center gap-2">
              <div className="w-3 h-3 border border-blue-300 border-t-transparent rounded-full animate-spin"></div>
              背景加载中
            </div>
          )}
          
          {/* 实时连接状态 */}
          {streamError && reconnectCount > 0 && (
            <div className="bg-yellow-500/20 backdrop-blur-md rounded-full px-4 py-2 text-yellow-300 text-sm flex items-center gap-2">
              <div className="w-3 h-3 border border-yellow-300 border-t-transparent rounded-full animate-spin"></div>
              重连中 ({reconnectCount}/5)
            </div>
          )}
          
          {!streamConnected && !streamError && (
            <div className="bg-gray-500/20 backdrop-blur-md rounded-full px-4 py-2 text-gray-300 text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
              连接中
            </div>
          )}
        </div>

      </div>
    </div>
  );
} 