'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AdminGuard } from '@/components/auth/PermissionGuard';
import { usePermissions } from '@/lib/auth/usePermissions';
import { Settings, Shield, Clock, Database, AlertTriangle, Save, RotateCcw, Bell, Lock, Eye, FileText } from 'lucide-react';

// 权限策略配置接口
interface PermissionPolicy {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>;
  updatedAt: string;
}

// 安全参数配置接口
interface SecurityConfig {
  sessionTimeout: number; // 会话超时时间（分钟）
  maxLoginAttempts: number; // 最大登录尝试次数
  lockoutDuration: number; // 锁定持续时间（分钟）
  passwordMinLength: number; // 密码最小长度
  passwordRequireSpecial: boolean; // 是否需要特殊字符
  passwordRequireNumbers: boolean; // 是否需要数字
  passwordRequireUppercase: boolean; // 是否需要大写字母
  twoFactorRequired: boolean; // 是否强制双因子认证
  ipWhitelistEnabled: boolean; // 是否启用IP白名单
  ipWhitelist: string[]; // IP白名单
  auditLogRetention: number; // 审计日志保留天数
  dataEncryptionEnabled: boolean; // 是否启用数据加密
}

// 审计配置接口
interface AuditConfig {
  enabled: boolean;
  logLevel: 'basic' | 'detailed' | 'verbose';
  retentionDays: number;
  realTimeAlerts: boolean;
  emailNotifications: boolean;
  notificationEmail: string;
  loggedActions: string[];
  excludedUsers: string[];
  autoArchive: boolean;
  archiveThreshold: number;
}

// 系统状态接口
interface SystemStatus {
  permissionCacheSize: number;
  activeUsers: number;
  failedLogins: number;
  blockedIPs: number;
  auditLogSize: number;
  lastBackup: string;
  systemHealth: 'healthy' | 'warning' | 'critical';
}

