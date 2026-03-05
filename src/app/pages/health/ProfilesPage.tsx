// 健康档案 - AI建议中心页面
import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Apple, Pill, Dumbbell, Heart, ChevronRight, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, Minus } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { ScrollArea } from '../../components/ui/scroll-area';
import { familyMemberStorage } from '../../utils/health-storage';
import { FamilyMember } from '../../types/health';

export default function ProfilesPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = () => {
    const allMembers = familyMemberStorage.getAll();
    setMembers(allMembers);
    if (allMembers.length > 0 && !selectedMember) {
      setSelectedMember(allMembers.find(m => m.isPrimary) || allMembers[0]);
    }
  };

  const handleMemberSelect = (member: FamilyMember) => {
    setSelectedMember(member);
  };

  // AI建议数据
  const dietPlan = {
    title: '饮食调理方案',
    icon: Apple,
    color: 'from-green-500 to-emerald-500',
    priority: 'high',
    recommendations: [
      {
        category: '降尿酸饮食',
        status: 'critical',
        items: [
          { label: '✅ 多吃', content: '樱桃、芹菜、西红柿、黄瓜、冬瓜', tip: '富含碱性物质，促进尿酸排泄' },
          { label: '⚠️ 限制', content: '海鲜、动物内脏、浓肉汤、啤酒', tip: '高嘌呤食物会升高尿酸' },
          { label: '💧 多喝水', content: '每日2000ml+，促进代谢', tip: '建议少量多次饮用白开水' },
        ],
      },
      {
        category: '控血脂饮食',
        status: 'important',
        items: [
          { label: '🥗 优选', content: '燕麦、大豆、深海鱼、坚果、橄榄油', tip: '富含ω-3和膳食纤维' },
          { label: '🚫 避免', content: '红肉、黄油、油炸食品、甜点', tip: '减少饱和脂肪摄入' },
          { label: '🍎 水果', content: '苹果、柚子、蓝莓（控糖）', tip: '富含抗氧化物质' },
        ],
      },
      {
        category: '血糖管理',
        status: 'moderate',
        items: [
          { label: '🌾 主食', content: '全谷物、糙米、藜麦替代精米', tip: '低GI食物稳定血糖' },
          { label: '⏰ 规律', content: '定时定量，少食多餐', tip: '避免血糖波动' },
        ],
      },
    ],
    compliance: '基于《中国居民膳食指南2022》《高尿酸血症与痛风患者膳食指导》',
  };

  const supplementPlan = {
    title: '维生素与补剂建议',
    icon: Pill,
    color: 'from-purple-500 to-pink-500',
    priority: 'medium',
    recommendations: [
      {
        name: 'Omega-3 鱼油',
        dosage: '1000mg EPA+DHA/天',
        timing: '随餐服用',
        purpose: '降低甘油三酯，保护心血管',
        status: 'recommended',
        notes: '选择深海鱼油，确保无重金属污染',
      },
      {
        name: '辅酶Q10',
        dosage: '100-200mg/天',
        timing: '早餐后',
        purpose: '保护心肌，抗氧化',
        status: 'recommended',
        notes: '如服用他汀类药物，建议补充',
      },
      {
        name: '维生素D3',
        dosage: '2000IU/天',
        timing: '随餐',
        purpose: '骨骼健康，免疫调节',
        status: 'suggested',
        notes: '建议检测血液水平后调整剂量',
      },
      {
        name: '益生菌',
        dosage: '100亿CFU/天',
        timing: '空腹或睡前',
        purpose: '肠道健康，改善代谢',
        status: 'optional',
        notes: '选择多菌种配方',
      },
    ],
    compliance: '⚠️ 补剂建议仅供参考，使用前请咨询医师或营养师',
  };

  const medicationPlan = {
    title: '药物治疗建议',
    icon: Heart,
    color: 'from-red-500 to-orange-500',
    priority: 'high',
    status: 'monitoring',
    recommendations: [
      {
        condition: '高尿酸血症',
        status: 'monitoring',
        advice: '目前处于临界值，建议先通过生活方式干预（饮食+运动）观察3个月',
        criteria: '如果3个月后尿酸仍≥480 μmol/L，或出现痛风发作，建议就诊风湿免疫科评估用药',
        options: [
          '非布司他（降尿酸）',
          '别嘌醇（抑制尿酸生成）',
        ],
      },
      {
        condition: '血脂异常',
        status: 'monitoring',
        advice: 'LDL-C为4.2 mmol/L，建议先进行3-6个月生活方式干预',
        criteria: '如持续≥4.9 mmol/L或有心血管高危因素，建议心内科评估他汀类药物',
        options: [
          '阿托伐他汀（降胆固醇）',
          '瑞舒伐他汀（降LDL-C）',
        ],
      },
    ],
    warning: '⚠️ 本建议基于体检数据生成，具体用药方案必须由执业医师开具处方',
    compliance: '遵循《中国高尿酸血症与痛风诊疗指南》《中国成人血脂异常防治指南》',
  };

  const fitnessPlan = {
    title: '运动健身方案',
    icon: Dumbbell,
    color: 'from-blue-500 to-cyan-500',
    priority: 'high',
    weeklyPlan: [
      {
        day: '周一/三/五',
        type: '有氧运动',
        exercises: [
          { name: '快走', duration: '30分钟', intensity: '中等强度', hr: '100-120次/分', calories: '~150 kcal' },
          { name: '或游泳', duration: '30分钟', intensity: '中等强度', hr: '110-130次/分', calories: '~200 kcal' },
        ],
        benefits: '促进尿酸排泄、改善心肺功能、控制体重',
        notes: '运动前后补水充足，避免剧烈运动（防止尿酸升高）',
      },
      {
        day: '周二/四/六',
        type: '力量训练',
        exercises: [
          { name: '深蹲', sets: '3组x12次', intensity: '自重或轻负重', target: '下肢力量' },
          { name: '俯卧撑', sets: '3组x10次', intensity: '自重', target: '上肢+核心' },
          { name: '平板支撑', sets: '3组x30秒', intensity: '静态', target: '核心稳定' },
        ],
        benefits: '增加肌肉量、提升代谢率、改善胰岛素敏感性',
        notes: '循序渐进，注意姿势正确，避免关节损伤',
      },
      {
        day: '周日',
        type: '休息/轻度活动',
        exercises: [
          { name: '散步', duration: '20分钟', intensity: '低强度' },
          { name: '瑜伽/拉伸', duration: '15分钟', intensity: '放松' },
        ],
        benefits: '主动恢复，保持活力',
      },
    ],
    targets: [
      { metric: '每周运动', goal: '5天', current: '记录中' },
      { metric: '每周总时长', goal: '150分钟', current: '记录中' },
      { metric: '3个月减重', goal: '5-8%体重', current: '待测量' },
    ],
    compliance: '基于《中国成人身体活动指南》《美国运动医学会运动处方指南》',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-700 border-red-200">⚠️ 重点关注</Badge>;
      case 'important':
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">⚡ 需要改善</Badge>;
      case 'moderate':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">💡 建议优化</Badge>;
      case 'monitoring':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">👁️ 持续监测</Badge>;
      case 'recommended':
        return <Badge className="bg-green-100 text-green-700 border-green-200">✅ 推荐</Badge>;
      case 'suggested':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">💊 建议</Badge>;
      case 'optional':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">⭕ 可选</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题与成员选择 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">健康档案</h1>
          <p className="text-gray-600 mt-1">AI个性化健康建议</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          添加家庭成员
        </Button>
      </div>

      {/* 成员选择卡片 */}
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-2">
          {members.map((member) => (
            <Card
              key={member.id}
              className={`
                p-4 cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-40
                ${selectedMember?.id === member.id ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' : ''}
              `}
              onClick={() => handleMemberSelect(member)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-2">
                  <Avatar className="w-14 h-14">
                    <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white text-lg font-bold">
                      {member.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {member.isPrimary && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <span className="text-xs">★</span>
                    </div>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{member.name}</h3>
                <p className="text-xs text-gray-600">{member.relationship}</p>
                <p className="text-xs text-gray-500 mt-1">{member.age}岁</p>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {selectedMember && (
        <>
          {/* 健康状态概览 */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {selectedMember.name} 的健康方案
                </h2>
                <p className="text-sm text-gray-600">基于2024年度体检报告生成</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-blue-300">AI生成</Badge>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4</div>
                <div className="text-xs text-gray-600 mt-1">需关注指标</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">3</div>
                <div className="text-xs text-gray-600 mt-1">改善建议</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4</div>
                <div className="text-xs text-gray-600 mt-1">推荐补剂</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">5天/周</div>
                <div className="text-xs text-gray-600 mt-1">运动计划</div>
              </div>
            </div>
          </Card>

          {/* ========== AI核心建议区域 ========== */}

          {/* 1. 饮食调理方案 */}
          <Card className="overflow-hidden border-2">
            <div className={`p-6 bg-gradient-to-r ${dietPlan.color}`}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <dietPlan.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{dietPlan.title}</h2>
                  <p className="text-sm text-white/90 mt-1">根据您的健康状况定制</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {dietPlan.recommendations.map((rec, idx) => (
                <div key={idx} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{rec.category}</h3>
                    {getStatusBadge(rec.status)}
                  </div>
                  <div className="space-y-3 pl-4 border-l-4 border-green-200">
                    {rec.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="font-medium text-gray-900 min-w-20">{item.label}</div>
                          <div className="flex-1">
                            <p className="text-gray-800 mb-1">{item.content}</p>
                            <p className="text-sm text-gray-600">{item.tip}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {dietPlan.compliance}
                </p>
              </div>
            </div>
          </Card>

          {/* 2. 维生素与补剂建议 */}
          <Card className="overflow-hidden border-2">
            <div className={`p-6 bg-gradient-to-r ${supplementPlan.color}`}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <supplementPlan.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{supplementPlan.title}</h2>
                  <p className="text-sm text-white/90 mt-1">科学补充，精准营养</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {supplementPlan.recommendations.map((supp, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{supp.name}</h3>
                      <p className="text-sm text-purple-600 mt-1">{supp.purpose}</p>
                    </div>
                    {getStatusBadge(supp.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">建议剂量</div>
                      <div className="font-medium text-gray-900">{supp.dosage}</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="text-xs text-gray-600 mb-1">服用时间</div>
                      <div className="font-medium text-gray-900">{supp.timing}</div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 bg-white rounded-lg p-3">
                    💡 {supp.notes}
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <p className="text-xs text-orange-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {supplementPlan.compliance}
                </p>
              </div>
            </div>
          </Card>

          {/* 3. 药物治疗建议 */}
          <Card className="overflow-hidden border-2 border-orange-200">
            <div className={`p-6 bg-gradient-to-r ${medicationPlan.color}`}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <medicationPlan.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{medicationPlan.title}</h2>
                  <p className="text-sm text-white/90 mt-1">基于体检指标的医疗参考</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-orange-900 mb-1">{medicationPlan.warning}</p>
                    <p className="text-sm text-orange-700">严禁自行用药，必须在医生指导下使用</p>
                  </div>
                </div>
              </div>

              {medicationPlan.recommendations.map((med, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{med.condition}</h3>
                    {getStatusBadge(med.status)}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">💡 当前建议：</div>
                      <p className="text-gray-900 bg-white rounded p-3">{med.advice}</p>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">📋 用药指征：</div>
                      <p className="text-gray-900 bg-white rounded p-3">{med.criteria}</p>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-1">💊 可能药物：</div>
                      <div className="flex flex-wrap gap-2">
                        {med.options.map((option, optIdx) => (
                          <Badge key={optIdx} variant="outline" className="bg-white">
                            {option}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {medicationPlan.compliance}
                </p>
              </div>
            </div>
          </Card>

          {/* 4. 运动健身方案 */}
          <Card className="overflow-hidden border-2">
            <div className={`p-6 bg-gradient-to-r ${fitnessPlan.color}`}>
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <fitnessPlan.icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{fitnessPlan.title}</h2>
                  <p className="text-sm text-white/90 mt-1">定制化运动处方</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 周计划 */}
              {fitnessPlan.weeklyPlan.map((plan, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-5 border border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{plan.day}</h3>
                      <Badge className="mt-2 bg-blue-100 text-blue-700">{plan.type}</Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    {plan.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{ex.name}</h4>
                          <span className="text-sm text-gray-600">{ex.intensity}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-gray-600">
                            {ex.duration || ex.sets}
                          </div>
                          {ex.target && <div className="text-gray-600">{ex.target}</div>}
                          {ex.hr && <div className="text-blue-600">心率: {ex.hr}</div>}
                          {ex.calories && <div className="text-orange-600">{ex.calories}</div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white rounded-lg p-3 border-l-4 border-blue-400">
                    <div className="text-sm font-medium text-gray-700 mb-1">✨ 健康效益：</div>
                    <p className="text-sm text-gray-600">{plan.benefits}</p>
                    {plan.notes && (
                      <>
                        <div className="text-sm font-medium text-gray-700 mt-2 mb-1">⚠️ 注意事项：</div>
                        <p className="text-sm text-gray-600">{plan.notes}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}

              {/* 目标追踪 */}
              <div className="bg-gray-50 rounded-lg p-5">
                <h3 className="font-semibold text-gray-900 mb-4">🎯 健身目标</h3>
                <div className="grid grid-cols-3 gap-4">
                  {fitnessPlan.targets.map((target, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-4 text-center">
                      <div className="text-xs text-gray-600 mb-1">{target.metric}</div>
                      <div className="text-lg font-bold text-blue-600">{target.goal}</div>
                      <div className="text-xs text-gray-500 mt-1">{target.current}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  {fitnessPlan.compliance}
                </p>
              </div>
            </div>
          </Card>

          {/* ========== 次要信息：指标数据（折叠或放下方）========== */}
          <details className="group">
            <summary className="cursor-pointer">
              <Card className="p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <h3 className="font-semibold text-gray-900">查看详细指标数据</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90" />
                </div>
              </Card>
            </summary>

            <Card className="mt-4 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">关键健康指标</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="text-xs text-gray-600 mb-1">尿酸</div>
                  <div className="text-2xl font-bold text-red-600">450</div>
                  <div className="text-xs text-gray-500 mt-1">μmol/L</div>
                  <div className="text-xs text-red-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    超标 7.1%
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="text-xs text-gray-600 mb-1">LDL-C</div>
                  <div className="text-2xl font-bold text-orange-600">4.2</div>
                  <div className="text-xs text-gray-500 mt-1">mmol/L</div>
                  <div className="text-xs text-orange-600 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    偏高
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="text-xs text-gray-600 mb-1">空腹血糖</div>
                  <div className="text-2xl font-bold text-yellow-700">5.8</div>
                  <div className="text-xs text-gray-500 mt-1">mmol/L</div>
                  <div className="text-xs text-yellow-700 mt-2 flex items-center gap-1">
                    <Minus className="w-3 h-3" />
                    正常偏高
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-gray-600 mb-1">血压</div>
                  <div className="text-2xl font-bold text-green-600">118/76</div>
                  <div className="text-xs text-gray-500 mt-1">mmHg</div>
                  <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    正常
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button variant="outline" size="sm">
                  查看完整体检报告 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </Card>
          </details>

          {/* 合规脚注 */}
          <div className="text-xs text-gray-500 text-center py-4 border-t bg-gray-50 rounded-lg">
            <p className="mb-1">ℹ️ 以上建议基于AI分析您的体检报告和权威医学指南生成</p>
            <p>⚠️ 仅供健康管理参考，不作为医疗诊断依据，具体治疗方案请咨询专业医师</p>
          </div>
        </>
      )}
    </div>
  );
}