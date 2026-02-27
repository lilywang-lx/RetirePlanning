import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { 
  CheckCircle2,
  Circle,
  Clock,
  Filter,
  Plus,
  TrendingUp,
  Heart,
  Shield,
  Users,
  X,
  ChevronRight,
} from 'lucide-react';
import { getUserProfile, saveUserProfile, toggleActionCompletion, addCustomAction } from '../../utils/retirement-storage';
import { ActionItem } from '../../types/retirement';
import { toast } from 'sonner';

export function ActionPlanPage() {
  const navigate = useNavigate();
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [dimensionFilter, setDimensionFilter] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const loadActions = () => {
    const profile = getUserProfile();
    setActions(profile.actions);
  };

  useEffect(() => {
    loadActions();
  }, []);

  const handleToggleAction = (actionId: string) => {
    toggleActionCompletion(actionId);
    loadActions();
    
    const action = actions.find(a => a.id === actionId);
    if (action && !action.completed) {
      toast.success('已记录！继续加油！', {
        duration: 2000,
      });
    }
  };

  const filteredActions = actions.filter(action => {
    if (filter === 'pending' && action.completed) return false;
    if (filter === 'completed' && !action.completed) return false;
    if (dimensionFilter && action.dimension !== dimensionFilter) return false;
    return true;
  });

  const pendingCount = actions.filter(a => !a.completed).length;

  const dimensionConfig = {
    financial: {
      icon: TrendingUp,
      label: '财务',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      badge: 'bg-blue-100 text-blue-700',
    },
    health: {
      icon: Heart,
      label: '健康',
      color: 'text-red-600',
      bg: 'bg-red-50',
      badge: 'bg-red-100 text-red-700',
    },
    legal: {
      icon: Shield,
      label: '法律',
      color: 'text-green-600',
      bg: 'bg-green-50',
      badge: 'bg-green-100 text-green-700',
    },
    social: {
      icon: Users,
      label: '社会',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      badge: 'bg-orange-100 text-orange-700',
    },
  };

  const timeLabels = {
    '15min': '≤15分钟',
    '1hour': '≤1小时',
    '1day': '≤1天',
  };

  const ActionCard = ({ action }: { action: ActionItem }) => {
    const config = dimensionConfig[action.dimension];
    const Icon = config.icon;

    return (
      <div
        className={`bg-white rounded-xl p-4 shadow-sm border-2 transition-all ${
          action.completed ? 'border-green-200 bg-green-50/30' : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="flex items-start gap-3">
          <button
            onClick={() => handleToggleAction(action.id)}
            className="flex-shrink-0 mt-1"
          >
            {action.completed ? (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 mb-2">
              <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold text-gray-900 ${action.completed ? 'line-through text-gray-500' : ''}`}>
                  {action.title}
                </h3>
              </div>
            </div>

            <p className={`text-sm mb-3 ${action.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              {action.description}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 rounded text-xs font-medium ${config.badge}`}>
                {config.label}
              </span>
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeLabels[action.estimatedTime]}
              </span>
              {action.priority === 'high' && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
                  高优先级
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddActionModal = () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      dimension: 'financial' as ActionItem['dimension'],
      estimatedTime: '15min' as ActionItem['estimatedTime'],
      priority: 'medium' as ActionItem['priority'],
    });

    const handleSubmit = () => {
      if (!formData.title.trim()) {
        toast.error('请输入行动标题');
        return;
      }

      addCustomAction(formData);
      loadActions();
      setShowAddModal(false);
      toast.success('行动已添加！');
      
      // 重置表单
      setFormData({
        title: '',
        description: '',
        dimension: 'financial',
        estimatedTime: '15min',
        priority: 'medium',
      });
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">添加自定义行动</h2>
            <button
              onClick={() => setShowAddModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                行动标题 *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：了解长期护理保险"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="说明具体要做什么..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属维度
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(dimensionConfig).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setFormData({ ...formData, dimension: key as ActionItem['dimension'] })}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      formData.dimension === key
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <config.icon className={`w-4 h-4 mx-auto mb-1 ${config.color}`} />
                    <span className="text-xs font-medium">{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  预估时间
                </label>
                <select
                  value={formData.estimatedTime}
                  onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value as ActionItem['estimatedTime'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15min">≤15分钟</option>
                  <option value="1hour">≤1小时</option>
                  <option value="1day">≤1天</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  优先级
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as ActionItem['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowAddModal(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              添加
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">
              行动计划
            </h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/retirement/progress')}
            >
              查看进度
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Status Bar */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-blue-600">{pendingCount}</span> 项建议待行动
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              待完成
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              已完成
            </button>

            <div className="w-px h-6 bg-gray-300 mx-2" />

            {Object.entries(dimensionConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setDimensionFilter(dimensionFilter === key ? null : key)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-1 ${
                  dimensionFilter === key
                    ? config.badge
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <config.icon className="w-3 h-3" />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredActions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              {filter === 'completed' ? '还没有完成任何行动' : '没有符合条件的行动'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActions.map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Button
            onClick={() => navigate('/retirement/dashboard')}
            variant="outline"
            className="flex-1"
          >
            返回评估
          </Button>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加自定义行动
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && <AddActionModal />}
    </div>
  );
}
