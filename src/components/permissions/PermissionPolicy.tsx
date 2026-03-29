'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Settings, Shield, Clock, Users, Database, AlertTriangle, CheckCircle, Save, RotateCcw, Plus, Edit, Trash2 } from 'lucide-react';

interface PermissionPolicy {
  id: string;
  name: string;
  description: string;
  type: 'access' | 'security' | 'audit' | 'data';
  enabled: boolean;
  priority: number;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  schedule?: PolicySchedule;
  createdAt: string;
  updatedAt: string;
}

interface PolicyCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
  value: string | string[];
}

interface PolicyAction {
  type: 'allow' | 'deny' | 'require_approval' | 'log' | 'notify';
  parameters?: Record<string, any>;
}

interface PolicySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  timezone: string;
}

interface SecuritySettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number;
    preventReuse: number;
  };
  ipWhitelist: string[];
  twoFactorRequired: boolean;
  auditLogRetention: number;
}

interface PermissionPolicyProps {
  onPolicyChange?: (policies: PermissionPolicy[]) => void;
}

// 策略类型配置
const POLICY_TYPES = {
  access: {
    name: '访问控制',
    description: '控制用户对资源的访问权限',
    icon: Shield,
    color: 'bg-blue-100 text-blue-800',
  },
  security: {
    name: '安全策略',
    description: '系统安全相关的策略配置',
    icon: AlertTriangle,
    color: 'bg-red-100 text-red-800',
  },
  audit: {
    name: '审计策略',
    description: '审计日志和监控相关策略',
    icon: Clock,
    color: 'bg-green-100 text-green-800',
  },
  data: {
    name: '数据策略',
    description: '数据访问和处理相关策略',
    icon: Database,
    color: 'bg-purple-100 text-purple-800',
  },
};

// 条件字段选项
const CONDITION_FIELDS = [
  { value: 'user.role', label: '用户角色' },
  { value: 'user.department', label: '用户部门' },
  { value: 'resource.type', label: '资源类型' },
  { value: 'resource.owner', label: '资源所有者' },
  { value: 'time.hour', label: '时间（小时）' },
  { value: 'time.day', label: '时间（星期）' },
  { value: 'request.ip', label: 'IP地址' },
  { value: 'request.method', label: '请求方法' },
];

// 操作符选项
const OPERATORS = [
  { value: 'equals', label: '等于' },
  { value: 'not_equals', label: '不等于' },
  { value: 'contains', label: '包含' },
  { value: 'not_contains', label: '不包含' },
  { value: 'greater_than', label: '大于' },
  { value: 'less_than', label: '小于' },
  { value: 'in', label: '在列表中' },
  { value: 'not_in', label: '不在列表中' },
];

// 动作类型选项
const ACTION_TYPES = [
  { value: 'allow', label: '允许', color: 'bg-green-100 text-green-800' },
  { value: 'deny', label: '拒绝', color: 'bg-red-100 text-red-800' },
  { value: 'require_approval', label: '需要审批', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'log', label: '记录日志', color: 'bg-blue-100 text-blue-800' },
  { value: 'notify', label: '发送通知', color: 'bg-purple-100 text-purple-800' },
];

