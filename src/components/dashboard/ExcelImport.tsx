'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Eye,
  Users,
  Trophy,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ImportData {
  type: 'participants' | 'programs';
  rows: any[];
  columns: string[];
  validRows: any[];
  invalidRows: any[];
  errors: string[];
}

interface ExcelImportProps {
  type: 'participants' | 'programs';
  competitionId?: string;
  onImportComplete?: (data: any[]) => void;
}

interface Competition {
  id: string;
  name: string;
  status: string;
}

interface Participant {
  id: string;
  name: string;
  team?: string;
}

export function ExcelImport({ type, competitionId, onImportComplete }: ExcelImportProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>(competitionId || '');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 预定义的列映射
  const participantColumns = {
    name: ['姓名', '选手姓名', '参赛者姓名', 'name', '名字'],
    bio: ['简介', '个人简介', '介绍', 'bio', 'description'],
    team: ['团队', '团队名称', '所属团队', 'team', '队伍'],
    contact: ['联系方式', '联系电话', '电话', 'contact', 'phone', '手机']
  };

  const programColumns = {
    name: ['节目名称', '节目', 'name', '名称'],
    description: ['描述', '节目描述', '简介', 'description', 'desc'],
    order: ['顺序', '序号', '排序', 'order', '编号'],
    participantNames: ['选手姓名', '参赛者', '表演者', 'participants', '选手']
  };

  // 已知的自定义字段名称，方便识别
  const knownCustomFields = [
    '表演时长', '演出时长', '时长', 'duration', 
    '道具需求', '道具', 'props',
    '特殊要求', '要求', '备注', 'requirements', 'notes',
    '音乐', '背景音乐', 'music',
    '灯光', '灯光需求', 'lighting',
    '舞台', '舞台要求', 'stage'
  ];

  // 获取比赛列表
  const fetchCompetitions = async () => {
    try {
      const response = await fetch('/api/competitions?limit=1000');
      if (response.ok) {
        const data = await response.json();
        setCompetitions(data.competitions || []);
      }
    } catch (error) {
      console.error('获取比赛列表失败:', error);
    }
  };

  // 获取选手列表
  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants?limit=2000');
      if (response.ok) {
        const data = await response.json();
        setParticipants(data.participants || []);
      }
    } catch (error) {
      console.error('获取选手列表失败:', error);
    }
  };

  // 解析Excel文件
  const parseExcelFile = (file: File): Promise<ImportData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

          if (jsonData.length < 2) {
            reject(new Error('Excel文件至少需要包含标题行和一行数据'));
            return;
          }

          const columns = jsonData[0] as string[];
          const rows = jsonData.slice(1).filter(row => 
            Array.isArray(row) && row.some(cell => cell !== null && cell !== undefined && cell !== '')
          ) as any[][];

          const validationResult = validateData(rows, columns);
          
          resolve({
            type,
            rows,
            columns,
            validRows: validationResult.validRows,
            invalidRows: validationResult.invalidRows,
            errors: validationResult.errors
          });
        } catch (error) {
          reject(new Error('解析Excel文件失败: ' + (error as Error).message));
        }
      };
      reader.onerror = () => reject(new Error('读取文件失败'));
      reader.readAsArrayBuffer(file);
    });
  };

  // 验证数据
  const validateData = (rows: any[][], columns: string[]) => {
    const validRows: any[] = [];
    const invalidRows: any[] = [];
    const errors: string[] = [];

    const columnMapping = type === 'participants' ? participantColumns : programColumns;

    // 创建列索引映射
    const columnIndexes: Record<string, number> = {};
    for (const [key, possibleNames] of Object.entries(columnMapping)) {
      const index = columns.findIndex(col => 
        possibleNames.some(name => 
          col.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(col.toLowerCase())
        )
      );
      if (index !== -1) {
        columnIndexes[key] = index;
      }
    }

    // 检查必需列
    const requiredColumns = type === 'participants' ? ['name'] : ['name'];
    const missingColumns = requiredColumns.filter(col => !(col in columnIndexes));
    if (missingColumns.length > 0) {
      errors.push(`缺少必需列: ${missingColumns.join(', ')}`);
    }

    // 处理自定义字段（对于节目类型）
    let customFieldIndexes: Record<string, number> = {};
    if (type === 'programs') {
      // 找出所有不是标准字段的列，作为自定义字段
      for (let i = 0; i < columns.length; i++) {
        const colName = columns[i];
        if (!colName || colName.trim() === '') continue;
        
        const isStandardColumn = Object.values(columnMapping).some(possibleNames => 
          possibleNames.some(name => 
            colName.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(colName.toLowerCase())
          )
        );
        
        // 如果不是标准列，则作为自定义字段
        if (!isStandardColumn) {
          customFieldIndexes[colName] = i;
        }
      }
    }

    rows.forEach((row, index) => {
      const rowData: any = { _rowIndex: index + 2 }; // +2 因为有标题行且从1开始计数
      let isValid = true;
      const rowErrors: string[] = [];

      // 映射数据
      for (const [key, columnIndex] of Object.entries(columnIndexes)) {
        rowData[key] = row[columnIndex];
      }

      // 处理自定义字段
      if (type === 'programs' && Object.keys(customFieldIndexes).length > 0) {
        const customFields: Record<string, string> = {};
        for (const [fieldName, columnIndex] of Object.entries(customFieldIndexes)) {
          const value = row[columnIndex];
          if (value !== undefined && value !== null && value !== '') {
            customFields[fieldName] = String(value);
          }
        }
        
        if (Object.keys(customFields).length > 0) {
          rowData.customFields = customFields;
        }
      }

      // 验证必需字段
      if (type === 'participants') {
        if (!rowData.name || rowData.name.toString().trim() === '') {
          isValid = false;
          rowErrors.push('选手姓名不能为空');
        }
      } else if (type === 'programs') {
        if (!rowData.name || rowData.name.toString().trim() === '') {
          isValid = false;
          rowErrors.push('节目名称不能为空');
        }
        if (rowData.order && isNaN(Number(rowData.order))) {
          isValid = false;
          rowErrors.push('节目顺序必须是数字');
        }
      }

      rowData._errors = rowErrors;
      
      if (isValid && rowErrors.length === 0) {
        validRows.push(rowData);
      } else {
        invalidRows.push(rowData);
      }
    });

    return { validRows, invalidRows, errors };
  };

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('请选择Excel文件(.xlsx, .xls)或CSV文件');
      return;
    }

    setIsUploading(true);
    try {
      const data = await parseExcelFile(file);
      setImportData(data);
      setPreviewOpen(true);
      
      // 获取相关数据
      if (type === 'programs') {
        await fetchCompetitions();
        await fetchParticipants();
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // 执行导入
  const handleImport = async () => {
    if (!importData || importData.validRows.length === 0) {
      toast.error('没有有效数据可导入');
      return;
    }

    if (type === 'programs' && !selectedCompetition) {
      toast.error('请选择比赛');
      return;
    }

    setIsImporting(true);
    setProgress(0);

    try {
      const endpoint = type === 'participants' 
        ? '/api/participants/batch-import'
        : '/api/programs/batch-import';

      const requestData = {
        data: importData.validRows,
        competitionId: selectedCompetition,
        participants: participants // 传递选手数据用于节目导入时匹配
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '导入失败');
      }

      const result = await response.json();
      
      toast.success(`成功导入 ${result.imported.length} 条记录`);
      
      if (onImportComplete) {
        onImportComplete(result.imported);
      }

      // 重置状态
      setImportData(null);
      setPreviewOpen(false);
      setProgress(100);

    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };

  // 下载模板
  const downloadTemplate = () => {
    const templateUrl = type === 'participants' 
      ? '/templates/participants-template.xlsx'
      : '/templates/programs-template.xlsx';
    
    const fileName = type === 'participants' 
      ? '选手信息导入模板.xlsx' 
      : '节目信息导入模板.xlsx';
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = templateUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {isUploading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">正在解析文件...</span>
          </div>
        ) : (
          <>
            <div>
              <h3 className="text-lg font-medium mb-2">
                {type === 'participants' ? '批量导入选手' : '批量导入节目'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {type === 'participants' 
                  ? '从Excel文件批量导入选手信息，支持姓名、简介、团队等字段'
                  : '从Excel文件批量导入节目信息，支持节目名称、描述、顺序、选手姓名等字段'}
              </p>
            </div>

            {/* 自定义字段信息提示 */}
            {type === 'programs' && (
              <div className="bg-muted/50 p-4 rounded-lg border">
                <h4 className="text-sm font-semibold mb-2">支持自定义字段</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  系统会自动识别除标准字段外的其他列作为节目的自定义字段。常见的自定义字段包括：
                </p>
                <div className="flex flex-wrap gap-2">
                  {knownCustomFields.map((field, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  下载模板
                </Button>
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="file">选择Excel文件</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                />
              </div>

              {type === 'programs' && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="competition">选择比赛</Label>
                  <Select
                    value={selectedCompetition}
                    onValueChange={setSelectedCompetition}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择目标比赛" />
                    </SelectTrigger>
                    <SelectContent>
                      {competitions.map((competition) => (
                        <SelectItem 
                          key={competition.id} 
                          value={competition.id}
                          disabled={competition.status === 'ARCHIVED'}
                        >
                          {competition.name}
                          {competition.status === 'ARCHIVED' && ' (已归档)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 预览对话框 */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              数据预览 - {type === 'participants' ? '选手信息' : '节目信息'}
            </DialogTitle>
            <DialogDescription>
              请检查数据是否正确，确认后开始导入
            </DialogDescription>
          </DialogHeader>

          {importData && (
            <div className="space-y-6">
              {/* 统计信息 */}
              <div className="flex gap-4">
                <Badge variant="outline" className="px-3 py-1">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                  有效: {importData.validRows.length}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  <XCircle className="h-4 w-4 mr-1 text-red-600" />
                  无效: {importData.invalidRows.length}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  总计: {importData.rows.length}
                </Badge>
              </div>

              {/* 错误信息 */}
              {importData.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div>发现以下问题：</div>
                    <ul className="list-disc list-inside mt-2">
                      {importData.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* 数据预览表格 */}
              {importData.validRows.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-green-700">
                    有效数据 ({importData.validRows.length} 条)
                  </h4>
                  <div className="border rounded-lg max-h-60 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>行号</TableHead>
                          {type === 'participants' ? (
                            <>
                              <TableHead>姓名</TableHead>
                              <TableHead>简介</TableHead>
                              <TableHead>团队</TableHead>
                              <TableHead>联系方式</TableHead>
                            </>
                          ) : (
                            <>
                              <TableHead>节目名称</TableHead>
                              <TableHead>描述</TableHead>
                              <TableHead>顺序</TableHead>
                              <TableHead>选手姓名</TableHead>
                            </>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importData.validRows.slice(0, 10).map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row._rowIndex}</TableCell>
                            {type === 'participants' ? (
                              <>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.bio || '-'}</TableCell>
                                <TableCell>{row.team || '-'}</TableCell>
                                <TableCell>{row.contact || '-'}</TableCell>
                              </>
                            ) : (
                              <>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.description || '-'}</TableCell>
                                <TableCell>{row.order || '-'}</TableCell>
                                <TableCell>{row.participantNames || '-'}</TableCell>
                              </>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {importData.validRows.length > 10 && (
                      <div className="p-2 text-center text-sm text-muted-foreground border-t">
                        仅显示前10条，共{importData.validRows.length}条有效数据
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 无效数据 */}
              {importData.invalidRows.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-red-700">
                    无效数据 ({importData.invalidRows.length} 条)
                  </h4>
                  <div className="border rounded-lg max-h-40 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>行号</TableHead>
                          <TableHead>错误信息</TableHead>
                          <TableHead>原始数据</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {importData.invalidRows.slice(0, 5).map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row._rowIndex}</TableCell>
                            <TableCell className="text-red-600">
                              {row._errors?.join(', ')}
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {JSON.stringify(row).slice(0, 100)}...
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* 导入进度 */}
              {isImporting && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">正在导入数据...</div>
                  <Progress value={progress} />
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPreviewOpen(false)}
                  disabled={isImporting}
                >
                  取消
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={
                    isImporting || 
                    importData.validRows.length === 0 ||
                    (type === 'programs' && !selectedCompetition)
                  }
                >
                  {isImporting ? '导入中...' : `导入 ${importData.validRows.length} 条数据`}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 