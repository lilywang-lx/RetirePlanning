import { useState } from 'react';
import { Sparkles, CheckCircle, Edit2, X } from 'lucide-react';

interface OutlineConfirmModalProps {
  outline: string[];
  onConfirm: (outline: string[]) => void;
  onRegenerate: () => void;
  onClose: () => void;
}

export function OutlineConfirmModal({
  outline: initialOutline,
  onConfirm,
  onRegenerate,
  onClose
}: OutlineConfirmModalProps) {
  const [outline, setOutline] = useState(initialOutline);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(outline[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const newOutline = [...outline];
      newOutline[editingIndex] = editValue;
      setOutline(newOutline);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-white">
              <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="size-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">AI 已生成 PPT 大纲</h3>
                <p className="text-sm text-blue-100">请确认大纲结构，确认后将生成完整骨架预览</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="size-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Outline */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-neutral-900">生成的大纲结构（共 {outline.length} 页）</h4>
            <button
              onClick={onRegenerate}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Sparkles className="size-3" />
              重新生成
            </button>
          </div>

          <div className="space-y-2">
            {outline.map((item, index) => (
              <div
                key={index}
                className="group relative"
              >
                {editingIndex === index ? (
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-blue-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                    />
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors">
                    <div className="flex-shrink-0 size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1 text-sm text-neutral-900">{item}</div>
                    <button
                      onClick={() => startEdit(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded"
                    >
                      <Edit2 className="size-4 text-neutral-500" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* AI Insight */}
          <div className="mt-5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Sparkles className="size-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-900">
                <div className="font-medium mb-1">AI 分析：</div>
                <div className="text-blue-700">
                  系统生成了{outline.length}页PPT结构。包含封面页、目录页、{outline.length - 3}个内容页和总结页。
                  您可以点击任意页面标题进行编辑调整。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(outline)}
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <CheckCircle className="size-4" />
            确认大纲，生成骨架预览
          </button>
        </div>
      </div>
    </div>
  );
}