export function PermissionPolicy({ onPolicyChange }: PermissionPolicyProps) {
  const [policies, setPolicies] = useState<PermissionPolicy[]>([]);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90,
      preventReuse: 5,
    },
    ipWhitelist: [],
    twoFactorRequired: false,
    auditLogRetention: 365,
  });
  const [loading, setLoading] = useState(true);
  const [editingPolicy, setEditingPolicy] = useState<PermissionPolicy | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 获取策略列表
  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/permissions/policies');
      if (response.ok) {
        const data = await response.json();
        setPolicies(data.policies || []);
      }
    } catch (error) {
      console.error('Error fetching policies:', error);
      toast.error('获取策略列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取安全设置
  const fetchSecuritySettings = async () => {
    try {
      const response = await fetch('/api/permissions/security-settings');
      if (response.ok) {
        const data = await response.json();
        setSecuritySettings(data.settings || securitySettings);
      }
    } catch (error) {
      console.error('Error fetching security settings:', error);
    }
  };

  // 保存策略
  const savePolicy = async (policy: PermissionPolicy) => {
    try {
      const method = policy.id ? 'PUT' : 'POST';
      const url = policy.id ? `/api/permissions/policies/${policy.id}` : '/api/permissions/policies';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      });

      if (response.ok) {
        toast.success(policy.id ? '策略更新成功' : '策略创建成功');
        fetchPolicies();
        setIsDialogOpen(false);
        setEditingPolicy(null);
      } else {
        toast.error('保存策略失败');
      }
    } catch (error) {
      console.error('Error saving policy:', error);
      toast.error('保存策略失败');
    }
  };

  // 删除策略
  const deletePolicy = async (policyId: string) => {
    try {
      const response = await fetch(`/api/permissions/policies/${policyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('策略删除成功');
        fetchPolicies();
      } else {
        toast.error('删除策略失败');
      }
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast.error('删除策略失败');
    }
  };

  // 切换策略状态
  const togglePolicy = async (policyId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/permissions/policies/${policyId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        toast.success(enabled ? '策略已启用' : '策略已禁用');
        fetchPolicies();
      } else {
        toast.error('更新策略状态失败');
      }
    } catch (error) {
      console.error('Error toggling policy:', error);
      toast.error('更新策略状态失败');
    }
  };

  // 保存安全设置
  const saveSecuritySettings = async () => {
    try {
      const response = await fetch('/api/permissions/security-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(securitySettings),
      });

      if (response.ok) {
        toast.success('安全设置保存成功');
      } else {
        toast.error('保存安全设置失败');
      }
    } catch (error) {
      console.error('Error saving security settings:', error);
      toast.error('保存安全设置失败');
    }
  };

  // 创建新策略
  const createNewPolicy = () => {
    const newPolicy: PermissionPolicy = {
      id: '',
      name: '',
      description: '',
      type: 'access',
      enabled: true,
      priority: 1,
      conditions: [],
      actions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingPolicy(newPolicy);
    setIsDialogOpen(true);
  };

  // 编辑策略
  const editPolicy = (policy: PermissionPolicy) => {
    setEditingPolicy({ ...policy });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchPolicies();
    fetchSecuritySettings();
  }, []);

  useEffect(() => {
    if (onPolicyChange) {
      onPolicyChange(policies);
    }
  }, [policies, onPolicyChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="policies" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="policies">权限策略</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
        </TabsList>

        {/* 权限策略标签页 */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    权限策略管理
                  </CardTitle>
                  <CardDescription>
                    配置和管理系统的权限策略规则
                  </CardDescription>
                </div>
                <Button onClick={createNewPolicy}>
                  <Plus className="h-4 w-4 mr-1" />
                  新建策略
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policies.map((policy) => {
                  const typeConfig = POLICY_TYPES[policy.type];
                  const TypeIcon = typeConfig.icon;
                  
                  return (
                    <Card key={policy.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <TypeIcon className="h-5 w-5 mt-1 text-muted-foreground" />
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{policy.name}</h3>
                                <Badge className={typeConfig.color}>
                                  {typeConfig.name}
                                </Badge>
                                <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                                  {policy.enabled ? '已启用' : '已禁用'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {policy.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>优先级: {policy.priority}</span>
                                <span>条件: {policy.conditions.length}</span>
                                <span>动作: {policy.actions.length}</span>
                                <span>更新: {new Date(policy.updatedAt).toLocaleDateString('zh-CN')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={policy.enabled}
                              onCheckedChange={(enabled) => togglePolicy(policy.id, enabled)}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editPolicy(policy)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deletePolicy(policy.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {policies.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>暂无权限策略</p>
                    <p className="text-sm">点击上方按钮创建新的权限策略</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置标签页 */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                安全参数设置
              </CardTitle>
              <CardDescription>
                配置系统的安全策略和参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 会话设置 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">会话管理</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>会话超时时间（分钟）</Label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        sessionTimeout: parseInt(e.target.value) || 30
                      }))}
                    />
                  </div>
                  <div>
                    <Label>最大登录尝试次数</Label>
                    <Input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        maxLoginAttempts: parseInt(e.target.value) || 5
                      }))}
                    />
                  </div>
                  <div>
                    <Label>账户锁定时间（分钟）</Label>
                    <Input
                      type="number"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        lockoutDuration: parseInt(e.target.value) || 15
                      }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={securitySettings.twoFactorRequired}
                      onCheckedChange={(checked) => setSecuritySettings(prev => ({
                        ...prev,
                        twoFactorRequired: checked
                      }))}
                    />
                    <Label>强制双因素认证</Label>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 密码策略 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">密码策略</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>最小长度</Label>
                    <Input
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: {
                          ...prev.passwordPolicy,
                          minLength: parseInt(e.target.value) || 8
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>密码有效期（天）</Label>
                    <Input
                      type="number"
                      value={securitySettings.passwordPolicy.maxAge}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: {
                          ...prev.passwordPolicy,
                          maxAge: parseInt(e.target.value) || 90
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label>禁止重复使用次数</Label>
                    <Input
                      type="number"
                      value={securitySettings.passwordPolicy.preventReuse}
                      onChange={(e) => setSecuritySettings(prev => ({
                        ...prev,
                        passwordPolicy: {
                          ...prev.passwordPolicy,
                          preventReuse: parseInt(e.target.value) || 5
                        }
                      }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>密码复杂度要求</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'requireUppercase', label: '包含大写字母' },
                      { key: 'requireLowercase', label: '包含小写字母' },
                      { key: 'requireNumbers', label: '包含数字' },
                      { key: 'requireSpecialChars', label: '包含特殊字符' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Switch
                          checked={securitySettings.passwordPolicy[key as keyof typeof securitySettings.passwordPolicy] as boolean}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({
                            ...prev,
                            passwordPolicy: {
                              ...prev.passwordPolicy,
                              [key]: checked
                            }
                          }))}
                        />
                        <Label className="text-sm">{label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* 审计设置 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">审计设置</h3>
                <div>
                  <Label>审计日志保留天数</Label>
                  <Input
                    type="number"
                    value={securitySettings.auditLogRetention}
                    onChange={(e) => setSecuritySettings(prev => ({
                      ...prev,
                      auditLogRetention: parseInt(e.target.value) || 365
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={fetchSecuritySettings}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  重置
                </Button>
                <Button onClick={saveSecuritySettings}>
                  <Save className="h-4 w-4 mr-1" />
                  保存设置
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 策略编辑对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPolicy?.id ? '编辑策略' : '创建策略'}
            </DialogTitle>
            <DialogDescription>
              配置权限策略的基本信息、条件和动作
            </DialogDescription>
          </DialogHeader>
          {editingPolicy && (
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>策略名称</Label>
                    <Input
                      value={editingPolicy.name}
                      onChange={(e) => setEditingPolicy(prev => prev ? {
                        ...prev,
                        name: e.target.value
                      } : null)}
                      placeholder="输入策略名称"
                    />
                  </div>
                  <div>
                    <Label>策略类型</Label>
                    <Select
                      value={editingPolicy.type}
                      onValueChange={(value) => setEditingPolicy(prev => prev ? {
                        ...prev,
                        type: value as any
                      } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(POLICY_TYPES).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>优先级</Label>
                    <Input
                      type="number"
                      value={editingPolicy.priority}
                      onChange={(e) => setEditingPolicy(prev => prev ? {
                        ...prev,
                        priority: parseInt(e.target.value) || 1
                      } : null)}
                      min="1"
                      max="100"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingPolicy.enabled}
                      onCheckedChange={(checked) => setEditingPolicy(prev => prev ? {
                        ...prev,
                        enabled: checked
                      } : null)}
                    />
                    <Label>启用策略</Label>
                  </div>
                </div>
                <div>
                  <Label>策略描述</Label>
                  <Textarea
                    value={editingPolicy.description}
                    onChange={(e) => setEditingPolicy(prev => prev ? {
                      ...prev,
                      description: e.target.value
                    } : null)}
                    placeholder="输入策略描述"
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={() => savePolicy(editingPolicy)}>
                  <Save className="h-4 w-4 mr-1" />
                  保存策略
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PermissionPolicy;