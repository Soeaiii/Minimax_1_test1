'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { CalendarIcon, PlusCircle, Trash2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const competitionFormSchema = z.object({
  name: z.string().min(2, { message: '比赛名称至少需要2个字符' }),
  description: z.string().optional(),
  organizerId: z.string({ required_error: '请选择主办方' }),
  startTime: z.date({ required_error: '请选择开始时间' }),
  endTime: z.date({ required_error: '请选择结束时间' }),
  status: z.enum(['PENDING', 'ACTIVE', 'FINISHED', 'ARCHIVED'], { required_error: '请选择状态' }),
  rankingUpdateMode: z.enum(['REALTIME', 'BATCH'], { required_error: '请选择排名更新模式' }),
  scoringCriteria: z.array(
    z.object({
      name: z.string().min(1, { message: '评分项名称不能为空' }),
      weight: z.number().min(0, { message: '权重必须大于0' }).max(1, { message: '权重必须小于或等于1' }),
      maxScore: z.number().min(1, { message: '最高分必须大于等于1' }),
    })
  ).min(1, { message: '至少需要一个评分标准' }),
});

type CompetitionFormValues = z.infer<typeof competitionFormSchema>;

interface ScoringCriteria {
  id?: string;
  name: string;
  weight: number;
  maxScore: number;
}

