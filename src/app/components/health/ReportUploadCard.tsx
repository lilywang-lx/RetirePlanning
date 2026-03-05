// 健康报告上传组件
import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileText, X, Loader2, AlertCircle, Check, Users } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { familyMemberStorage, reportStorage } from '../../utils/health-storage';
import { HealthReport, FamilyMember } from '../../types/health';

interface ReportUploadCardProps {
  onUploadComplete?: (report: HealthReport) => void;
  compact?: boolean; // 紧凑模式
}

interface UploadingFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'analyzing' | 'completed' | 'error';
  currentStage?: string;
  error?: string;
  reportId?: string;
}

export default function ReportUploadCard({ onUploadComplete, compact = false }: ReportUploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 加载家庭成员
  useEffect(() => {
    const allMembers = familyMemberStorage.getAll();
    setMembers(allMembers);
    if (allMembers.length > 0 && !selectedMemberId) {
      const primary = allMembers.find(m => m.isPrimary);
      setSelectedMemberId(primary?.id || allMembers[0].id);
    }
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [selectedMemberId]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [selectedMemberId]);

  const handleFiles = (files: File[]) => {
    if (!selectedMemberId) {
      alert('请先选择家庭成员');
      return;
    }

    const pdfFiles = files.filter(f => f.type === 'application/pdf' || f.name.endsWith('.pdf'));
    
    if (pdfFiles.length === 0) {
      alert('请上传PDF格式的体检报告');
      return;
    }

    if (pdfFiles.length > 5) {
      alert('一次最多上传5个文件');
      return;
    }

    // 检查文件大小
    const oversizedFiles = pdfFiles.filter(f => f.size > 50 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('单个文件大小不能超过50MB');
      return;
    }

    // 开始上传
    pdfFiles.forEach(file => {
      const uploadingFile: UploadingFile = {
        file,
        id: `upload-${Date.now()}-${Math.random()}`,
        progress: 0,
        status: 'uploading',
        currentStage: '文件上传中...',
      };

      setUploadingFiles(prev => [...prev, uploadingFile]);
      simulateUpload(uploadingFile);
    });
  };

  const simulateUpload = async (uploadingFile: UploadingFile) => {
    const selectedMember = members.find(m => m.id === selectedMemberId);
    if (!selectedMember) return;

    try {
      // 阶段1: 上传文件 (0-30%)
      for (let i = 0; i <= 30; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateUploadingFile(uploadingFile.id, {
          progress: i,
          currentStage: '正在上传文件...',
        });
      }

      // 阶段2: OCR识别 (30-60%)
      updateUploadingFile(uploadingFile.id, {
        currentStage: 'AI识别报告内容...',
      });
      for (let i = 30; i <= 60; i += 3) {
        await new Promise(resolve => setTimeout(resolve, 150));
        updateUploadingFile(uploadingFile.id, { progress: i });
      }

      // 阶段3: 数据提取 (60-80%)
      updateUploadingFile(uploadingFile.id, {
        currentStage: '提取健康指标数据...',
      });
      for (let i = 60; i <= 80; i += 4) {
        await new Promise(resolve => setTimeout(resolve, 120));
        updateUploadingFile(uploadingFile.id, { progress: i });
      }

      // 阶段4: AI分析 (80-100%)
      updateUploadingFile(uploadingFile.id, {
        status: 'analyzing',
        currentStage: 'AI智能分析中...',
      });
      for (let i = 80; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        updateUploadingFile(uploadingFile.id, { progress: i });
      }

      // 保存报告到存储
      const newReport: HealthReport = {
        id: `report-${Date.now()}`,
        fileName: uploadingFile.file.name,
        uploadTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        status: 'completed',
        memberId: selectedMemberId,
        memberName: selectedMember.name,
        reportDate: new Date().toISOString().split('T')[0],
        progress: 100,
      };

      reportStorage.add(newReport);

      // 完成
      updateUploadingFile(uploadingFile.id, {
        status: 'completed',
        currentStage: '解读完成！',
        progress: 100,
        reportId: newReport.id,
      });

      // 显示成功提示
      toast.success('报告解读完成！', {
        description: `已为 ${selectedMember.name} 生成个性化健康建议`,
        duration: 4000,
      });

      // 通知父组件
      if (onUploadComplete) {
        setTimeout(() => {
          onUploadComplete(newReport);
        }, 1000);
      }

      // 3秒后移除完成的项目
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(f => f.id !== uploadingFile.id));
      }, 3000);

    } catch (error) {
      updateUploadingFile(uploadingFile.id, {
        status: 'error',
        currentStage: '上传失败',
        error: '网络错误，请重试',
      });
      
      // 显示错误提示
      toast.error('上传失败', {
        description: '网络错误，请稍后重试',
      });
    }
  };

  const updateUploadingFile = (id: string, updates: Partial<UploadingFile>) => {
    setUploadingFiles(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'analyzing':
        return <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />;
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-50 border-blue-200';
      case 'analyzing':
        return 'bg-purple-50 border-purple-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          上传体检报告
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 成员选择 */}
      {members.length > 0 && (
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">上传给:</span>
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="选择家庭成员" />
            </SelectTrigger>
            <SelectContent>
              {members.map(member => (
                <SelectItem key={member.id} value={member.id}>
                  {member.name} {member.isPrimary && '★'} ({member.relationship})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* 上传区域 */}
      <Card
        className={`
          border-2 border-dashed transition-all cursor-pointer
          ${isDragging
            ? 'border-blue-500 bg-blue-50 scale-[1.02]'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Upload className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            上传体检报告
          </h3>
          <p className="text-gray-600 mb-4">
            拖拽PDF文件到此处，或点击选择文件
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
            <Badge variant="outline">支持PDF格式</Badge>
            <Badge variant="outline">最多5个文件</Badge>
            <Badge variant="outline">单个≤50MB</Badge>
          </div>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* 上传进度列表 */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-3">
          {uploadingFiles.map(uploadFile => (
            <Card
              key={uploadFile.id}
              className={`p-4 border-2 ${getStatusColor(uploadFile.status)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(uploadFile.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <h4 className="font-medium text-gray-900 truncate">
                          {uploadFile.file.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    {uploadFile.status !== 'completed' && uploadFile.status !== 'error' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeUploadingFile(uploadFile.id);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {uploadFile.status === 'error' ? (
                    <div className="text-sm text-red-600">
                      {uploadFile.error || '上传失败'}
                    </div>
                  ) : (
                    <>
                      <div className="mb-2">
                        <Progress value={uploadFile.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {uploadFile.currentStage}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {uploadFile.progress}%
                        </span>
                      </div>
                    </>
                  )}

                  {uploadFile.status === 'completed' && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-green-700">
                      <Check className="w-4 h-4" />
                      <span>AI解读完成，已保存到健康档案</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* 提示信息 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">上传提示</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>AI将自动识别并提取报告中的健康指标</li>
              <li>上传的报告会与家庭成员关联保存</li>
              <li>解读完成后可在健康档案中查看详细建议</li>
              <li>您的数据仅保存在本地浏览器，确保隐私安全</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
