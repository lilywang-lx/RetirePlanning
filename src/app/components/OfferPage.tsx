import React from 'react';
import { COLORS } from '../App';

interface OfferPageProps {
  pageIndex: number;
}

export function OfferPage({ pageIndex }: OfferPageProps) {
  const pages = [
    <CoverPage key="cover" />,
    <ContentPage1 key="content1" />,
    <ContentPage2 key="content2" />,
    <BackCoverPage key="backcover" />,
  ];

  return (
    <div className="w-full aspect-[210/297] bg-white shadow-2xl rounded-sm overflow-hidden">
      {pages[pageIndex]}
    </div>
  );
}

// 封面页
function CoverPage() {
  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(180deg, #1a1612 0%, #2d2416 25%, #3d3020 50%, #2d2416 75%, #1a1612 100%)`,
      }}
    >
      {/* 主图片 - 乐信建筑群 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src="figma:asset/affcaf53f5aff11e64c935bf933ec6013b661460.png"
          alt="LEXIN Building"
          className="w-full h-full object-contain"
          style={{ 
            opacity: 0.4
          }}
        />
      </div>

      {/* 金色光晕效果 - 底部 */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center bottom, ${COLORS.gold.primary}40 0%, transparent 70%)`,
        }}
      />
      
      {/* 金色光晕效果 - 顶部 */}
      <div
        className="absolute inset-x-0 top-0 h-1/3 opacity-20"
        style={{
          background: `radial-gradient(ellipse at center top, ${COLORS.gold.primary}30 0%, transparent 70%)`,
        }}
      />

      {/* 金色装饰线 - 顶部 */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ 
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.gold.primary} 50%, transparent 100%)`,
          boxShadow: `0 0 20px ${COLORS.gold.primary}80`
        }}
      />

      {/* 底部渐变遮罩，让文字区域更清晰 */}
      <div
        className="absolute inset-x-0 bottom-0 h-32"
        style={{
          background: `linear-gradient(to top, #1a1612dd 0%, transparent 100%)`,
        }}
      />

      {/* 金色装饰线 - 底部 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ 
          background: `linear-gradient(90deg, transparent 0%, ${COLORS.gold.primary} 50%, transparent 100%)`,
          boxShadow: `0 0 20px ${COLORS.gold.primary}80`
        }}
      />

      {/* 页码 */}
      <div
        className="absolute bottom-8 right-12 text-sm z-20"
        style={{ color: COLORS.gold.muted }}
      >
        Page 1 / 4
      </div>
    </div>
  );
}

// 正文页1
function ContentPage1() {
  return (
    <div
      className="w-full h-full p-12 relative"
      style={{
        background: `linear-gradient(180deg, ${COLORS.gradient.contentStart} 0%, ${COLORS.gradient.contentEnd} 100%)`,
      }}
    >
      {/* 页眉装饰 */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: COLORS.gold.line }}>
        <span className="text-sm font-medium" style={{ color: COLORS.gold.primary }}>XX科技</span>
        <span className="text-sm" style={{ color: COLORS.gold.muted }}>OFFER LETTER</span>
      </div>

      {/* 正文内容 */}
      <div className="space-y-6">
        {/* 称呼 */}
        <div>
          <p className="text-lg font-medium mb-2" style={{ color: COLORS.text.primary }}>
            尊敬的张三先生/女士：
          </p>
        </div>

        {/* 开场白 */}
        <p className="leading-relaxed" style={{ color: COLORS.text.body, lineHeight: '1.8' }}>
          感谢您对XX科技的关注与信任。经过严格的选拔流程，我们很高兴地通知您，您已成功通过我们的面试评估。现正式向您发出录用邀请，诚邀您加入我们的团队。
        </p>

        {/* 职位信息卡片 */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded p-6 border"
          style={{ borderColor: COLORS.gold.line }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gold.primary }}>
            一、职位信息
          </h3>
          <div className="space-y-3">
            <InfoRow label="职位名称" value="高级产品设计师" />
            <InfoRow label="所属部门" value="产品设计中心" />
            <InfoRow label="汇报对象" value="设计总监" />
            <InfoRow label="工作地点" value="北京市朝阳区XX大厦28层" />
            <InfoRow label="入职日期" value="2026年3月1日" />
          </div>
        </div>

        {/* 薪酬福利卡片 */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded p-6 border"
          style={{ borderColor: COLORS.gold.line }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gold.primary }}>
            二、薪酬福利
          </h3>
          <div className="space-y-3">
            <InfoRow label="基本工资" value="¥28,000 / 月" highlight />
            <InfoRow label="绩效奖金" value="年度绩效考核，最高可达4个月基本工资" />
            <InfoRow label="年终奖金" value="13薪 + 项目奖金" />
            <InfoRow label="五险一金" value="按国家规定缴纳��公积金12%" />
          </div>
        </div>
      </div>

      {/* 页码 */}
      <div
        className="absolute bottom-8 right-12 text-sm"
        style={{ color: COLORS.gold.muted }}
      >
        Page 2 / 4
      </div>
    </div>
  );
}

