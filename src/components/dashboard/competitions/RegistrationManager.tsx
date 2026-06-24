'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Link2, Copy, Check, RefreshCw, Users } from 'lucide-react';

interface Props {
  competitionId: string;
}

export function RegistrationManager({ competitionId }: Props) {
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  // 获取当前状态
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/competitions/${competitionId}`);
        const data = await res.json();
        if (data?.registration !== undefined) {
          setRegistrationEnabled(data.registration);
        }
        // 需要通过单独的 GET 获取详细字段
        // 可以使用 competition 的 GET
      } catch {}
    }
    load();
  }, [competitionId]);

  // 更可靠地获取报名状态
  useEffect(() => {
    async function loadDetails() {
      try {
        const res = await fetch(`/api/competitions/${competitionId}`);
        const body = await res.json();
        // API返回可能直接是对象或带data字段
        const data = body.data || body;
        setRegistrationEnabled(data.registrationEnabled ?? false);
        setRegistrationToken(data.registrationToken || null);
      } catch {} finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [competitionId]);

  const handleToggle = async (enabled: boolean) => {
    setToggling(true);
    try {
      const body: any = { registrationEnabled: enabled };
      if (enabled && !registrationToken) {
        // 生成新 token
        const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
          .map(b => b.toString(16).padStart(2, '0')).join('');
        body.registrationToken = token;
        setRegistrationToken(token);
      }
      const res = await fetch(`/api/competitions/${competitionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setRegistrationEnabled(enabled);
        if (!enabled) setRegistrationToken(null);
      }
    } catch {} finally {
      setToggling(false);
    }
  };

  const handleRegenerateToken = async () => {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    setRegistrationToken(token);
    await fetch(`/api/competitions/${competitionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationToken: token }),
    });
  };

  const registrationUrl = registrationToken
    ? `${window.location.origin}/register/${competitionId}?token=${registrationToken}`
    : '';
  const scoreQueryUrl = registrationToken
    ? `${window.location.origin}/score-query/${competitionId}?token=${registrationToken}`
    : '';

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return null;

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              公开报名
            </CardTitle>
            <CardDescription>开启后，选手可通过链接自助报名</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {toggling && <Loader2 className="h-4 w-4 animate-spin" />}
            <Switch
              checked={registrationEnabled}
              onCheckedChange={handleToggle}
              disabled={toggling}
            />
            <Badge variant={registrationEnabled ? 'default' : 'secondary'}>
              {registrationEnabled ? '已开启' : '已关闭'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      {registrationEnabled && registrationToken && (
        <CardContent className="space-y-3">
          {/* 报名链接 */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Link2 className="h-3 w-3" /> 报名链接
            </label>
            <div className="flex gap-2">
              <Input value={registrationUrl} readOnly className="text-xs font-mono" />
              <Button size="sm" variant="outline" onClick={() => copyLink(registrationUrl)}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {/* 成绩查询链接 */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">成绩查询链接</label>
            <div className="flex gap-2">
              <Input value={scoreQueryUrl} readOnly className="text-xs font-mono" />
              <Button size="sm" variant="outline" onClick={() => copyLink(scoreQueryUrl)}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {/* 重新生成 Token */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              重新生成 Token 将使旧链接失效
            </span>
            <Button size="sm" variant="ghost" onClick={handleRegenerateToken}>
              <RefreshCw className="h-3 w-3 mr-1" /> 重置链接
            </Button>
          </div>
          {/* 预览链接 */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
                预览报名页
              </a>
            </Button>
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={scoreQueryUrl} target="_blank" rel="noopener noreferrer">
                预览查成绩页
              </a>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
