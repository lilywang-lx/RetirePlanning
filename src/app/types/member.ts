// 成员类型定义
export interface Member {
  id: string;
  name: string;
  createdAt: string;
  lastUpdated?: string;
}

// 健康档案记录
export interface HealthRecord {
  id: string;
  memberId: string;
  reportDate: string;
  createdAt: string;
  
  // 报告基本信息
  reportName?: string;
  reportPages?: number;
  
  // 病史信息
  chronicDiseases?: string; // 慢性疾病
  currentMedications?: string; // 正在服用的药物
  allergies?: string; // 过敏史
  
  // AI诊断结果
  overallAssessment: string; // 整体评价
  abnormalIndicators: AbnormalIndicator[]; // 异常指标
  
  // AI详细建议
  dietPlan?: DietPlan; // 饮食计划
  supplementPlan?: SupplementPlan; // 补剂建议
  medicationPlan?: MedicationPlan; // 药物建议
  fitnessPlan?: FitnessPlan; // 运动计划
  
  // 简化版建议（兼容旧数据）
  dietSuggestions?: string;
  exerciseSuggestions?: string;
  medicationSuggestions?: string;
  
  // 原始对话ID（可选，用于回溯完整对话）
  conversationId?: string;
}

// 异常指标
export interface AbnormalIndicator {
  name: string;
  value: number;
  unit: string;
  normalRange: {
    min: number;
    max: number;
  };
  status: 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

// 饮食计划
export interface DietPlan {
  recommendations: {
    category: string;
    status: 'critical' | 'important' | 'moderate';
    items: {
      label: string;
      content: string;
      tip: string;
    }[];
  }[];
}

// 补剂建议
export interface SupplementPlan {
  recommendations: {
    name: string;
    dosage: string;
    timing: string;
    purpose: string;
    status: 'recommended' | 'suggested' | 'optional';
    notes: string;
  }[];
}

// 药物建议
export interface MedicationPlan {
  status: 'monitoring' | 'required' | 'consulting';
  recommendations: {
    condition: string;
    status: 'monitoring' | 'required';
    advice: string;
    criteria: string;
    options: string[];
  }[];
}

// 运动计划
export interface FitnessPlan {
  weeklyPlan: {
    day: string;
    type: string;
    exercises: {
      name: string;
      duration?: string;
      sets?: string;
      intensity: string;
      target?: string;
      hr?: string;
      calories?: string;
    }[];
    benefits: string;
    notes?: string;
  }[];
  targets: {
    metric: string;
    goal: string;
    current: string;
  }[];
}
