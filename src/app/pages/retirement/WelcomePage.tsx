import { useNavigate } from 'react-router';
import { Heart, Shield, Users, TrendingUp, ArrowRight, Info } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useState, useEffect } from 'react';

export function WelcomePage() {
  const navigate = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    // 检查是否首次访问
    const hasVisited = localStorage.getItem('retirement_planner_visited');
    if (!hasVisited) {
      setShowDisclaimer(true);
    }
  }, []);

  const handleStart = () => {
    if (showDisclaimer && !agreed) {
      return;
    }
    
    localStorage.setItem('retirement_planner_visited', 'true');
    navigate('/retirement/input');
  };

  const features = [
    {
      icon: Heart,
      title: '健康管理',
      description: '身体稳不稳？',
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
    {
      icon: TrendingUp,
      title: '财务准备',
      description: '钱够不够？',
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      icon: Shield,
      title: '法律保障',
      description: '安排清不清？',
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      icon: Users,
      title: '社会支持',
      description: '身边靠不靠？',
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          {/* Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className="mx-auto">
                {/* 银发夫妇简笔画 */}
                <circle cx="90" cy="60" r="30" fill="#E3F2FD" stroke="#4A90E2" strokeWidth="2"/>
                <path d="M 60 90 Q 90 70 120 90" stroke="#4A90E2" strokeWidth="2" fill="none"/>
                <circle cx="150" cy="60" r="30" fill="#FFF3E0" stroke="#FFA726" strokeWidth="2"/>
                <path d="M 120 90 Q 150 70 180 90" stroke="#FFA726" strokeWidth="2" fill="none"/>
                {/* 家庭树 */}
                <path d="M 120 100 L 120 140" stroke="#4CAF50" strokeWidth="3"/>
                <circle cx="120" cy="150" r="8" fill="#4CAF50"/>
                <circle cx="100" cy="170" r="6" fill="#4CAF50"/>
                <circle cx="140" cy="170" r="6" fill="#4CAF50"/>
                <path d="M 120 150 L 100 165" stroke="#4CAF50" strokeWidth="2"/>
                <path d="M 120 150 L 140 165" stroke="#4CAF50" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            你的养老，我们陪你算清楚
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            选择适合您的评估方式，5分钟了解养老准备现状
          </p>

          {/* 双系统选择卡片 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12 max-w-3xl mx-auto">
            {/* 基础版：生活规划 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-blue-100 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">生活规划助手</h3>
              <p className="text-gray-600 text-sm mb-4">
                全面评估健康、财务、法律、社会支持4大维度，获得生活化建议
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">适老化设计</span>
                <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">生活建议</span>
              </div>
              <Button
                onClick={() => navigate('/retirement/input')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                开始生活规划
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            {/* 专业版：财务评估 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-indigo-100 hover:border-indigo-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">财务准备度评估</h3>
              <p className="text-gray-600 text-sm mb-4">
                精确计算养老资金缺口，生成可执行的补足方案和投资建议
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded">AI智能</span>
                <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">金融专业</span>
              </div>
              <Button
                onClick={() => navigate('/financial')}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                开始财务评估
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3 text-sm text-gray-600">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900 mb-2">隐私承诺</p>
                <ul className="space-y-1 text-gray-600">
                  <li>• 您的信息仅保存在手机中，我们无法访问</li>
                  <li>• 本工具为公益教育用途，不构成专业投资建议</li>
                  <li>• 数据加密存储，永不共享给第三方</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-start gap-3 text-sm text-gray-600">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-2">隐私承诺</p>
              <ul className="space-y-1 text-gray-600">
                <li>• 您的信息仅保存在手机中，我们无法访问</li>
                <li>• 本工具为公益���育用途，不构成专业投资建议</li>
                <li>• 数据加密存储，永不共享给第三方</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">免责声明</h2>
            <div className="text-sm text-gray-600 space-y-3 mb-6 max-h-60 overflow-y-auto">
              <p>欢迎使用养老规划助手！在开始之前，请您了解：</p>
              <ul className="space-y-2 ml-4">
                <li>• 本工具仅提供教育性参考，不构成专业理财、法律或医疗建议</li>
                <li>• 评估结果基于您提供的信息模拟生成，实际情况可能存在差异</li>
                <li>• 所有数据加密存储在您的设备本地，我们不会收集或共享您的个人信息</li>
                <li>• 本工具不用于收集个人身份信息（PII）或敏感数据</li>
                <li>• 如需专业建议，请咨询持牌理财顾问、律师或医疗机构</li>
              </ul>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                我已阅读并同意上述声明
              </label>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleStart}
                disabled={!agreed}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                开始使用
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}