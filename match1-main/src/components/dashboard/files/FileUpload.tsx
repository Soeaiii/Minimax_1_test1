'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, FileText, Image, Video, Music } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface FileUploadProps {
  onUpload: (files: any[]) => void;
  maxSize?: number;
  accept?: string;
}

interface FileWithId extends File {
  id: string;
}

export function FileUpload({ onUpload, maxSize = 50 * 1024 * 1024, accept }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithId[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList)
      .filter(file => {
        if (file.size > maxSize) {
          console.warn(`文件 ${file.name} 大小超过限制（${formatFileSize(maxSize)}）`);
          return false;
        }
        return true;
      })
      .map(file => Object.assign(file, {
        id: Math.random().toString(36).substr(2, 9)
      }));

    if (Array.from(fileList).length > newFiles.length) {
      alert(`部分文件因超过大小限制（${formatFileSize(maxSize)}）而被忽略`);
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const uploadedFile = await response.json();
          uploadedFiles.push(uploadedFile);
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      }

      onUpload(uploadedFiles);
      setFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Video;
    if (file.type.startsWith('audio/')) return Music;
    return FileText;
  };

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {dragActive ? (
          <p className="text-lg">放下文件以上传...</p>
        ) : (
          <div>
            <p className="text-lg mb-2">拖拽文件到这里，或点击选择文件</p>
            <p className="text-sm text-gray-500">
              最大文件大小: {formatFileSize(maxSize)}
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">待上传文件 ({files.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file) => {
              const Icon = getFileIcon(file);
              return (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} />
              <p className="text-sm text-center">上传中... {Math.round(uploadProgress)}%</p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className="flex-1"
            >
              {uploading ? '上传中...' : `上传 ${files.length} 个文件`}
            </Button>
            <Button
              variant="outline"
              onClick={() => setFiles([])}
              disabled={uploading}
            >
              清空
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 