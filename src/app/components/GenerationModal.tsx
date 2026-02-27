import { useState, useEffect } from 'react';
import { CheckCircle, Download, Loader2, FileText, Shield, Sparkles } from 'lucide-react';

interface GenerationModalProps {
  onClose: () => void;
}

type GenerationStep = 
  | 'validating'
  | 'applying-template'
  | 'injecting-content'
  | 'generating-charts'
  | 'cleaning-metadata'
  | 'compatibility-check'
  | 'complete';

const steps: { key: GenerationStep; label: string; duration: number }[] = [
  { key: 'validating', label: '校验维度数据...', duration: 1500 },
  { key: 'applying-template', label: '应用【XX科技】商务模板...', duration: 2000 },
  { key: 'injecting-content', label: '注入标题/正文/备注...', duration: 2500 },
  { key: 'generating-charts', label: '生成SVG图表占位符...', duration: 2000 },
  { key: 'cleaning-metadata', label: '清理元数据（隐私保护）...', duration: 1500 },
  { key: 'compatibility-check', label: '兼容性检测（PPT2019+/WPS2023+/Keynote13+）...', duration: 1800 },
  { key: 'complete', label: '生成完成！', duration: 0 }
];

export function GenerationModal({ onClose }: GenerationModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 100);
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (currentStepIndex >= steps.length - 1) return;

    const currentStep = steps[currentStepIndex];
    const timeout = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, currentStep.duration);

    return () => clearTimeout(timeout);
  }, [currentStepIndex]);

  const currentStep = steps[currentStepIndex];
  const isComplete = currentStep.key === 'complete';
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleDownload = () => {
    // Simulate download trigger
    const link = document.createElement('a');
    link.href = '#'; // In real implementation, this would be a Blob URL
    link.download = `AI-PPT-生成-${new Date().toISOString().split('T')[0]}.pptx`;
    // link.click(); // Commented out to avoid actual download in demo
    
    alert('🎉 PPTX文件下载已触发！\n\n✅ 文件名：AI-PPT-生成.pptx\n✅ 包含：6页完整内容\n✅ 兼容：PowerPoint 2019+ / WPS 2023 / Keynote 13+\n✅ 模板：XX科技商务模板\n✅ 字体：思源黑体 + Inter\n✅ 元数据：已清空（隐私保护）');
    
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
              {isComplete ? (
                <CheckCircle className="size-6" />
              ) : (
                <Loader2 className="size-6 animate-spin" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {isComplete ? 'PPT生成完成' : '正在生成PPT...'}
              </h3>
              <p className="text-sm text-blue-100">
                {isComplete 
                  ? `总耗时 ${(elapsedTime / 1000).toFixed(1)}秒 · 节省约2小时手动制作时间`
                  : `已用时 ${(elapsedTime / 1000).toFixed(1)}秒`
                }
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="px-6 py-6 space-y-3">
          {steps.map((step, index) => {
            const isCurrentStep = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            const isPending = index > currentStepIndex;

            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isCurrentStep ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-30'
                }`}
              >
                <div className={`flex-shrink-0 size-6 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-green-500'
                    : isCurrentStep
                    ? 'bg-blue-600'
                    : 'bg-neutral-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="size-4 text-white" />
                  ) : isCurrentStep ? (
                    <Loader2 className="size-4 text-white animate-spin" />
                  ) : (
                    <div className="size-2 rounded-full bg-white" />
                  )}
                </div>
                <span className={`text-sm ${
                  isCurrentStep ? 'text-neutral-900 font-medium' : 'text-neutral-600'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Complete State */}
        {isComplete && (
          <>
            {/* Stats */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="size-4 text-blue-600" />
                    <span className="text-xs text-blue-900 font-medium">页数统计</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">6页</div>
                </div>

                <div className="px-4 py-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="size-4 text-green-600" />
                    <span className="text-xs text-green-900 font-medium">隐私保护</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">✓ 已清理</div>
                </div>

                <div className="px-4 py-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="size-4 text-purple-600" />
                    <span className="text-xs text-purple-900 font-medium">模板应用</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">✓ 完成</div>
                </div>
              </div>
            </div>

            {/* Compatibility Badge */}
            <div className="px-6 pb-4">
              <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="text-xs text-neutral-500 mb-2">兼容性检测通过：</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-white border border-green-300 text-green-700 text-xs rounded-md font-medium flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    PowerPoint 2019+
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-green-300 text-green-700 text-xs rounded-md font-medium flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    WPS Office 2023
                  </span>
                  <span className="px-2.5 py-1 bg-white border border-green-300 text-green-700 text-xs rounded-md font-medium flex items-center gap-1">
                    <CheckCircle className="size-3" />
                    Keynote 13+
                  </span>
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="px-6 pb-4">
              <div className="px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2 text-xs text-blue-900">
                  <CheckCircle className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium mb-1">已应用【XX科技】商务模板</div>
                    <div className="text-blue-700">
                      字体：思源黑体（中文）+ Inter（英文） · 主色：#2563EB深蓝 · 页脚统一声明 · Logo占位符已添加
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          {isComplete ? (
            <>
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                返回编辑
              </button>
              <button
                onClick={handleDownload}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <Download className="size-4" />
                下载 PPTX 文件
              </button>
            </>
          ) : (
            <div className="text-xs text-neutral-500">
              预计剩余时间：{Math.max(0, Math.round((steps.slice(currentStepIndex).reduce((sum, s) => sum + s.duration, 0)) / 1000))}秒
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
