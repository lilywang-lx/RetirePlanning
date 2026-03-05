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
  dietSuggestions: string; // 饮食建议
  exerciseSuggestions: string; // 运动建议
  medicationSuggestions: string; // 药物建议
  
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
