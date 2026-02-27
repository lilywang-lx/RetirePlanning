import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Slider } from '../../components/ui/slider';
import { Switch } from '../../components/ui/switch';
import { ChevronRight, ChevronLeft, HelpCircle, User, Users, Home, Building } from 'lucide-react';
import { UserData } from '../../types/retirement';
import { getUserProfile, saveUserProfile, generateAssessment, generateActionItems } from '../../utils/retirement-storage';

export function InputPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserData>({
    age: 45,
    familyStructure: 'couple',
    incomeLevel: 'comfortable',
    healthStatus: 'good',
    legalPreparation: false,
    socialSupport: 'moderate',
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/retirement');
    }
  };

  const handleSubmit = async () => {
    // 显示加载动画
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'fixed inset-0 bg-white z-50 flex items-center justify-center';
    loadingDiv.innerHTML = `
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">正在为您生成专属评估...</p>
      </div>
    `;
    document.body.appendChild(loadingDiv);

    // 模拟加载
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成评估
    const assessment = generateAssessment(formData);
    const actions = generateActionItems(assessment);
    
    // 保存数据
    const profile = getUserProfile();
    profile.assessments.push(assessment);
    profile.actions = actions;
    saveUserProfile(profile);

    // 移除加载动画并跳转
    document.body.removeChild(loadingDiv);
    navigate('/retirement/dashboard');
  };

  const familyOptions = [
    { value: 'single' as const, label: '独居', icon: User },
    { value: 'couple' as const, label: '夫妻二人', icon: Users },
    { value: 'with-children' as const, label: '与子女同住', icon: Home },
    { value: 'multi-generation' as const, label: '三代同堂', icon: Building },
  ];

  const incomeOptions = [
    { value: 'tight' as const, label: '刚够日常开销', emoji: '😰' },
    { value: 'modest' as const, label: '略有结余', emoji: '🙂' },
    { value: 'comfortable' as const, label: '能存下一部分', emoji: '😊' },
    { value: 'affluent' as const, label: '有稳定理财', emoji: '😎' },
  ];

  const healthOptions = [
    { value: 'excellent' as const, label: '很好', color: 'bg-green-500' },
    { value: 'good' as const, label: '良好', color: 'bg-blue-500' },
    { value: 'fair' as const, label: '一般', color: 'bg-yellow-500' },
    { value: 'poor' as const, label: '较差', color: 'bg-red-500' },
  ];

  const socialOptions = [
    { value: 'weak' as const, label: '较少社交' },
    { value: 'moderate' as const, label: '有一些朋友' },
    { value: 'strong' as const, label: '社交圈广泛' },
  ];

  const tooltips: Record<string, string> = {
    age: '年龄帮助我们评估您的养老准备周期。越早开始，调整空间越大。',
    family: '家庭结构影响养老成本和可获得的支持资源。',
    income: '收支情况帮助评估您的储蓄能力，无需提供具体数字。',
    health: '健康状况影响未来医疗成本和生活质量规划。',
    legal: '遗嘱、授权委托等法律文件能保障您的意愿得到执行。',
    social: '良好的社交网络是养老生活质量的重要保障。',
  };

  const getAgeMessage = (age: number) => {
    if (age < 40) return '您正处在养老准备的黄金期！';
    if (age < 50) return '现在开始准备还有充足时间';
    if (age < 60) return '抓紧行动，为未来做好准备';
    return '让我们一起规划更好的晚年生活';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-semibold text-gray-900">
              了解您的现状
            </h1>
            <span className="text-sm text-gray-500">
              第 {step}/3 步
            </span>
          </div>
          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Step 1: 年龄 + 家庭结构 */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Age Slider */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-medium text-gray-900">
                  您的年龄
                </label>
                <button
                  onClick={() => setShowTooltip(showTooltip === 'age' ? null : 'age')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
              
              {showTooltip === 'age' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  {tooltips.age}
                </div>
              )}

              <div className="space-y-4">
                <div className="text-center">
                  <span className="text-5xl font-bold text-blue-600">{formData.age}</span>
                  <span className="text-2xl text-gray-500 ml-2">岁</span>
                </div>
                
                <Slider
                  value={[formData.age]}
                  onValueChange={(value) => setFormData({ ...formData, age: value[0] })}
                  min={35}
                  max={65}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span>35</span>
                  <span>45</span>
                  <span>55</span>
                  <span>65</span>
                </div>

                <p className="text-center text-sm text-blue-600 font-medium">
                  {getAgeMessage(formData.age)}
                </p>
              </div>
            </div>

            {/* Family Structure */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-medium text-gray-900">
                  家庭结构
                </label>
                <button
                  onClick={() => setShowTooltip(showTooltip === 'family' ? null : 'family')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showTooltip === 'family' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  {tooltips.family}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {familyOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, familyStructure: option.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.familyStructure === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                      formData.familyStructure === option.value ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className="text-sm font-medium text-center">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: 收支 + 健康 */}
        {step === 2 && (
          <div className="space-y-8">
            {/* Income Level */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-medium text-gray-900">
                  月收支情况
                </label>
                <button
                  onClick={() => setShowTooltip(showTooltip === 'income' ? null : 'income')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showTooltip === 'income' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  {tooltips.income}
                </div>
              )}

              <div className="space-y-3">
                {incomeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, incomeLevel: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      formData.incomeLevel === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-base font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Health Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-medium text-gray-900">
                  健康自评
                </label>
                <button
                  onClick={() => setShowTooltip(showTooltip === 'health' ? null : 'health')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showTooltip === 'health' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  {tooltips.health}
                </div>
              )}

              <div className="grid grid-cols-4 gap-2">
                {healthOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, healthStatus: option.value })}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.healthStatus === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${option.color} mx-auto mb-2`} />
                    <p className="text-xs font-medium text-center">{option.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 法律 + 社交 */}
        {step === 3 && (
          <div className="space-y-8">
            {/* Legal Preparation */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-medium text-gray-900">
                  法律文件准备
                </label>
                <button
                  onClick={() => setShowTooltip(showTooltip === 'legal' ? null : 'legal')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showTooltip === 'legal' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  {tooltips.legal}
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 mb-1">
                    已准备遗嘱或授权委托书
                  </p>
                  <p className="text-sm text-gray-600">
                    包括医疗授权、财产清单等
                  </p>
                </div>
                <Switch
                  checked={formData.legalPreparation}
                  onCheckedChange={(checked) => setFormData({ ...formData, legalPreparation: checked })}
                />
              </div>
            </div>

            {/* Social Support */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-medium text-gray-900">
                  社交支持网络
                </label>
                <button
                  onClick={() => setShowTooltip(showTooltip === 'social' ? null : 'social')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>

              {showTooltip === 'social' && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-gray-700">
                  {tooltips.social}
                </div>
              )}

              <div className="space-y-3">
                {socialOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFormData({ ...formData, socialSupport: option.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      formData.socialSupport === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-base font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {step === 1 ? '返回首页' : '上��步'}
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {step === 3 ? '生成评估' : '下一步'}
            {step < 3 && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}