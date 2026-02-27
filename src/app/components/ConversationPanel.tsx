import { useState } from 'react';
import { ChevronLeft, AlertTriangle, Sparkles, CheckCircle, Edit2, Send, Loader2 } from 'lucide-react';
import { DimensionData } from '@/app/App';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  outline?: string[];
  showOutlineConfirm?: boolean;
}

interface ConversationPanelProps {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  dimensionData: DimensionData;
  updateDimension: (dimension: keyof DimensionData, value: string) => void;
  onGenerate: () => void;
  onOutlineConfirmed?: (outline: string[]) => void;
}

export function ConversationPanel({
  currentStep,
  setCurrentStep,
  dimensionData,
  updateDimension,
  onGenerate,
  onOutlineConfirmed
}: ConversationPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '您好！我是AI助手，将帮助您快速生成专业的PPT。请告诉我您想要制作什么主题的PPT？例如：产品汇报、技术方案、工作总结等。',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      generateAIResponse(inputValue);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string) => {
    let outline: string[] = [];
    let content = '';

    // Analyze user input and generate appropriate outline
    if (userInput.includes('技术') || userInput.includes('架构') || userInput.includes('开发')) {
      content = '我理解了，您需要制作一份技术相关的PPT。我为您生成了以下大纲：';
      outline = [
        '封面页：技术方案汇报',
        '目录：技术架构概览',
        '现状分析：当前技术栈与挑战',
        '技术方案：核心架构设计',
        '关键技术：实现细节',
        '性能评估：基准测试结果',
        '总结：技术优势与展望'
      ];
    } else if (userInput.includes('产品') || userInput.includes('功能') || userInput.includes('需求')) {
      content = '好的，我为您的产品方案准备了以下PPT大纲：';
      outline = [
        '封面页：产品方案展示',
        '目录：功能模块导航',
        '市场分析：用户需求与竞品',
        '产品定位：核心价值主张',
        '功能架构：核心模块介绍',
        '用户体验：交互流程',
        '总结：产品亮点与规划'
      ];
    } else if (userInput.includes('汇报') || userInput.includes('工作') || userInput.includes('总结')) {
      content = '明白了，这是一份工作汇报PPT。我为您设计了以下结构：';
      outline = [
        '封面页：工作汇报',
        '目录：汇报内容概览',
        '工作回顾：完成情况',
        '关键成果：量化数据',
        '遇到问题：挑战与应对',
        '下阶段计划：目标与措施',
        '总结：请示与建议'
      ];
    } else if (userInput.includes('销售') || userInput.includes('营销') || userInput.includes('推广')) {
      content = '我为您的销售/营销方案设计了以下PPT结构：';
      outline = [
        '封面页：营销方案',
        '目录：方案概览',
        '市场现状：数据与趋势',
        '目标客群：用户画像',
        '营销策略：核心打法',
        '执行计划：时间线与预算',
        '总结：预期效果与ROI'
      ];
    } else {
      content = '我为您生成了以下通用PPT大纲：';
      outline = [
        '封面页：项目标题',
        '目录：内容概览',
        '背景分析：现状与痛点',
        '解决方案：核心策略',
        '实施计划：时间线与里程碑',
        '预期效果：量化指标',
        '总结与展望'
      ];
    }

    const aiMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content,
      timestamp: new Date(),
      outline,
      showOutlineConfirm: true
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleConfirmOutline = (outline: string[]) => {
    // Hide confirm button
    setMessages(prev => prev.map(msg => 
      msg.outline ? { ...msg, showOutlineConfirm: false } : msg
    ));

    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: '好的，我已经为您生成了PPT骨架预览。您可以在右侧查看并编辑每一页的内容。如有需要调整的地方，随时告诉我！',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, confirmMessage]);

    // Notify parent
    if (onOutlineConfirmed) {
      onOutlineConfirmed(outline);
    }
  };

  const handleEditOutline = (outline: string[]) => {
    const editMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: '我想修改大纲结构',
      timestamp: new Date()
    };

    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '好的，请告诉我您想如何调整大纲？或者直接描述您的新需求，我重新为您生成。',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, editMessage, responseMessage]);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-neutral-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="size-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-neutral-900">AI PPT 助手</h1>
            <p className="text-xs text-neutral-500">智能生成专业PPT</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Message Bubble */}
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-neutral-100 text-neutral-900'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>

              {/* Outline Display */}
              {message.outline && (
                <div className="mt-3 bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div className="px-3 py-2 bg-blue-50 border-b border-blue-200">
                    <div className="text-xs font-semibold text-blue-900">
                      生成的大纲（共 {message.outline.length} 页）
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {message.outline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <div className="flex-shrink-0 size-5 rounded bg-blue-600 text-white flex items-center justify-center font-medium text-[10px]">
                          {idx + 1}
                        </div>
                        <div className="flex-1 text-neutral-900 pt-0.5">{item}</div>
                      </div>
                    ))}
                  </div>
                  
                  {message.showOutlineConfirm && (
                    <div className="px-3 pb-3 flex gap-2">
                      <button
                        onClick={() => handleEditOutline(message.outline!)}
                        className="flex-1 px-3 py-2 text-xs border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        修改大纲
                      </button>
                      <button
                        onClick={() => handleConfirmOutline(message.outline!)}
                        className="flex-1 px-3 py-2 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="size-3" />
                        确认生成
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Timestamp */}
              <div className={`mt-1 text-xs text-neutral-400 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Avatar */}
            <div className={`flex-shrink-0 ${message.type === 'user' ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
              {message.type === 'ai' ? (
                <div className="size-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="size-4 text-white" />
                </div>
              ) : (
                <div className="size-7 rounded-full bg-neutral-300 flex items-center justify-center text-xs font-medium text-neutral-700">
                  You
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                <Sparkles className="size-4 text-white" />
              </div>
              <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="size-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-neutral-200 flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="描述您的PPT需求，例如：我要做一个技术方案汇报..."
            className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="flex-shrink-0 size-10 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-200 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors"
          >
            <Send className="size-4" />
          </button>
        </div>
        <div className="mt-2 text-xs text-neutral-400 text-center">
          按 Enter 发送 · Shift + Enter 换行
        </div>
      </div>
    </div>
  );
}