interface CompetitionFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export function CompetitionForm({ initialData, isEditMode = false }: CompetitionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scoringCriteria, setScoringCriteria] = useState<ScoringCriteria[]>(
    initialData?.scoringCriteria || []
  );

  // 设置表单默认值
  const defaultValues: Partial<CompetitionFormValues> = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    startTime: initialData?.startTime 
      ? new Date(initialData.startTime)
      : undefined,
    endTime: initialData?.endTime 
      ? new Date(initialData.endTime)
      : undefined,
    status: initialData?.status || "PENDING",
    rankingUpdateMode: initialData?.rankingUpdateMode || "BATCH",
    organizerId: initialData?.organizerId || initialData?.organizer?.id || "",
    scoringCriteria: initialData?.scoringCriteria || [],
  };

  // 输出初始数据，用于调试
  console.log('初始化表单数据:', {
    id: initialData?.id,
    name: initialData?.name,
    originalDates: {
      startTime: initialData?.startTime,
      endTime: initialData?.endTime
    },
    convertedDates: {
      startTime: initialData?.startTime ? new Date(initialData.startTime) : undefined,
      endTime: initialData?.endTime ? new Date(initialData.endTime) : undefined
    },
    scoringCriteria: initialData?.scoringCriteria?.length || 0
  });

  const form = useForm<CompetitionFormValues>({
    resolver: zodResolver(competitionFormSchema),
    defaultValues,
  });

  // 从API获取组织者数据
  const [organizers, setOrganizers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [isLoadingOrganizers, setIsLoadingOrganizers] = useState(true);
  const [organizerError, setOrganizerError] = useState<string | null>(null);

  // 获取组织者列表
  useEffect(() => {
    async function fetchOrganizers() {
      try {
        setIsLoadingOrganizers(true);
        const response = await fetch('/api/users?role=ORGANIZER');
        
        if (!response.ok) {
          throw new Error('获取组织者列表失败');
        }
        
        const data = await response.json();
        setOrganizers(data.users || []);
        setOrganizerError(null);
      } catch (err) {
        console.error('Error fetching organizers:', err);
        setOrganizerError('获取组织者列表失败');
        // 设置一些默认数据以防API调用失败
        setOrganizers([
          { id: '682ee4e115cc0a8537ad5702', name: '系统管理员', email: 'admin@example.com' }
        ]);
      } finally {
        setIsLoadingOrganizers(false);
      }
    }
    
    fetchOrganizers();
  }, []);

  // 添加评分标准
  const addScoringCriteria = () => {
    const newCriteria = [
      ...scoringCriteria,
      { name: "", weight: 0.1, maxScore: 10 },
    ];
    setScoringCriteria(newCriteria);
    
    // 更新表单中的评分标准数据
    form.setValue('scoringCriteria', newCriteria as any);
  };

  // 移除评分标准
  const removeScoringCriteria = (index: number) => {
    const newCriteria = scoringCriteria.filter((_, i) => i !== index);
    setScoringCriteria(newCriteria);
    
    // 更新表单中的评分标准数据
    form.setValue('scoringCriteria', newCriteria as any);
  };

  // 更新评分标准
  const updateScoringCriteria = (index: number, field: keyof ScoringCriteria, value: any) => {
    const newCriteria = [...scoringCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setScoringCriteria(newCriteria);
    
    // 更新表单中的评分标准数据
    form.setValue('scoringCriteria', newCriteria as any);
  };

  // 提交表单
  const onSubmit = async (data: CompetitionFormValues) => {
    // 检查表单数据
    console.log('提交表单:', {
      formData: data,
      scoringCriteria,
      formValid: form.formState.isValid
    });
    
    // 验证评分标准
    if (scoringCriteria.length === 0) {
      toast.error("请至少添加一个评分标准");
      return;
    }
    
    const hasEmptyCriteriaName = scoringCriteria.some(c => !c.name.trim());
    if (hasEmptyCriteriaName) {
      toast.error("评分标准名称不能为空");
      return;
    }

    // 验证评分权重总和
    const totalWeight = scoringCriteria.reduce((sum, c) => sum + c.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01 && scoringCriteria.length > 0) {
      toast.error("评分标准权重总和必须为 1");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 确保日期是正确的格式
      const startTime = data.startTime instanceof Date ? data.startTime : new Date(data.startTime);
      const endTime = data.endTime instanceof Date ? data.endTime : new Date(data.endTime);
      
      // 构建请求数据
      const formData = {
        ...data,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        scoringCriteria: scoringCriteria.map(criteria => ({
          id: criteria.id, // 保留ID，对于更新操作很重要
          name: criteria.name,
          weight: criteria.weight,
          maxScore: criteria.maxScore
        })),
      };

      console.log('提交表单数据:', formData);

      // 使用window.location.origin获取当前服务器的URL
      const baseUrl = window.location.origin;
      const url = isEditMode
        ? `${baseUrl}/api/competitions/${initialData.id}`
        : `${baseUrl}/api/competitions`;
      
      const method = isEditMode ? "PUT" : "POST";
      
      // 使用绝对路径，确保请求发送到正确的服务器
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('解析响应数据失败:', parseError);
        responseData = { error: "服务器响应解析失败" };
      }
      
      if (!response.ok) {
        console.error('API响应错误:', {
          status: response.status,
          statusText: response.statusText,
          data: responseData
        });
        
        // 构造更详细的错误信息
        let errorMessage = "提交失败";
        
        if (responseData) {
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (responseData.error) {
            errorMessage = responseData.error;
            // 如果有详细信息，添加到错误消息中
            if (responseData.details && responseData.details !== responseData.error) {
              errorMessage += `：${responseData.details}`;
            }
            // 如果是数据库配置问题，给出特定提示
            if (responseData.code === 'P2031') {
              errorMessage = "数据库配置问题，请联系系统管理员检查MongoDB配置";
            }
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (Object.keys(responseData).length === 0) {
            // 空对象的情况
            errorMessage = `请求失败 (状态码: ${response.status})`;
          }
        } else {
          errorMessage = `请求失败 (状态码: ${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      toast.success(isEditMode ? "比赛更新成功" : "比赛创建成功");
      router.push("/dashboard/competitions");
      router.refresh();
    } catch (error: any) {
      console.error('表单提交错误:', error);
      
      // 更详细的错误处理
      let displayMessage = "提交失败，请重试";
      
      if (error.message) {
        displayMessage = error.message;
      } else if (error.name === 'TypeError' && error.message?.includes('fetch')) {
        displayMessage = "网络连接失败，请检查网络状态";
      } else if (error.name === 'SyntaxError') {
        displayMessage = "服务器响应格式错误";
      }
      
      toast.error(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比赛名称</FormLabel>
              <FormControl>
                <Input placeholder="输入比赛名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="organizerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>主办方 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingOrganizers}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingOrganizers ? "加载中..." : "选择主办方"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {organizers.map((organizer) => (
                    <SelectItem key={organizer.id} value={organizer.id}>
                      {organizer.name} ({organizer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {organizerError && <p className="text-sm text-destructive mt-1">{organizerError}</p>}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>开始时间 *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>选择日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>结束时间 *</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>选择日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>状态 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择比赛状态" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="PENDING">待开始</SelectItem>
                  <SelectItem value="ACTIVE">进行中</SelectItem>
                  <SelectItem value="FINISHED">已完成</SelectItem>
                  <SelectItem value="ARCHIVED">已归档</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rankingUpdateMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>排名更新模式 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="选择排名更新模式" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="REALTIME">实时更新</SelectItem>
                  <SelectItem value="BATCH">批量更新</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                实时更新会在每次评分后立即更新排名，批量更新允许手动触发排名计算
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>比赛描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="请输入比赛的详细描述信息"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                描述可以包含比赛的主题、目标、奖项设置等信息
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">评分标准 *</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addScoringCriteria}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加评分项
            </Button>
          </div>

          {scoringCriteria.length === 0 && (
            <p className="text-sm text-muted-foreground">
              请添加评分标准，如技术难度、艺术表现等
            </p>
          )}
          
          {scoringCriteria.map((criteria, index) => (
            <div
              key={index}
              className="flex items-end gap-4 p-4 border rounded-md"
            >
              <div className="flex-1">
                <FormLabel className="text-xs">评分项名称</FormLabel>
                <Input
                  value={criteria.name}
                  onChange={(e) =>
                    updateScoringCriteria(index, "name", e.target.value)
                  }
                  placeholder="评分项名称"
                />
              </div>
              <div className="w-20">
                <FormLabel className="text-xs">权重</FormLabel>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={criteria.weight}
                  onChange={(e) =>
                    updateScoringCriteria(
                      index,
                      "weight",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <div className="w-20">
                <FormLabel className="text-xs">最高分</FormLabel>
                <Input
                  type="number"
                  step="1"
                  min="1"
                  value={criteria.maxScore}
                  onChange={(e) =>
                    updateScoringCriteria(
                      index,
                      "maxScore",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeScoringCriteria(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {scoringCriteria.length > 0 && (
            <div className="text-sm text-muted-foreground">
              权重总和: {scoringCriteria.reduce((sum, c) => sum + c.weight, 0).toFixed(1)}
              {scoringCriteria.reduce((sum, c) => sum + c.weight, 0) !== 1 && (
                <span className="text-destructive ml-2">
                  （应等于 1）
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/competitions">取消</Link>
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            onClick={(e) => {
              // 输出表单状态，用于调试
              if (!form.formState.isValid) {
                console.log('表单验证失败:', form.formState.errors);
                e.preventDefault(); // 阻止表单提交
                
                // 手动触发表单验证
                form.trigger().then(isValid => {
                  console.log('手动触发验证结果:', isValid, form.formState.errors);
                  
                  // 检查日期字段
                  const startTime = form.getValues('startTime');
                  const endTime = form.getValues('endTime');
                  console.log('日期字段值:', { startTime, endTime });
                  
                  // 检查评分标准
                  if (scoringCriteria.length === 0) {
                    toast.error("请至少添加一个评分标准");
                  }
                });
              }
            }}
          >
            {isSubmitting ? '提交中...' : isEditMode ? '更新比赛' : '创建比赛'}
          </Button>
        </div>
      </form>
    </Form>
  );
} 