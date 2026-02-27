import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../components/ui/button';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { UserData } from '../../types/retirement';
import { getUserProfile, saveUserProfile, generateAssessment, generateActionItems } from '../../utils/retirement-storage';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  options?: QuickOption[];
}

interface QuickOption {
  label: string;
  value: any;
}

interface QuestionConfig {
  field: keyof UserData;
  question: string;
  options: QuickOption[];
  followUp?: string;
}

export function ChatInputPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const questions: QuestionConfig[] = [
    {
      field: 'age',
      question: '您好！我是您的养老规划助手小智 🤖\n\n首先，能告诉我您今年多大了吗？这能帮我更好地为您规划。',
      options: [
        { label: '35-44岁', value: 40 },
        { label: '45-54岁', value: 50 },
        { label: '55-65岁', value: 60 },
      ],
    },
    {
      field: 'familyStructure',
      question: '了解了！接下来，想了解一下您的家庭结构，方便我评估您的养老支持网络。',
      options: [
        { label: '👤 独居', value: 'single' },
        { label: '💑 与配偶同住', value: 'couple' },
        { label: '👨‍👩‍👧‍👦 与子女同住', value: 'withChildren' },
        { label: '👥 三代同堂', value: 'multigenerational' },
      ],
    },
    {
      field: 'incomeLevel',
      question: '好的，那您目前的经济状况如何呢？（别担心，这仅用于评估，绝对保密）',
      options: [
        { label: '💰 较为宽裕', value: 'comfortable' },
        { label: '✅ 基本够用', value: 'adequate' },
        { label: '⚠️ 略有压力', value: 'tight' },
        { label: '🔴 压力较大', value: 'strained' },
      ],
    },
    {
      field: 'healthStatus',
      question: '财务状况清楚了。那您现在的身体状况怎么样？',
      options: [
        { label: '💪 身体倍儿棒', value: 'excellent' },
        { label: '😊 总体良好', value: 'good' },
        { label: '😐 还行，有小毛病', value: 'fair' },
        { label: '😔 有慢性疾病', value: 'poor' },
      ],
    },
    {
      field: 'legalPreparation',
      question: '很好！那您有没有做过一些法律层面的准备呢？比如遗嘱、医疗委托等。',
      options: [
        { label: '✅ 已经安排好了', value: true },
        { label: '❌ 还没有准备', value: false },
        { label: '🤔 正在考虑中', value: false },
      ],
    },
    {
      field: 'socialSupport',
      question: '最后一个问题！您觉得自己的社交网络和社区支持怎么样？',
      options: [
        { label: '🌟 朋友多，社区活动丰富', value: 'strong' },
        { label: '👍 有一些固定的朋友圈', value: 'moderate' },
        { label: '😶 社交较少', value: 'limited' },
      ],
    },
  ];

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化欢迎消息
  useEffect(() => {
    setTimeout(() => {
      addAIMessage(questions[0].question, questions[0].options);
    }, 500);
  }, []);

  // 添加AI消息
  const addAIMessage = (content: string, options?: QuickOption[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date(),
        options,
      };
      setMessages((prev) => [...prev, newMessage]);
    }, 800);
  };

  // 添加用户消息
  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // 处理快捷选项
  const handleQuickOption = (option: QuickOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // 添加用户选择
    addUserMessage(option.label);
    
    // 保存数据
    const newUserData = {
      ...userData,
      [currentQuestion.field]: option.value,
    };
    setUserData(newUserData);

    // 进入下一个问题或完成
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      setTimeout(() => {
        addAIMessage(questions[nextIndex].question, questions[nextIndex].options);
      }, 1000);
    } else {
      finishQuestionnaire(newUserData);
    }
  };

  // 处理文本输入
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    addUserMessage(input);

    // 简单的自然语言处理（模拟）
    let value: any;
    const lowerInput = input.toLowerCase();

    switch (currentQuestion.field) {
      case 'age':
        const ageMatch = input.match(/(\d+)/);
        value = ageMatch ? parseInt(ageMatch[1]) : 45;
        break;
      case 'familyStructure':
        if (lowerInput.includes('独居') || lowerInput.includes('一个人')) value = 'single';
        else if (lowerInput.includes('配偶') || lowerInput.includes('老伴')) value = 'couple';
        else if (lowerInput.includes('子女')) value = 'withChildren';
        else if (lowerInput.includes('三代')) value = 'multigenerational';
        else value = 'couple';
        break;
      case 'incomeLevel':
        if (lowerInput.includes('宽裕') || lowerInput.includes('充足')) value = 'comfortable';
        else if (lowerInput.includes('够用') || lowerInput.includes('还行')) value = 'adequate';
        else if (lowerInput.includes('紧张') || lowerInput.includes('压力')) value = 'tight';
        else value = 'adequate';
        break;
      case 'healthStatus':
        if (lowerInput.includes('很好') || lowerInput.includes('健康')) value = 'excellent';
        else if (lowerInput.includes('良好') || lowerInput.includes('不错')) value = 'good';
        else if (lowerInput.includes('小毛病') || lowerInput.includes('还行')) value = 'fair';
        else if (lowerInput.includes('疾病') || lowerInput.includes('不好')) value = 'poor';
        else value = 'good';
        break;
      case 'legalPreparation':
        value = lowerInput.includes('有') || lowerInput.includes('准备了');
        break;
      case 'socialSupport':
        if (lowerInput.includes('多') || lowerInput.includes('丰富')) value = 'strong';
        else if (lowerInput.includes('一些') || lowerInput.includes('还行')) value = 'moderate';
        else if (lowerInput.includes('少') || lowerInput.includes('较少')) value = 'limited';
        else value = 'moderate';
        break;
    }

    const newUserData = {
      ...userData,
      [currentQuestion.field]: value,
    };
    setUserData(newUserData);

    setInput('');

    // 进入下一个问题或完成
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      setTimeout(() => {
        addAIMessage(questions[nextIndex].question, questions[nextIndex].options);
      }, 1000);
    } else {
      finishQuestionnaire(newUserData);
    }
  };

  // 完成问卷
  const finishQuestionnaire = (finalData: Partial<UserData>) => {
    setTimeout(() => {
      addAIMessage('太好了！我已经收集到了所有信息。让我为您生成专属的养老评估报告...');
    }, 1000);

    setTimeout(async () => {
      // 保存用户数据
      const completeData: UserData = {
        age: finalData.age || 45,
        familyStructure: finalData.familyStructure || 'couple',
        incomeLevel: finalData.incomeLevel || 'adequate',
        healthStatus: finalData.healthStatus || 'good',
        legalPreparation: finalData.legalPreparation || false,
        socialSupport: finalData.socialSupport || 'moderate',
      };
      
      // 获取或创建用户档案
      const profile = getUserProfile();
      
      // 生成评估
      const assessment = generateAssessment(completeData);
      profile.assessments.push(assessment);
      
      // 生成行动计划
      const actionItems = generateActionItems(assessment);
      profile.actions = actionItems;
      
      // 保存用户档案
      saveUserProfile(profile);

      // 导航到评估页面
      navigate('/retirement/dashboard');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">小智</h1>
            <p className="text-xs text-gray-500">养老规划助手</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                {message.type === 'ai' && (
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="bg-white rounded-2xl rounded-tl-none shadow-sm px-4 py-3 whitespace-pre-line">
                        <p className="text-gray-800">{message.content}</p>
                      </div>
                      
                      {/* Quick Options */}
                      {message.options && message.options.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.options.map((option, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickOption(option)}
                              className="bg-white hover:bg-blue-50 hover:border-blue-300 transition-all"
                            >
                              {option.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {message.type === 'user' && (
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none shadow-sm px-4 py-3">
                    <p>{message.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none shadow-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="或者直接输入您的回答..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex-shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            您可以点击快捷选项或输入文字回答
          </p>
        </form>
      </div>
    </div>
  );
}