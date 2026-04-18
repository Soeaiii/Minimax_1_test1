'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Users, Monitor, Settings } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Judge {
  id: string;
  name: string;
  avatar?: string;
}

interface DisplayControlPanelProps {
  competitionId: string;
  onJudgeSelectionChange: (selectedJudgeIds: string[]) => void;
  onManualRefresh: () => void;
  selectedJudgeIds: string[];
  isRefreshing?: boolean;
}

export function DisplayControlPanel({
  competitionId,
  onJudgeSelectionChange,
  onManualRefresh,
  selectedJudgeIds,
  isRefreshing = false,
}: DisplayControlPanelProps) {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取评委列表
  useEffect(() => {
    const fetchJudges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/users?role=JUDGE');
        if (!response.ok) {
          throw new Error('获取评委列表失败');
        }
        const data = await response.json();
        setJudges(data.users || []);
        
        // 如果没有选中的评委，默认选中所有评委
        if (selectedJudgeIds.length === 0 && data.users?.length > 0) {
          onJudgeSelectionChange(data.users.map((judge: Judge) => judge.id));
        }
      } catch (error) {
        console.error('获取评委列表失败:', error);
        setError(error instanceof Error ? error.message : '获取评委列表失败');
      } finally {
        setLoading(false);
      }
    };

    fetchJudges();
  }, [competitionId]);

  const handleJudgeToggle = (judgeId: string, checked: boolean) => {
    if (checked) {
      onJudgeSelectionChange([...selectedJudgeIds, judgeId]);
    } else {
      onJudgeSelectionChange(selectedJudgeIds.filter(id => id !== judgeId));
    }
  };

  const handleSelectAll = () => {
    onJudgeSelectionChange(judges.map(judge => judge.id));
  };

  const handleSelectNone = () => {
    onJudgeSelectionChange([]);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            大屏幕控制
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">加载中...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            大屏幕控制
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              重新加载
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          大屏幕控制
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 手动刷新 */}
        <div>
          <h4 className="font-medium mb-3 flex items-center">
            <Monitor className="h-4 w-4 mr-2" />
            显示控制
          </h4>
          <Button 
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '刷新中...' : '手动刷新大屏幕'}
          </Button>
        </div>

        {/* 评委选择 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center">
              <Users className="h-4 w-4 mr-2" />
              评委选择
            </h4>
            <Badge variant="secondary">
              已选择 {selectedJudgeIds.length}/{judges.length}
            </Badge>
          </div>
          
          {/* 快速选择按钮 */}
          <div className="flex gap-2 mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              disabled={selectedJudgeIds.length === judges.length}
            >
              全选
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectNone}
              disabled={selectedJudgeIds.length === 0}
            >
              全不选
            </Button>
          </div>

          {/* 评委列表 */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {judges.map((judge) => (
              <div key={judge.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`judge-${judge.id}`}
                  checked={selectedJudgeIds.includes(judge.id)}
                  onCheckedChange={(checked) => handleJudgeToggle(judge.id, checked as boolean)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={judge.avatar ? (
                      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(judge.avatar)
                        ? `/api/files/${judge.avatar}/preview`
                        : judge.avatar.startsWith('/api/files/')
                          ? judge.avatar 
                          : judge.avatar.startsWith('/uploads/')
                            ? `/api/files/preview?path=${encodeURIComponent(judge.avatar)}`
                            : `/uploads/${judge.avatar}`
                    ) : undefined}
                    alt={judge.name}
                  />
                  <AvatarFallback className="text-xs">
                    {judge.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor={`judge-${judge.id}`}
                  className="flex-1 text-sm font-medium cursor-pointer"
                >
                  {judge.name}
                </label>
              </div>
            ))}
          </div>

          {judges.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>暂无评委</p>
            </div>
          )}
        </div>

        {/* 选择提示 */}
        {selectedJudgeIds.length === 0 && judges.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              ⚠️ 未选择任何评委，大屏幕将不显示评分数据
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 