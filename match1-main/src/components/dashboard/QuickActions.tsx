import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, ListMusic, Users, Settings, FileText } from 'lucide-react';

interface QuickActionProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  variant?: 'default' | 'secondary' | 'outline';
}

function QuickActionCard({ href, icon: Icon, title, description, variant = 'outline' }: QuickActionProps) {
  return (
    <Link href={href} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function QuickActions() {
  const actions = [
    {
      href: '/dashboard/competitions/new',
      icon: Trophy,
      title: '创建比赛',
      description: '创建新的比赛活动'
    },
    {
      href: '/dashboard/programs/new',
      icon: ListMusic,
      title: '添加节目',
      description: '为比赛添加新节目'
    },
    {
      href: '/dashboard/participants',
      icon: Users,
      title: '管理选手',
      description: '查看和管理选手信息'
    },
    {
      href: '/dashboard/audit-logs',
      icon: FileText,
      title: '查看日志',
      description: '查看系统操作记录'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          快速操作
        </CardTitle>
        <CardDescription>
          常用功能的快捷入口
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {actions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 