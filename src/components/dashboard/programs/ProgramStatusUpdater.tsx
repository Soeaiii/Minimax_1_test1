'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProgramStatusUpdaterProps {
  programId: string;
  currentStatus: string;
  userId: string;
}

export function ProgramStatusUpdater({ 
  programId, 
  currentStatus, 
  userId 
}: ProgramStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const statusOptions = [
    { value: 'WAITING', label: '等待中', icon: Clock, color: 'text-yellow-600' },
    { value: 'PERFORMING', label: '进行中', icon: Play, color: 'text-blue-600' },
    { value: 'COMPLETED', label: '已完成', icon: CheckCircle, color: 'text-green-600' },
  ];

  const updateStatus = async (newStatus: string) => {
    if (newStatus === status) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/programs/${programId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentStatus: newStatus,
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      setStatus(newStatus);
      toast.success('节目状态更新成功');
      router.refresh();
    } catch (error) {
      toast.error('更新节目状态失败，请重试');
      console.error('Status update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (status === 'WAITING') {
      actions.push({
        label: '开始节目',
        action: () => updateStatus('PERFORMING'),
        icon: Play,
        variant: 'default' as const
      });
    }
    
    if (status === 'PERFORMING') {
      actions.push({
        label: '完成节目',
        action: () => updateStatus('COMPLETED'),
        icon: CheckCircle,
        variant: 'default' as const
      });
      actions.push({
        label: '暂停节目',
        action: () => updateStatus('WAITING'),
        icon: Pause,
        variant: 'outline' as const
      });
    }
    
    if (status === 'COMPLETED') {
      actions.push({
        label: '重新开始',
        action: () => updateStatus('WAITING'),
        icon: RefreshCw,
        variant: 'outline' as const
      });
    }
    
    return actions;
  };

  const quickActions = getQuickActions();
  const currentStatusOption = statusOptions.find(opt => opt.value === status);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">状态控制</h3>
          {currentStatusOption && (
            <div className={`flex items-center space-x-1 ${currentStatusOption.color}`}>
              <currentStatusOption.icon className="h-4 w-4" />
              <span className="text-sm">{currentStatusOption.label}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            size="sm"
            onClick={action.action}
            disabled={isUpdating}
            className="flex items-center space-x-1"
          >
            <action.icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">自定义状态:</span>
        <Select value={status} onValueChange={updateStatus} disabled={isUpdating}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center space-x-2">
                  <option.icon className={`h-4 w-4 ${option.color}`} />
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {isUpdating && (
        <div className="text-sm text-muted-foreground">
          正在更新状态...
        </div>
      )}
    </div>
  );
} 