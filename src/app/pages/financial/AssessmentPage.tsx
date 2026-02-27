import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { Slider } from '../../components/ui/slider';
import { 
  Send, 
  Sparkles, 
  X, 
  Info, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  DollarSign
} from 'lucide-react';
import {
  UserProfile,
  LifeVision,
  FinancialSnapshot,
  ReadinessScore,
  GapAnalysis,
  ActionPlan,
  ConversationMessage,
  QuickOption,
  AssessmentStage,
  STAGE_LABELS,
} from '../../types/financial';
import {
  calculateReadiness,
  generateGapAnalysis,
  generateActionPlan,
  formatCurrency,
  parseAmount,
} from '../../utils/financial-calculator';

export function FinancialAssessmentPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStage, setCurrentStage] = useState<AssessmentStage>(1);
  const [currentStep, setCurrentStep] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // 数据状态
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [vision, setVision] = useState<Partial<LifeVision>>({});
  const [financial, setFinancial] = useState<Partial<FinancialSnapshot>>({});
  const [readiness, setReadiness] = useState<ReadinessScore | null>(null);
  const [gap, setGap] = useState<GapAnalysis | null>(null);
  const [plan, setPlan] = useState<ActionPlan | null>(null);

  // 自动滚动
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    setTimeout(() => {
      addAIMessage(
        '你好！我是您的AI财务伙伴小智 🤖\n\n' +
        '接下来5-8分钟，我会通过几个简单问题，帮您算清「退休后的钱够不够用」这个核心问题。\n\n' +
        '📌 重要承诺：\n' +
        '• 您的数据端到端加密，仅保存在您的设备中\n' +
        '• 我们不会索要身份证、银行卡等敏感信息\n' +
        '• 评估结果仅供参考，不构成投资建议\n\n' +
        '准备好了吗？让我们从了解您的基本情况开始！',
        [
          { label: '✅ 明白了，开始评估', value: 'start' },
          { label: '❓ 先看看评估原理', value: 'explain' },
        ]
      );
    }, 500);
  }, []);

  // 添加AI消息
  const addAIMessage = (
    content: string,
    options?: QuickOption[],
    component?: ConversationMessage['component'],
    data?: any
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage: ConversationMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        stage: currentStage,
        options,
        component,
        data,
      };
      setMessages((prev) => [...prev, newMessage]);
    }, 800);
  };

  // 添加用户消息
  const addUserMessage = (content: string) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // 处理快捷选项
  const handleQuickOption = (option: QuickOption) => {
    addUserMessage(option.label);
    
    if (option.value === 'start') {
      startStage1();
    } else if (option.value === 'explain') {
      explainPrinciple();
    } else {
      processStageData(option);
    }
  };

  // 解释评估原理
  const explainPrinciple = () => {
    setTimeout(() => {
      addAIMessage(
        '📊 评估原理简述：\n\n' +
        '我们的模型基于三个核心维度计算您的「养老财务准备度」：\n\n' +
        '1️⃣ 目标需求测算\n' +
        '   根据您的退休时间、理想生活图景，估算未来每月养老支出（考虑通胀）\n\n' +
        '2️⃣ 当前储备盘点\n' +
        '   汇总您的存款、投资、社保、年金等所有可用于养老的资产\n\n' +
        '3️⃣ 缺口与路径规划\n' +
        '   计算差额，生成可行动的补足方案（短期+中期+长期）\n\n' +
        '💡 所有计算参数均可追溯，结果页会展示详细拆解。',
        [{ label: '✅ 了解了，开始评估', value: 'start' }]
      );
    }, 1000);
  };

  // 阶段1：身份与目标
  const startStage1 = () => {
    setCurrentStage(1);
    setCurrentStep(0);
    
    setTimeout(() => {
      addAIMessage(
        '① 首先，能告诉我您今年多大了吗？\n\n这能帮我计算您距离退休还有多少准备时间。',
        [
          { label: '35-39岁', value: 37 },
          { label: '40-44岁', value: 42 },
          { label: '45-49岁', value: 47 },
          { label: '50-54岁', value: 52 },
          { label: '55-59岁', value: 57 },
          { label: '60岁以上', value: 62 },
        ]
      );
    }, 1000);
  };

  // 处理阶段数据
  const processStageData = (option: QuickOption) => {
    if (currentStage === 1) {
      handleStage1(option);
    } else if (currentStage === 2) {
      handleStage2(option);
    } else if (currentStage === 3) {
      handleStage3(option);
    } else if (currentStage === 4) {
      handleStage4(option);
    }
  };

  // 处理阶段1数据
  const handleStage1 = (option: QuickOption) => {
    if (currentStep === 0) {
      // 年龄
      setProfile((prev) => ({ ...prev, age: option.value }));
      setCurrentStep(1);
      
      setTimeout(() => {
        addAIMessage(
          '② 您在哪个城市生活？（这会影响物价水平估算）',
          [
            { label: '🏙 一线城市（北上广深）', value: '一线' },
            { label: '🌆 新一线（杭州成都等）', value: '新一线' },
            { label: '🏘 二三线城市', value: '二三线' },
            { label: '🏡 县城或乡镇', value: '县镇' },
          ]
        );
      }, 1000);
    } else if (currentStep === 1) {
      // 城市
      setProfile((prev) => ({ ...prev, city: option.value }));
      setCurrentStep(2);
      
      setTimeout(() => {
        addAIMessage(
          '③ 您计划几岁退休？\n\n💡 提示：法定退休年龄为男60岁/女55岁，但您可以选择延迟退休。',
          [],
          'slider',
          { min: 55, max: 70, default: 60, field: 'retirementAge' }
        );
      }, 1000);
    } else if (currentStep === 2) {
      // 退休年龄
      setProfile((prev) => ({ ...prev, retirementAge: option.value }));
      
      setTimeout(() => {
        addAIMessage(
          `太好了！您计划${option.value}岁退休。\n\n现在让我了解一下您理想的退休生活是什么样的 →`
        );
      }, 1000);
      
      setTimeout(() => {
        startStage2();
      }, 2500);
    }
  };

  // 阶段2：理想生活
  const startStage2 = () => {
    setCurrentStage(2);
    setCurrentStep(0);
    
    addAIMessage(
      '④ 退休后，您期望过上哪些生活？（可多选）\n\n这会影响您的养老支出预算。',
      [],
      'multi-select',
      {
        options: [
          { key: 'travelRetirement', label: '🏖 旅居养老', desc: '候鸟式生活，南北往返' },
          { key: 'communitySupport', label: '👥 社区互助', desc: '参与社区活动和志愿服务' },
          { key: 'homeAdaptation', label: '🏠 居家适老化', desc: '改造住宅适应老年需求' },
          { key: 'medicalCare', label: '🏥 高品质医疗', desc: '私立医院、定期检' },
          { key: 'hobbyCultivation', label: '🎨 兴趣爱好', desc: '书画、乐器、摄影等' },
          { key: 'familyCompanionship', label: '👨‍👩‍👧 家庭陪伴', desc: '帮忙带孙辈、家庭旅行' },
        ],
      }
    );
  };

  // 处理阶段2数据
  const handleStage2 = (option: QuickOption) => {
    setVision(option.value);
    
    const selectedCount = Object.values(option.value).filter(Boolean).length;
    setTimeout(() => {
      addAIMessage(
        `明白了！您选择了${selectedCount}项生活愿景。\n\n接下来，我需要了解您当前的财务状况，这样才能计算准备度 →`
      );
    }, 1000);
    
    setTimeout(() => {
      startStage3();
    }, 2500);
  };

  // 阶段3：财务快照
  const startStage3 = () => {
    setCurrentStage(3);
    setCurrentStep(0);
    
    addAIMessage(
      '⑤ 您目前的月收入大约是多少？\n\n💡 可以输入"1.5w"或"15000"，我都能识别。',
      [
        { label: '¥5,000以下', value: 4000 },
        { label: '¥5,000-10,000', value: 7500 },
        { label: '¥10,000-20,000', value: 15000 },
        { label: '¥20,000-50,000', value: 35000 },
        { label: '¥50,000以上', value: 60000 },
      ]
    );
  };

  // 处理阶段3数据
  const handleStage3 = (option: QuickOption) => {
    if (currentStep === 0) {
      // 月收入
      setFinancial((prev) => ({ ...prev, monthlyIncome: option.value }));
      setCurrentStep(1);
      
      setTimeout(() => {
        addAIMessage(
          '⑥ 目前有多少金融资产？（存款、理财、基金、股票等）',
          [
            { label: '¥10万以下', value: 50000 },
            { label: '¥10-30万', value: 200000 },
            { label: '¥30-100万', value: 650000 },
            { label: '¥100-300万', value: 2000000 },
            { label: '¥300万以上', value: 4000000 },
          ]
        );
      }, 1000);
    } else if (currentStep === 1) {
      // 金融资产
      setFinancial((prev) => ({ ...prev, financialAssets: option.value }));
      setCurrentStep(2);
      
      setTimeout(() => {
        addAIMessage(
          '⑦ 有专门的养老储蓄或个人养老金账户吗？',
          [
            { label: '✅ 有，约¥10万以下', value: 50000 },
            { label: '✅ 有，约¥10-50万', value: 300000 },
            { label: '✅ 有，约¥50万以上', value: 700000 },
            { label: '❌ 暂时还没有', value: 0 },
          ]
        );
      }, 1000);
    } else if (currentStep === 2) {
      // 养老储蓄
      setFinancial((prev) => ({ ...prev, pensionSavings: option.value }));
      
      setTimeout(() => {
        addAIMessage(
          '很好！财务资产部分已了解。\n\n现在让我确认一下您的保障情况 →'
        );
      }, 1000);
      
      setTimeout(() => {
        startStage4();
      }, 2500);
    }
  };

  // 阶段4：保障体系
  const startStage4 = () => {
    setCurrentStage(4);
    setCurrentStep(0);
    
    addAIMessage(
      '⑧ 您有缴纳社保吗？（包括城镇职工/灵活就业/城乡居民）',
      [
        { label: '✅ 有，正常缴纳中', value: true },
        { label: '❌ 没有或已中断', value: false },
      ]
    );
  };

  // 处理阶段4数据
  const handleStage4 = (option: QuickOption) => {
    if (currentStep === 0) {
      // 社保
      setFinancial((prev) => ({ ...prev, socialSecurity: option.value }));
      setCurrentStep(1);
      
      setTimeout(() => {
        addAIMessage(
          '⑨ 有企业年金或职业年金吗？',
          [
            { label: '✅ 有，单位有缴纳', value: true },
            { label: '❌ 没有', value: false },
          ]
        );
      }, 1000);
    } else if (currentStep === 1) {
      // 企业年金
      setFinancial((prev) => ({ ...prev, enterpriseAnnuity: option.value }));
      setCurrentStep(2);
      
      setTimeout(() => {
        addAIMessage(
          '⑩ 最后一个问题：目前还有房贷或其他负债吗？',
          [
            { label: '✅ 有房贷，约¥50万以下', value: 300000 },
            { label: '✅ 有房贷，约¥50-150万', value: 1000000 },
            { label: '✅ 有房贷，约¥150万以上', value: 2000000 },
            { label: '❌ 无房贷', value: 0 },
          ]
        );
      }, 1000);
    } else if (currentStep === 2) {
      // 负债
      setFinancial((prev) => ({ ...prev, mortgage: option.value, otherDebts: 0 }));
      
      setTimeout(() => {
        addAIMessage(
          '🎉 太棒了！所有信息已收集完毕。\n\n现在让我为您进行深度分析，请稍等片刻...'
        );
      }, 1000);
      
      setTimeout(() => {
        performAnalysis();
      }, 2500);
    }
  };

  // 执行分析
  const performAnalysis = () => {
    setCurrentStage(5);
    
    // 补充默认值
    const completeProfile: UserProfile = {
      age: profile.age || 45,
      occupation: '职场人士',
      city: profile.city || '二三线',
      retirementAge: profile.retirementAge || 60,
    };
    
    const completeVision: LifeVision = {
      travelRetirement: vision.travelRetirement || false,
      communitySupport: vision.communitySupport || false,
      homeAdaptation: vision.homeAdaptation || false,
      medicalCare: vision.medicalCare || false,
      hobbyCultivation: vision.hobbyCultivation || false,
      familyCompanionship: vision.familyCompanionship || false,
    };
    
    const completeFinancial: FinancialSnapshot = {
      monthlyIncome: financial.monthlyIncome || 15000,
      realEstateValue: 0,
      financialAssets: financial.financialAssets || 200000,
      pensionSavings: financial.pensionSavings || 0,
      mortgage: financial.mortgage || 0,
      otherDebts: 0,
      socialSecurity: financial.socialSecurity !== false,
      enterpriseAnnuity: financial.enterpriseAnnuity || false,
      commercialInsurance: 0,
    };
    
    // 计算结果
    const readinessResult = calculateReadiness(completeProfile, completeFinancial, completeVision);
    const gapResult = generateGapAnalysis(completeProfile, completeFinancial, readinessResult);
    const planResult = generateActionPlan(completeProfile, completeFinancial, readinessResult);
    
    setReadiness(readinessResult);
    setGap(gapResult);
    setPlan(planResult);
    
    // 显示结果
    setTimeout(() => {
      showResults(readinessResult, gapResult);
    }, 3000);
  };

  // 显示结果
  const showResults = (readinessResult: ReadinessScore, gapResult: GapAnalysis) => {
    const statusText = {
      excellent: '🎉 优秀',
      good: '👍 良好',
      warning: '⚠️ 需改善',
      critical: '🔴 亟待加强',
    };
    
    addAIMessage(
      `📊 您的养老财务准备度分析报告已生成！\n\n核心结论：${statusText[readinessResult.status]}`,
      [],
      'dashboard',
      { readiness: readinessResult, gap: gapResult }
    );
    
    setTimeout(() => {
      startStage6();
    }, 2000);
  };

  // 阶段6：行动计划
  const startStage6 = () => {
    setCurrentStage(6);
    
    addAIMessage(
      '基于您的情况，我为您定制了「3步改善路径」：\n\n从本周就能开始行动的小事，到长期习惯养成，每一步都清晰可执行。',
      [],
      'action-plan',
      { plan }
    );
  };

  // 处理文本输入
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);
    
    // 简单的文本处理逻辑
    const parsedAmount = parseAmount(input);
    if (parsedAmount > 0) {
      handleQuickOption({ label: input, value: parsedAmount });
    }
    
    setInput('');
  };

  // 进度百分比
  const progressPercentage = (currentStage / 6) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* 顶部状态栏 */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* 进度环 */}
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#E5E7EB"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  stroke="#4A6FA5"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={`${progressPercentage} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                {currentStage}
              </div>
            </div>
            
            {/* 阶段标签 */}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {STAGE_LABELS[currentStage]}
              </p>
              <p className="text-xs text-gray-500">
                第 {currentStage}/6 步
              </p>
            </div>
          </div>
          
          {/* 退出按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (confirm('确定要退出评估吗？您的数据将被保留7天。')) {
                navigate('/retirement');
              }
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            退出
          </Button>
        </div>
      </div>

      {/* 主对话区 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onQuickOption={handleQuickOption}
            />
          ))}

          {/* 打字指示器 */}
          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入区 */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入金额，如 2.5w 或 25000"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="w-12 h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 消息气泡组件
