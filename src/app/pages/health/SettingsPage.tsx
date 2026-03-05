// 设置与合规中心
import { Shield, FileText, Download, Trash2, AlertCircle, Info } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { useState } from 'react';

export default function SettingsPage() {
  const [privacyMode, setPrivacyMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const handleClearData = () => {
    if (window.confirm('确认要清除所有健康数据吗？此操作不可恢复。')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      reports: localStorage.getItem('health_reports'),
      members: localStorage.getItem('family_members'),
      indicators: localStorage.getItem('health_indicators'),
      conversations: localStorage.getItem('ai_conversations'),
      suggestions: localStorage.getItem('ai_suggestions'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">设置与合规中心</h1>
        <p className="text-gray-600 mt-1">管理您的隐私设置和查看合规信息</p>
      </div>

      {/* 隐私设置 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">隐私与安全</h2>
            <p className="text-sm text-gray-600">控制您的数据隐私</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">隐私模糊模式</h3>
              <p className="text-sm text-gray-600">图表和数值显示为区间，保护隐私</p>
            </div>
            <Switch checked={privacyMode} onCheckedChange={setPrivacyMode} />
          </div>

          <Separator />

          <div className="flex items-center justify-between py-3">
            <div>
              <h3 className="font-medium text-gray-900">消息通知</h3>
              <p className="text-sm text-gray-600">报告解析完成时接收通知</p>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <Separator />

          <div className="py-3">
            <h3 className="font-medium text-gray-900 mb-3">数据存储</h3>
            <div className="p-4 bg-blue-50 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">本地存储说明</p>
                  <p>您的所有健康数据仅存储在浏览器本地（LocalStorage），不会上传到任何服务器。数据会保留直到您手动清除。</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                导出数据
              </Button>
              <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleClearData}>
                <Trash2 className="w-4 h-4 mr-2" />
                清除所有数据
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* 免责声明 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">免责声明</h2>
            <p className="text-sm text-gray-600">重要法律信息</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
            <h3 className="font-semibold text-orange-900 mb-2">⚠️ 本工具不提供医疗诊断服务</h3>
            <p className="text-sm">
              本工具是一个健康信息参考工具，所有AI生成的建议、分析和解读仅供参考，不构成：
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>❌ 疾病诊断</li>
              <li>❌ 治疗方案</li>
              <li>❌ 用药建议</li>
              <li>❌ 医疗咨询</li>
            </ul>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">重要提示</h3>
            <ul className="text-sm space-y-2">
              <li>• 所有健康决策请以执业医师的面诊意见为准</li>
              <li>• 如有健康问题，请及时到正规医疗机构就诊</li>
              <li>• 切勿根据AI建议自行停药、换药或调整治疗方案</li>
              <li>• 紧急情况请拨打120急救电话</li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">AI建议来源</h3>
            <p className="text-sm">
              所有AI生成的健康建议均基于以下公开权威指南：
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>• 《中国居民膳食指南2022》</li>
              <li>• 《中国成人血脂异常防治指南》</li>
              <li>• 《中国高血压防治指南》</li>
              <li>• AHA（美国心脏协会）心血管健康指南</li>
              <li>• KDIGO慢性肾脏病管理指南</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">数据隐私承诺</h3>
            <p className="text-sm">
              我们严格遵守《个人信息保护法》和《数据安全法》：
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li>✅ 数据仅存储在您的浏览器本地</li>
              <li>✅ 不上传到任何云端服务器</li>
              <li>✅ 不与任何第三方共享</li>
              <li>✅ 您可随时导出或删除数据</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* 关于 */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">关于本工具</h2>
            <p className="text-sm text-gray-600">版本与许可信息</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">产品名称</span>
            <span className="font-medium">AI健康报告解读助手</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">版本号</span>
            <span className="font-medium">1.2.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">最后更新</span>
            <span className="font-medium">2024年6月</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">开源协议</span>
            <span className="font-medium">MIT License</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">技术栈</span>
            <span className="font-medium">React 18 + TypeScript + Tailwind CSS</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
          <p className="text-sm text-gray-700 font-medium">
            💙 让健康数据更易懂，让健康管理更简单
          </p>
        </div>
      </Card>

      {/* 合规脚注 */}
      <div className="text-xs text-gray-500 text-center py-4 border-t">
        本工具遵循《互联网诊疗监管办法》《生成式AI服务管理暂行办法》《个人信息保护法》等相关法律法规
      </div>
    </div>
  );
}
