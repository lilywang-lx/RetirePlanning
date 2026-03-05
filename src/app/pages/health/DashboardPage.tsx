// 首页仪表盘
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { TrendingUp, Activity, Target, ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { MemberSelector } from '../../components/MemberSelector';
import { useMembers, useHealthRecords } from '../../hooks/useMembers';
import { AbnormalIndicator } from '../../types/member';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { members, currentMemberId, setCurrentMemberId } = useMembers();
  const { records, latestRecord } = useHealthRecords(currentMemberId);

  // 从最新记录中获取数据
  const urgentIndicator = latestRecord?.abnormalIndicators.find(
    i => i.status === 'critical'
  ) || latestRecord?.abnormalIndicators[0] || null;

  // 模拟AI建议数据（后续从记录中提取）
  const suggestions = latestRecord ? [
    { id: '1', category: '饮食调整', content: latestRecord.dietSuggestions.slice(0, 50) + '...', completed: false, timestamp: '2天前', source: '最新报告' },
    { id: '2', category: '运动建议', content: latestRecord.exerciseSuggestions.slice(0, 50) + '...', completed: false, timestamp: '2天前', source: '最新报告' },
    { id: '3', category: '药物建议', content: latestRecord.medicationSuggestions.slice(0, 50) + '...', completed: false, timestamp: '2天前', source: '最新报告' },
  ] : [];

  const completionRate = 0; // 后续实现进度追踪

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部：成员切换器和AI助手 */}
      <div className="flex items-center justify-between">
        <MemberSelector 
          members={members}
          currentMemberId={currentMemberId}
          onMemberChange={setCurrentMemberId}
        />
        
        <Button 
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => navigate('/chat')}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          AI对话 · 上传报告
        </Button>
      </div>

      {/* AI健康助手欢迎卡片 */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-2xl">AI</span>
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-1">AI健康助手</h1>
            <p className="text-sm text-gray-600">持续守护您的健康 · 一次上传，终身陪伴</p>
          </div>
        </div>
      </Card>

      {/* 空状态：首次使用引导 */}
      {records.length === 0 ? (
        <Card className="p-12 text-center border-2 border-dashed">
          <div className="max-w-md mx-auto">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              还没有健康记录
            </h3>
            <p className="text-gray-600 mb-6">
              {members.length === 0 
                ? '开始您的健康管理之旅，在AI对话中上传第一份健康报告'
                : `${members.find(m => m.id === currentMemberId)?.name || '该成员'}还没有上传报告，前往AI对话上传吧`
              }
            </p>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => navigate('/chat')}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              前往AI对话
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* 页面标题 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">健康概览</h2>
            <p className="text-gray-600 mt-1">
              {members.find(m => m.id === currentMemberId)?.name || '成员'}的健康状况一目了然
            </p>
          </div>

          {/* 健康快照卡片 - 三列布局 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 今日关注 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900">今日关注</h3>
          </div>

          {urgentIndicator ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(urgentIndicator.status)}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-medium">{urgentIndicator.name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white">
                    {urgentIndicator.status === 'critical' ? '需干预' : '警示'}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {urgentIndicator.value} {urgentIndicator.unit}
                </div>
                <div className="text-sm opacity-80">
                  正常范围: {urgentIndicator.normalRange.min}-{urgentIndicator.normalRange.max} {urgentIndicator.unit}
                </div>
                {urgentIndicator.trend && (
                  <div className="text-sm mt-2">
                    {urgentIndicator.trendValue}
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => navigate('/chat')}
              >
                查看AI建议
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>暂无需要特别关注的指标</p>
              <p className="text-sm mt-1">继续保持健康生活方式</p>
            </div>
          )}
        </Card>

        {/* 趋势洞察 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">趋势洞察</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">尿酸</span>
              <span className="text-sm font-medium text-orange-600">↑ 12.5%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">LDL-C</span>
              <span className="text-sm font-medium text-orange-600">↑ 10.5%</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-gray-600">空腹血糖</span>
              <span className="text-sm font-medium text-green-600">↑ 8.5%</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => navigate('/profiles')}
          >
            查看完整趋势图
          </Button>
        </Card>

        {/* AI建议进度 */}
        <Card className="p-6 border-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">AI建议进度</h3>
          </div>

          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {completionRate}%
              </div>
              <Progress value={completionRate} className="h-2" />
              <p className="text-sm text-gray-600 mt-2">
                已执行建议 {suggestions.filter(s => s.completed).length} / {suggestions.length}
              </p>
            </div>

            <div className="space-y-2 pt-2">
              {suggestions.map((sug) => (
                <div 
                  key={sug.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className={`w-2 h-2 rounded-full ${sug.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-gray-600">{sug.category}</span>
                  <span className="text-gray-400">({sug.completed ? '已完成' : '进行中'})</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/chat')}
            >
              查看所有建议
            </Button>
          </div>
        </Card>
      </div>
        </>
      )}

      {/* 近期AI互动摘要 */}
      {records.length > 0 && suggestions.length > 0 && (
        <Card className="p-6 border-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">近期AI互动</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/chat')}
            >
              查看更多
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {suggestions.map((sug) => (
              <div key={sug.id} className="flex gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate('/chat')}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-500">{sug.timestamp}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {sug.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 mb-1">{sug.content}</p>
                  <p className="text-xs text-gray-500">依据 {sug.source}</p>
                </div>
                <Button variant="ghost" size="sm">
                  继续对话
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 合规脚注 */}
      {records.length > 0 && (
        <div className="text-xs text-gray-500 text-center py-4 border-t">
          ℹ️ 以上信息基于健康档案生成，仅供个人参考。具体诊疗请咨询专业医师。
        </div>
      )}
    </div>
  );
}