'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Loader2, Trophy, Star, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: string;
  title: string;
  content?: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    setNotifications(data.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markAll: true }),
    });
    fetchNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'score': return <Star className="h-5 w-5 text-yellow-500" />;
      case 'promotion': return <Trophy className="h-5 w-5 text-green-500" />;
      case 'certificate': return <Trophy className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container py-8 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" /> 消息通知
          </h1>
          {unreadCount > 0 && <p className="text-muted-foreground">{unreadCount} 条未读</p>}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" /> 全部已读
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">暂无通知</div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <Card key={n.id} className={n.isRead ? 'opacity-60' : 'border-l-4 border-l-blue-500'}>
              <CardContent className="p-4 flex items-start gap-3">
                {getIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    {!n.isRead && <Badge variant="default" className="text-xs">新</Badge>}
                  </div>
                  {n.content && <p className="text-sm text-muted-foreground mt-1">{n.content}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(n.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
