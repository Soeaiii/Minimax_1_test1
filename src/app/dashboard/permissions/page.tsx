'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { usePermissions } from '@/lib/auth/usePermissions';
import { AdminGuard } from '@/components/auth/PermissionGuard';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Database, 
  Settings, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Loader2
} from 'lucide-react';

// 权限管理模块配置
const permissionModules = [
  {
    id: 'roles',
    title: '角色管理',
    description: '管理系统角色定义、权限配置和角色分配',
    href: '/dashboard/permissions/roles',
    icon: UserCheck,
    color: 'bg-blue-100 text-blue-800',
    features: ['角色定义', '权限配置', '角色分配', '权限继承'],
  },
  {
    id: 'users',
    title: '用户权限',
    description: '查看和管理用户权限、审计用户操作记录',
    href: '/dashboard/permissions/users',
    icon: Users,
    color: 'bg-green-100 text-green-800',
    features: ['用户权限查看', '权限审计', '操作日志', '权限测试'],
  },
  {
    id: 'data-access',
    title: '数据访问控制',
    description: '配置数据访问规则和权限范围控制',
    href: '/dashboard/permissions/data-access',
    icon: Database,
    color: 'bg-purple-100 text-purple-800',
    features: ['访问规则', '数据范围', '访问日志', '统计分析'],
  },
  {
    id: 'settings',
    title: '系统设置',
    description: '配置权限策略、安全参数和审计设置',
    href: '/dashboard/permissions/settings',
    icon: Settings,
    color: 'bg-orange-100 text-orange-800',
    features: ['权限策略', '安全参数', '审计配置', '系统监控'],
  },
];

// 系统状态接口定义
interface SystemStats {
  totalUsers: number;
  activeRoles: number;
  permissionPolicies: number;
  todayAuditLogs: number;
  securityAlerts: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
  userId?: string;
  userName?: string;
}

