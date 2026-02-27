import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { 
  TrendingUp, 
  Heart, 
  Shield, 
  Users, 
  ArrowRight,
  Home,
  AlertCircle,
} from 'lucide-react';
import { getUserProfile } from '../../utils/retirement-storage';
import { Assessment, DimensionScore } from '../../types/retirement';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    const profile = getUserProfile();
    if (profile.assessments.length === 0) {
      navigate('/retirement');
      return;
    }
    
    // 获取最新的评估
    const latestAssessment = profile.assessments[profile.assessments.length - 1];
    setAssessment(latestAssessment);
  }, [navigate]);

  if (!assessment) {
    return null;
  }

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return '😊';
    if (score >= 60) return '😐';
    return '😅';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FFA726';
    return '#FF6B6B';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return '准备充分';
    if (score >= 60) return '基本达标';
    return '需要关注';
  };

  const dimensionConfig = {
    financial: {
      icon: TrendingUp,
      title: '财务准备',
      subtitle: '钱够不够？',
      color: '#4A90E2',
      bgColor: 'bg-blue-50',
    },
    health: {
      icon: Heart,
      title: '健康管理',
      subtitle: '身体稳不稳？',
      color: '#FF6B6B',
      bgColor: 'bg-red-50',
    },
    legal: {
      icon: Shield,
      title: '法律保障',
      subtitle: '安排清不清？',
      color: '#4CAF50',
      bgColor: 'bg-green-50',
    },
    social: {
      icon: Users,
      title: '社会支持',
      subtitle: '身边靠不靠？',
      color: '#FFA726',
      bgColor: 'bg-orange-50',
    },
  };

  const GaugeChart = ({ score }: { score: number }) => {
    const data = [
      { value: score },
      { value: 100 - score },
    ];

    return (
      <div className="relative w-48 h-48 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              <Cell fill={getScoreColor(score)} />
              <Cell fill="#E0E0E0" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl mb-2">{getScoreEmoji(score)}</div>
          <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
            {score}
          </div>
          <div className="text-sm text-gray-500">分</div>
        </div>
      </div>
    );
  };

  const DimensionCard = ({ dimension }: { dimension: DimensionScore }) => {
    const config = dimensionConfig[dimension.dimension];
    const Icon = config.icon;
    
    const pieData = [
      { value: dimension.score, color: getScoreColor(dimension.score) },
      { value: 100 - dimension.score, color: '#E0E0E0' },
    ];

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow min-w-[280px]">
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">{config.title}</h3>
            <p className="text-sm text-gray-600">{config.subtitle}</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative w-24 h-24 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={40}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold" style={{ color: getScoreColor(dimension.score) }}>
                  {dimension.score}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium`}
                  style={{ 
                    backgroundColor: getScoreColor(dimension.score) + '20',
                    color: getScoreColor(dimension.score)
                  }}>
              {dimension.status === 'well-prepared' ? '已完善' : 
               dimension.status === 'on-track' ? '基本达标' : '需关注'}
            </span>
          </div>

          <p className="text-sm text-gray-700">
            {dimension.summary}
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/retirement/action')}
            className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            查看详情
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/retirement')}
                className="text-gray-600 hover:text-gray-900"
              >
                <Home className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                养老准备度评估
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/retirement/action')}
            >
              查看行动计划
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Disclaimer Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              <span className="font-medium">ⓘ 本评估基于您提供的信息模拟生成，不替代专业顾问意见。</span>
              数据加密存储，永不共享。
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              养老准备度综合评分
            </h2>
            <p className="text-gray-600">
              基于您的现状分析，这是您当前的准备情况
            </p>
          </div>

          <GaugeChart score={assessment.totalScore} />

          <div className="text-center mt-6">
            <p className="text-lg font-medium mb-2" style={{ color: getScoreColor(assessment.totalScore) }}>
              {getScoreMessage(assessment.totalScore)}
            </p>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {assessment.totalScore >= 80 
                ? '您的养老准备工作做得很好！继续保持，并定期复查。'
                : assessment.totalScore >= 60
                ? '您已经有了良好的基础，建议关注以下维度的改进。'
                : '别担心，我们为您准备了实用的行动建议，一步步来！'
              }
            </p>
          </div>
        </div>

        {/* Dimensions Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            四维度详细评估
          </h3>
          <p className="text-gray-600 mb-6">
            点击任一卡片查看具体建议和行动计划
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {assessment.dimensions.map((dimension) => (
              <DimensionCard key={dimension.dimension} dimension={dimension} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">
            准备好开始行动了吗？
          </h3>
          <p className="text-blue-100 mb-6">
            我们为您准备了 {getUserProfile().actions.length} 项个性化建议
          </p>
          <Button
            onClick={() => navigate('/retirement/action')}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            查看行动计划
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
