'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, UserRound, Users, Save, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

interface Participant {
  id: string;
  name: string;
  bio?: string;
  team?: string;
  contact?: string;
}

export default function EditParticipantPage() {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [participantType, setParticipantType] = useState<'individual' | 'team'>('individual');
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    team: '',
    contact: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

  // 获取选手详情
  const fetchParticipant = async () => {
    const participantId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!participantId) {
      setError('无效的选手ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/participants/${participantId}`);
      if (response.ok) {
        const data = await response.json();
        setParticipant(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          team: data.team || '',
          contact: data.contact || '',
        });
        setParticipantType(data.team ? 'team' : 'individual');
      } else if (response.status === 404) {
        setError('选手不存在');
      } else {
        setError('获取选手信息失败');
      }
    } catch (error) {
      console.error('Error fetching participant:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipant();
  }, [params.id]);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('选手姓名不能为空');
      return;
    }

    if (!participant) return;

    setSaving(true);
    try {
      const submitData = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || undefined,
        contact: formData.contact.trim() || undefined,
        team: participantType === 'team' ? formData.team.trim() || undefined : undefined,
      };

      const response = await fetch(`/api/participants/${participant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        const updatedParticipant = await response.json();
        setParticipant(updatedParticipant);
        toast.success('选手信息更新成功！');
        router.push(`/dashboard/participants/${participant.id}`);
      } else {
        const error = await response.json();
        toast.error(error.error || '更新失败');
      }
    } catch (error) {
      console.error('Error updating participant:', error);
      toast.error('网络错误，请稍后重试');
    } finally {
      setSaving(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 重置表单
  const resetForm = () => {
    if (participant) {
      setFormData({
        name: participant.name || '',
        bio: participant.bio || '',
        team: participant.team || '',
        contact: participant.contact || '',
      });
      setParticipantType(participant.team ? 'team' : 'individual');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">加载中...</p>
      </div>
    );
  }

  if (error || !participant) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">{error || '选手不存在'}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/participants/${participant.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回选手详情
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">编辑选手</h1>
            <p className="text-muted-foreground">修改 {participant.name} 的信息</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>选手信息</CardTitle>
            <CardDescription>
              修改选手的基本信息，支持在个人选手和团体选手之间切换
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 选手类型选择 */}
              <div className="space-y-3">
                <Label className="text-base">选手类型</Label>
                <RadioGroup
                  value={participantType}
                  onValueChange={(value: string) => setParticipantType(value as 'individual' | 'team')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="flex items-center space-x-2 cursor-pointer">
                      <UserRound className="h-4 w-4" />
                      <span>个人选手</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="team" id="team" />
                    <Label htmlFor="team" className="flex items-center space-x-2 cursor-pointer">
                      <Users className="h-4 w-4" />
                      <span>团体选手</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* 选手姓名 */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  选手姓名 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={participantType === 'team' ? '请输入团队名称或代表姓名' : '请输入选手姓名'}
                  required
                />
              </div>

              {/* 团队名称（仅团体选手显示） */}
              {participantType === 'team' && (
                <div className="space-y-2">
                  <Label htmlFor="team">团队名称</Label>
                  <Input
                    id="team"
                    value={formData.team}
                    onChange={(e) => handleInputChange('team', e.target.value)}
                    placeholder="请输入团队名称"
                  />
                  <p className="text-sm text-muted-foreground">
                    如果选手姓名已包含团队信息，此项可留空
                  </p>
                </div>
              )}

              {/* 选手简介 */}
              <div className="space-y-2">
                <Label htmlFor="bio">选手简介</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder={
                    participantType === 'team' 
                      ? '请简要介绍团队背景、成员等信息...' 
                      : '请简要介绍选手背景、特长等信息...'
                  }
                  rows={4}
                />
              </div>

              {/* 联系方式 */}
              <div className="space-y-2">
                <Label htmlFor="contact">联系方式</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  placeholder="邮箱、电话或其他联系方式"
                />
              </div>

              {/* 按钮组 */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  重置
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 