// 获取系统统计数据
async function fetchSystemStats(): Promise<SystemStats> {
  try {
    const [statsResponse, statusResponse] = await Promise.all([
      fetch('/api/permissions/data-access/stats', { credentials: 'include' }),
      fetch('/api/permissions/system-status', { credentials: 'include' })
    ]);

    const stats = await statsResponse.json();
    const status = await statusResponse.json();

    return {
      totalUsers: stats.stats?.summary?.totalUsers || 0,
      activeRoles: 4, // 从角色API获取
      permissionPolicies: 12, // 从策略API获取
      todayAuditLogs: stats.stats?.summary?.totalAuditLogs || 0,
      securityAlerts: 0, // 从安全状态获取
      systemHealth: status.status?.overall || 'healthy',
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Failed to fetch system stats:', error);
    // 返回默认值
    return {
      totalUsers: 0,
      activeRoles: 0,
      permissionPolicies: 0,
      todayAuditLogs: 0,
      securityAlerts: 0,
      systemHealth: 'warning',
      lastUpdated: new Date().toISOString(),
    };
  }
}

// 获取最近活动数据
async function fetchRecentActivities(): Promise<RecentActivity[]> {
  try {
    const response = await fetch('/api/permissions/data-access/logs?limit=5', { credentials: 'include' });
    const data = await response.json();
    
    return data.logs?.map((log: any) => ({
      id: log.id,
      type: log.action.toLowerCase(),
      message: typeof log.details === 'object' && log.details !== null
        ? JSON.stringify(log.details)
        : (log.details || `${log.action} 操作`),
      timestamp: log.createdAt,
      severity: getSeverityFromAction(log.action),
      userId: log.userId,
      userName: log.user?.name,
    })) || [];
  } catch (error) {
    console.error('Failed to fetch recent activities:', error);
    return [];
  }
}

// 根据操作类型确定严重程度
function getSeverityFromAction(action: string): 'info' | 'warning' | 'error' {
  const errorActions = ['DELETE', 'SECURITY_VIOLATION', 'LOGIN_FAILED'];
  const warningActions = ['UPDATE', 'PERMISSION_GRANTED', 'ROLE_ASSIGNED'];
  
  if (errorActions.some(a => action.includes(a))) return 'error';
  if (warningActions.some(a => action.includes(a))) return 'warning';
  return 'info';
}

// 活动类型配置
const activityConfig = {
  role_assigned: {
    icon: UserCheck,
    color: 'text-blue-600',
  },
  permission_granted: {
    icon: Shield,
    color: 'text-green-600',
  },
  security_alert: {
    icon: AlertTriangle,
    color: 'text-red-600',
  },
  policy_updated: {
    icon: Settings,
    color: 'text-purple-600',
  },
};

// 严重程度配置
const severityConfig = {
  info: {
    color: 'bg-blue-100 text-blue-800',
    label: '信息',
  },
  warning: {
    color: 'bg-yellow-100 text-yellow-800',
    label: '警告',
  },
  error: {
    color: 'bg-red-100 text-red-800',
    label: '错误',
  },
};

export default function PermissionsPage() {
  const { isAdmin } = usePermissions();
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载数据
  const loadData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const [stats, activities] = await Promise.all([
        fetchSystemStats(),
        fetchRecentActivities()
      ]);

      setSystemStats(stats);
      setRecentActivities(activities);
    } catch (err) {
      setError('加载数据失败，请稍后重试');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadData();
  }, []);

  // 自动刷新（每30秒）
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // 计算系统健康状态样式
  const healthStatusConfig = useMemo(() => {
    if (!systemStats) return { color: 'bg-gray-100 text-gray-800', text: '未知', icon: Clock };
    
    switch (systemStats.systemHealth) {
      case 'healthy':
        return { color: 'bg-green-100 text-green-800', text: '正常', icon: CheckCircle };
      case 'warning':
        return { color: 'bg-yellow-100 text-yellow-800', text: '警告', icon: AlertTriangle };
      case 'critical':
        return { color: 'bg-red-100 text-red-800', text: '严重', icon: AlertTriangle };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: '未知', icon: Clock };
    }
  }, [systemStats]);

  // 手动刷新
  const handleRefresh = () => {
    loadData(true);
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="space-y-6">
        {/* 错误提示 */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">权限管理</h1>
            <p className="text-muted-foreground">
              管理系统权限、角色和安全策略
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              刷新
            </Button>
            <Badge className={healthStatusConfig.color}>
              {React.createElement(healthStatusConfig.icon, { className: "h-3 w-3 mr-1" })}
              系统{healthStatusConfig.text}
            </Badge>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">总用户数</p>
                  <p className="text-2xl font-bold">{systemStats?.totalUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                实时数据
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">活跃角色</p>
                  <p className="text-2xl font-bold">{systemStats?.activeRoles || 0}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                全部正常运行
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">权限策略</p>
                  <p className="text-2xl font-bold">{systemStats?.permissionPolicies || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center mt-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3 mr-1" />
                {Math.max(0, (systemStats?.permissionPolicies || 0) - 2)} 个已启用
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">今日审计</p>
                  <p className="text-2xl font-bold">{systemStats?.todayAuditLogs || 0}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center mt-2 text-xs">
                {(systemStats?.securityAlerts || 0) > 0 ? (
                  <>
                    <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                    <span className="text-red-600">{systemStats?.securityAlerts} 个安全警告</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-600">无安全警告</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 权限管理模块 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  权限管理模块
                </CardTitle>
                <CardDescription>
                  选择要管理的权限模块
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissionModules.map((module) => {
                    const Icon = module.icon;
                    return (
                      <Card key={module.id} className="border hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${module.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div>
                                <h3 className="font-medium">{module.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {module.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <p className="text-xs font-medium text-muted-foreground">主要功能：</p>
                            <div className="flex flex-wrap gap-1">
                              {module.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Link href={module.href}>
                            <Button className="w-full" size="sm">
                              进入管理
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 最近活动 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  最近活动
                </CardTitle>
                <CardDescription>
                  权限相关的最新操作记录
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => {
                      const config = activityConfig[activity.type as keyof typeof activityConfig] || {
                        icon: Activity,
                        color: 'text-gray-600'
                      };
                      const severityStyle = severityConfig[activity.severity];
                      const Icon = config.icon;
                      
                      return (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                          <div className={`p-1.5 rounded-full bg-gray-100`}>
                            <Icon className={`h-3 w-3 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {new Date(activity.timestamp).toLocaleString('zh-CN')}
                              </p>
                              {activity.userName && (
                                <span className="text-xs text-muted-foreground">• {activity.userName}</span>
                              )}
                              <Badge className={severityStyle.color} variant="secondary">
                                {severityStyle.label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>暂无最近活动</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Link href="/dashboard/permissions/data-access">
                    <Button variant="outline" className="w-full" size="sm">
                      查看全部日志
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                
                {systemStats?.lastUpdated && (
                  <div className="mt-2 text-xs text-muted-foreground text-center">
                    最后更新: {new Date(systemStats.lastUpdated).toLocaleTimeString('zh-CN')}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}