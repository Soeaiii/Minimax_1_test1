'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Trophy, 
  Users, 
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

interface ExportDataProps {
  competitionId: string;
  competitionName: string;
}

type ExportType = 'scores' | 'rankings' | 'participants';
type ExportFormat = 'xlsx' | 'json';

interface ExportStatus {
  type: ExportType;
  format: ExportFormat;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export function ExportData({ competitionId, competitionName }: ExportDataProps) {
  const [exportStatuses, setExportStatuses] = useState<Record<string, ExportStatus>>({});

  const updateExportStatus = (key: string, status: Partial<ExportStatus>) => {
    setExportStatuses(prev => ({
      ...prev,
      [key]: { ...prev[key], ...status }
    }));
  };

  const handleExport = async (type: ExportType, format: ExportFormat) => {
    const key = `${type}-${format}`;
    
    try {
      updateExportStatus(key, { 
        type, 
        format, 
        status: 'loading', 
        error: undefined 
      });

      const response = await fetch(
        `/api/competitions/${competitionId}/export?type=${type}&format=${format}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '导出失败');
      }

      if (format === 'xlsx') {
        // 处理XLSX文件下载
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${competitionName}-${getTypeLabel(type)}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success(`${getTypeLabel(type)}数据导出成功！`);
      } else {
        // 处理JSON数据
        const data = await response.json();
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${competitionName}-${getTypeLabel(type)}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast.success(`${getTypeLabel(type)}数据导出成功！`);
      }

      updateExportStatus(key, { status: 'success' });
      
      // 3秒后重置状态
      setTimeout(() => {
        updateExportStatus(key, { status: 'idle' });
      }, 3000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '导出失败';
      updateExportStatus(key, { 
        status: 'error', 
        error: errorMessage 
      });
      toast.error(errorMessage);
      
      // 5秒后重置状态
      setTimeout(() => {
        updateExportStatus(key, { status: 'idle' });
      }, 5000);
    }
  };

  const getTypeLabel = (type: ExportType) => {
    const labels: Record<ExportType, string> = {
      scores: '评分',
      rankings: '排名',
      participants: '选手'
    };
    return labels[type];
  };

  const getTypeIcon = (type: ExportType) => {
    switch (type) {
      case 'scores':
        return BarChart3;
      case 'rankings':
        return Trophy;
      case 'participants':
        return Users;
      default:
        return BarChart3;
    }
  };

  const getStatusIcon = (status: ExportStatus) => {
    switch (status.status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const exportOptions = [
    {
      type: 'scores' as ExportType,
      title: '评分数据导出',
      description: '导出所有节目的详细评委打分数据，包括评分标准、分数、评语等',
      features: [
        '节目信息（名称、顺序、选手）',
        '评委评分详情',
        '评分标准和权重',
        '评分时间记录',
        '评语和备注'
      ]
    },
    {
      type: 'rankings' as ExportType,
      title: '排名结果导出',
      description: '导出比赛的最终排名结果和总分统计',
      features: [
        '最终排名顺序',
        '总分计算结果',
        '节目和选手信息',
        '排名更新方式',
        '排名计算时间'
      ]
    },
    {
      type: 'participants' as ExportType,
      title: '选手信息导出',
      description: '导出所有参赛选手的详细信息和参赛记录',
      features: [
        '选手基本信息',
        '团队归属信息',
        '参与节目列表',
        '联系方式',
        '注册时间'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            数据导出
          </CardTitle>
          <CardDescription>
            导出比赛的各类数据，支持 XLSX 和 JSON 格式
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scores" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scores">评分数据</TabsTrigger>
          <TabsTrigger value="rankings">排名结果</TabsTrigger>
          <TabsTrigger value="participants">选手信息</TabsTrigger>
        </TabsList>

        {exportOptions.map((option) => (
          <TabsContent key={option.type} value={option.type} className="space-y-4">
            <Card>
                             <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   {(() => {
                     const Icon = getTypeIcon(option.type);
                     return <Icon className="h-5 w-5" />;
                   })()}
                   {option.title}
                 </CardTitle>
                <CardDescription>
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 功能特性 */}
                <div>
                  <h4 className="text-sm font-medium mb-3">包含数据：</h4>
                  <div className="grid gap-2 md:grid-cols-2">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 导出按钮 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">选择导出格式：</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* XLSX 导出 */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <span className="font-medium">XLSX 格式</span>
                        </div>
                        <Badge variant="outline">推荐</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Excel 格式，适合用 Excel、WPS 等软件打开查看和分析
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={() => handleExport(option.type, 'xlsx')}
                        disabled={exportStatuses[`${option.type}-xlsx`]?.status === 'loading'}
                      >
                        {getStatusIcon(exportStatuses[`${option.type}-xlsx`] || { status: 'idle' } as ExportStatus)}
                        <span className="ml-2">
                          {exportStatuses[`${option.type}-xlsx`]?.status === 'loading' 
                            ? '导出中...' 
                            : exportStatuses[`${option.type}-xlsx`]?.status === 'success'
                            ? '导出成功'
                            : exportStatuses[`${option.type}-xlsx`]?.status === 'error'
                            ? '导出失败'
                            : '导出 XLSX'
                          }
                        </span>
                      </Button>
                      {exportStatuses[`${option.type}-xlsx`]?.error && (
                        <p className="text-xs text-red-500 mt-2">
                          {exportStatuses[`${option.type}-xlsx`].error}
                        </p>
                      )}
                    </Card>

                    {/* JSON 导出 */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">JSON 格式</span>
                        </div>
                        <Badge variant="secondary">开发者</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        结构化数据格式，适合程序处理和二次开发
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleExport(option.type, 'json')}
                        disabled={exportStatuses[`${option.type}-json`]?.status === 'loading'}
                      >
                        {getStatusIcon(exportStatuses[`${option.type}-json`] || { status: 'idle' } as ExportStatus)}
                        <span className="ml-2">
                          {exportStatuses[`${option.type}-json`]?.status === 'loading' 
                            ? '导出中...' 
                            : exportStatuses[`${option.type}-json`]?.status === 'success'
                            ? '导出成功'
                            : exportStatuses[`${option.type}-json`]?.status === 'error'
                            ? '导出失败'
                            : '导出 JSON'
                          }
                        </span>
                      </Button>
                      {exportStatuses[`${option.type}-json`]?.error && (
                        <p className="text-xs text-red-500 mt-2">
                          {exportStatuses[`${option.type}-json`].error}
                        </p>
                      )}
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">1.</span>
            <span>XLSX 格式适合在 Excel、WPS Office、Google Sheets 等表格软件中查看和分析</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">2.</span>
            <span>JSON 格式包含完整的数据结构，适合程序处理和系统集成</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">3.</span>
            <span>导出的文件名包含比赛名称和导出日期，便于管理</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">4.</span>
            <span>XLSX 文件包含格式化的表格，列宽已自动调整，方便查看</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-medium text-foreground">5.</span>
            <span>评分数据包含所有评委的详细打分，可用于深度分析</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 