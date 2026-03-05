// 全局合规提示栏组件
import { AlertCircle } from 'lucide-react';

export default function ComplianceBanner() {
  return (
    <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex items-center gap-3 sticky top-0 z-40">
      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
      <p className="text-sm text-blue-900">
        ⚠️ 本工具提供健康信息参考，不用于疾病诊断、治疗或用药决策。请以医生面诊为准。
      </p>
    </div>
  );
}
