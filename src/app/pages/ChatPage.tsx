import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Plus,
  MessageSquare,
  Clock,
  Trash2,
  FileText,
  Bot,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { storage, aiSimulator } from '../utils';
import { Message, ConversationDimension, PPTProject } from '../types';

const DIMENSIONS: ConversationDimension[] = [
  { name: '目标定义', key: 'objective', completed: false },
  { name: '受众分析', key: 'audience', completed: false },
  { name: '内容逻辑', key: 'content', completed: false },
  { name: '视觉风格', key: 'style', completed: false },
  { name: '输出格式', key: 'format', completed: false },
];

export function ChatPage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [projects, setProjects] = useState<PPTProject[]>([]);
  const [currentProject, setCurrentProject] = useState<PPTProject | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dimensions, setDimensions] = useState(DIMENSIONS);
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [projectMetadata, setProjectMetadata] = useState<any>({});
  const [aiModel, setAiModel] = useState('gpt-4');

  // 加载所有项目
  useEffect(() => {
    const loadedProjects = storage.getProjects();
    setProjects(loadedProjects);

    // 如果有projectId,加载该项目
    if (projectId) {
      const project = storage.getProject(projectId);
      if (project) {
        setCurrentProject(project);
        setMessages(project.conversationHistory || []);
        setProjectMetadata(project.metadata || {});
        
        // 恢复维度完成状态
        const updatedDimensions = DIMENSIONS.map(dim => ({
          ...dim,
          completed: !!project.metadata[dim.key],
        }));
        setDimensions(updatedDimensions);
        
        // 计算当前维度索引
        const completedCount = updatedDimensions.filter(d => d.completed).length;
        setCurrentDimensionIndex(Math.min(completedCount, DIMENSIONS.length - 1));
      }
    } else if (loadedProjects.length === 0) {
      // 如果没有任何项目,创建一个新的
      handleCreateNewProject();
    } else {
      // 选择第一个项目
      handleSelectProject(loadedProjects[0].id);
    }
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateNewProject = () => {
    const project = storage.createProject(`PPT项目 ${Date.now()}`);
    
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: '您好！我是XX科技的AI助手，将引导您通过5个维度创建专业的PPT。\n\n让我们从第一步开始：**明确PPT目标**\n\n请告诉我：\n1. 这份PPT的主要用途是什么？（如：产品发布、商务提案、工作汇报、培训课件等）\n2. 您希望通过这份PPT达到什么目的？',
      timestamp: Date.now(),
    };
    
    project.conversationHistory = [welcomeMessage];
    storage.saveProject(project);
    
    setProjects([project, ...projects]);
    navigate(`/chat/${project.id}`);
  };

  const handleSelectProject = (id: string) => {
    const project = storage.getProject(id);
    if (!project) return;

    // 根据项目状态跳转到不同页面
    if (project.status === 'editing' || project.status === 'completed') {
      // 如果已经在编辑或完成状态,跳转到编辑器
      navigate(`/editor/${id}`);
    } else if (project.status === 'outline') {
      // 如果在大纲状态,跳转到大纲页面
      navigate(`/outline/${id}`);
    } else {
      // 否则继续对话
      navigate(`/chat/${id}`);
    }
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这个项目吗？')) {
      storage.deleteProject(id);
      const updatedProjects = projects.filter(p => p.id !== id);
      setProjects(updatedProjects);
      
      if (currentProject?.id === id) {
        if (updatedProjects.length > 0) {
          handleSelectProject(updatedProjects[0].id);
        } else {
          handleCreateNewProject();
        }
      }
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || !currentProject) return;

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // 更新当前维度状态
      const currentDimension = dimensions[currentDimensionIndex];
      const updatedMetadata = {
        ...projectMetadata,
        [currentDimension.key]: inputValue,
      };
      setProjectMetadata(updatedMetadata);

      // 标记当前维度完成
      const updatedDimensions = [...dimensions];
      updatedDimensions[currentDimensionIndex].completed = true;
      setDimensions(updatedDimensions);

      // 获取AI响应
      const response = await aiSimulator.generateResponse(
        inputValue,
        currentDimension.key,
        aiModel
      );

      const assistantMessage: Message = {
        id: `assistant_${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // 更新项目
      currentProject.conversationHistory = updatedMessages;
      currentProject.metadata = updatedMetadata;
      currentProject.updatedAt = Date.now();
      storage.saveProject(currentProject);

      // 移动到下一个维度
      if (currentDimensionIndex < dimensions.length - 1) {
        setCurrentDimensionIndex(currentDimensionIndex + 1);
      } else {
        // 所有维度完成，显示生成按钮
        setTimeout(() => {
          const finalMessage: Message = {
            id: `final_${Date.now()}`,
            role: 'system',
            content: '🎉 太棒了！所有信息已收集完成。点击下方按钮生成您的PPT大纲。',
            timestamp: Date.now(),
          };
          const finalMessages = [...updatedMessages, finalMessage];
          setMessages(finalMessages);
          currentProject.conversationHistory = finalMessages;
          storage.saveProject(currentProject);
        }, 500);
      }

      // 更新项目列表
      setProjects(storage.getProjects());
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateOutline = () => {
    if (!currentProject) return;

    // 生成大纲
    const outline = aiSimulator.generateOutline(projectMetadata);
    currentProject.outline = outline;
    currentProject.status = 'outline';
    currentProject.updatedAt = Date.now();
    
    // 更新项目名称为更有意义的名称
    if (projectMetadata.objective) {
      currentProject.name = projectMetadata.objective;
    }
    
    storage.saveProject(currentProject);

    // 跳转到大纲页面
    navigate(`/outline/${currentProject.id}`);
  };

  const allDimensionsCompleted = dimensions.every(d => d.completed);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getProjectStatus = (project: PPTProject) => {
    if (project.status === 'completed') return { label: '已完成', color: 'text-green-600 bg-green-50' };
    if (project.status === 'editing') return { label: '编辑中', color: 'text-blue-600 bg-blue-50' };
    if (project.status === 'outline') return { label: '大纲', color: 'text-purple-600 bg-purple-50' };
    return { label: '对话中', color: 'text-orange-600 bg-orange-50' };
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Left Sidebar - Project List */}
      <div className="w-80 border-r flex flex-col bg-gray-50">
        {/* Sidebar Header */}
        <div className="p-3 border-b bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-semibold text-gray-900">智能PPT助手</h1>
          </div>
          
          <div className="space-y-2">
            <Button
              onClick={handleCreateNewProject}
              className="w-full bg-blue-600 hover:bg-blue-700 h-8"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建PPT项目
            </Button>
            
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Project List */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {projects.length === 0 ? (
              <div className="text-center py-12 px-4">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-4">还没有任何项目</p>
                <Button
                  onClick={handleCreateNewProject}
                  variant="outline"
                  size="sm"
                >
                  创建第一个项目
                </Button>
              </div>
            ) : (
              projects.map((project) => {
                const status = getProjectStatus(project);
                const isActive = currentProject?.id === project.id;
                
                return (
                  <Card
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    className={`p-2 cursor-pointer transition-all group hover:shadow-md ${
                      isActive
                        ? 'border-blue-600 bg-white shadow-md'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isActive ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <FileText className={`w-4 h-4 ${
                          isActive ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${status.color}`}>
                            {status.label}
                          </span>
                          {project.slides.length > 0 && (
                            <span className="text-xs text-gray-500">
                              {project.slides.length} 页
                            </span>
                          )}
                          <span className="text-xs text-gray-400">·</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(project.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 hover:bg-red-50 hover:text-red-600"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Content - Chat Area */}
      {currentProject ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <header className="border-b px-6 py-4 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">{currentProject.name}</h2>
                <p className="text-sm text-gray-500">五维需求收集对话</p>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center gap-2">
                {dimensions.map((dim, index) => (
                  <div key={dim.key} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {dim.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : index === currentDimensionIndex ? (
                        <Circle className="w-5 h-5 text-blue-600 animate-pulse" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300" />
                      )}
                      <span
                        className={`text-sm ${
                          dim.completed
                            ? 'text-green-600'
                            : index === currentDimensionIndex
                            ? 'text-blue-600 font-medium'
                            : 'text-gray-400'
                        }`}
                      >
                        {dim.name}
                      </span>
                    </div>
                    {index < dimensions.length - 1 && (
                      <div className="w-8 h-px bg-gray-200 mx-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </header>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {message.role === 'system' && (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    )}

                    <div
                      className={`max-w-2xl rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : message.role === 'system'
                          ? 'bg-green-50 text-green-900 border border-green-200'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      {message.role !== 'user' && (
                        <div className="text-xs opacity-60 mt-2">
                          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 text-white text-sm">
                        我
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-white">
            <div className="max-w-3xl mx-auto px-6 py-4">
              {allDimensionsCompleted ? (
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        需求收集完成！
                      </h3>
                      <p className="text-sm text-gray-600">
                        已完成5个维度的信息收集，现在可以生成PPT大纲了
                      </p>
                    </div>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={handleGenerateOutline}
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      生成PPT大纲
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="flex gap-3">
                  <Textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="输入您的回答... (Shift+Enter换行，Enter发送)"
                    className="min-h-[60px] max-h-[200px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 px-6"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              开始创建您的PPT
            </h3>
            <p className="text-gray-500 mb-6">
              点击左侧"新建PPT项目"开始与AI对话
            </p>
            <Button onClick={handleCreateNewProject} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              新建项目
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}