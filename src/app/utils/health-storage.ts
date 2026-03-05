// 健康数据本地存储工具

import { HealthReport, FamilyMember, HealthIndicator, AIConversation, AISuggestion } from '../types/health';

const STORAGE_KEYS = {
  REPORTS: 'health_reports',
  MEMBERS: 'family_members',
  INDICATORS: 'health_indicators',
  CONVERSATIONS: 'ai_conversations',
  SUGGESTIONS: 'ai_suggestions',
};

// 家庭成员管理
export const familyMemberStorage = {
  getAll: (): FamilyMember[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    return data ? JSON.parse(data) : [];
  },
  
  save: (members: FamilyMember[]) => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  },
  
  add: (member: FamilyMember) => {
    const members = familyMemberStorage.getAll();
    members.push(member);
    familyMemberStorage.save(members);
  },
  
  update: (id: string, updates: Partial<FamilyMember>) => {
    const members = familyMemberStorage.getAll();
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      familyMemberStorage.save(members);
    }
  },
  
  delete: (id: string) => {
    const members = familyMemberStorage.getAll().filter(m => m.id !== id);
    familyMemberStorage.save(members);
  },
};

// 健康报告管理
export const reportStorage = {
  getAll: (): HealthReport[] => {
    const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return data ? JSON.parse(data) : [];
  },
  
  save: (reports: HealthReport[]) => {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  },
  
  add: (report: HealthReport) => {
    const reports = reportStorage.getAll();
    reports.push(report);
    reportStorage.save(reports);
  },
  
  updateStatus: (id: string, status: HealthReport['status'], progress?: number) => {
    const reports = reportStorage.getAll();
    const index = reports.findIndex(r => r.id === id);
    if (index !== -1) {
      reports[index].status = status;
      if (progress !== undefined) {
        reports[index].progress = progress;
      }
      reportStorage.save(reports);
    }
  },
  
  getByMember: (memberId: string): HealthReport[] => {
    return reportStorage.getAll().filter(r => r.memberId === memberId);
  },
};

// 健康指标管理
export const indicatorStorage = {
  getAll: (): HealthIndicator[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INDICATORS);
    return data ? JSON.parse(data) : [];
  },
  
  save: (indicators: HealthIndicator[]) => {
    localStorage.setItem(STORAGE_KEYS.INDICATORS, JSON.stringify(indicators));
  },
  
  add: (indicator: HealthIndicator) => {
    const indicators = indicatorStorage.getAll();
    indicators.push(indicator);
    indicatorStorage.save(indicators);
  },
  
  getByMember: (memberId: string): HealthIndicator[] => {
    return indicatorStorage.getAll().filter(i => i.memberId === memberId);
  },
  
  getAbnormal: (memberId: string): HealthIndicator[] => {
    return indicatorStorage.getByMember(memberId).filter(
      i => i.status === 'warning' || i.status === 'critical'
    );
  },
};

// AI对话管理
export const conversationStorage = {
  getAll: (): AIConversation[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : [];
  },
  
  save: (conversations: AIConversation[]) => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  },
  
  add: (conversation: AIConversation) => {
    const conversations = conversationStorage.getAll();
    conversations.push(conversation);
    conversationStorage.save(conversations);
  },
  
  update: (id: string, updates: Partial<AIConversation>) => {
    const conversations = conversationStorage.getAll();
    const index = conversations.findIndex(c => c.id === id);
    if (index !== -1) {
      conversations[index] = { ...conversations[index], ...updates };
      conversationStorage.save(conversations);
    }
  },
};

