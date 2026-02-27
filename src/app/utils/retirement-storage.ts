import { UserData, Assessment, ActionItem, ProgressRecord, Milestone, UserProfile, DimensionScore } from '../types/retirement';

const STORAGE_KEY = 'retirement_planner_data';
const USER_ID = 'default_user'; // 单用户模式

// 默认里程碑
const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'milestone_1',
    title: '首周行动者',
    description: '完成第一周的所有建议行动',
    icon: '🏅',
    unlocked: false,
    criteria: { type: 'actions-completed', value: 7 },
  },
  {
    id: 'milestone_2',
    title: '健康守护者',
    description: '完成所有健康维度的行动项',
    icon: '💪',
    unlocked: false,
    criteria: { type: 'dimension-improved', value: 80 },
  },
  {
    id: 'milestone_3',
    title: '法律安心员',
    description: '完成法律准备相关的重要文档',
    icon: '📜',
    unlocked: false,
    criteria: { type: 'actions-completed', value: 5 },
  },
  {
    id: 'milestone_4',
    title: '连续行动达人',
    description: '连续7天完成至少一项行动',
    icon: '🔥',
    unlocked: false,
    criteria: { type: 'consecutive-days', value: 7 },
  },
];

// 获取用户数据
export const getUserProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load user profile:', error);
  }
  
  // 返回默认数据
  return {
    id: USER_ID,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    assessments: [],
    actions: [],
    progress: [],
    milestones: DEFAULT_MILESTONES,
    preferences: {
      voiceGuidance: false,
      fontSize: 'normal',
      darkMode: false,
    },
  };
};

// 保存用户数据
export const saveUserProfile = (profile: UserProfile): void => {
  try {
    profile.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
};

// 清除所有数据
export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// 生成评估结果
export const generateAssessment = (userData: UserData): Assessment => {
  const dimensions: DimensionScore[] = [
    calculateFinancialScore(userData),
    calculateHealthScore(userData),
    calculateLegalScore(userData),
    calculateSocialScore(userData),
  ];
  
  const totalScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
  );
  
  return {
    id: `assessment_${Date.now()}`,
    userId: USER_ID,
    totalScore,
    dimensions,
    createdAt: Date.now(),
    userData,
  };
};

// 财务维度评分
const calculateFinancialScore = (data: UserData): DimensionScore => {
  let score = 50;
  
  // 年龄因素：越早准备越好
  if (data.age < 40) score += 20;
  else if (data.age < 50) score += 10;
  else if (data.age > 60) score -= 10;
  
  // 收入水平
  if (data.incomeLevel === 'affluent') score += 20;
  else if (data.incomeLevel === 'comfortable') score += 10;
  else if (data.incomeLevel === 'tight') score -= 15;
  
  // 家庭结构
  if (data.familyStructure === 'single') score += 10;
  else if (data.familyStructure === 'multi-generation') score -= 5;
  
  score = Math.max(0, Math.min(100, score));
  
  const status = score >= 80 ? 'well-prepared' : score >= 60 ? 'on-track' : 'needs-attention';
  const years = Math.floor(score / 10);
  
  return {
    dimension: 'financial',
    score,
    status,
    summary: `目前储蓄可支撑约${years}年基础养老生活`,
    details: '建议定期检查养老金账户，考虑配置稳健型理财产品',
  };
};

// 健康维度评分
const calculateHealthScore = (data: UserData): DimensionScore => {
  let score = 50;
  
  if (data.healthStatus === 'excellent') score += 30;
  else if (data.healthStatus === 'good') score += 15;
  else if (data.healthStatus === 'fair') score += 5;
  else score -= 20;
  
  // 年龄调整
  if (data.age < 45) score += 10;
  else if (data.age > 60) score -= 5;
  
  score = Math.max(0, Math.min(100, score));
  
  const status = score >= 80 ? 'well-prepared' : score >= 60 ? 'on-track' : 'needs-attention';
  
  return {
    dimension: 'health',
    score,
    status,
    summary: score >= 80 ? '健康状况良好，保持当前生活方式' : '建议定期体检，关注慢性病预防',
    details: '建立健康档案，记录常用药物和过敏史',
  };
};

// 法律维度评分
const calculateLegalScore = (data: UserData): DimensionScore => {
  let score = data.legalPreparation ? 70 : 30;
  
  // 年龄因素
  if (data.age > 55 && !data.legalPreparation) score -= 10;
  
  score = Math.max(0, Math.min(100, score));
  
  const status = score >= 80 ? 'well-prepared' : score >= 60 ? 'on-track' : 'needs-attention';
  
  return {
    dimension: 'legal',
    score,
    status,
    summary: data.legalPreparation ? '已完成基本法律文档准备' : '尚未准备相关法律文件',
    details: '建议准备：遗嘱、医疗授权委托书、财产清单',
  };
};

// 社会支持维度评分
const calculateSocialScore = (data: UserData): DimensionScore => {
  let score = 50;
  
  if (data.socialSupport === 'strong') score += 30;
  else if (data.socialSupport === 'moderate') score += 10;
  else score -= 10;
  
  // 家庭结构影响
  if (data.familyStructure === 'with-children' || data.familyStructure === 'multi-generation') {
    score += 10;
  } else if (data.familyStructure === 'single') {
    score -= 5;
  }
  
  score = Math.max(0, Math.min(100, score));
  
  const status = score >= 80 ? 'well-prepared' : score >= 60 ? 'on-track' : 'needs-attention';
  
  return {
    dimension: 'social',
    score,
    status,
    summary: score >= 80 ? '社交网络健全，支持充足' : '建议扩展社交圈，增强社区联系',
    details: '参与社区活动，培养兴趣爱好，建立互助关系',
  };
};