export default function PermissionSettingsPage() {
  const { isAdmin } = usePermissions();
  const [policies, setPolicies] = useState<PermissionPolicy[]>([]);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    twoFactorRequired: false,
    ipWhitelistEnabled: false,
    ipWhitelist: [],
    auditLogRetention: 90,
    dataEncryptionEnabled: true,
  });
  const [auditConfig, setAuditConfig] = useState<AuditConfig>({
    enabled: true,
    logLevel: 'detailed',
    retentionDays: 90,
    realTimeAlerts: true,
    emailNotifications: false,
    notificationEmail: '',
    loggedActions: ['login', 'logout', 'permission_change', 'data_access', 'system_config'],
    excludedUsers: [],
    autoArchive: true,
    archiveThreshold: 10000,
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    permissionCacheSize: 0,
    activeUsers: 0,
    failedLogins: 0,
    blockedIPs: 0,
    auditLogSize: 0,
    lastBackup: '',
    systemHealth: 'healthy',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newIP, setNewIP] = useState('');

  // 获取权限策略
  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/permissions/policies');
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies || []);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  // 获取安全配置
  const fetchSecurityConfig = async () => {
    try {
      const response = await fetch('/api/permissions/security-config');
      if (response.ok) {
        const data = await response.json();
        setSecurityConfig(data.config || securityConfig);
      }
    } catch (error) {
      console.error('Error fetching security config:', error);
    }
  };

  // 获取审计配置
  const fetchAuditConfig = async () => {
    try {
      const response = await fetch('/api/permissions/audit-config');
      if (response.ok) {
        const data = await response.json();
        setAuditConfig(data.config || auditConfig);
      }
    } catch (error) {
      console.error('Error fetching audit config:', error);
    }
  };

  // 获取系统状态
  const fetchSystemStatus = async () => {
    try {
      const response = await fetch('/api/permissions/system-status');
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data.status || systemStatus);
      }
    } catch (error) {
      console.error('Error fetching system status:', error);
    }
  };

  // 保存安全配置
  const saveSecurityConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/permissions/security-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: securityConfig }),
      });

      if (response.ok) {
        toast.success('安全配置保存成功');
      } else {
        toast.error('保存安全配置失败');
      }
    } catch (error) {
      console.error('Error saving security config:', error);
      toast.error('保存安全配置失败');
    } finally {
      setSaving(false);
    }
  };

  // 保存审计配置
  const saveAuditConfig = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/permissions/audit-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config: auditConfig }),
      });

      if (response.ok) {
        toast.success('审计配置保存成功');
      } else {
        toast.error('保存审计配置失败');
      }
    } catch (error) {
      console.error('Error saving audit config:', error);
      toast.error('保存审计配置失败');
    } finally {
      setSaving(false);
    }
  };

  // 切换策略状态
  const togglePolicy = async (policyId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/permissions/policies/${policyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        toast.success('策略状态更新成功');
        fetchPolicies();
      } else {
        toast.error('更新策略状态失败');
      }
    } catch (error) {
      console.error('Error toggling policy:', error);
      toast.error('更新策略状态失败');
    }
  };

  // 添加IP到白名单
  const addIPToWhitelist = () => {
    if (newIP && !securityConfig.ipWhitelist.includes(newIP)) {
      setSecurityConfig(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, newIP],
      }));
      setNewIP('');
    }
  };

  // 从白名单移除IP
  const removeIPFromWhitelist = (ip: string) => {
    setSecurityConfig(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(item => item !== ip),
    }));
  };

  // 清除权限缓存
  const clearPermissionCache = async () => {
    try {
      const response = await fetch('/api/permissions/cache', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('权限缓存已清除');
        fetchSystemStatus();
      } else {
        toast.error('清除权限缓存失败');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      toast.error('清除权限缓存失败');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchPolicies(),
        fetchSecurityConfig(),
        fetchAuditConfig(),
        fetchSystemStatus(),
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AdminGuard showError>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
            <p className="text-muted-foreground">
              配置权限策略、安全参数和审计设置
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={
                systemStatus.systemHealth === 'healthy' ? 'bg-green-100 text-green-800' :
                systemStatus.systemHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }
            >
              系统状态: {systemStatus.systemHealth === 'healthy' ? '正常' : 
                       systemStatus.systemHealth === 'warning' ? '警告' : '严重'}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="policies" className="space-y-4">
          <TabsList>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              权限策略
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              安全配置
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              审计配置
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              系统状态
            </TabsTrigger>
          </TabsList>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>权限策略配置</CardTitle>
                <CardDescription>
                  管理系统的权限策略和访问控制规则
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{policy.name}</h3>
                          <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                            {policy.enabled ? '启用' : '禁用'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {policy.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          更新时间: {new Date(policy.updatedAt).toLocaleString('zh-CN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={policy.enabled}
                          onCheckedChange={(enabled) => togglePolicy(policy.id, enabled)}
                        />
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {policies.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      没有找到权限策略配置
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>安全参数配置</CardTitle>
                <CardDescription>
                  配置系统的安全策略和访问控制参数
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 会话和登录配置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">会话和登录</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessionTimeout">会话超时时间（分钟）</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={securityConfig.sessionTimeout}
                          onChange={(e) => setSecurityConfig(prev => ({
                            ...prev,
                            sessionTimeout: parseInt(e.target.value) || 30,
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxLoginAttempts">最大登录尝试次数</Label>
                        <Input
                          id="maxLoginAttempts"
                          type="number"
                          value={securityConfig.maxLoginAttempts}
                          onChange={(e) => setSecurityConfig(prev => ({
                            ...prev,
                            maxLoginAttempts: parseInt(e.target.value) || 5,
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lockoutDuration">锁定持续时间（分钟）</Label>
                        <Input
                          id="lockoutDuration"
                          type="number"
                          value={securityConfig.lockoutDuration}
                          onChange={(e) => setSecurityConfig(prev => ({
                            ...prev,
                            lockoutDuration: parseInt(e.target.value) || 15,
                          }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="twoFactorRequired"
                          checked={securityConfig.twoFactorRequired}
                          onCheckedChange={(checked) => setSecurityConfig(prev => ({
                            ...prev,
                            twoFactorRequired: checked,
                          }))}
                        />
                        <Label htmlFor="twoFactorRequired">强制双因子认证</Label>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 密码策略 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">密码策略</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="passwordMinLength">密码最小长度</Label>
                        <Input
                          id="passwordMinLength"
                          type="number"
                          value={securityConfig.passwordMinLength}
                          onChange={(e) => setSecurityConfig(prev => ({
                            ...prev,
                            passwordMinLength: parseInt(e.target.value) || 8,
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="passwordRequireSpecial"
                            checked={securityConfig.passwordRequireSpecial}
                            onCheckedChange={(checked) => setSecurityConfig(prev => ({
                              ...prev,
                              passwordRequireSpecial: checked,
                            }))}
                          />
                          <Label htmlFor="passwordRequireSpecial">需要特殊字符</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="passwordRequireNumbers"
                            checked={securityConfig.passwordRequireNumbers}
                            onCheckedChange={(checked) => setSecurityConfig(prev => ({
                              ...prev,
                              passwordRequireNumbers: checked,
                            }))}
                          />
                          <Label htmlFor="passwordRequireNumbers">需要数字</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="passwordRequireUppercase"
                            checked={securityConfig.passwordRequireUppercase}
                            onCheckedChange={(checked) => setSecurityConfig(prev => ({
                              ...prev,
                              passwordRequireUppercase: checked,
                            }))}
                          />
                          <Label htmlFor="passwordRequireUppercase">需要大写字母</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* IP白名单 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">IP访问控制</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="ipWhitelistEnabled"
                          checked={securityConfig.ipWhitelistEnabled}
                          onCheckedChange={(checked) => setSecurityConfig(prev => ({
                            ...prev,
                            ipWhitelistEnabled: checked,
                          }))}
                        />
                        <Label htmlFor="ipWhitelistEnabled">启用IP白名单</Label>
                      </div>
                      {securityConfig.ipWhitelistEnabled && (
                        <div>
                          <div className="flex gap-2 mb-2">
                            <Input
                              placeholder="输入IP地址"
                              value={newIP}
                              onChange={(e) => setNewIP(e.target.value)}
                            />
                            <Button onClick={addIPToWhitelist}>添加</Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {securityConfig.ipWhitelist.map((ip, index) => (
                              <Badge key={index} variant="outline" className="flex items-center gap-1">
                                {ip}
                                <button
                                  onClick={() => removeIPFromWhitelist(ip)}
                                  className="ml-1 text-red-500 hover:text-red-700"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* 其他安全设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">其他设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="auditLogRetention">审计日志保留天数</Label>
                        <Input
                          id="auditLogRetention"
                          type="number"
                          value={securityConfig.auditLogRetention}
                          onChange={(e) => setSecurityConfig(prev => ({
                            ...prev,
                            auditLogRetention: parseInt(e.target.value) || 90,
                          }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="dataEncryptionEnabled"
                          checked={securityConfig.dataEncryptionEnabled}
                          onCheckedChange={(checked) => setSecurityConfig(prev => ({
                            ...prev,
                            dataEncryptionEnabled: checked,
                          }))}
                        />
                        <Label htmlFor="dataEncryptionEnabled">启用数据加密</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveSecurityConfig} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? '保存中...' : '保存配置'}
                    </Button>
                    <Button variant="outline" onClick={fetchSecurityConfig}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      重置
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>审计配置</CardTitle>
                <CardDescription>
                  配置系统审计日志和监控设置
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 基础审计设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">基础设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="auditEnabled"
                          checked={auditConfig.enabled}
                          onCheckedChange={(checked) => setAuditConfig(prev => ({
                            ...prev,
                            enabled: checked,
                          }))}
                        />
                        <Label htmlFor="auditEnabled">启用审计日志</Label>
                      </div>
                      <div>
                        <Label htmlFor="logLevel">日志级别</Label>
                        <Select
                          value={auditConfig.logLevel}
                          onValueChange={(value) => setAuditConfig(prev => ({
                            ...prev,
                            logLevel: value as 'basic' | 'detailed' | 'verbose',
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">基础</SelectItem>
                            <SelectItem value="detailed">详细</SelectItem>
                            <SelectItem value="verbose">详尽</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="retentionDays">日志保留天数</Label>
                        <Input
                          id="retentionDays"
                          type="number"
                          value={auditConfig.retentionDays}
                          onChange={(e) => setAuditConfig(prev => ({
                            ...prev,
                            retentionDays: parseInt(e.target.value) || 90,
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 通知设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">通知设置</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="realTimeAlerts"
                          checked={auditConfig.realTimeAlerts}
                          onCheckedChange={(checked) => setAuditConfig(prev => ({
                            ...prev,
                            realTimeAlerts: checked,
                          }))}
                        />
                        <Label htmlFor="realTimeAlerts">实时警报</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="emailNotifications"
                          checked={auditConfig.emailNotifications}
                          onCheckedChange={(checked) => setAuditConfig(prev => ({
                            ...prev,
                            emailNotifications: checked,
                          }))}
                        />
                        <Label htmlFor="emailNotifications">邮件通知</Label>
                      </div>
                      {auditConfig.emailNotifications && (
                        <div>
                          <Label htmlFor="notificationEmail">通知邮箱</Label>
                          <Input
                            id="notificationEmail"
                            type="email"
                            value={auditConfig.notificationEmail}
                            onChange={(e) => setAuditConfig(prev => ({
                              ...prev,
                              notificationEmail: e.target.value,
                            }))}
                            placeholder="admin@example.com"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* 归档设置 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">归档设置</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="autoArchive"
                          checked={auditConfig.autoArchive}
                          onCheckedChange={(checked) => setAuditConfig(prev => ({
                            ...prev,
                            autoArchive: checked,
                          }))}
                        />
                        <Label htmlFor="autoArchive">自动归档</Label>
                      </div>
                      <div>
                        <Label htmlFor="archiveThreshold">归档阈值（条数）</Label>
                        <Input
                          id="archiveThreshold"
                          type="number"
                          value={auditConfig.archiveThreshold}
                          onChange={(e) => setAuditConfig(prev => ({
                            ...prev,
                            archiveThreshold: parseInt(e.target.value) || 10000,
                          }))}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveAuditConfig} disabled={saving}>
                      <Save className="h-4 w-4 mr-2" />
                      {saving ? '保存中...' : '保存配置'}
                    </Button>
                    <Button variant="outline" onClick={fetchAuditConfig}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      重置
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>系统状态</CardTitle>
                <CardDescription>
                  查看权限系统的运行状态和性能指标
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* 系统指标 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">权限缓存</p>
                            <p className="text-2xl font-bold">{systemStatus.permissionCacheSize}</p>
                          </div>
                          <Database className="h-8 w-8 text-blue-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">活跃用户</p>
                            <p className="text-2xl font-bold">{systemStatus.activeUsers}</p>
                          </div>
                          <Eye className="h-8 w-8 text-green-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">失败登录</p>
                            <p className="text-2xl font-bold">{systemStatus.failedLogins}</p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">审计日志</p>
                            <p className="text-2xl font-bold">{systemStatus.auditLogSize}</p>
                          </div>
                          <FileText className="h-8 w-8 text-purple-600" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  {/* 系统操作 */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">系统操作</h3>
                    <div className="flex gap-2">
                      <Button onClick={clearPermissionCache} variant="outline">
                        <Database className="h-4 w-4 mr-2" />
                        清除权限缓存
                      </Button>
                      <Button onClick={fetchSystemStatus} variant="outline">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        刷新状态
                      </Button>
                    </div>
                  </div>

                  {/* 最后备份时间 */}
                  {systemStatus.lastBackup && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">备份信息</h3>
                      <p className="text-sm text-muted-foreground">
                        最后备份时间: {new Date(systemStatus.lastBackup).toLocaleString('zh-CN')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}