// 正文页2
function ContentPage2() {
  return (
    <div
      className="w-full h-full p-12 relative"
      style={{
        background: `linear-gradient(180deg, ${COLORS.gradient.contentStart} 0%, ${COLORS.gradient.contentEnd} 100%)`,
      }}
    >
      {/* 页眉装饰 */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: COLORS.gold.line }}>
        <span className="text-sm font-medium" style={{ color: COLORS.gold.primary }}>XX科技</span>
        <span className="text-sm" style={{ color: COLORS.gold.muted }}>OFFER LETTER</span>
      </div>

      {/* 正文内容 */}
      <div className="space-y-6">
        {/* 福利待遇卡片 */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded p-6 border"
          style={{ borderColor: COLORS.gold.line }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gold.primary }}>
            三、福利待遇
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <BenefitItem icon="🏥" text="商业医疗保险" />
            <BenefitItem icon="🏖️" text="带薪年假15天" />
            <BenefitItem icon="🍎" text="每日下午茶" />
            <BenefitItem icon="🎓" text="培训发展基金" />
            <BenefitItem icon="💻" text="MacBook Pro配置" />
            <BenefitItem icon="🏋️" text="健身房会员" />
          </div>
        </div>

        {/* 工作时间 */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded p-6 border"
          style={{ borderColor: COLORS.gold.line }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gold.primary }}>
            四、工作时间
          </h3>
          <div className="space-y-3">
            <InfoRow label="工作制度" value="弹性工作制，每周40小时" />
            <InfoRow label="核心工作时间" value="10:00 - 16:00" />
            <InfoRow label="远程办公" value="每周可申请1-2天远程" />
          </div>
        </div>

        {/* 入职须知 */}
        <div
          className="bg-white/60 backdrop-blur-sm rounded p-6 border"
          style={{ borderColor: COLORS.gold.line }}
        >
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.gold.primary }}>
            五、入职须知
          </h3>
          <div className="space-y-2 text-sm" style={{ color: COLORS.text.body, lineHeight: '1.8' }}>
            <p>1. 请于入职日前3个工作日联系HR办理入职手续</p>
            <p>2. 需准备材料：身份证、学历学位证、离职证明、体检报告</p>
            <p>3. 试用期为3个月，试用期工资为正式工资的80%</p>
          </div>
        </div>

        {/* 接受确认 */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: COLORS.gold.line }}>
          <p className="text-sm mb-4" style={{ color: COLORS.text.body, lineHeight: '1.8' }}>
            请您在收到本录用通知后的<span className="font-semibold" style={{ color: COLORS.gold.primary }}>5个工作日内</span>回复确认。我们期待您的加入！
          </p>
          <div className="flex justify-between items-end mt-8">
            <div>
              <p className="text-sm mb-2" style={{ color: COLORS.text.secondary }}>XX科技人力资源部</p>
              <p className="text-sm" style={{ color: COLORS.text.secondary }}>2026年2月5日</p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: COLORS.text.legal }}>联系电话：010-8888-8888</p>
              <p className="text-xs" style={{ color: COLORS.text.legal }}>邮箱：hr@xxtech.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* 页码 */}
      <div
        className="absolute bottom-8 right-12 text-sm"
        style={{ color: COLORS.gold.muted }}
      >
        Page 3 / 4
      </div>
    </div>
  );
}

// 封底页
function BackCoverPage() {
  return (
    <div
      className="w-full h-full relative flex flex-col items-center justify-center"
      style={{
        background: `linear-gradient(180deg, ${COLORS.gradient.coverStart} 0%, ${COLORS.gradient.coverEnd} 100%)`,
      }}
    >
      {/* 金色装饰线 - 顶部 */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: COLORS.gold.primary }}
      />

      {/* 中央内容 */}
      <div className="relative z-10 text-center px-12">
        {/* 装饰元素 */}
        <div className="mb-12">
          <div
            className="w-20 h-20 mx-auto border-2 rotate-45 flex items-center justify-center"
            style={{ borderColor: COLORS.gold.primary }}
          >
            <div
              className="w-12 h-12 border-2"
              style={{ borderColor: COLORS.gold.secondary }}
            />
          </div>
        </div>

        {/* 欢迎语 */}
        <h2
          className="text-3xl font-semibold mb-6"
          style={{ color: COLORS.gold.primary }}
        >
          期待与您共创未来
        </h2>
        <p
          className="text-lg mb-12 max-w-md mx-auto leading-relaxed"
          style={{ color: COLORS.gold.secondary }}
        >
          加入XX科技，与优秀的团队一起，用设计改变世界
        </p>

        {/* 分隔线 */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className="h-px w-32"
            style={{ background: COLORS.gold.line }}
          />
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: COLORS.gold.primary }}
          />
          <div
            className="h-px w-32"
            style={{ background: COLORS.gold.line }}
          />
        </div>

        {/* 联系信息 */}
        <div className="space-y-2">
          <p className="text-sm" style={{ color: COLORS.gold.muted }}>
            北京市朝阳区XX大厦28层
          </p>
          <p className="text-sm" style={{ color: COLORS.gold.muted }}>
            www.xxtech.com | hr@xxtech.com
          </p>
          <p className="text-sm" style={{ color: COLORS.gold.muted }}>
            010-8888-8888
          </p>
        </div>
      </div>

      {/* 金色装饰线 - 底部 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: COLORS.gold.primary }}
      />

      {/* 页码 */}
      <div
        className="absolute bottom-8 right-12 text-sm"
        style={{ color: COLORS.gold.muted }}
      >
        Page 4 / 4
      </div>
    </div>
  );
}

// 辅助组件
function InfoRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <span
        className="text-sm w-28 flex-shrink-0"
        style={{ color: COLORS.text.secondary }}
      >
        {label}：
      </span>
      <span
        className={`text-sm flex-1 ${highlight ? 'font-semibold' : ''}`}
        style={{ color: highlight ? COLORS.gold.primary : COLORS.text.body }}
      >
        {value}
      </span>
    </div>
  );
}

function BenefitItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{icon}</span>
      <span className="text-sm" style={{ color: COLORS.text.body }}>
        {text}
      </span>
    </div>
  );
}