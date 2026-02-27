import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  Award,
  TrendingUp,
  Share2,
  ChevronLeft,
  Star,
  Lock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { getUserProfile, clearAllData } from '../../utils/retirement-storage';
import { ProgressRecord, Milestone } from '../../types/retirement';
import { toast } from 'sonner';

export function ProgressPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    const profile = getUserProfile();
    setProgress(profile.progress.sort((a, b) => b.date - a.date).slice(0, 30));
    setMilestones(profile.milestones);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.getTime() === today.getTime()) {
      return '今天';
    } else if (date.getTime() === yesterday.getTime()) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  const unlockedCount = milestones.filter(m => m.unlocked).length;
  const totalActions = progress.reduce((sum, p) => sum + p.completedActions, 0);

  const handleShare = () => {
    toast.success('分享功能开发中...', {
      description: '即将支持生成成就海报分享到微信',
    });
  };

  const handleClearData = () => {
    clearAllData();
    toast.success('数据已清除');
    navigate('/retirement');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/retirement/action')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              我的进度
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {totalActions}
            </div>
            <div className="text-sm text-gray-600">累计完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {progress.length}
            </div>
            <div className="text-sm text-gray-600">活跃天数</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {unlockedCount}
            </div>
            <div className="text-sm text-gray-600">已解锁徽章</div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-500" />
              成就徽章
            </h2>
            <span className="text-sm text-gray-500">
              {unlockedCount}/{milestones.length} 已解锁
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`p-4 rounded-xl border-2 ${
                  milestone.unlocked
                    ? 'border-orange-200 bg-orange-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2 relative">
                    {milestone.unlocked ? (
                      milestone.icon
                    ) : (
                      <div className="relative">
                        <span className="opacity-30">{milestone.icon}</span>
                        <Lock className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                    )}
                  </div>
                  <h3 className={`font-semibold mb-1 ${
                    milestone.unlocked ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {milestone.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {milestone.description}
                  </p>
                  {milestone.unlocked && milestone.unlockedAt && (
                    <p className="text-xs text-orange-600 mt-2">
                      {formatDate(milestone.unlockedAt)} 解锁
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            行动记录
          </h2>

          {progress.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">还没有行动记录</p>
              <Button
                onClick={() => navigate('/retirement/action')}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                立即开始
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {progress.map((record, index) => (
                <div
                  key={record.date}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                      {record.completedActions > 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Calendar className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">
                        {formatDate(record.date)}
                      </span>
                      <span className="text-sm text-gray-500">
                        完成 {record.completedActions}/{record.totalActions}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{
                          width: `${(record.completedActions / record.totalActions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {record.completedActions > 0 && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(record.completedActions, 5) }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Share Button */}
        <Button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          size="lg"
        >
          <Share2 className="w-5 h-5 mr-2" />
          分享我的进步
        </Button>

        {/* Data Management */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            数据管理
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-gray-600">
                <p className="mb-2">
                  所有数据仅保存在您的设备本地，清除后无法恢复。
                </p>
                <Button
                  onClick={() => setShowClearConfirm(true)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  清除本地数据
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Confirm Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                确认清除数据？
              </h2>
              <p className="text-sm text-gray-600">
                这将删除所有评估、行动记录和进度数据，操作无法撤销。
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowClearConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleClearData}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                确认清除
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
