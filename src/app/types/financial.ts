// 养老财务评估相关类型定义

export interface UserProfile {
  age: number;
  occupation: string;
  city: string;
  retirementAge: number;
}

export interface LifeVision {
  travelRetirement: boolean;
  communitySupport: boolean;
  homeAdaptation: boolean;
  medicalCare: boolean;
  hobbyCultivation: boolean;
  familyCompanionship: boolean;
}

export interface FinancialSnapshot {
  monthlyIncome: number;
  realEstateValue: number;
  financialAssets: number;
  pensionSavings: number;
  mortgage: number;
  otherDebts: number;
  socialSecurity: boolean;
  enterpriseAnnuity: boolean;
  commercialInsurance: number;
}

export interface ReadinessScore {
  overall: number; // 0-100
  confidence: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  shortfallAmount: number;
  annualSupplementNeeded: number;
  coverageYears: number;
}

export interface GapAnalysis {
  inflation: number;
  medicalCosts: number;
  longevityRisk: number;
  breakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface ActionPlan {
  shortTerm: ActionItem[];
  midTerm: ActionItem[];
  longTerm: ActionItem[];
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  cost: string;
  expectedImpact: number; // 0-100
  category: 'immediate' | 'quarterly' | 'habit';
}

export interface AssessmentData {
  profile: UserProfile;
  vision: LifeVision;
  financial: FinancialSnapshot;
  readiness: ReadinessScore;
  gap: GapAnalysis;
  plan: ActionPlan;
  createdAt: number;
}

export interface ConversationMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  stage?: number;
  options?: QuickOption[];
  component?: 'input' | 'slider' | 'multi-select' | 'dashboard' | 'action-plan';
  data?: any;
}

export interface QuickOption {
  label: string;
  value: any;
  icon?: string;
}

export type AssessmentStage = 1 | 2 | 3 | 4 | 5 | 6;

export const STAGE_LABELS: Record<AssessmentStage, string> = {
  1: '身份与目标',
  2: '理想生活',
  3: '财务快照',
  4: '保障体系',
  5: '分析结果',
  6: '行动计划',
};
