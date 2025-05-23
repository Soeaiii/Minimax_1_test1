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
import { useRouter } from 'next/navigation';
import { MultiSelect } from '@/components/ui/multi-select';
import { ProgramStatus } from '@/lib/types';
import { toast } from 'sonner';

// 节目表单验证模式
const programFormSchema = z.object({
  name: z.string().min(2, { message: '节目名称至少需要2个字符' }),
  description: z.string().optional(),
  competitionId: z.string().min(1, { message: '请选择所属比赛' }),
  order: z.coerce.number().int().min(1, { message: '顺序必须大于0' }),
  currentStatus: z.enum(['WAITING', 'PERFORMING', 'COMPLETED'], { message: '请选择节目状态' }),
  participantIds: z.array(z.string()).min(1, { message: '至少需要选择一名选手' }),
});

type ProgramFormValues = z.infer<typeof programFormSchema>;

interface Participant {
  id: string;
  name: string;
  team?: string | null;
}

interface Competition {
  id: string;
  name: string;
  status: string;
}

interface ProgramFormProps {
  initialData?: any;
  isEditMode?: boolean;
  competitionId?: string;
}

export function ProgramForm({ initialData, isEditMode = false, competitionId }: ProgramFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    initialData?.participantIds || []
  );
  const [isLoadingParticipants, setIsLoadingParticipants] = useState(false);
  const [isLoadingCompetitions, setIsLoadingCompetitions] = useState(false);
  const [participantSearch, setParticipantSearch] = useState("");

  // 设置表单默认值
  const defaultValues: Partial<ProgramFormValues> = {
    name: initialData?.name || "",
    description: initialData?.description || "",
    order: initialData?.order || 1,
    currentStatus: initialData?.currentStatus || "WAITING",
    competitionId: initialData?.competitionId || competitionId || "",
    participantIds: initialData?.participantIds || [],
  };

  const form = useForm<ProgramFormValues>({
    resolver: zodResolver(programFormSchema),
    defaultValues,
  });

  // 加载比赛列表
  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsLoadingCompetitions(true);
      try {
        const response = await fetch('/api/competitions');
        if (!response.ok) {
          throw new Error('获取比赛列表失败');
        }
        const data = await response.json();
        setCompetitions(data);
      } catch (error) {
        console.error('加载比赛失败:', error);
        toast.error('加载比赛列表失败');
        setCompetitions([]);
      } finally {
        setIsLoadingCompetitions(false);
      }
    };

    // 只有在没有指定competitionId时才加载比赛列表
    if (!competitionId) {
      fetchCompetitions();
    }
  }, [competitionId]);

  // 加载选手列表
  useEffect(() => {
    const fetchParticipants = async () => {
      setIsLoadingParticipants(true);
      try {
        const response = await fetch('/api/participants');
        if (!response.ok) {
          throw new Error('获取选手列表失败');
        }
        const data = await response.json();
        // 修复：API 返回的是 { participants: [...], pagination: {...} }
        const participantsList = data.participants || [];
        // 确保每个参与者都有必需的属性
        const validParticipants = participantsList.filter((p: any) => p && p.id && p.name);
        setParticipants(validParticipants);
      } catch (error) {
        console.error('加载选手失败:', error);
        toast.error('加载选手列表失败');
        // 确保即使出错也设置为空数组
        setParticipants([]);
      } finally {
        setIsLoadingParticipants(false);
      }
    };

    fetchParticipants();
  }, []);

  // 选手选择处理
  const toggleParticipant = (participantId: string) => {
    const newSelectedParticipants = selectedParticipants.includes(participantId)
      ? selectedParticipants.filter(id => id !== participantId)
      : [...selectedParticipants, participantId];
    
    setSelectedParticipants(newSelectedParticipants);
    // 同步更新表单字段
    form.setValue('participantIds', newSelectedParticipants);
  };

  // 过滤选手列表
  const filteredParticipants = participants.filter(participant =>
    participant.name.toLowerCase().includes(participantSearch.toLowerCase()) ||
    participant.team?.toLowerCase().includes(participantSearch.toLowerCase())
  );

  // 全选/清空功能
  const selectAllParticipants = () => {
    const allParticipantIds = filteredParticipants.map(p => p.id);
    setSelectedParticipants(allParticipantIds);
    form.setValue('participantIds', allParticipantIds);
  };

  const clearAllParticipants = () => {
    setSelectedParticipants([]);
    form.setValue('participantIds', []);
  };

  // 当初始数据或competitionId变化时，同步表单值
  useEffect(() => {
    if (initialData?.participantIds) {
      setSelectedParticipants(initialData.participantIds);
      form.setValue('participantIds', initialData.participantIds);
    }
  }, [initialData, form]);

  // 提交表单
  const onSubmit = async (data: ProgramFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData = {
        ...data,
        participantIds: selectedParticipants,
      };

      const url = isEditMode
        ? `/api/programs/${initialData.id}`
        : "/api/programs";
      
      const method = isEditMode ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "提交失败");
      }

      toast.success(isEditMode ? "节目更新成功" : "节目创建成功");
      
      // 如果是从比赛详情页创建的，返回到比赛详情页
      if (competitionId || data.competitionId) {
        router.push(`/dashboard/competitions/${competitionId || data.competitionId}`);
      } else {
        router.push("/dashboard/programs");
      }
      
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 添加表单调试
  const handleFormSubmit = (data: ProgramFormValues) => {
    console.log('表单提交数据:', data);
    console.log('选中的选手:', selectedParticipants);
    
    // 确保participantIds同步
    const finalData = {
      ...data,
      participantIds: selectedParticipants,
    };
    
    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>节目名称</FormLabel>
              <FormControl>
                <Input placeholder="输入节目名称" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>节目描述</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="输入节目描述（可选）"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>顺序</FormLabel>
                <FormControl>
                  <Input type="number" min="1" step="1" {...field} />
                </FormControl>
                <FormDescription>
                  节目在比赛中的显示顺序
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>状态</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="选择节目状态" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WAITING">等待中</SelectItem>
                    <SelectItem value="PERFORMING">进行中</SelectItem>
                    <SelectItem value="COMPLETED">已完成</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="competitionId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>所属比赛</FormLabel>
              {competitionId ? (
                <>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <div className="p-2 rounded-md border bg-muted/50">
                    <p className="text-sm">该节目将添加到当前比赛中</p>
                  </div>
                </>
              ) : (
                <>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingCompetitions || isEditMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={
                          isLoadingCompetitions 
                            ? "正在加载比赛..." 
                            : "请选择比赛"
                        } />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {competitions.map((competition) => (
                        <SelectItem key={competition.id} value={competition.id}>
                          {competition.name}
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({competition.status === 'ACTIVE' ? '进行中' : 
                              competition.status === 'PENDING' ? '待开始' : '已结束'})
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isEditMode && (
                    <FormDescription>
                      节目所属比赛无法更改
                    </FormDescription>
                  )}
                  {!isEditMode && competitions.length === 0 && !isLoadingCompetitions && (
                    <FormDescription className="text-orange-600">
                      暂无可用比赛，请先创建比赛
                    </FormDescription>
                  )}
                </>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 隐藏的participantIds字段用于表单验证 */}
        <FormField
          control={form.control}
          name="participantIds"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={selectedParticipants.join(',')} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>参与选手</FormLabel>
            {selectedParticipants.length === 0 && (
              <span className="text-sm text-destructive">至少需要选择一名选手</span>
            )}
          </div>
          
          {isLoadingParticipants ? (
            <div className="text-sm text-muted-foreground">
              正在加载选手列表...
            </div>
          ) : participants.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              暂无选手数据，请先添加选手
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="p-3 border-b bg-muted/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium">
                    选手列表 ({filteredParticipants.length} 名, 已选择 {selectedParticipants.length} 名)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllParticipants}
                      disabled={filteredParticipants.length === 0}
                      className="h-6 px-2 text-xs"
                    >
                      全选
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllParticipants}
                      disabled={selectedParticipants.length === 0}
                      className="h-6 px-2 text-xs"
                    >
                      清空
                    </Button>
                  </div>
                </div>
                <Input
                  placeholder="搜索选手姓名或团队..."
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  className="h-8"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredParticipants.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    {participantSearch ? "未找到匹配的选手" : "暂无选手"}
                  </div>
                ) : (
                  filteredParticipants.map((participant, index) => (
                  <div 
                    key={participant.id}
                    className={`flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                      index !== participants.length - 1 ? 'border-b' : ''
                    } ${
                      selectedParticipants.includes(participant.id)
                        ? "bg-primary/5 border-l-4 border-l-primary"
                        : ""
                    }`}
                    onClick={() => toggleParticipant(participant.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        selectedParticipants.includes(participant.id)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}>
                        {selectedParticipants.includes(participant.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        {participant.team && (
                          <div className="text-sm text-muted-foreground">
                            团队: {participant.team}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      点击{selectedParticipants.includes(participant.id) ? '取消' : '选择'}
                    </div>
                  </div>
                  ))
                )}
              </div>
              
              {selectedParticipants.length > 0 && (
                <div className="p-3 border-t bg-muted/30">
                  <div className="text-sm">
                    <span className="font-medium">已选择的选手:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {selectedParticipants.map(participantId => {
                        const participant = participants.find(p => p.id === participantId);
                        return participant ? (
                          <span 
                            key={participantId}
                            className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded-md"
                          >
                            {participant.name}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleParticipant(participantId);
                              }}
                              className="ml-1 hover:text-primary/70"
                            >
                              ×
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const selectedCompetitionId = competitionId || form.getValues('competitionId');
              if (selectedCompetitionId) {
                router.push(`/dashboard/competitions/${selectedCompetitionId}`);
              } else {
                router.push("/dashboard/programs");
              }
            }}
          >
            取消
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "提交中..." : isEditMode ? "更新节目" : "创建节目"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 