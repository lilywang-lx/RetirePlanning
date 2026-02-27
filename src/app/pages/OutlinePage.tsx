import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ChevronLeft,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  CheckCircle2,
  Sparkles,
  Edit2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { storage, aiSimulator } from '../utils';
import { PPTProject, OutlineItem } from '../types';
import { toast } from 'sonner';

export function OutlinePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PPTProject | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (id) {
      const loadedProject = storage.getProject(id);
      if (loadedProject) {
        setProject(loadedProject);
        
        // 如果还没有大纲,生成一个
        if (!loadedProject.outline || loadedProject.outline.length === 0) {
          const outline = aiSimulator.generateOutline(loadedProject.metadata);
          loadedProject.outline = outline;
          loadedProject.status = 'outline';
          storage.saveProject(loadedProject);
          setProject({ ...loadedProject });
        }
      } else {
        toast.error('项目不存在');
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!project || !project.outline) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">生成大纲中...</p>
        </div>
      </div>
    );
  }

  const currentItem = project.outline[selectedIndex];

  const handleUpdateOutlineItem = (index: number, updates: Partial<OutlineItem>) => {
    if (project.outline) {
      project.outline[index] = {
        ...project.outline[index],
        ...updates,
      };
      setProject({ ...project });
    }
  };

  const handleAddOutlineItem = () => {
    if (project.outline) {
      const newItem: OutlineItem = {
        id: `outline_${Date.now()}`,
        order: project.outline.length,
        title: '新页面',
        description: '页面描述',
        layout: 'content',
      };
      project.outline.push(newItem);
      setProject({ ...project });
      setSelectedIndex(project.outline.length - 1);
      toast.success('已添加新页面');
    }
  };

  const handleDeleteOutlineItem = (index: number) => {
    if (project.outline && project.outline.length <= 1) {
      toast.error('至少需要保留一个页面');
      return;
    }

    if (project.outline) {
      project.outline.splice(index, 1);
      project.outline.forEach((item, i) => {
        item.order = i;
      });

      if (selectedIndex >= project.outline.length) {
        setSelectedIndex(project.outline.length - 1);
      }

      setProject({ ...project });
      toast.success('已删除页面');
    }
  };

  const handleSave = () => {
    project.updatedAt = Date.now();
    storage.saveProject(project);
    toast.success('大纲已保存');
  };

  const handleGenerateSlides = async () => {
    setIsGenerating(true);

    try {
      // 模拟生成过程
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 根据大纲生成幻灯片
      const slides = aiSimulator.generateSlides(project.metadata);
      project.slides = slides;
      project.status = 'editing';
      project.updatedAt = Date.now();
      storage.saveProject(project);

      toast.success('幻灯片生成成功！');
      
      // 跳转到编辑器
      setTimeout(() => {
        navigate(`/editor/${project.id}`);
      }, 500);
    } catch (error) {
      toast.error('生成失败，请重试');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const layoutLabels: Record<string, string> = {
    title: '标题页',
    content: '内容页',
    'two-column': '两栏布局',
    'image-text': '图文混排',
    blank: '空白页',
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回对话
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">PPT大纲</h1>
              <p className="text-sm text-gray-500">{project.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>{project.outline.length} 个页面</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleSave}>
            保存大纲
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            onClick={handleGenerateSlides}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                生成中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                生成幻灯片
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Outline List */}
        <div className="w-80 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <Button
              onClick={handleAddOutlineItem}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加页面
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {project.outline.map((item, index) => (
              <Card
                key={item.id}
                onClick={() => setSelectedIndex(index)}
                className={`p-4 cursor-pointer transition-all group hover:shadow-md ${
                  selectedIndex === index
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {layoutLabels[item.layout]}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteOutlineItem(index);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Content - Detail Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            {/* Preview Card */}
            <Card className="mb-6 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                    {selectedIndex + 1}
                  </div>
                  <span className="text-sm opacity-90">
                    {layoutLabels[currentItem.layout]}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{currentItem.title}</h2>
                <p className="text-blue-100">{currentItem.description}</p>
              </div>
              
              <div className="p-6 bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Edit2 className="w-4 h-4" />
                  <span>此页面将使用 <strong>{layoutLabels[currentItem.layout]}</strong> 布局</span>
                </div>
              </div>
            </Card>

            {/* Edit Form */}
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-blue-600" />
                编辑页面信息
              </h3>

              <div className="space-y-6">
                <div>
                  <Label>页面标题</Label>
                  <Input
                    value={currentItem.title}
                    onChange={(e) =>
                      handleUpdateOutlineItem(selectedIndex, { title: e.target.value })
                    }
                    placeholder="输入页面标题"
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label>页面说明</Label>
                  <Textarea
                    value={currentItem.description || ''}
                    onChange={(e) =>
                      handleUpdateOutlineItem(selectedIndex, { description: e.target.value })
                    }
                    placeholder="描述这个页面的内容和用途"
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>布局类型</Label>
                  <Select
                    value={currentItem.layout}
                    onValueChange={(value: any) =>
                      handleUpdateOutlineItem(selectedIndex, { layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-5 border rounded bg-blue-50 flex items-center justify-center">
                            <div className="w-4 h-1 bg-blue-600 rounded" />
                          </div>
                          标题页
                        </div>
                      </SelectItem>
                      <SelectItem value="content">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-5 border rounded bg-gray-50 flex flex-col gap-0.5 justify-center px-1">
                            <div className="w-full h-0.5 bg-gray-600 rounded" />
                            <div className="w-full h-0.5 bg-gray-400 rounded" />
                            <div className="w-full h-0.5 bg-gray-400 rounded" />
                          </div>
                          内容页
                        </div>
                      </SelectItem>
                      <SelectItem value="two-column">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-5 border rounded bg-gray-50 flex gap-0.5 p-0.5">
                            <div className="flex-1 bg-gray-400 rounded" />
                            <div className="flex-1 bg-gray-400 rounded" />
                          </div>
                          两栏布局
                        </div>
                      </SelectItem>
                      <SelectItem value="image-text">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-5 border rounded bg-gray-50 flex gap-0.5 p-0.5">
                            <div className="w-3 bg-green-400 rounded" />
                            <div className="flex-1 bg-gray-400 rounded" />
                          </div>
                          图文混排
                        </div>
                      </SelectItem>
                      <SelectItem value="blank">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-5 border rounded bg-white" />
                          空白页
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-2">
                    选择适合此页面内容的布局样式
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedIndex > 0) {
                      setSelectedIndex(selectedIndex - 1);
                    }
                  }}
                  disabled={selectedIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  上一页
                </Button>

                <span className="text-sm text-gray-500">
                  {selectedIndex + 1} / {project.outline.length}
                </span>

                <Button
                  variant="outline"
                  onClick={() => {
                    if (selectedIndex < project.outline.length - 1) {
                      setSelectedIndex(selectedIndex + 1);
                    }
                  }}
                  disabled={selectedIndex === project.outline.length - 1}
                >
                  下一页
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Action Hint */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 font-medium mb-1">
                    准备好了吗？
                  </p>
                  <p className="text-sm text-gray-600">
                    确认大纲无误后，点击右上角"生成幻灯片"按钮，AI将为您创建完整的PPT内容。
                    您还可以在编辑器中进一步调整每一页的详细内容。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
