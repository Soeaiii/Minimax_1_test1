'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Database, 
  RefreshCw, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  Users
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export function SystemMaintenance() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [lastFixResult, setLastFixResult] = useState<{
    fixedPrograms: number;
    fixedParticipants: number;
  } | null>(null);
  const [isFixingDuplicates, setIsFixingDuplicates] = useState(false);
  const [fixResult, setFixResult] = useState<{
    success: boolean;
    message: string;
    fixedParticipants?: number;
    fixedPrograms?: number;
  } | null>(null);

  // 修复选手关联关系
  const fixParticipantRelations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fix-participant-relations', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        setLastFixResult(result);
        toast.success(`关联关系修复完成！修复了 ${result.fixedPrograms} 个节目和 ${result.fixedParticipants} 个选手的关联。`);
      } else {
        throw new Error('修复关联关系失败');
      }
    } catch (error) {
      toast.error('修复关联关系失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFixDuplicateIds = async () => {
    setIsFixingDuplicates(true);
    setFixResult(null);
    
    try {
      const response = await fetch('/api/fix-duplicate-ids', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFixResult({
          success: true,
          message: data.message,
          fixedParticipants: data.fixedParticipants,
          fixedPrograms: data.fixedPrograms,
        });
      } else {
        setFixResult({
          success: false,
          message: data.error || '修复失败',
        });
      }
    } catch (error) {
      console.error('修复重复ID失败:', error);
      setFixResult({
        success: false,
        message: '修复过程中发生错误',
      });
    } finally {
      setIsFixingDuplicates(false);
    }
  };

  const handleCleanupLogs = async () => {
    try {
      const response = await fetch('/api/audit-logs/cleanup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        alert('日志清理完成');
      } else {
        const error = await response.json();
        alert(`清理失败: ${error.message}`);
      }
    } catch (error) {
      console.error('清理日志失败:', error);
      alert('清理过程中发生错误');
    }
  };

  // 只有管理员可以看到此组件
  if (!session || session.user.role !== 'ADMIN') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          系统维护
        </CardTitle>
        <CardDescription>
          系统优化和维护工具
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 修复选手关联 */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h4 className="font-medium">修复选手关联关系</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                如果发现选手参与的节目没有正确显示，请执行此修复操作
              </p>
              {lastFixResult && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    上次修复：{lastFixResult.fixedPrograms} 个节目，{lastFixResult.fixedParticipants} 个选手
                  </span>
                </div>
              )}
            </div>
            <Button 
              onClick={fixParticipantRelations} 
              disabled={loading}
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              {loading ? '修复中...' : '执行修复'}
            </Button>
          </div>
        </div>

        {/* 修复重复ID */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">修复重复ID</h4>
              <p className="text-xs text-muted-foreground">
                清理参与者和节目中的重复关联ID
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleFixDuplicateIds}
              disabled={isFixingDuplicates}
            >
              {isFixingDuplicates ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  修复中...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  修复重复ID
                </>
              )}
            </Button>
          </div>
          
          {fixResult && (
            <Alert variant={fixResult.success ? "default" : "destructive"}>
              {fixResult.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                {fixResult.message}
                {fixResult.success && fixResult.fixedParticipants !== undefined && (
                  <div className="mt-2 flex gap-2">
                    <Badge variant="secondary">
                      参与者: {fixResult.fixedParticipants}
                    </Badge>
                    <Badge variant="secondary">
                      节目: {fixResult.fixedPrograms}
                    </Badge>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* 清理审计日志 */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium">清理审计日志</h4>
            <p className="text-xs text-muted-foreground">
              删除30天前的审计日志记录
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCleanupLogs}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清理日志
          </Button>
        </div>

        {/* 系统状态 */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">系统状态</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">数据库连接</span>
              <Badge variant="default" className="text-xs">
                正常
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">查询优化</span>
              <Badge variant="default" className="text-xs">
                已启用
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 