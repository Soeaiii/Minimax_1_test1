'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, AlertCircle, Users } from 'lucide-react';

const registrationSchema = z.object({
  name: z.string().min(1, '姓名不能为空'),
  team: z.string().optional(),
  contact: z.string().optional(),
  bio: z.string().optional(),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

interface CompetitionInfo {
  name: string;
  description?: string;
  status: string;
  registrationEnabled: boolean;
  registrationFields: string[];
  registeredCount: number;
}

export default function RegisterPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const competitionId = params.competitionId as string;
  const token = searchParams.get('token') || '';

  const [info, setInfo] = useState<CompetitionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<'success' | 'error' | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { name: '', team: '', contact: '', bio: '' },
  });

  // 加载比赛信息
  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await fetch(`/api/public/register/${competitionId}?token=${token}`);
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || '加载失败');
          return;
        }
        const data = await res.json();
        setInfo(data.data);
      } catch {
        setError('网络错误');
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, [competitionId, token]);

  const onSubmit = async (values: RegistrationValues) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/public/register/${competitionId}?token=${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (res.ok) {
        setResult('success');
        setResultMessage(body.message || '报名成功！');
      } else if (res.status === 409) {
        setResult('success');
        setResultMessage('您已报名成功！');
      } else {
        setResult('error');
        setResultMessage(body.error || '报名失败');
      }
    } catch {
      setResult('error');
      setResultMessage('网络错误，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-400 mb-4" />
            <p className="text-gray-600">{error || '链接无效'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!info.registrationEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-yellow-400 mb-4" />
            <p className="text-gray-600">报名尚未开启</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (result === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
            <h2 className="text-xl font-bold text-green-700">{resultMessage}</h2>
            <p className="text-gray-500">感谢您报名参加 {info.name}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fields = (info.registrationFields as string[]) || ['name', 'team', 'contact'];
  const showField = (name: string) => fields.includes(name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{info.name || '选手报名'}</CardTitle>
          <CardDescription>
            {info.description || '请填写以下信息完成报名'}
          </CardDescription>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              已报名 {info.registeredCount} 人
            </Badge>
            <Badge variant="outline" className={
              info.status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'
            }>
              {info.status === 'PENDING' ? '待开始' : info.status === 'ACTIVE' ? '进行中' : '已结束'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {result === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {resultMessage}
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {showField('name') && (
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>姓名 *</FormLabel>
                    <FormControl><Input placeholder="请输入您的姓名" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              {showField('team') && (
                <FormField control={form.control} name="team" render={({ field }) => (
                  <FormItem>
                    <FormLabel>团队/单位</FormLabel>
                    <FormControl><Input placeholder="如：XX学校/XX公司" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              {showField('contact') && (
                <FormField control={form.control} name="contact" render={({ field }) => (
                  <FormItem>
                    <FormLabel>联系方式</FormLabel>
                    <FormControl><Input placeholder="手机号/邮箱（用于接收成绩通知）" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                提交报名
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
