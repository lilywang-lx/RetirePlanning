import { 
  FinancialSnapshot, 
  UserProfile, 
  ReadinessScore, 
  GapAnalysis, 
  ActionPlan,
  ActionItem,
  LifeVision
} from '../types/financial';

// 计算养老财务准备度
export const calculateReadiness = (
  profile: UserProfile,
  financial: FinancialSnapshot,
  vision: LifeVision
): ReadinessScore => {
  const yearsUntilRetirement = profile.retirementAge - profile.age;
  const retirementYears = 85 - profile.retirementAge; // 假设预期寿命85岁
  
  // 计算月度养老需求（基于生活愿景）
  const baseMonthlyNeed = 8000; // 基础生活费
  let visionMultiplier = 1.0;
  if (vision.travelRetirement) visionMultiplier += 0.3;
  if (vision.medicalCare) visionMultiplier += 0.2;
  if (vision.hobbyCultivation) visionMultiplier += 0.15;
  
  const monthlyNeedAtRetirement = baseMonthlyNeed * visionMultiplier;
  
  // 考虑通胀（假设3%年通胀率）
  const inflationRate = 0.03;
  const inflatedMonthlyNeed = monthlyNeedAtRetirement * Math.pow(1 + inflationRate, yearsUntilRetirement);
  
  // 总需求金额
  const totalNeeded = inflatedMonthlyNeed * 12 * retirementYears;
  
  // 当前储备
  const currentSavings = financial.financialAssets + financial.pensionSavings;
  
  // 社保收入折现（假设月领取2500元）
  const socialSecurityMonthly = financial.socialSecurity ? 2500 : 0;
  const socialSecurityTotal = socialSecurityMonthly * 12 * retirementYears;
  
  // 企业年金折现（假设月领取1500元）
  const annuityMonthly = financial.enterpriseAnnuity ? 1500 : 0;
  const annuityTotal = annuityMonthly * 12 * retirementYears;
  
  // 未来储蓄能力（假设年储蓄15%收入）
  const annualSavings = financial.monthlyIncome * 12 * 0.15;
  const futureSavings = annualSavings * yearsUntilRetirement * 1.05; // 考虑5%投资回报
  
  // 总储备
  const totalPrepared = currentSavings + socialSecurityTotal + annuityTotal + futureSavings;
  
  // 缺口
  const shortfall = Math.max(0, totalNeeded - totalPrepared);
  
  // 准备度分数
  const readinessRatio = totalPrepared / totalNeeded;
  const overall = Math.min(100, Math.round(readinessRatio * 100));
  
  // 状态评级
  let status: ReadinessScore['status'];
  if (overall >= 90) status = 'excellent';
  else if (overall >= 70) status = 'good';
  else if (overall >= 50) status = 'warning';
  else status = 'critical';
  
  // 年补足金额
  const annualSupplementNeeded = yearsUntilRetirement > 0 
    ? Math.round(shortfall / yearsUntilRetirement)
    : 0;
  
  // 当前储备可覆盖年数
  const coverageYears = Math.round(totalPrepared / (inflatedMonthlyNeed * 12));
  
  // 置信度（基于数据完整性）
  let confidence = 100;
  if (financial.monthlyIncome === 0) confidence -= 20;
  if (financial.financialAssets === 0 && financial.pensionSavings === 0) confidence -= 15;
  if (!financial.socialSecurity) confidence -= 10;
  
  return {
    overall,
    confidence,
    status,
    shortfallAmount: Math.round(shortfall),
    annualSupplementNeeded,
    coverageYears,
  };
};

// 生成缺口分析
export const generateGapAnalysis = (
  profile: UserProfile,
  financial: FinancialSnapshot,
  readiness: ReadinessScore
): GapAnalysis => {
  const totalShortfall = readiness.shortfallAmount;
  
  // 通胀影响（假设占30%）
  const inflationImpact = totalShortfall * 0.30;
  
  // 医疗成本（假设占25%）
  const medicalImpact = totalShortfall * 0.25;
  
  // 长寿风险（假设占45%）
  const longevityImpact = totalShortfall * 0.45;
  
  return {
    inflation: Math.round(inflationImpact),
    medicalCosts: Math.round(medicalImpact),
    longevityRisk: Math.round(longevityImpact),
    breakdown: [
      {
        category: '长寿风险储备',
        amount: Math.round(longevityImpact),
        percentage: 45,
      },
      {
        category: '通胀侵蚀缓冲',
        amount: Math.round(inflationImpact),
        percentage: 30,
      },
      {
        category: '医疗支出预留',
        amount: Math.round(medicalImpact),
        percentage: 25,
      },
    ],
  };
};

