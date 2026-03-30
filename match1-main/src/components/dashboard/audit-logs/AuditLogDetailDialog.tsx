'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, User, Calendar, Target, FileText } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  targetId?: string;
  details?: any;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

interface AuditLogDetailDialogProps {
  log: AuditLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuditLogDetailDialog({ log, open, onOpenChange }: AuditLogDetailDialogProps) {
  if (!log) return null;

  const getActionInfo = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      'CREATE': { label: '创建', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'UPDATE': { label: '更新', color: 'bg-green-100 text-green-800 border-green-200' },
      'DELETE': { label: '删除', color: 'bg-red-100 text-red-800 border-red-200' },
      'SCORE': { label: '评分', color: 'bg-purple-100 text-purple-800 border-purple-200' },
      'LOGIN': { label: '登录', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'LOGOUT': { label: '登出', color: 'bg-gray-100 text-gray-800 border-gray-200' },
      'ARCHIVE': { label: '归档', color: 'bg-orange-100 text-orange-800 border-orange-200' },
      'RESTORE': { label: '恢复', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    };
    
    return actionMap[action] || { label: action, color: 'bg-gray-100 text-gray-800 border-gray-200' };
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      'ADMIN': '管理员',
      'ORGANIZER': '组织者',
      'JUDGE': '评委',
      'USER': '用户',
    };
    return roleMap[role] || role;
  };

  const actionInfo = getActionInfo(log.action);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加一个toast提示
    });
  };

  const formatDetails = (details: any): string => {
    if (!details) return '无详情';
    if (typeof details === 'string') return details;
    if (typeof details === 'number' || typeof details === 'boolean') return String(details);
    
    // 处理对象类型，确保始终返回字符串
    if (typeof details === 'object') {
      try {
        // 如果是数组，转换为字符串
        if (Array.isArray(details)) {
          return JSON.stringify(details, null, 2);
        }
        // 如果是普通对象，转换为字符串
        return JSON.stringify(details, null, 2);
      } catch (error) {
        console.error('Error formatting details:', error);
        return '[无法格式化的对象]';
      }
    }
    
    // 兜底处理，确保返回字符串
    try {
      return String(details);
    } catch (error) {
      console.error('Error converting details to string:', error);
      return '[无法显示的内容]';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Badge className={actionInfo.color}>
              {actionInfo.label}
            </Badge>
            <span>操作详情</span>
          </DialogTitle>
          <DialogDescription>
            查看此操作的详细信息和相关数据
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">基本信息</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">操作时间</span>
                </div>
                <div className="text-sm bg-muted p-2 rounded-md font-mono">
                  {format(new Date(log.timestamp), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhCN })}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">操作用户</span>
                </div>
                <div className="text-sm bg-muted p-2 rounded-md">
                  <div className="font-medium">{log.user.name}</div>
                  <div className="text-muted-foreground">{log.user.email}</div>
                  <Badge variant="secondary" className="mt-1">
                    {getRoleLabel(log.user.role)}
                  </Badge>
                </div>
              </div>
            </div>

            {log.targetId && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">目标对象</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm bg-muted p-2 rounded-md font-mono flex-1">
                    {log.targetId}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(log.targetId!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* 详细信息 */}
          {log.details && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold">详细信息</h3>
              </div>
              
              <div className="bg-muted p-4 rounded-md">
                <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
                  {(() => {
                    const formattedDetails = formatDetails(log.details);
                    // 确保返回的是字符串类型
                    if (typeof formattedDetails !== 'string') {
                      console.error('formatDetails did not return a string:', formattedDetails);
                      return '[格式化错误]';
                    }
                    return formattedDetails;
                  })()}
                </pre>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(formatDetails(log.details) || '')}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                复制详细信息
              </Button>
            </div>
          )}

          {/* 元数据 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">元数据</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">日志ID:</span>
                <div className="font-mono bg-muted p-2 rounded mt-1">{log.id}</div>
              </div>
              <div>
                <span className="text-muted-foreground">用户ID:</span>
                <div className="font-mono bg-muted p-2 rounded mt-1">{log.userId}</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}