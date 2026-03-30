'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Eye, 
  MoreHorizontal,
  FileText,
  Image,
  Video,
  Music,
  Archive
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface FileGridProps {
  files: FileItem[];
  selectedFiles: string[];
  onFileSelect: (fileIds: string[]) => void;
  onDownload: (fileId: string, filename: string) => void;
  getFileTypeIcon: (mimetype: string) => React.ComponentType<any>;
}

export function FileGrid({ 
  files, 
  selectedFiles, 
  onFileSelect, 
  onDownload, 
  getFileTypeIcon 
}: FileGridProps) {
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const handleFileCheck = (fileId: string, checked: boolean) => {
    if (checked) {
      onFileSelect([...selectedFiles, fileId]);
    } else {
      onFileSelect(selectedFiles.filter(id => id !== fileId));
    }
  };

  const getFilePreview = (file: FileItem) => {
    if (file.mimetype.startsWith('image/')) {
      return (
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={`/api/files/${file.id}/preview`}
            alt={file.filename}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const icon = target.nextElementSibling as HTMLElement;
              if (icon) icon.style.display = 'flex';
            }}
          />
          <div className="w-full h-full hidden items-center justify-center">
            <Image className="h-12 w-12 text-gray-400" />
          </div>
        </div>
      );
    }

    const Icon = getFileTypeIcon(file.mimetype);
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <Card key={file.id} className="relative group hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            {/* 选择框 */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox
                checked={selectedFiles.includes(file.id)}
                onCheckedChange={(checked) => handleFileCheck(file.id, checked as boolean)}
                className="bg-white border-gray-300"
              />
            </div>

            {/* 操作菜单 */}
            <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                    <Eye className="mr-2 h-4 w-4" />
                    预览
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDownload(file.id, file.filename)}>
                    <Download className="mr-2 h-4 w-4" />
                    下载
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 文件预览/图标 */}
            <div className="mb-3">
              {getFilePreview(file)}
            </div>

            {/* 文件信息 */}
            <div className="space-y-1">
              <h4 className="text-sm font-medium truncate" title={file.filename}>
                {file.filename}
              </h4>
              <p className="text-xs text-gray-500">
                {formatFileSize(file.size)}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(file.createdAt)}
              </p>
              
              {/* 关联信息 */}
              {(file.programs.length > 0 || file.competitions.length > 0) && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {file.programs.slice(0, 2).map((program) => (
                    <Badge key={program.id} variant="secondary" className="text-xs">
                      {program.name}
                    </Badge>
                  ))}
                  {file.competitions.slice(0, 2).map((competition) => (
                    <Badge key={competition.id} variant="outline" className="text-xs">
                      {competition.name}
                    </Badge>
                  ))}
                  {(file.programs.length + file.competitions.length) > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{file.programs.length + file.competitions.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 