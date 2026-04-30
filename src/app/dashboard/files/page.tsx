'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  Search, 
  Download, 
  Trash2, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  Eye,
  Filter,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { formatFileSize, formatDate } from '@/lib/utils';
import { FileUpload } from '@/components/dashboard/files/FileUpload';
import { FileGrid } from '@/components/dashboard/files/FileGrid';
import { FileList } from '@/components/dashboard/files/FileList';

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

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/files');
      if (response.ok) {
        const responseData = await response.json();
        // Handle API envelope format: { success, data, ... }
        const filesData = Array.isArray(responseData) ? responseData : responseData?.data ?? [];
        setFiles(filesData);
      } else {
        toast({
          title: "错误",
          description: "获取文件列表失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "网络连接错误",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileUpload = async (uploadedFiles: FileItem[]) => {
    setFiles(prev => [...uploadedFiles, ...prev]);
    setUploadDialogOpen(false);
    toast({
      title: "成功",
      description: `成功上传 ${uploadedFiles.length} 个文件`,
    });
  };

  const handleDeleteFiles = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileIds: selectedFiles }),
      });

      if (response.ok) {
        setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
        setSelectedFiles([]);
        toast({
          title: "成功",
          description: `成功删除 ${selectedFiles.length} 个文件`,
        });
      } else {
        toast({
          title: "错误",
          description: "删除文件失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "网络连接错误",
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (fileId: string, filename: string) => {
    try {
      const response = await fetch(`/api/files/${fileId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast({
          title: "错误",
          description: "下载文件失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "网络连接错误",
        variant: "destructive",
      });
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = (file.filename ?? '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || (file.mimetype ?? '').startsWith(filterType);
    return matchesSearch && matchesType;
  });

  const getFileTypeIcon = (mimetype: string) => {
    const mime = mimetype ?? '';
    if (mime.startsWith('image/')) return Image;
    if (mime.startsWith('video/')) return Video;
    if (mime.startsWith('audio/')) return Music;
    if (mime.includes('zip') || mime.includes('rar')) return Archive;
    return FileText;
  };

  const fileStats = {
    total: files.length,
    images: files.filter(f => (f.mimetype ?? '').startsWith('image/')).length,
    videos: files.filter(f => (f.mimetype ?? '').startsWith('video/')).length,
    documents: files.filter(f => (f.mimetype ?? '').startsWith('text/') || (f.mimetype ?? '').includes('pdf')).length,
    totalSize: files.reduce((sum, file) => sum + (file.size ?? 0), 0),
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">文件管理</h1>
          <p className="text-muted-foreground">
            管理和查看所有上传的文件
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                上传文件
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>上传文件</DialogTitle>
                <DialogDescription>
                  选择要上传的文件，支持多种格式
                </DialogDescription>
              </DialogHeader>
              <FileUpload onUpload={handleFileUpload} />
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={fetchFiles}>
            <RefreshCw className="mr-2 h-4 w-4" />
            刷新
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总文件数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">图片文件</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStats.images}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">视频文件</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fileStats.videos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总大小</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(fileStats.totalSize)}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索文件名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="all">所有类型</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
                <option value="audio">音频</option>
                <option value="text">文档</option>
              </select>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'grid' | 'list')}>
                <TabsList>
                  <TabsTrigger value="grid">网格</TabsTrigger>
                  <TabsTrigger value="list">列表</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作 */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  已选择 {selectedFiles.length} 个文件
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteFiles}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除选中
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                >
                  取消选择
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 文件列表 */}
      <Card>
        <CardContent className="pt-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">没有找到文件</h3>
              <p className="text-muted-foreground">
                {searchTerm ? '尝试调整搜索条件' : '开始上传一些文件吧'}
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <FileGrid
              files={filteredFiles}
              selectedFiles={selectedFiles}
              onFileSelect={setSelectedFiles}
              onDownload={handleDownloadFile}
              getFileTypeIcon={getFileTypeIcon}
            />
          ) : (
            <FileList
              files={filteredFiles}
              selectedFiles={selectedFiles}
              onFileSelect={setSelectedFiles}
              onDownload={handleDownloadFile}
              getFileTypeIcon={getFileTypeIcon}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 