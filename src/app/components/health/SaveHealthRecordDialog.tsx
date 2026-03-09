// 保存健康档案对话框
import { useState } from 'react';
import { Save, AlertCircle, CheckCircle2, Loader2, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { useMembers } from '../../hooks/useMembers';
import { HealthRecord } from '../../types/member';

interface SaveHealthRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: string;
  conversationTopic: string;
  onSaveSuccess?: () => void;
}

export function SaveHealthRecordDialog({
  open,
  onOpenChange,
  conversationId,
  conversationTopic,
  onSaveSuccess,
}: SaveHealthRecordDialogProps) {
  const { members, currentMemberId } = useMembers();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStep, setSaveStep] = useState<'form' | 'generating' | 'success'>('form');
  
  // 表单数据
  const [formData, setFormData] = useState({
    reportName: conversationTopic || '',
    reportDate: new Date().toISOString().split('T')[0],
    chronicDiseases: '',
    currentMedications: '',
    allergies: '',
  });

  const currentMember = members.find(m => m.id === currentMemberId);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStep('generating');

    // 模拟AI生成健康解读的过程
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成健康档案
    const healthRecord: HealthRecord = {
      id: `record-${Date.now()}`,
      memberId: currentMemberId,
      reportDate: formData.reportDate,
      createdAt: new Date().toISOString(),
      reportName: formData.reportName,
      chronicDiseases: formData.chronicDiseases,
      currentMedications: formData.currentMedications,
      allergies: formData.allergies,
      overallAssessment: '基于体检报告和AI分析，整体健康状况良好，但有3项指标需要关注和改善。',
      abnormalIndicators: [
        {
          name: '尿酸',
          value: 450,
          unit: 'μmol/L',
          normalRange: { min: 150, max: 420 },
          status: 'warning',
          trend: 'up',
          trendValue: '+7.1%',
        },
        {
          name: 'LDL-C',
          value: 4.2,
          unit: 'mmol/L',
          normalRange: { min: 0, max: 3.4 },
          status: 'warning',
          trend: 'up',
          trendValue: '+23.5%',
        },
        {
          name: '空腹血糖',
          value: 5.8,
          unit: 'mmol/L',
          normalRange: { min: 3.9, max: 6.1 },
          status: 'warning',
          trend: 'stable',
        },
      ],
      dietPlan: {
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
            ],
          },
        ],
      },
      supplementPlan: {
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
        ],
      },
      medicationPlan: {
        status: 'monitoring',
        recommendations: [
          {
            condition: '高尿酸血症',
            status: 'monitoring',
            advice: '目前处于临界值，建议先通过生活方式干预（饮食+运动）观察3个月',
            criteria: '如果3个月后尿酸仍≥480 μmol/L，或出现痛风发作，建议就诊风湿免疫科评估用药',
            options: ['非布司他（降尿酸）', '别嘌醇（抑制尿酸生成）'],
          },
        ],
      },
      fitnessPlan: {
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
        ],
        targets: [
          { metric: '每周运动', goal: '5天', current: '记录中' },
          { metric: '每周总时长', goal: '150分钟', current: '记录中' },
        ],
      },
      conversationId,
    };

    // 保存到localStorage
    const existingRecords = JSON.parse(localStorage.getItem('health_records') || '[]');
    localStorage.setItem('health_records', JSON.stringify([...existingRecords, healthRecord]));

    setSaveStep('success');
    setIsSaving(false);

    // 2秒后关闭对话框
    setTimeout(() => {
      onOpenChange(false);
      onSaveSuccess?.();
      // 重置状态
      setTimeout(() => {
        setSaveStep('form');
      }, 300);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {saveStep === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Save className="w-5 h-5 text-blue-600" />
                生成健康解读并保存到档案
              </DialogTitle>
              <DialogDescription>
                将AI对话中的健康建议整理成结构化档案，方便长期跟踪管理
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* 成员信息 */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm text-gray-900">保存至成员档案</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-600">{currentMember?.name || '未选择'}</Badge>
                  <span className="text-sm text-gray-600">的健康档案</span>
                </div>
              </div>

              {/* 报告信息 */}
              <div className="space-y-2">
                <Label htmlFor="reportName">报告名称 *</Label>
                <Input
                  id="reportName"
                  value={formData.reportName}
                  onChange={(e) => setFormData({ ...formData, reportName: e.target.value })}
                  placeholder="例如：2024年度体检报告"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportDate">报告日期 *</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={formData.reportDate}
                  onChange={(e) => setFormData({ ...formData, reportDate: e.target.value })}
                />
              </div>

              {/* 病史信息（可选） */}
              <div className="border-t pt-4">
                <h4 className="font-medium text-sm text-gray-900 mb-3">补充病史信息（可选）</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="chronicDiseases">慢性疾病</Label>
                    <Textarea
                      id="chronicDiseases"
                      value={formData.chronicDiseases}
                      onChange={(e) => setFormData({ ...formData, chronicDiseases: e.target.value })}
                      placeholder="例如：高血压、糖尿病等"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">正在服用的药物</Label>
                    <Textarea
                      id="currentMedications"
                      value={formData.currentMedications}
                      onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                      placeholder="例如：阿司匹林、降压药等"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="allergies">过敏史</Label>
                    <Textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="例如：青霉素过敏、海鲜过敏等"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-medium mb-1">AI将自动生成：</p>
                    <ul className="text-orange-800 space-y-1 text-xs">
                      <li>• 异常指标分析与趋势</li>
                      <li>• 个性化饮食调理方案</li>
                      <li>• 运动健身计划</li>
                      <li>• 补剂与药物建议（仅供参考）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                取消
              </Button>
              <Button 
                onClick={handleSave}
                disabled={!formData.reportName || !formData.reportDate}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="w-4 h-4 mr-2" />
                生成并保存
              </Button>
            </DialogFooter>
          </>
        )}

        {saveStep === 'generating' && (
          <div className="py-12">
            <div className="text-center space-y-4">
              <Loader2 className="w-16 h-16 mx-auto text-blue-600 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI正在生成健康解读...
                </h3>
                <p className="text-sm text-gray-600">
                  分析对话内容，提取关键健康信息，生成个性化建议
                </p>
              </div>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        {saveStep === 'success' && (
          <div className="py-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  保存成功！
                </h3>
                <p className="text-sm text-gray-600">
                  健康解读已保存到 <span className="font-medium text-blue-600">{currentMember?.name}</span> 的档案
                </p>
              </div>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onSaveSuccess?.();
                }}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                查看健康档案
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
