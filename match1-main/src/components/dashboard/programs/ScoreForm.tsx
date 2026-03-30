'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Star, Award } from 'lucide-react';

// 评分表单验证模式
const scoreFormSchema = z.object({
  scoringCriteriaId: z.string().min(1, { message: '请选择评分标准' }),
  value: z.coerce.number()
    .min(0, { message: '分数不能为负数' })
    .refine((val) => {
      // 检查小数位数是否不超过2位
      const decimalPlaces = (val.toString().split('.')[1] || '').length;
      return decimalPlaces <= 2;
    }, { message: '分数最多支持两位小数' }),
  comment: z.string().optional(),
  judgeId: z.string().min(1, { message: '请选择评委' }),
});

type ScoreFormValues = z.infer<typeof scoreFormSchema>;

interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface Judge {
  id: string;
  name: string;
  email: string;
}

interface ScoreFormProps {
  programId: string;
  scoringCriteria: ScoringCriteria[];
  judges: Judge[];
  onSuccess?: () => void;
}

export function ScoreForm({ 
  programId, 
  scoringCriteria, 
  judges, 
  onSuccess 
}: ScoreFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<ScoringCriteria | null>(null);

  const form = useForm<ScoreFormValues>({
    resolver: zodResolver(scoreFormSchema),
    defaultValues: {
      scoringCriteriaId: '',
      value: 0,
      comment: '',
      judgeId: '',
    },
  });

  // 监听评分标准选择变化
  const watchedCriteriaId = form.watch('scoringCriteriaId');
  useEffect(() => {
    if (watchedCriteriaId) {
      const criteria = scoringCriteria.find(c => c.id === watchedCriteriaId);
      setSelectedCriteria(criteria || null);
      
      // 重置分数值，应用最大分数限制
      if (criteria) {
        form.setValue('value', 0);
        form.clearErrors('value');
      }
    }
  }, [watchedCriteriaId, scoringCriteria, form]);

  // 提交表单
  const onSubmit = async (data: ScoreFormValues) => {
    if (!selectedCriteria) {
      toast.error('请选择有效的评分标准');
      return;
    }

    // 验证分数范围
    if (data.value > selectedCriteria.maxScore) {
      form.setError('value', {
        message: `分数不能超过最大值 ${selectedCriteria.maxScore}`
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/programs/${programId}/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '评分提交失败');
      }

      const result = await response.json();
      
      toast.success('评分提交成功');
      
      // 重置表单
      form.reset();
      setSelectedCriteria(null);
      
      // 调用成功回调
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || '评分提交失败，请重试');
      console.error('Score submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (scoringCriteria.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">该比赛暂未设置评分标准</p>
            <p className="text-sm text-muted-foreground mt-1">
              请联系管理员添加评分标准后再进行评分
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (judges.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">暂无可用评委</p>
            <p className="text-sm text-muted-foreground mt-1">
              请联系管理员添加评委后再进行评分
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5" />
          <span>节目评分</span>
        </CardTitle>
        <CardDescription>
          为节目的不同标准进行评分，每个标准都有对应的权重和满分
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="scoringCriteriaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>评分标准</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择评分标准" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {scoringCriteria.map((criteria) => (
                          <SelectItem key={criteria.id} value={criteria.id}>
                            <div className="flex justify-between items-center w-full">
                              <span>{criteria.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                权重:{criteria.weight} | 满分:{criteria.maxScore}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="judgeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>评委</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="选择评委" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {judges.map((judge) => (
                          <SelectItem key={judge.id} value={judge.id}>
                            {judge.name} ({judge.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分数</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max={selectedCriteria?.maxScore || 100}
                      step="0.01"
                      placeholder={selectedCriteria 
                        ? `请输入 0-${selectedCriteria.maxScore} 之间的分数` 
                        : '请先选择评分标准'
                      }
                      disabled={!selectedCriteria}
                      {...field}
                    />
                  </FormControl>
                  {selectedCriteria && (
                    <FormDescription>
                      最高分数: {selectedCriteria.maxScore} 分 | 
                      权重: {selectedCriteria.weight}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>评分备注 (可选)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入评分理由或建议..."
                      className="min-h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    为评分提供详细说明或建设性意见
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedCriteria(null);
                }}
                disabled={isSubmitting}
              >
                重置
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !selectedCriteria}
              >
                {isSubmitting ? '提交中...' : '提交评分'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
} 