function MessageBubble({
  message,
  onQuickOption,
}: {
  message: ConversationMessage;
  onQuickOption: (option: QuickOption) => void;
}) {
  if (message.type === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm px-4 py-3 max-w-[80%]">
          <p className="whitespace-pre-line">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3">
              <p className="whitespace-pre-line text-gray-800">{message.content}</p>
            </div>

            {/* 快捷选项 */}
            {message.options && message.options.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {message.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuickOption(option)}
                    className="bg-white hover:bg-blue-50 hover:border-blue-400 transition-all shadow-sm"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}

            {/* 特殊组件渲染区域 */}
            {message.component === 'dashboard' && message.data && (
              <DashboardComponent data={message.data} />
            )}
            
            {message.component === 'action-plan' && message.data && (
              <ActionPlanComponent data={message.data} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 打字指示器
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm px-4 py-3">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 仪表盘组件
function DashboardComponent({ data }: { data: any }) {
  const { readiness, gap } = data;
  
  return (
    <div className="mt-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
      {/* 准备度仪表盘 */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="#E5E7EB"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke={
                readiness.status === 'excellent' ? '#10B981' :
                readiness.status === 'good' ? '#3B82F6' :
                readiness.status === 'warning' ? '#F59E0B' :
                '#EF4444'
              }
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${readiness.overall * 4.4} 440`}
              strokeLinecap="round"
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-4xl font-bold text-gray-900">{readiness.overall}%</p>
            <p className="text-sm text-gray-600 mt-1">准备度</p>
          </div>
        </div>
        
        <p className="text-lg font-semibold text-gray-800 mt-4">
          您的储备可覆盖约 <span className="text-blue-600">{readiness.coverageYears}</span> 年养老支出
        </p>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">资金缺口</p>
          <p className="text-xl font-bold text-red-600">
            {formatCurrency(readiness.shortfallAmount)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">年补足额</p>
          <p className="text-xl font-bold text-orange-600">
            {formatCurrency(readiness.annualSupplementNeeded)}
          </p>
        </div>
      </div>

      {/* 缺口拆解 */}
      <div className="bg-white rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">差距来源分析</p>
        {gap.breakdown.map((item: any, index: number) => (
          <div key={index} className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">{item.category}</span>
              <span className="font-semibold">{formatCurrency(item.amount)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 行动计划组件
function ActionPlanComponent({ data }: { data: any }) {
  const { plan } = data;
  
  const difficultyIcons = {
    easy: '⭐️',
    medium: '⭐️⭐️',
    hard: '⭐️⭐️⭐️',
  };
  
  return (
    <div className="mt-4 space-y-4">
      {/* 短期行动 */}
      <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
        <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          ① 本周可做
        </h4>
        <div className="space-y-3">
          {plan.shortTerm.map((action: ActionItem) => (
            <div key={action.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-gray-900">{action.title}</h5>
                <span className="text-xs">{difficultyIcons[action.difficulty]}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{action.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>⏱ {action.timeRequired}</span>
                <span>💰 {action.cost}</span>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                    style={{ width: `${action.expectedImpact}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">预计提升 {action.expectedImpact}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 中期行动 */}
      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5" />
          ② 本季度重点
        </h4>
        <div className="space-y-3">
          {plan.midTerm.map((action: ActionItem) => (
            <div key={action.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-gray-900">{action.title}</h5>
                <span className="text-xs">{difficultyIcons[action.difficulty]}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{action.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>⏱ {action.timeRequired}</span>
                <span>💰 {action.cost}</span>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                    style={{ width: `${action.expectedImpact}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">预计提升 {action.expectedImpact}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 长期习惯 */}
      <div className="bg-purple-50 rounded-2xl p-5 border border-purple-200">
        <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          ③ 长期习惯
        </h4>
        <div className="space-y-3">
          {plan.longTerm.map((action: ActionItem) => (
            <div key={action.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold text-gray-900">{action.title}</h5>
                <span className="text-xs">{difficultyIcons[action.difficulty]}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{action.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>⏱ {action.timeRequired}</span>
                <span>💰 {action.cost}</span>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500"
                    style={{ width: `${action.expectedImpact}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">长期收益 {action.expectedImpact}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 导出按钮 */}
      <div className="flex gap-3 mt-6">
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
          📄 生成PDF报告
        </Button>
        <Button variant="outline" className="flex-1">
          💬 分享到微信
        </Button>
      </div>
    </div>
  );
}