// AI建议管理
export const suggestionStorage = {
  getAll: (): AISuggestion[] => {
    const data = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
    return data ? JSON.parse(data) : [];
  },
  
  save: (suggestions: AISuggestion[]) => {
    localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(suggestions));
  },
  
  add: (suggestion: AISuggestion) => {
    const suggestions = suggestionStorage.getAll();
    suggestions.push(suggestion);
    suggestionStorage.save(suggestions);
  },
  
  toggleComplete: (id: string) => {
    const suggestions = suggestionStorage.getAll();
    const index = suggestions.findIndex(s => s.id === id);
    if (index !== -1) {
      suggestions[index].completed = !suggestions[index].completed;
      suggestionStorage.save(suggestions);
    }
  },
};

// 初始化演示数据
export const initializeDemoData = () => {
  // 检查是否已有数据
  if (familyMemberStorage.getAll().length > 0) {
    return;
  }

  // 创建默认成员（本人）
  const primaryMember: FamilyMember = {
    id: 'member-1',
    name: '张伟',
    age: 45,
    relationship: '本人',
    gender: '男',
    birthYear: 1979,
    conditions: [],
    isPrimary: true,
  };
  familyMemberStorage.add(primaryMember);

  // 添加演示报告
  const demoReport: HealthReport = {
    id: 'report-1',
    fileName: '张伟_2024年体检报告.pdf',
    uploadTime: '2024-05-25 10:30:00',
    status: 'completed',
    memberId: 'member-1',
    memberName: '张伟',
    reportDate: '2024-05-20',
  };
  reportStorage.add(demoReport);

  // 添加演示指标
  const demoIndicators: HealthIndicator[] = [
    {
      id: 'ind-1',
      name: '空腹血糖',
      value: 5.8,
      unit: 'mmol/L',
      normalRange: { min: 3.9, max: 6.1 },
      status: 'normal',
      trend: 'up',
      trendValue: '↑8.5% vs 2023',
      memberId: 'member-1',
      history: [
        { date: '2023-05', value: 5.3 },
        { date: '2023-11', value: 5.5 },
        { date: '2024-05', value: 5.8 },
      ],
    },
    {
      id: 'ind-2',
      name: '尿酸',
      value: 450,
      unit: 'μmol/L',
      normalRange: { min: 150, max: 420 },
      warningThreshold: 480,
      status: 'warning',
      trend: 'up',
      trendValue: '↑12.5% vs 2023',
      memberId: 'member-1',
      history: [
        { date: '2023-05', value: 380 },
        { date: '2023-11', value: 410 },
        { date: '2024-05', value: 450 },
      ],
    },
    {
      id: 'ind-3',
      name: 'LDL-C',
      value: 4.2,
      unit: 'mmol/L',
      normalRange: { min: 0, max: 3.4 },
      warningThreshold: 4.9,
      status: 'warning',
      trend: 'up',
      trendValue: '↑10.5% vs 2023',
      memberId: 'member-1',
      history: [
        { date: '2023-05', value: 3.8 },
        { date: '2023-11', value: 4.0 },
        { date: '2024-05', value: 4.2 },
      ],
    },
  ];
  demoIndicators.forEach(ind => indicatorStorage.add(ind));

  // 添加AI建议
  const demoSuggestions: AISuggestion[] = [
    {
      id: 'sug-1',
      category: '营养',
      content: '每日增加膳食纤维至25g，多食用燕麦、豆类、蔬菜',
      source: '《中国居民膳食指南2022》',
      timestamp: '2024-05-25 14:30',
      completed: false,
      priority: 'high',
    },
    {
      id: 'sug-2',
      category: '运动',
      content: '每周3次快走，每次30分钟，保持心率在最大心率的60-70%',
      source: 'AHA 2023心脏健康指南',
      timestamp: '2024-05-25 14:32',
      completed: false,
      priority: 'high',
    },
    {
      id: 'sug-3',
      category: '监测',
      content: '建议3个月后复查尿酸、血脂指标',
      source: 'KDIGO高尿酸血症管理指南',
      timestamp: '2024-05-25 14:35',
      completed: false,
      priority: 'medium',
    },
  ];
  demoSuggestions.forEach(sug => suggestionStorage.add(sug));
};
