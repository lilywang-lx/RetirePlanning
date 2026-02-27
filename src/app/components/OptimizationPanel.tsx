import React from 'react';
import { X, CheckCircle2, XCircle, Lightbulb, Palette, Type } from 'lucide-react';
import { COLORS } from '../App';

interface OptimizationPanelProps {
  onClose: () => void;
}

export function OptimizationPanel({ onClose }: OptimizationPanelProps) {
  return (
    <div className="w-96 bg-white border-r border-neutral-200 overflow-y-auto flex-shrink-0">
      {/* 头部 */}
      <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">设计优化说明</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-neutral-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>
      </div>

      {/* 内容 */}
      <div className="p-6 space-y-6">
        {/* 核心优化点 */}
        <Section icon={<Lightbulb className="w-5 h-5" />} title="核心优化点">
          <OptimizationItem
            type="fix"
            label="问题1"
            before="封面/封底大面积使用纯黑 #000000"
            after={
              <span>
                改用高级黑渐变 <ColorChip color={COLORS.black.primary} /> →{' '}
                <ColorChip color={COLORS.black.secondary} />
              </span>
            }
          />
          <OptimizationItem
            type="fix"
            label="问题2"
            before="正文区使用纯白 #FFFFFF 底色"
            after={
              <span>
                改用金色渐变 <ColorChip color={COLORS.gradient.contentStart} /> →{' '}
                <ColorChip color={COLORS.gradient.contentEnd} />
              </span>
            }
          />
          <OptimizationItem
            type="keep"
            label="保留"
            before="第一页的大楼 Y 型建筑图片"
            after="已保留并设置为 20% 透明度背景层"
          />
        </Section>

        {/* 配色系统 */}
        <Section icon={<Palette className="w-5 h-5" />} title="配色系统">
          <div className="space-y-3">
            <ColorSystem
              title="黑色体系（背景）"
              colors={[
                { name: 'Primary', value: COLORS.black.primary },
                { name: 'Secondary', value: COLORS.black.secondary },
                { name: 'Divider', value: COLORS.black.divider },
              ]}
            />
            <ColorSystem
              title="金色体系（强调）"
              colors={[
                { name: 'Primary', value: COLORS.gold.primary },
                { name: 'Secondary', value: COLORS.gold.secondary },
                { name: 'Muted', value: COLORS.gold.muted },
              ]}
            />
            <ColorSystem
              title="文字颜色"
              colors={[
                { name: 'Primary', value: COLORS.text.primary },
                { name: 'Body', value: COLORS.text.body },
                { name: 'Secondary', value: COLORS.text.secondary },
                { name: 'Legal', value: COLORS.text.legal },
              ]}
            />
          </div>
        </Section>

        {/* 设计规范 */}
        <Section icon={<Type className="w-5 h-5" />} title="设计规范">
          <div className="space-y-2 text-sm text-neutral-600">
            <Rule label="字体" value="思源黑体 / Inter" />
            <Rule label="标题字号" value="20-22px (H1), 16-18px (H2)" />
            <Rule label="正文字号" value="13-14px" />
            <Rule label="行高" value="1.8" />
            <Rule label="描边粗细" value="1px" />
            <Rule label="描边颜色" value="金色 20-30% 透明度" />
            <Rule label="圆角" value="4px (卡片), 6px (装饰)" />
            <Rule label="页面边距" value="48px" />
            <Rule label="阴影" value="极少使用，Y:2 Blur:8 8%黑色" />
          </div>
        </Section>

        {/* 设计原则 */}
        <Section icon={<CheckCircle2 className="w-5 h-5" />} title="设计原则">
          <div className="space-y-2">
            <Principle
              icon="✨"
              text="金色仅用于强调，不作为大面积底色"
            />
            <Principle
              icon="🎨"
              text="渐变过渡要柔和，明度变化 ≤ 5%"
            />
            <Principle
              icon="📐"
              text="描边使用金色低透明度，营造高级感"
            />
            <Principle
              icon="🖼️"
              text="正文卡片使用毛玻璃效果增强层次"
            />
            <Principle
              icon="⚖️"
              text="黑金配色保持 7:3 比例平衡"
            />
          </div>
        </Section>

        {/* 禁止事项 */}
        <Section icon={<XCircle className="w-5 h-5" />} title="禁止使用">
          <div className="space-y-2">
            <Forbidden text="纯黑 #000000" />
            <Forbidden text="纯白 #FFFFFF 作为正文底色" />
            <Forbidden text="高亮浅黄色" />
            <Forbidden text="粗描边（>2px）" />
            <Forbidden text="亮金色描边" />
            <Forbidden text="明显的阴影效果" />
          </div>
        </Section>
      </div>
    </div>
  );
}

// 辅助组件
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div style={{ color: COLORS.gold.primary }}>{icon}</div>
        <h3 className="font-semibold text-neutral-900">{title}</h3>
      </div>
      <div className="ml-7">{children}</div>
    </div>
  );
}

function OptimizationItem({
  type,
  label,
  before,
  after,
}: {
  type: 'fix' | 'keep';
  label: string;
  before: string;
  after: React.ReactNode;
}) {
  return (
    <div className="mb-4 pb-4 border-b border-neutral-100 last:border-0">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded ${
            type === 'fix'
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          }`}
        >
          {label}
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex items-start gap-2">
          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <span className="text-neutral-600">{before}</span>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span className="text-neutral-900 font-medium">{after}</span>
        </div>
      </div>
    </div>
  );
}

function ColorChip({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block w-3 h-3 rounded border border-neutral-300"
        style={{ background: color }}
      />
      <code className="text-xs font-mono">{color}</code>
    </span>
  );
}

function ColorSystem({
  title,
  colors,
}: {
  title: string;
  colors: Array<{ name: string; value: string }>;
}) {
  return (
    <div className="bg-neutral-50 rounded p-3">
      <h4 className="text-xs font-semibold text-neutral-700 mb-2">{title}</h4>
      <div className="space-y-1.5">
        {colors.map((color) => (
          <div key={color.name} className="flex items-center justify-between">
            <span className="text-xs text-neutral-600">{color.name}</span>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono text-neutral-700">
                {color.value}
              </code>
              <span
                className="w-4 h-4 rounded border border-neutral-300"
                style={{ background: color.value }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Rule({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-neutral-600">{label}</span>
      <span className="font-medium text-neutral-900">{value}</span>
    </div>
  );
}

function Principle({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-neutral-700">
      <span className="text-base">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Forbidden({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
      <span className="text-neutral-700 line-through">{text}</span>
    </div>
  );
}
