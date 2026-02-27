import React from 'react';
import { Eye, EyeOff, Palette } from 'lucide-react';
import { COLORS } from '../App';

interface NavigationPanelProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onToggleOptimization: () => void;
  showOptimization: boolean;
}

export function NavigationPanel({
  currentPage,
  totalPages,
  onPageChange,
  onToggleOptimization,
  showOptimization,
}: NavigationPanelProps) {
  const pageNames = ['封面', '正文页 1', '正文页 2', '封底'];

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：项目标题 */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded flex items-center justify-center"
            style={{ background: COLORS.gold.primary }}
          >
            <Palette className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">
              黑金 Offer Letter 设计
            </h1>
            <p className="text-sm text-neutral-500">企业级录用通知书视觉优化方案</p>
          </div>
        </div>

        {/* 中间：页面导航 */}
        <div className="flex items-center gap-2">
          {pageNames.map((name, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                index === currentPage
                  ? 'text-white shadow-md'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              style={
                index === currentPage
                  ? { background: COLORS.gold.primary }
                  : {}
              }
            >
              {name}
            </button>
          ))}
        </div>

        {/* 右侧：优化说明开关 */}
        <button
          onClick={onToggleOptimization}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          {showOptimization ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span className="text-sm">隐藏优化说明</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="text-sm">显示优化说明</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
