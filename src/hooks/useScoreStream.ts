import { useState, useEffect, useRef } from 'react';

interface JudgeScore {
  judge: {
    id: string;
    name: string;
    avatar?: string;
  };
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

interface ScoreStreamData {
  programId: string;
  programName: string;
  programOrder: number;
  participants: Participant[];
  judgeScores: JudgeScore[];
  averageScore: number | null;
  allJudgesScored: boolean;
  totalJudges: number;
  scoredJudges: number;
  timestamp: string;
}

interface UseScoreStreamOptions {
  enabled?: boolean;
  onError?: (error: Error) => void;
  onReconnect?: () => void;
}

export function useScoreStream(
  competitionId: string, 
  selectedJudgeIds?: string[],
  options: UseScoreStreamOptions = {}
) {
  const { enabled = true, onError, onReconnect } = options;
  
  const [data, setData] = useState<ScoreStreamData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataRef = useRef<string | null>(null); // 缓存上次数据，避免无变化时重复渲染
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3秒

  const connect = () => {
    if (!enabled || !competitionId) return;

    try {
      // 关闭现有连接
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      // 构建 URL 参数
      const params = new URLSearchParams();
      if (selectedJudgeIds && selectedJudgeIds.length > 0) {
        params.set('judges', selectedJudgeIds.join(','));
      }
      
      const url = `/api/display/${competitionId}/stream${params.toString() ? `?${params.toString()}` : ''}`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
        setReconnectCount(0);
        prevDataRef.current = null; // 重连后清空缓存，确保接收最新数据
      };

      eventSource.onmessage = (event) => {
        try {
          const scoreData = JSON.parse(event.data);

          if (scoreData.error) {
            setError(scoreData.error);
            return;
          }

          if (scoreData) {
            // 只对比关键字段，避免因 timestamp 变化导致的无意义重渲染
            const dataKey = JSON.stringify({
              programId: scoreData.programId,
              programName: scoreData.programName,
              programOrder: scoreData.programOrder,
              averageScore: scoreData.averageScore,
              allJudgesScored: scoreData.allJudgesScored,
              totalJudges: scoreData.totalJudges,
              scoredJudges: scoreData.scoredJudges,
              participants: scoreData.participants,
              judgeScores: scoreData.judgeScores,
            });
            if (dataKey !== prevDataRef.current) {
              prevDataRef.current = dataKey;
              setData(scoreData);
            }
            setError(null);
          }
        } catch (err) {
          console.error('解析 SSE 数据失败:', err);
          setError('数据解析失败');
        }
      };

      eventSource.onerror = (event) => {
        console.error('SSE 连接错误:', event);
        setIsConnected(false);
        
        // 检查连接状态
        const readyState = eventSource.readyState;
        let errorMsg = '';
        
        switch (readyState) {
          case EventSource.CONNECTING:
            errorMsg = '正在连接中...';
            break;
          case EventSource.CLOSED:
            errorMsg = '连接已关闭';
            break;
          default:
            errorMsg = '连接错误';
        }
        
        console.log(`SSE 连接状态: ${readyState}, 错误信息: ${errorMsg}`);
        
        // 如果连接失败且重连次数未达到上限，则尝试重连
        if (reconnectCount < maxReconnectAttempts) {
          const newReconnectCount = reconnectCount + 1;
          setReconnectCount(newReconnectCount);
          
          console.log(`尝试第 ${newReconnectCount} 次重连...`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (onReconnect) {
              onReconnect();
            }
            connect();
          }, reconnectDelay * newReconnectCount); // 递增延迟
        } else {
          const finalErrorMsg = '连接失败，已达到最大重连次数';
          setError(finalErrorMsg);
          console.error(finalErrorMsg);
          if (onError) {
            onError(new Error(finalErrorMsg));
          }
        }
      };

    } catch (err) {
      console.error('创建 SSE 连接失败:', err);
      const errorMsg = '无法建立实时连接';
      setError(errorMsg);
      if (onError) {
        onError(new Error(errorMsg));
      }
    }
  };

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
  };

  const reconnect = () => {
    disconnect();
    setReconnectCount(0);
    connect();
  };

  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [competitionId, enabled, selectedJudgeIds?.join(',')]);

  // 页面可见性变化时的处理
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 页面隐藏时断开连接
        disconnect();
      } else if (enabled) {
        // 页面显示时重新连接
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return {
    data,
    isConnected,
    error,
    reconnectCount,
    reconnect,
    disconnect,
  };
} 