// 生成行动建议
export const generateActionItems = (assessment: Assessment): ActionItem[] => {
  const actions: ActionItem[] = [];
  
  assessment.dimensions.forEach((dimension) => {
    if (dimension.status === 'needs-attention' || dimension.status === 'on-track') {
      actions.push(...getActionsForDimension(dimension.dimension, dimension.score));
    }
  });
  
  return actions;
};

// 根据维度生成行动项
const getActionsForDimension = (dimension: DimensionScore['dimension'], score: number): ActionItem[] => {
  const actions: ActionItem[] = [];
  const now = Date.now();
  
  if (dimension === 'financial') {
    actions.push({
      id: `action_financial_1_${now}`,
      title: '检查养老保险',
      description: '确认社保/商业养老保险的缴纳情况和预期收益',
      dimension: 'financial',
      estimatedTime: '1hour',
      priority: 'high',
      completed: false,
      createdAt: now,
    });
    
    if (score < 70) {
      actions.push({
        id: `action_financial_2_${now}`,
        title: '制定储蓄计划',
        description: '设定每月固定养老储蓄金额，建议收入的10-15%',
        dimension: 'financial',
        estimatedTime: '15min',
        priority: 'high',
        completed: false,
        createdAt: now,
      });
    }
  }
  
  if (dimension === 'health') {
    actions.push({
      id: `action_health_1_${now}`,
      title: '整理医保卡信息',
      description: '确认家人是否知晓您的就诊偏好与常用药',
      dimension: 'health',
      estimatedTime: '15min',
      priority: 'high',
      completed: false,
      createdAt: now,
    });
    
    actions.push({
      id: `action_health_2_${now}`,
      title: '预约年度体检',
      description: '建议每年至少一次全面体检，关注心血管等指标',
      dimension: 'health',
      estimatedTime: '1hour',
      priority: 'medium',
      completed: false,
      createdAt: now,
    });
  }
  
  if (dimension === 'legal') {
    actions.push({
      id: `action_legal_1_${now}`,
      title: '准备遗嘱文档',
      description: '与律师咨询，撰写合法有效的遗嘱',
      dimension: 'legal',
      estimatedTime: '1day',
      priority: 'medium',
      completed: false,
      createdAt: now,
    });
    
    actions.push({
      id: `action_legal_2_${now}`,
      title: '整理财产清单',
      description: '列出房产、存款、投资等重要资产明细',
      dimension: 'legal',
      estimatedTime: '1hour',
      priority: 'high',
      completed: false,
      createdAt: now,
    });
  }
  
  if (dimension === 'social') {
    actions.push({
      id: `action_social_1_${now}`,
      title: '加入社区活动',
      description: '了解附近社区中心的活动，选择感兴趣的参加',
      dimension: 'social',
      estimatedTime: '1hour',
      priority: 'medium',
      completed: false,
      createdAt: now,
    });
    
    actions.push({
      id: `action_social_2_${now}`,
      title: '培养新爱好',
      description: '选择一项可长期坚持的兴趣爱好（如书法、摄影）',
      dimension: 'social',
      estimatedTime: '15min',
      priority: 'low',
      completed: false,
      createdAt: now,
    });
  }
  
  return actions;
};

// 更新行动项完成状态
export const toggleActionCompletion = (actionId: string): void => {
  const profile = getUserProfile();
  const action = profile.actions.find(a => a.id === actionId);
  
  if (action) {
    action.completed = !action.completed;
    action.completedAt = action.completed ? Date.now() : undefined;
    
    // 更新今日进度
    updateTodayProgress(profile);
    
    // 检查里程碑
    checkMilestones(profile);
    
    saveUserProfile(profile);
  }
};

// 更新今日进度
const updateTodayProgress = (profile: UserProfile): void => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = today.getTime();
  
  const existingProgress = profile.progress.find(p => p.date === todayTimestamp);
  const completedToday = profile.actions.filter(a => 
    a.completedAt && a.completedAt >= todayTimestamp
  ).length;
  
  if (existingProgress) {
    existingProgress.completedActions = completedToday;
    existingProgress.totalActions = profile.actions.length;
  } else {
    profile.progress.push({
      date: todayTimestamp,
      completedActions: completedToday,
      totalActions: profile.actions.length,
    });
  }
};

// 检查并解锁里程碑
const checkMilestones = (profile: UserProfile): void => {
  const completedActions = profile.actions.filter(a => a.completed).length;
  
  profile.milestones.forEach(milestone => {
    if (!milestone.unlocked) {
      if (milestone.criteria.type === 'actions-completed' && 
          completedActions >= milestone.criteria.value) {
        milestone.unlocked = true;
        milestone.unlockedAt = Date.now();
      }
    }
  });
};

// 添加自定义行动项
export const addCustomAction = (action: Omit<ActionItem, 'id' | 'createdAt' | 'completed'>): void => {
  const profile = getUserProfile();
  
  const newAction: ActionItem = {
    ...action,
    id: `action_custom_${Date.now()}`,
    createdAt: Date.now(),
    completed: false,
  };
  
  profile.actions.push(newAction);
  saveUserProfile(profile);
};
