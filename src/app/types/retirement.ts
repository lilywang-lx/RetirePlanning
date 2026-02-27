// 养老规划助手类型定义

export interface UserData {
  age: number;
  familyStructure: 'single' | 'couple' | 'with-children' | 'multi-generation';
  incomeLevel: 'tight' | 'modest' | 'comfortable' | 'affluent';
  healthStatus: 'excellent' | 'good' | 'fair' | 'poor';
  legalPreparation: boolean;
  socialSupport: 'weak' | 'moderate' | 'strong';
  completedAt?: number;
}

export interface DimensionScore {
  dimension: 'financial' | 'health' | 'legal' | 'social';
  score: number; // 0-100
  status: 'needs-attention' | 'on-track' | 'well-prepared';
  summary: string;
  details: string;
}

export interface Assessment {
  id: string;
  userId: string;
  totalScore: number; // 0-100
  dimensions: DimensionScore[];
  createdAt: number;
  userData: UserData;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  dimension: 'financial' | 'health' | 'legal' | 'social';
  estimatedTime: '15min' | '1hour' | '1day';
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: number;
  createdAt: number;
}

export interface ProgressRecord {
  date: number; // timestamp
  completedActions: number;
  totalActions: number;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  criteria: {
    type: 'actions-completed' | 'consecutive-days' | 'dimension-improved';
    value: number;
  };
}

export interface UserProfile {
  id: string;
  nickname?: string;
  createdAt: number;
  updatedAt: number;
  assessments: Assessment[];
  actions: ActionItem[];
  progress: ProgressRecord[];
  milestones: Milestone[];
  preferences: {
    voiceGuidance: boolean;
    fontSize: 'normal' | 'large' | 'extra-large';
    darkMode: boolean;
  };
}
