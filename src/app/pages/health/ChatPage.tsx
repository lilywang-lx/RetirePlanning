// AI对话中心页面 - 按话题组织对话
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SaveHealthRecordDialog } from '../../components/health/SaveHealthRecordDialog';
import { 
  Send, Sparkles, Search, Paperclip, Image as ImageIcon, FileText, 
  X, Loader2, CheckCircle2, Plus, FileBarChart, Apple, Pill, 
  Dumbbell, MessageCircle, Stethoscope, Calendar, PanelLeftClose, PanelLeft, Save
} from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { conversationStorage, reportStorage, familyMemberStorage } from '../../utils/health-storage';
import { AIConversation, AIMessage } from '../../types/health';

interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  size: string;
  status: 'uploading' | 'processing' | 'completed';
  progress: number;
  url?: string;
}

// 话题分类配置
const topicCategories = {
  report: { label: '报告解读', icon: FileBarChart, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
  diet: { label: '饮食调理', icon: Apple, color: 'bg-green-500', bgColor: 'bg-green-50', textColor: 'text-green-700' },
  medication: { label: '药物指导', icon: Pill, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  fitness: { label: '健身建议', icon: Dumbbell, color: 'bg-orange-500', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
  consultation: { label: '健康咨询', icon: Stethoscope, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
  general: { label: '通用对话', icon: MessageCircle, color: 'bg-gray-500', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
};

export default function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<AIConversation | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showNewTopicMenu, setShowNewTopicMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 侧边栏显示状态
  const [showSaveDialog, setShowSaveDialog] = useState(false); // 保存健康档案对话框
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      const conv = conversations.find(c => c.id === conversationId);
      if (conv) {
        setSelectedConversation(conv);
        setMessages(conv.messages);
      }
    } else if (conversations.length > 0) {
      setSelectedConversation(conversations[0]);
      setMessages(conversations[0].messages);
    }
  }, [conversationId, conversations]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = () => {
    const allConversations = conversationStorage.getAll();
    if (allConversations.length === 0) {
      createDefaultConversations();
    } else {
      // 按创建时间倒序排列
      const sorted = allConversations.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setConversations(sorted);
    }
  };

  const createDefaultConversations = () => {
    const now = new Date();
    const currentMonth = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
    
    const defaultConversations: AIConversation[] = [
      {
        id: 'conv-1',
        memberId: 'member-1',
        memberName: '张伟',
        reportId: 'report-1',
        topic: `${currentMonth}健康报告解读`,
        category: 'report',
        lastMessage: '已完成报告分析，发现3项需要关注的指标',
        lastTime: new Date(now.getTime() - 2 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        unreadCount: 0,
        context: '2024年度体检报告 | 关注：尿酸、血脂、血糖',
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['尿酸', '血脂', '血糖'],
        messages: [
          {
            id: 'msg-1',
            role: 'assistant',
            content: `您好！我已经分析了您${currentMonth}的体检报告 📋

**关键发现：**

⚠️ **需要关注的指标：**
1. 尿酸 450 μmol/L - 超标7.1%
2. LDL-C 4.2 mmol/L - 低密度脂蛋白偏高
3. 空腹血糖 5.8 mmol/L - 正常偏高

💡 **主要建议：**
• 调整饮食结构（详见"饮食调理方案"话题）
• 增加有氧运动（详见"健身建议"话题）
• 3个月后复查

您可以针对任何指标深入询问，或者创建专门的话题来讨论饮食、运动等方案。`,
            timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
          },
        ],
      },
      {
        id: 'conv-2',
        memberId: 'member-1',
        memberName: '张伟',
        topic: '降尿酸饮食调理方案',
        category: 'diet',
        lastMessage: '樱桃、芹菜等碱性食物可以促进尿酸排泄',
        lastTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        unreadCount: 0,
        context: '针对尿酸450 μmol/L的饮食改善方案',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['尿酸', '饮食', '嘌呤'],
        messages: [
          {
            id: 'msg-2-1',
            role: 'user',
            content: '我的尿酸偏高，应该怎么调整饮食？',
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
          },
          {
            id: 'msg-2-2',
            role: 'assistant',
            content: `针对您尿酸450 μmol/L的情况，这里是详细的饮食调理方案：

**✅ 推荐多吃（碱性食物）：**
• 樱桃 - 富含花青素，降尿酸效果好
• 芹菜 - 促进尿酸排泄
• 西红柿、黄瓜、冬瓜 - 利尿
• 大量饮水 2000ml+/天

**⚠️ 严格限制（高嘌呤）：**
• 海鲜（特别是贝类、沙丁鱼）
• 动物内脏（肝、肾、脑）
• 浓肉汤、火锅汤底
• 啤酒、白酒

**💡 中等嘌呤（适量）：**
• 瘦肉每天不超过100g
• 豆制品可以适量食用
• 菌菇类控制摄入

**📅 建议执行：**
连续3个月严格执行，每2周记录一次尿酸变化。`,
            timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000 + 60000).toLocaleString('zh-CN'),
            sources: [
              { title: 'KDIGO高尿酸血症管理指南', reference: '2020版' },
              { title: '中国高尿酸血症与痛风患者膳食指导', reference: '2019' },
            ],
          },
        ],
      },
      {
        id: 'conv-3',
        memberId: 'member-1',
        memberName: '张伟',
        topic: '有氧运动降尿酸方案',
        category: 'fitness',
        lastMessage: '建议每周3-5次，每次30分钟中等强度有氧',
        lastTime: new Date(now.getTime() - 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
        unreadCount: 1,
        context: '针对尿酸和血脂的运动处方',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['运动', '尿酸', '血脂'],
        messages: [
          {
            id: 'msg-3-1',
            role: 'user',
            content: '什么运动对降尿酸有帮助？',
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toLocaleString('zh-CN'),
          },
          {
            id: 'msg-3-2',
            role: 'assistant',
            content: `运动对降尿酸很有帮助！以下是针对您的定制方案：

**✅ 推荐运动（中等强度有氧）：**

1. **快走** 🚶
   - 频率：每周3-5次
   - 时长：30-40分钟
   - 强度：心率100-120次/分
   - 效果：促进尿酸排泄，燃脂150 kcal

2. **游泳** 🏊
   - 频率：每周2-3次
   - 时长：30分钟
   - 强度：中等配速
   - 效果：全身运动，保护关节，燃脂200 kcal

3. **骑车** 🚴
   - 频率：每周3次
   - 时长：40分钟
   - 强度：轻松交谈程度
   - 效果：提升代谢，改善心肺

**⚠️ 避免：**
• 剧烈运动（会升高尿酸）
• 爆发性运动（短跑、HIIT）
• 运动中脱水

**💡 关键要点：**
• 运动前后补水充足
• 循序渐进，不要突然加量
• 运动后不要马上喝啤酒

配合饮食调整，3个月内尿酸有望降至正常范围！`,
            timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 120000).toLocaleString('zh-CN'),
            sources: [
              { title: '中国成人身体活动指南', reference: '2021' },
            ],
          },
        ],
      },
    ];

    defaultConversations.forEach(conv => conversationStorage.add(conv));
    setConversations(defaultConversations);
    setSelectedConversation(defaultConversations[0]);
    setMessages(defaultConversations[0].messages);
  };

  const createNewTopic = (category: typeof topicCategories[keyof typeof topicCategories], categoryKey: string) => {
    const now = new Date();
    const members = familyMemberStorage.getAll();
    const primaryMember = members.find(m => m.isPrimary) || members[0];

    let topicTitle = '';
    let context = '';
    let initialMessage = '';

    switch (categoryKey) {
      case 'report':
        const currentMonth = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
        topicTitle = `${currentMonth}健康报告解读`;
        context = '等待上传体检报告';
        initialMessage = '您好！请上传您的体检报告，我会为您详细分析各项指标。\n\n您可以：\n• 点击 📎 上传PDF报告\n• 或上传化验单截图\n\n我会立即为您解读！';
        break;
      case 'diet':
        topicTitle = '饮食调理咨询';
        context = '个性化饮食改善方案';
        initialMessage = '您好！我是您的营养顾问 🥗\n\n请告诉我您想改善的健康问题，我会为您定制饮食方案：\n\n• 降尿酸饮食\n• 控血脂饮食\n• 血糖管理\n• 减重营养\n• 其他营养问题';
        break;
      case 'medication':
        topicTitle = '药物使用咨询';
        context = '用药指导与建议';
        initialMessage = '您好！我可以为您提供药物相关的参考信息 💊\n\n⚠️ 重要提示：\n本建议仅供参考，具体用药必须遵医嘱。\n\n请告诉我：\n• 您想了解哪类药物？\n• 您的具体健康问题是什么？\n• 是否在服用其他药物？';
        break;
      case 'fitness':
        topicTitle = '运动健身方案';
        context = '定制化运动处方';
        initialMessage = '您好！我是您的健身顾问 💪\n\n请告诉我：\n• 您的健康目标（降尿酸/减重/增肌）\n• 目前的运动习惯\n• 是否有运动限制\n\n我会为您制定适合的运动方案！';
        break;
      case 'consultation':
        topicTitle = '健康问题咨询';
        context = '一般健康咨询';
        initialMessage = '您好！我是您的健康助手 🏥\n\n我可以回答：\n• 体检指标解读\n• 症状初步分析\n• 健康生活方式建议\n• 就医指导\n\n请问有什么可以帮您？';
        break;
      default:
        topicTitle = '新对话';
        context = '通用对话';
        initialMessage = '您好！有什么可以帮您？';
    }

    const newConversation: AIConversation = {
      id: `conv-${Date.now()}`,
      memberId: primaryMember?.id || 'member-1',
      memberName: primaryMember?.name || '用户',
      topic: topicTitle,
      category: categoryKey as any,
      lastMessage: initialMessage,
      lastTime: now.toLocaleString('zh-CN'),
      unreadCount: 0,
      context,
      createdAt: now.toISOString(),
      tags: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: initialMessage,
          timestamp: now.toLocaleString('zh-CN'),
        },
      ],
    };

    conversationStorage.add(newConversation);
    loadConversations();
    setSelectedConversation(newConversation);
    setMessages(newConversation.messages);
    setShowNewTopicMenu(false);
    navigate(`/chat/${newConversation.id}`);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const fileType = file.type.includes('pdf') ? 'pdf' : 'image';
      const fileSize = (file.size / 1024 / 1024).toFixed(2);

      const uploadedFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        type: fileType,
        size: `${fileSize}MB`,
        status: 'uploading',
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);
      simulateFileUpload(uploadedFile, file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const simulateFileUpload = (file: UploadedFile, actualFile: File) => {
    const uploadInterval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === file.id && f.status === 'uploading') {
          const newProgress = Math.min(f.progress + 20, 100);
          if (newProgress >= 100) {
            clearInterval(uploadInterval);
            return { ...f, progress: 100, status: 'processing' };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 300);

    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: 'processing' } : f
      ));

      setTimeout(() => {
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, status: 'completed' } : f
        ));
        sendFileMessage(file, actualFile);
      }, 2000);
    }, 1500);
  };

  const sendFileMessage = (file: UploadedFile, actualFile: File) => {
    if (!selectedConversation) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: file.type === 'pdf' 
        ? `📄 上传了体检报告：${file.name}`
        : `🖼️ 上传了图片：${file.name}`,
      timestamp: new Date().toLocaleString('zh-CN'),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateFileAnalysisResponse(file);
      const aiMessage: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleString('zh-CN'),
        sources: aiResponse.sources,
        actions: aiResponse.actions,
      };

      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      setIsTyping(false);

      // 如果当前对话是报告类别，更新话题标题
      if (selectedConversation.category === 'report' && file.type === 'pdf') {
        const now = new Date();
        const monthStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
        conversationStorage.update(selectedConversation.id, {
          messages: newMessages,
          lastMessage: '已完成报告分析',
          lastTime: new Date().toLocaleString('zh-CN'),
          topic: `${monthStr}健康报告解读`,
          tags: ['尿酸', '血脂', '血糖'],
        });
      } else {
        conversationStorage.update(selectedConversation.id, {
          messages: newMessages,
          lastMessage: '已完成分析',
          lastTime: new Date().toLocaleString('zh-CN'),
        });
      }

      loadConversations();

      if (file.type === 'pdf') {
        const members = familyMemberStorage.getAll();
        const primaryMember = members.find(m => m.isPrimary);
        if (primaryMember) {
          reportStorage.add({
            id: `report-${Date.now()}`,
            fileName: file.name,
            uploadTime: new Date().toLocaleString('zh-CN'),
            status: 'completed',
            memberId: primaryMember.id,
            memberName: primaryMember.name,
          });
        }
      }

      setTimeout(() => {
        setUploadedFiles(prev => prev.filter(f => f.id !== file.id));
      }, 1000);
    }, 2500);
  };

  const generateFileAnalysisResponse = (file: UploadedFile) => {
    if (file.type === 'pdf') {
      return {
        content: `✅ **报告分析完成**

我已经仔细分析了您的体检报告《${file.name}》，以下是关键发现：

**⚠️ 需要关注的指标：**

1. **尿酸 450 μmol/L** (超标)
   - 正常范围：150-420 μmol/L
   - 超标 7.1%，需要控制

2. **LDL-C 4.2 mmol/L** (超标)
   - 正常范围：0-3.4 mmol/L
   - 低密度脂蛋白胆固醇偏高

3. **空腹血糖 5.8 mmol/L** (正常偏高)
   - 正常范围：3.9-6.1 mmol/L
   - 处于正常上限

**💡 后续建议：**

我已经为您创建了专门的话题，您可以深入咨询：
• "饮食调理方案" - 详细的降尿酸饮食指导
• "运动健身方案" - 定制化运动处方
• "药物指导" - 用药参考建议

有任何问题欢迎随时询问！`,
        sources: [
          { title: 'KDIGO高尿酸血症管理指南', reference: '2020版' },
          { title: '中国成人血脂异常防治指南', reference: '2016' },
        ],
        actions: [
          { label: '查看详细指标', type: 'view-chart' },
          { label: '生成饮食计划', type: 'compare' },
        ],
      };
    } else {
      return {
        content: `✅ **图片分析完成**

我已收到您上传的图片《${file.name}》。

如果这是化验单或检查报告的照片，请告诉我您想了解哪些内容，或者您有什么健康疑问？

💡 **提示**：如果是完整的体检报告，建议上传PDF格式以获得更准确的分析。`,
        sources: [
          { title: '临床检验结果解读', reference: '2023' },
        ],
      };
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !selectedConversation) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleString('zh-CN'),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, selectedConversation.category);
      const aiMessage: AIMessage = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date().toLocaleString('zh-CN'),
        sources: aiResponse.sources,
        actions: aiResponse.actions,
      };

      const newMessages = [...updatedMessages, aiMessage];
      setMessages(newMessages);
      setIsTyping(false);

      conversationStorage.update(selectedConversation.id, {
        messages: newMessages,
        lastMessage: aiResponse.content.substring(0, 50) + '...',
        lastTime: new Date().toLocaleString('zh-CN'),
      });
      loadConversations();
    }, 1500);
  };

  const generateAIResponse = (userInput: string, category: string): { content: string; sources?: any[]; actions?: any[] } => {
    const input = userInput.toLowerCase();

    // 根据话题类别生成更精准的回复
    if (category === 'diet') {
      return {
        content: `关于饮食调理，基于您的健康状况：

**针对尿酸管理：**
• ✅ 多吃：樱桃、芹菜、西红柿、黄瓜
• ⚠️ 限制：海鲜、动物内脏、啤酒
• 💧 每日饮水2000ml+

**针对血脂控制：**
• 🥗 优选：燕麦、深海鱼、坚果、橄榄油
• 🚫 避免：红肉、黄油、油炸食品

**实施建议：**
连续执行3个月，每2周记录体重和感受变化。

需要更详细的食谱或菜单吗？`,
        sources: [
          { title: '中国居民膳食指南', reference: '2022' },
        ],
      };
    }

    if (category === 'fitness') {
      return {
        content: `根据您的健康目标，这是运动建议：

**有氧运动（每周3-5次）：**
• 快走 30分钟，心率100-120次/分
• 游泳 30分钟，中等强度
• 骑车 40分钟，轻松交谈程度

**力量训练（每周2-3次）：**
• 深蹲 3组x12次
• 俯卧撑 3组x10次
• 平板支撑 3组x30秒

**关键要点：**
• 运动前后充分补水
• 避免剧烈运动（防止尿酸升高）
• 循序渐进增加运动量

需要详细的训练计划吗？`,
        sources: [
          { title: '中国成人身体活动指南', reference: '2021' },
        ],
      };
    }

    if (category === 'medication') {
      return {
        content: `⚠️ **用药提醒**

关于药物使用，我需要强调：

**当前建议：**
您的指标处于临界值，建议先通过生活方式干预（饮食+运动）观察3个月。

**用药指征：**
• 如果3个月后尿酸仍≥480 μmol/L
• 或出现痛风发作
• 建议就诊风湿免疫科评估用药

**可能药物（仅供参考）：**
• 非布司他（降尿酸）
• 别嘌醇（抑制尿酸生成）

⚠️ **重要**：具体用药必须由执业医师开具处方，请勿自行用药。

您想了解哪种药物的详细信息？`,
        sources: [
          { title: '中国高尿酸血症与痛风诊疗指南', reference: '2019' },
        ],
      };
    }

    // 默认通用回复
    return {
      content: `感谢您的提问。${input.includes('尿酸') ? '关于尿酸管理' : ''}

💡 **建议：**
1. 持续关注关键指标变化
2. 坚持健康的生活方式
3. 定期体检监测

您可以：
• 创建"饮食调理"话题 - 获取详细饮食方案
• 创建"运动健身"话题 - 获取运动指导
• 上传新的体检报告 - 追踪指标变化

有具体问题欢迎继续提问！`,
    };
  };

  const filteredConversations = conversations.filter(conv => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (conv.topic && conv.topic.toLowerCase().includes(searchLower)) ||
      (conv.context && conv.context.toLowerCase().includes(searchLower)) ||
      (conv.tags && conv.tags.some(tag => tag && tag.toLowerCase().includes(searchLower)))
    );
  });

  const getCategoryIcon = (category: string) => {
    const config = topicCategories[category as keyof typeof topicCategories];
    if (!config) return null;
    const Icon = config.icon;
    return <Icon className="w-4 h-4" />;
  };

  const getCategoryBadge = (category: string) => {
    const config = topicCategories[category as keyof typeof topicCategories];
    if (!config) return null;
    return (
      <Badge className={`${config.bgColor} ${config.textColor} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="h-[calc(100vh-100px)] flex gap-4">
      {/* 左侧：话题列表 - 压缩宽度 */}
      {isSidebarOpen && (
        <div className="w-64 flex-shrink-0 transition-all duration-300">
          <Card className="h-full flex flex-col">
            <div className="p-3 border-b space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input 
                  placeholder="搜索..." 
                  className="pl-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => setShowNewTopicMenu(!showNewTopicMenu)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新建
                </Button>

                {showNewTopicMenu && (
                  <Card className="absolute top-full left-0 right-0 mt-2 p-2 z-10 shadow-lg">
                    <div className="space-y-1">
                      {Object.entries(topicCategories).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <button
                            key={key}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors text-left"
                            onClick={() => createNewTopic(config, key)}
                          >
                            <div className={`w-7 h-7 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="font-medium text-xs text-gray-900">{config.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                )}
              </div>
            </div>

            <ScrollArea className="flex-1 p-2">
              {filteredConversations.map((conv) => {
                const categoryConfig = topicCategories[conv.category];
                const Icon = categoryConfig?.icon || MessageCircle;
                
                return (
                  <div
                    key={conv.id}
                    className={`
                      p-2 rounded-lg mb-1.5 cursor-pointer transition-all
                      ${selectedConversation?.id === conv.id 
                        ? 'bg-blue-50 border-2 border-blue-200 shadow-sm' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                      }
                    `}
                    onClick={() => {
                      setSelectedConversation(conv);
                      setMessages(conv.messages);
                      navigate(`/chat/${conv.id}`);
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-lg ${categoryConfig?.color || 'bg-gray-500'} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-xs text-gray-900 truncate pr-1 leading-tight">
                            {conv.topic}
                          </h4>
                          {conv.unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center flex-shrink-0 text-[10px]">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 truncate">{conv.lastMessage}</p>
                        {conv.tags && conv.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {conv.tags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredConversations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">没有找到相关话题</p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      )}

      {/* 右侧：当前会话窗口 */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* 话题信息横幅 - 添加折叠按钮 */}
            <Card className="p-3 mb-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="flex-shrink-0"
                  title={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="w-5 h-5 text-gray-600" />
                  ) : (
                    <PanelLeft className="w-5 h-5 text-gray-600" />
                  )}
                </Button>
                
                {(() => {
                  const categoryConfig = topicCategories[selectedConversation.category];
                  const Icon = categoryConfig?.icon || MessageCircle;
                  return (
                    <div className={`w-10 h-10 rounded-xl ${categoryConfig?.color || 'bg-gray-500'} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  );
                })()}
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold text-gray-900 mb-1">{selectedConversation.topic}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getCategoryBadge(selectedConversation.category)}
                    <span className="text-xs text-gray-600">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      {new Date(selectedConversation.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                    {selectedConversation.tags && selectedConversation.tags.length > 0 && (
                      <div className="flex gap-1">
                        {selectedConversation.tags.map((tag, idx) => (
                          <span key={idx} className="text-xs bg-white text-gray-600 px-2 py-0.5 rounded border">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 保存到档案按钮 - 仅在报告类别显示 */}
                {selectedConversation.category === 'report' && messages.length > 2 && (
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    保存到档案
                  </Button>
                )}
              </div>
            </Card>

            {/* 消息区域 */}
            <Card className="flex-1 flex flex-col overflow-hidden">
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`
                          max-w-2xl rounded-lg px-4 py-3
                          ${message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border-2 border-blue-100'
                          }
                        `}
                      >
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-blue-100">
                            <p className="text-xs text-gray-600 mb-2">📚 参考来源：</p>
                            {message.sources.map((source, idx) => (
                              <p key={idx} className="text-xs text-blue-600">
                                • {source.title} ({source.reference})
                              </p>
                            ))}
                          </div>
                        )}

                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.actions.map((action, idx) => (
                              <Button key={idx} variant="outline" size="sm">
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}

                        {message.role === 'assistant' && (
                          <div className="mt-3 pt-3 border-t border-blue-100 text-xs text-gray-500">
                            ℹ️ 此建议基于公开指南生成，个体情况请咨询注册医师。
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-2">
                          {message.timestamp}
                        </div>
                      </div>

                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-gray-700">我</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      <div className="bg-white border-2 border-blue-100 rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* 文件上传预览区 */}
              {uploadedFiles.length > 0 && (
                <div className="px-4 py-3 border-t bg-gray-50">
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          file.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {file.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : file.status === 'processing' ? (
                            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                          ) : file.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <span className="text-xs text-gray-500">{file.size}</span>
                          </div>
                          {file.status !== 'completed' && (
                            <div className="space-y-1">
                              <Progress value={file.progress} className="h-1" />
                              <p className="text-xs text-gray-600">
                                {file.status === 'uploading' ? '上传中...' : 'AI分析中...'}
                              </p>
                            </div>
                          )}
                        </div>

                        {file.status === 'uploading' && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 输入区 */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    title="上传报告或图片"
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={`在"${selectedConversation.topic}"中提问...`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  💡 按话题组织对话，AI可以更精准地理解您的需求
                </p>
              </div>
            </Card>
          </>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-blue-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">选择一个话题开始</h3>
              <p className="text-gray-600 mb-4">或创建新话题开始咨询</p>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => setShowNewTopicMenu(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                新建话题
              </Button>
            </div>
          </Card>
        )}
      </div>
      
      {/* 保存健康档案对话框 */}
      {selectedConversation && (
        <SaveHealthRecordDialog
          open={showSaveDialog}
          onOpenChange={setShowSaveDialog}
          conversationId={selectedConversation.id}
          conversationTopic={selectedConversation.topic}
          onSaveSuccess={() => {
            // 保存成功后可以跳转到健康档案页面
            navigate('/profiles');
          }}
        />
      )}
    </div>
  );
}