'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Clock } from 'lucide-react';

export function WelcomeHeader() {
  const { data: session } = useSession();
  
  const getCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) return '上午';
    if (hour < 18) return '下午';
    return '晚上';
  };

  const getRoleText = (role: string | undefined) => {
    switch (role) {
      case 'ADMIN':
        return '管理员';
      case 'ORGANIZER':
        return '组织者';
      case 'JUDGE':
        return '评委';
      case 'USER':
        return '用户';
      default:
        return '用户';
    }
  };

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case 'ADMIN':
        return 'destructive';
      case 'ORGANIZER':
        return 'default';
      case 'JUDGE':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const timeOfDay = getCurrentTime();
  const userName = session?.user?.name || '用户';
  const userRole = session?.user?.role;

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {timeOfDay}好，{userName}!
                </h1>
                <p className="text-muted-foreground">
                  欢迎回到比赛管理系统
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant={getRoleColor(userRole) as any} className="px-3 py-1">
              {getRoleText(userRole)}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('zh-CN')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 