// 生成行动计划
export const generateActionPlan = (
  profile: UserProfile,
  financial: FinancialSnapshot,
  readiness: ReadinessScore
): ActionPlan => {
  const shortTerm: ActionItem[] = [];
  const midTerm: ActionItem[] = [];
  const longTerm: ActionItem[] = [];
  
  // 短期行动（本周可做）
  if (!financial.socialSecurity) {
    shortTerm.push({
      id: 'short_1',
      title: '核查社保缴纳记录',
      description: '登录"国家社会保险公共服务平台"APP，查看个人社保累计缴费月数和预估养老金',
      difficulty: 'easy',
      timeRequired: '15分钟',
      cost: '¥0',
      expectedImpact: 20,
      category: 'immediate',
    });
  }
  
  shortTerm.push({
    id: 'short_2',
    title: '整理现有资产清单',
    description: '列出所有银行账户、理财产品、基金股票等金融资产的当前价值，建立养老资产台账',
    difficulty: 'easy',
    timeRequired: '30分钟',
    cost: '¥0',
    expectedImpact: 15,
    category: 'immediate',
  });
  
  if (financial.monthlyIncome > 0) {
    shortTerm.push({
      id: 'short_3',
      title: '开通个人养老金账户',
      description: '在工行/招行等银行APP开立个人养老金资金账户，每年最高可抵扣¥12,000个税',
      difficulty: 'easy',
      timeRequired: '10分钟',
      cost: '¥0',
      expectedImpact: 25,
      category: 'immediate',
    });
  }
  
  // 中期行动（本季度重点）
  if (readiness.overall < 70) {
    midTerm.push({
      id: 'mid_1',
      title: '配置养老年金保险',
      description: '选择一份保证领取至100岁的商业养老年金，建议年缴费不低于¥3万，可补充社保不足',
      difficulty: 'medium',
      timeRequired: '2-3小时（含咨询）',
      cost: '¥30,000/年起',
      expectedImpact: 35,
      category: 'quarterly',
    });
  }
  
  midTerm.push({
    id: 'mid_2',
    title: '调整资产配置比例',
    description: `建议将${Math.round((profile.retirementAge - profile.age) * 0.8)}%资产配置于稳健型产品（债券基金/养老目标基金），降低退休前波动风险`,
    difficulty: 'medium',
    timeRequired: '1-2小时',
    cost: '根据资产规模',
    expectedImpact: 30,
    category: 'quarterly',
  });
  
  if (financial.mortgage > 0) {
    midTerm.push({
      id: 'mid_3',
      title: '优化负债结构',
      description: '评估是否提前还贷或转为组合贷，降低退休前债务压力，释放现金流用于养老储备',
      difficulty: 'hard',
      timeRequired: '3-5小时（含测算）',
      cost: '可能产生违约金',
      expectedImpact: 25,
      category: 'quarterly',
    });
  }
  
  // 长期习惯
  const monthlyTarget = Math.round(readiness.annualSupplementNeeded / 12);
  longTerm.push({
    id: 'long_1',
    title: '建立养老定投计划',
    description: `每月固定投资¥${monthlyTarget.toLocaleString()}至养老目标日期基金（如"养老2045"），自动调整股债比例`,
    difficulty: 'easy',
    timeRequired: '5分钟/月',
    cost: `¥${monthlyTarget.toLocaleString()}/月`,
    expectedImpact: 50,
    category: 'habit',
  });
  
  longTerm.push({
    id: 'long_2',
    title: '年度养老健检制度',
    description: '每年生日当月重新评估养老准备度，根据收入、通胀、政策变化动态调整储蓄目标',
    difficulty: 'easy',
    timeRequired: '30分钟/年',
    cost: '¥0',
    expectedImpact: 20,
    category: 'habit',
  });
  
  longTerm.push({
    id: 'long_3',
    title: '培养"延迟退休"备选技能',
    description: '学习一项可在退休后兼职的技能（咨询/培训/手工艺），既丰富生活又可补充收入',
    difficulty: 'medium',
    timeRequired: '持续学习',
    cost: '根据课程',
    expectedImpact: 15,
    category: 'habit',
  });
  
  return {
    shortTerm,
    midTerm,
    longTerm,
  };
};

// 格式化金额（带千分位）
export const formatCurrency = (amount: number): string => {
  if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount.toLocaleString()}`;
};

// 解析输入金额（支持2.5w、25000等格式）
export const parseAmount = (input: string): number => {
  const cleaned = input.replace(/[¥,，]/g, '').trim().toLowerCase();
  
  if (cleaned.includes('w') || cleaned.includes('万')) {
    const num = parseFloat(cleaned.replace(/[w万]/g, ''));
    return num * 10000;
  }
  
  if (cleaned.includes('k')) {
    const num = parseFloat(cleaned.replace(/k/g, ''));
    return num * 1000;
  }
  
  return parseFloat(cleaned) || 0;
};
