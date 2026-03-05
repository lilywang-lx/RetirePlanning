// 空状态 - 引导上传首份报告
import { Upload, FileText, Sparkles } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface EmptyStateUploadProps {
  onUploadClick: () => void;
}

export default function EmptyStateUpload({ onUploadClick }: EmptyStateUploadProps) {
  return (
    <Card className="p-12 border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center max-w-2xl mx-auto">
        {/* 图标 */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center animate-bounce">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          开启您的AI健康之旅
        </h2>
        
        {/* 描述 */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          上传您的体检报告，AI将智能识别健康指标，<br />
          为您生成个性化的饮食、运动、补剂和医疗建议，<br />
          开启一对一的健康管理陪伴。
        </p>

        {/* 特点列表 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-1">智能识别</h3>
            <p className="text-sm text-gray-600">自动提取关键指标</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="font-semibold text-gray-900 mb-1">个性建议</h3>
            <p className="text-sm text-gray-600">定制化健康方案</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-pink-200">
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-1">隐私安全</h3>
            <p className="text-sm text-gray-600">数据仅存本地</p>
          </div>
        </div>

        {/* 上传按钮 */}
        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 h-auto"
          onClick={onUploadClick}
        >
          <Upload className="w-5 h-5 mr-2" />
          上传首份体检报告
        </Button>

        {/* 提示 */}
        <p className="text-sm text-gray-500 mt-4">
          支持PDF格式，单个文件最大50MB
        </p>
      </div>
    </Card>
  );
}
