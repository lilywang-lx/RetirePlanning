import { useState } from 'react';
import { Upload, FileText, Table, Lightbulb, ChevronDown, ChevronUp, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { DocumentInsight } from '@/app/App';

interface DocumentPanelProps {
  documents: DocumentInsight[];
  addDocument: (doc: DocumentInsight) => void;
  toggleDocumentSelection: (docId: string) => void;
}

export function DocumentPanel({ documents, addDocument, toggleDocumentSelection }: DocumentPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (docId: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(docId)) {
        next.delete(docId);
      } else {
        next.add(docId);
      }
      return next;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      // Validate file
      const validTypes = ['.docx', '.pdf', '.xlsx', '.png', '.jpg', '.jpeg'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!validTypes.includes(ext)) {
        alert(`不支持的文件格式：${file.name}\n仅支持：${validTypes.join(', ')}`);
        continue;
      }

      if (file.size > 50 * 1024 * 1024) {
        alert(`文件过大：${file.name}\n最大支持50MB`);
        continue;
      }

      // Simulate upload and parsing
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Wait for completion
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      clearInterval(interval);
      setUploadProgress(100);

      // Generate mock insights based on file type
      generateMockInsights(file);

      // Reset
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const generateMockInsights = (file: File) => {
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (ext === 'xlsx' || ext === 'csv') {
      // Mock data table insights
      addDocument({
        id: `doc-${Date.now()}-1`,
        fileName,
        type: 'dataTable',
        title: 'Q3各渠道转化率',
        description: '表格包含5列×8行，关键指标：微信渠道32.1%、抖音28.7%、官网21.3%',
        targetSlideId: 'slide-3',
        isSelected: false
      });
      
      addDocument({
        id: `doc-${Date.now()}-2`,
        fileName,
        type: 'suggestion',
        title: '图表应用建议',
        description: '建议在第3页（需求背景）图表占位符处插入柱状图可视化各渠道转化率对比',
        suggestion: '→ 建议在第3页图表占位符处插入"Q3各渠道转化率"可视化',
        targetSlideId: 'slide-3',
        isSelected: false
      });
    } else if (ext === 'pdf' || ext === 'docx') {
      // Mock conclusion insights
      addDocument({
        id: `doc-${Date.now()}-3`,
        fileName,
        type: 'conclusion',
        title: '核心结论提取',
        description: 'A方案相比B方案ROI提升23%，实施周期缩短6周，但前期投入增加15%',
        targetSlideId: 'slide-1',
        isSelected: false
      });

      addDocument({
        id: `doc-${Date.now()}-4`,
        fileName,
        type: 'suggestion',
        title: '内容注入建议',
        description: '检测到3个关键论点，建议分别注入至第3-5页的演讲备注区',
        suggestion: '→ 建议将"实施周期缩短6周"注入至第4页备注区作为口述要点',
        targetSlideId: 'slide-4',
        isSelected: false
      });
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      // Mock image OCR insights
      addDocument({
        id: `doc-${Date.now()}-5`,
        fileName,
        type: 'conclusion',
        title: 'OCR文字识别',
        description: '识别到产品架构图，包含：API网关、微服务集群、分布式缓存、消息队列4个核心模块',
        targetSlideId: 'slide-5',
        isSelected: false
      });

      addDocument({
        id: `doc-${Date.now()}-6`,
        fileName,
        type: 'suggestion',
        title: '图片应用建议',
        description: '建议将架构图注入至第5页（技术架构）作为主视觉元素',
        suggestion: '→ 建议在第5页插入识别的架构图，替换默认SVG占位符',
        targetSlideId: 'slide-5',
        isSelected: false
      });
    }
  };

  const getTypeIcon = (type: DocumentInsight['type']) => {
    switch (type) {
      case 'conclusion':
        return <FileText className="size-4 text-blue-600" />;
      case 'dataTable':
        return <Table className="size-4 text-green-600" />;
      case 'suggestion':
        return <Lightbulb className="size-4 text-amber-600" />;
    }
  };

  const getTypeBadge = (type: DocumentInsight['type']) => {
    switch (type) {
      case 'conclusion':
        return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">提取结论</span>;
      case 'dataTable':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">发现数据表</span>;
      case 'suggestion':
        return <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">AI应用建议</span>;
    }
  };

  const selectedCount = documents.filter(d => d.isSelected).length;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-1">文档洞察</h2>
        <p className="text-sm text-neutral-500">
          上传文档以获取AI智能解析 · 勾选卡片以精准注入至对应PPT页面
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`mb-6 border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-neutral-200 bg-neutral-50 hover:border-blue-300 hover:bg-blue-50/50'
        }`}
      >
        <div className="text-center">
          <div className="size-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="size-8 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-neutral-900 mb-1">
            拖拽文件至此处，或点击选择
          </h3>
          <p className="text-xs text-neutral-500 mb-4">
            支持格式：.docx, .pdf, .xlsx, .png, .jpg · 单文件≤50MB
          </p>
          
          <input
            type="file"
            id="file-upload"
            multiple
            accept=".docx,.pdf,.xlsx,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="file-upload"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
          >
            <Upload className="size-4" />
            选择文件
          </label>

          {isUploading && (
            <div className="mt-4">
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                解析中... {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Selected Count */}
      {selectedCount > 0 && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="size-4 text-blue-600" />
            <span className="text-sm text-blue-900">
              已选择 <span className="font-bold">{selectedCount}</span> 个洞察注入至PPT
            </span>
          </div>
          <button
            onClick={() => documents.forEach(d => d.isSelected && toggleDocumentSelection(d.id))}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            取消全选
          </button>
        </div>
      )}

      {/* Document Insights Cards */}
      {documents.length === 0 ? (
        <div className="py-16 text-center">
          <div className="size-16 mx-auto mb-4 rounded-full bg-neutral-100 flex items-center justify-center">
            <AlertCircle className="size-8 text-neutral-400" />
          </div>
          <p className="text-sm text-neutral-500">
            暂无文档解析结果
          </p>
          <p className="text-xs text-neutral-400 mt-1">
            上传文档后，AI将自动提取关键信息并生成智能建议
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`border-2 rounded-xl transition-all ${
                doc.isSelected
                  ? 'border-blue-500 bg-blue-50/50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              {/* Card Header */}
              <div className="px-4 py-3 flex items-start gap-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleDocumentSelection(doc.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {doc.isSelected ? (
                    <CheckSquare className="size-5 text-blue-600" />
                  ) : (
                    <Square className="size-5 text-neutral-400 hover:text-blue-600 transition-colors" />
                  )}
                </button>

                {/* Icon */}
                <div className="flex-shrink-0 size-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                  {getTypeIcon(doc.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-neutral-900">
                      {doc.title}
                    </h4>
                    {getTypeBadge(doc.type)}
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-500">
                    <span>来源：{doc.fileName}</span>
                  </div>

                  {/* Suggestion (collapsed) */}
                  {doc.suggestion && !expandedCards.has(doc.id) && (
                    <button
                      onClick={() => toggleCard(doc.id)}
                      className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <ChevronDown className="size-3" />
                      查看应用建议
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {expandedCards.has(doc.id) && doc.suggestion && (
                <div className="px-4 pb-3 pt-0">
                  <div className="ml-14 pl-4 border-l-2 border-blue-200">
                    <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-amber-900">
                          <div className="font-medium mb-1">应用建议：</div>
                          <div>{doc.suggestion}</div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCard(doc.id)}
                      className="mt-2 flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
                    >
                      <ChevronUp className="size-3" />
                      收起
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Privacy Notice */}
      {documents.length > 0 && (
        <div className="mt-6 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-4 text-neutral-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-neutral-600">
              <span className="font-medium">隐私保护：</span>
              所有文档将在30秒后自动销毁，AI解析全程在本地完成，数据零留存。
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
