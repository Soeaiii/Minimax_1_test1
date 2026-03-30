'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Download, 
  Trash2,
  Upload,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

interface FileAttachment {
  id: string;
  filename: string;
  path: string;
  mimetype: string;
  size: number;
  createdAt: string | Date;
}

interface FileAttachmentListProps {
  files: FileAttachment[];
  canEdit?: boolean;
}

export function FileAttachmentList({ files, canEdit = false }: FileAttachmentListProps) {
  const [isUploading, setIsUploading] = useState(false);

  // 获取文件图标
  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return Image;
    if (mimetype.startsWith('video/')) return Video;
    if (mimetype.startsWith('audio/')) return Music;
    if (mimetype.includes('zip') || mimetype.includes('rar')) return Archive;
    return FileText;
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取文件类型标签颜色
  const getFileTypeColor = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return 'bg-green-100 text-green-800';
    if (mimetype.startsWith('video/')) return 'bg-purple-100 text-purple-800';
    if (mimetype.startsWith('audio/')) return 'bg-yellow-100 text-yellow-800';
    if (mimetype.includes('pdf')) return 'bg-red-100 text-red-800';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  // 下载文件
  const downloadFile = async (file: FileAttachment) => {
    try {
      const response = await fetch(`/api/files/${file.id}/download`);
      if (!response.ok) throw new Error('下载失败');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('文件下载成功');
    } catch (error) {
      toast.error('文件下载失败');
      console.error('Download error:', error);
    }
  };

  // 删除文件
  const deleteFile = async (fileId: string) => {
    if (!confirm('确定要删除这个文件吗？此操作不可撤销。')) return;
    
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('删除失败');
      
      toast.success('文件删除成功');
      // 这里应该触发父组件重新获取文件列表
      window.location.reload();
    } catch (error) {
      toast.error('文件删除失败');
      console.error('Delete error:', error);
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">暂无文件附件</p>
        {canEdit && (
          <Button variant="outline" className="mt-4">
            <Upload className="h-4 w-4 mr-2" />
            上传文件
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 上传按钮 */}
      {canEdit && (
        <div className="flex justify-end">
          <Button variant="outline" disabled={isUploading}>
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? '上传中...' : '上传文件'}
          </Button>
        </div>
      )}

      {/* 文件列表 */}
      <div className="grid gap-3">
        {files.map((file) => {
          const FileIcon = getFileIcon(file.mimetype);
          const typeColor = getFileTypeColor(file.mimetype);
          
          return (
            <Card key={file.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="p-2 bg-muted rounded">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium truncate">{file.filename}</h4>
                        <Badge className={`text-xs ${typeColor}`}>
                          {file.mimetype.split('/')[1]?.toUpperCase() || 'FILE'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                        <span>{formatFileSize(file.size)}</span>
                        <span>
                          {format(
                            typeof file.createdAt === 'string' ? new Date(file.createdAt) : file.createdAt, 
                            'yyyy-MM-dd HH:mm', 
                            { locale: zhCN }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* 预览按钮（针对图片和视频） */}
                    {(file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) && (
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {/* 下载按钮 */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    
                    {/* 删除按钮 */}
                    {canEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => deleteFile(file.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 