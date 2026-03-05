// 健康报告相关类型定义

export interface HealthReport {
  id: string;
  fileName: string;
  uploadTime: string;
  status: 'pending' | 'processing' | 'completed' | 'need-review' | 'failed';
  progress?: number;
  currentStage?: string;
  estimatedTime?: string;
  memberId: string;
  memberName: string;
  reportDate?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: '本人' | '父亲' | '母亲' | '配偶' | '子女' | '其他';
  avatar?: string;
  gender: '男' | '女';
  birthYear: number;
  conditions?: string[];
  isPrimary?: boolean;
}

export interface HealthIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: { min: number; max: number };
  warningThreshold?: number;
  status: 'normal' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  history?: Array<{ date: string; value: number }>;
  memberId: string;
}

export interface AIConversation {
  id: string;
  memberId: string;
  memberName: string;
  reportId?: string;
  topic: string; // 对话主题/标题
  category: 'report' | 'diet' | 'medication' | 'fitness' | 'consultation' | 'general'; // 话题分类
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  context: string; // 对话上下文描述
  messages: AIMessage[];
  createdAt: string; // 创建时间
  tags?: string[]; // 标签，如"尿酸"、"血脂"等
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: Array<{
    title: string;
    reference: string;
  }>;
  actions?: Array<{
    label: string;
    type: 'view-chart' | 'compare' | 'remind';
    data?: any;
  }>;
}

export interface HealthSummary {
  memberId: string;
  urgentIndicator?: {
    name: string;
    value: string;
    status: 'warning' | 'critical';
  };
  recentTrends: Array<{
    date: string;
    indicators: Array<{ name: string; change: number }>;
  }>;
  aiSuggestions: {
    total: number;
    completed: number;
    categories: Array<{
      name: string;
      count: number;
    }>;
  };
}

export interface AISuggestion {
  id: string;
  category: '营养' | '运动' | '监测' | '就医';
  content: string;
  source: string;
  timestamp: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}