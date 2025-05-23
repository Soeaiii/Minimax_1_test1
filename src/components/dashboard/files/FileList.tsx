'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  MoreHorizontal
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface FileItem {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string;
  programs: Array<{ id: string; name: string }>;
  competitions: Array<{ id: string; name: string }>;
}

interface FileListProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileSelect: (fileIds: string[]) => void;
  onDownload: (fileId: string, filename: string) => void;
  getFileTypeIcon: (mimetype: string) => React.ComponentType<any>;
}

export function FileList({ 
  files, 
  selectedFiles, 
  onFileSelect, 
  onDownload, 
  getFileTypeIcon 
}: FileListProps) {
  const handleFileCheck = (fileId: string, checked: boolean) => {
    if (checked) {
      onFileSelect([...selectedFiles, fileId]);
    } else {
      onFileSelect(selectedFiles.filter(id => id !== fileId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onFileSelect(files.map(file => file.id));
    } else {
      onFileSelect([]);
    }
  };

  const isAllSelected = selectedFiles.length === files.length && files.length > 0;
  const isPartiallySelected = selectedFiles.length > 0 && selectedFiles.length < files.length;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={handleSelectAll}
                aria-label="选择所有文件"
              />
            </TableHead>
            <TableHead>文件名</TableHead>
            <TableHead>类型</TableHead>
            <TableHead>大小</TableHead>
            <TableHead>上传时间</TableHead>
            <TableHead>关联</TableHead>
            <TableHead className="w-12">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => {
            const Icon = getFileTypeIcon(file.mimetype);
            return (
              <TableRow key={file.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={(checked) => handleFileCheck(file.id, checked)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="font-medium" title={file.filename}>
                      {file.filename.length > 30 
                        ? `${file.filename.substring(0, 30)}...` 
                        : file.filename
                      }
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {file.mimetype.split('/')[0]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatFileSize(file.size)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(file.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {file.programs.slice(0, 2).map((program) => (
                      <Badge key={program.id} variant="secondary" className="text-xs">
                        {program.name.length > 10 
                          ? `${program.name.substring(0, 10)}...` 
                          : program.name
                        }
                      </Badge>
                    ))}
                    {file.competitions.slice(0, 1).map((competition) => (
                      <Badge key={competition.id} variant="outline" className="text-xs">
                        {competition.name.length > 10 
                          ? `${competition.name.substring(0, 10)}...` 
                          : competition.name
                        }
                      </Badge>
                    ))}
                    {(file.programs.length + file.competitions.length) > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{file.programs.length + file.competitions.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        预览
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDownload(file.id, file.filename)}>
                        <Download className="mr-2 h-4 w-4" />
                        下载
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      
      {files.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          没有找到文件
        </div>
      )}
    </div>
  );
} 