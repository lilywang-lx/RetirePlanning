import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Eye,
  Save,
  Download,
  GripVertical,
  Type,
  Image as ImageIcon,
  Layout,
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
import { storage } from '../utils';
import { PPTProject, Slide, SlideContent } from '../types';
import { toast } from 'sonner';

export function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PPTProject | null>(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      const loadedProject = storage.getProject(id);
      if (loadedProject) {
        setProject(loadedProject);
      } else {
        toast.error('项目不存在');
        navigate('/');
      }
    }
  }, [id, navigate]);

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载项目中...</p>
        </div>
      </div>
    );
  }

  const currentSlide = project.slides[selectedSlideIndex];

  const handleSave = () => {
    setIsSaving(true);
    project.updatedAt = Date.now();
    storage.saveProject(project);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('保存成功');
    }, 500);
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide_${Date.now()}`,
      order: project.slides.length,
      content: {
        layout: 'content',
        title: '新幻灯片',
        bulletPoints: [],
      },
    };
    
    project.slides.push(newSlide);
    setProject({ ...project });
    setSelectedSlideIndex(project.slides.length - 1);
    toast.success('已添加新幻灯片');
  };

  const handleDeleteSlide = (index: number) => {
    if (project.slides.length <= 1) {
      toast.error('至少需要保留一页幻灯片');
      return;
    }
    
    project.slides.splice(index, 1);
    project.slides.forEach((slide, i) => {
      slide.order = i;
    });
    
    if (selectedSlideIndex >= project.slides.length) {
      setSelectedSlideIndex(project.slides.length - 1);
    }
    
    setProject({ ...project });
    toast.success('已删除幻灯片');
  };

  const handleUpdateSlide = (updates: Partial<SlideContent>) => {
    if (currentSlide) {
      currentSlide.content = {
        ...currentSlide.content,
        ...updates,
      };
      setProject({ ...project });
    }
  };

  const handleAddBulletPoint = () => {
    if (currentSlide) {
      const bulletPoints = currentSlide.content.bulletPoints || [];
      bulletPoints.push('新要点');
      handleUpdateSlide({ bulletPoints });
    }
  };

  const handleUpdateBulletPoint = (index: number, value: string) => {
    if (currentSlide && currentSlide.content.bulletPoints) {
      const bulletPoints = [...currentSlide.content.bulletPoints];
      bulletPoints[index] = value;
      handleUpdateSlide({ bulletPoints });
    }
  };

  const handleDeleteBulletPoint = (index: number) => {
    if (currentSlide && currentSlide.content.bulletPoints) {
      const bulletPoints = [...currentSlide.content.bulletPoints];
      bulletPoints.splice(index, 1);
      handleUpdateSlide({ bulletPoints });
    }
  };

  const renderSlidePreview = (slide: Slide, index: number) => {
    const { content } = slide;
    const isTitle = content.layout === 'title';
    const bgColor = content.backgroundColor || '#FFFFFF';
    const textColor = content.textColor || '#000000';

    return (
      <div
        onClick={() => setSelectedSlideIndex(index)}
        className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
          selectedSlideIndex === index
            ? 'border-blue-600 shadow-lg ring-2 ring-blue-200'
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div
          className="aspect-[16/9] p-3 flex flex-col justify-center"
          style={{ backgroundColor: bgColor, color: textColor }}
        >
          {isTitle ? (
            <div className="text-center">
              <div className="font-semibold text-xs mb-1 line-clamp-2">
                {content.title}
              </div>
              {content.subtitle && (
                <div className="text-[8px] opacity-80 line-clamp-1">
                  {content.subtitle}
                </div>
              )}
            </div>
          ) : (
            <div>
              {content.title && (
                <div className="font-semibold text-[10px] mb-2 line-clamp-1 border-b pb-1">
                  {content.title}
                </div>
              )}
              <div className="space-y-1">
                {content.bulletPoints?.slice(0, 3).map((point, i) => (
                  <div key={i} className="flex gap-1 text-[7px]">
                    <span>•</span>
                    <span className="line-clamp-1">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-2 py-1 text-[10px] text-gray-500 flex items-center justify-between">
          <span>幻灯片 {index + 1}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-red-100 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSlide(index);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/outline/${project.id}`)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回大纲
          </Button>
          <div>
            <Input
              value={project.name}
              onChange={(e) => {
                project.name = e.target.value;
                setProject({ ...project });
              }}
              className="font-semibold border-none shadow-none focus-visible:ring-0 px-2"
            />
            <p className="text-xs text-gray-500 px-2">
              {project.slides.length} 页幻灯片
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/preview/${project.id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            预览
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '保存中...' : '保存'}
          </Button>
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => navigate(`/preview/${project.id}`)}
          >
            <Download className="w-4 h-4 mr-2" />
            发布
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Slide Thumbnails */}
        <div className="w-64 bg-white border-r flex flex-col">
          <div className="p-4 border-b">
            <Button
              onClick={handleAddSlide}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加幻灯片
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {project.slides.map((slide, index) => (
              <div key={slide.id} className="relative group">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
                {renderSlidePreview(slide, index)}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Slide Editor */}
        {currentSlide && (
          <div className="flex-1 flex overflow-hidden">
            {/* Preview Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-gray-100">
              <div className="max-w-4xl mx-auto">
                <Card className="aspect-[16/9] overflow-hidden">
                  <div
                    className="w-full h-full p-12 flex flex-col justify-center"
                    style={{
                      backgroundColor: currentSlide.content.backgroundColor || '#FFFFFF',
                      color: currentSlide.content.textColor || '#000000',
                    }}
                  >
                    {currentSlide.content.layout === 'title' ? (
                      <div className="text-center">
                        <h1 className="text-5xl font-bold mb-4">
                          {currentSlide.content.title || '标题'}
                        </h1>
                        {currentSlide.content.subtitle && (
                          <p className="text-2xl opacity-80">
                            {currentSlide.content.subtitle}
                          </p>
                        )}
                      </div>
                    ) : currentSlide.content.layout === 'two-column' ? (
                      <div>
                        <h2 className="text-3xl font-semibold mb-6 pb-3 border-b">
                          {currentSlide.content.title || '标题'}
                        </h2>
                        <div className="grid grid-cols-2 gap-8">
                          <div className="whitespace-pre-wrap text-lg leading-relaxed">
                            {currentSlide.content.content}
                          </div>
                          <div className="bg-white/10 rounded-lg p-6 flex items-center justify-center">
                            <ImageIcon className="w-16 h-16 opacity-30" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-3xl font-semibold mb-6 pb-3 border-b">
                          {currentSlide.content.title || '标题'}
                        </h2>
                        <div className="space-y-4">
                          {currentSlide.content.bulletPoints?.map((point, i) => (
                            <div key={i} className="flex gap-4 text-xl">
                              <span className="text-blue-600">•</span>
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Sidebar - Properties Panel */}
            <div className="w-80 bg-white border-l overflow-y-auto p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Layout className="w-4 h-4" />
                幻灯片属性
              </h3>

              <div className="space-y-6">
                {/* Layout Selection */}
                <div>
                  <Label>布局</Label>
                  <Select
                    value={currentSlide.content.layout}
                    onValueChange={(value: any) => handleUpdateSlide({ layout: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">标题页</SelectItem>
                      <SelectItem value="content">内容页</SelectItem>
                      <SelectItem value="two-column">两栏布局</SelectItem>
                      <SelectItem value="image-text">图文混排</SelectItem>
                      <SelectItem value="blank">空白</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label>标题</Label>
                  <Input
                    value={currentSlide.content.title || ''}
                    onChange={(e) => handleUpdateSlide({ title: e.target.value })}
                    placeholder="输入标题"
                  />
                </div>

                {/* Subtitle (for title layout) */}
                {currentSlide.content.layout === 'title' && (
                  <div>
                    <Label>副标题</Label>
                    <Input
                      value={currentSlide.content.subtitle || ''}
                      onChange={(e) => handleUpdateSlide({ subtitle: e.target.value })}
                      placeholder="输入副标题"
                    />
                  </div>
                )}

                {/* Content (for two-column layout) */}
                {currentSlide.content.layout === 'two-column' && (
                  <div>
                    <Label>内容</Label>
                    <Textarea
                      value={currentSlide.content.content || ''}
                      onChange={(e) => handleUpdateSlide({ content: e.target.value })}
                      placeholder="输入内容"
                      className="min-h-[150px]"
                    />
                  </div>
                )}

                {/* Bullet Points */}
                {currentSlide.content.layout === 'content' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>要点列表</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleAddBulletPoint}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {currentSlide.content.bulletPoints?.map((point, i) => (
                        <div key={i} className="flex gap-2">
                          <Input
                            value={point}
                            onChange={(e) => handleUpdateBulletPoint(i, e.target.value)}
                            placeholder={`要点 ${i + 1}`}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBulletPoint(i)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>背景色</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentSlide.content.backgroundColor || '#FFFFFF'}
                        onChange={(e) =>
                          handleUpdateSlide({ backgroundColor: e.target.value })
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={currentSlide.content.backgroundColor || '#FFFFFF'}
                        onChange={(e) =>
                          handleUpdateSlide({ backgroundColor: e.target.value })
                        }
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>文字色</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={currentSlide.content.textColor || '#000000'}
                        onChange={(e) =>
                          handleUpdateSlide({ textColor: e.target.value })
                        }
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input
                        value={currentSlide.content.textColor || '#000000'}
                        onChange={(e) =>
                          handleUpdateSlide({ textColor: e.target.value })
                        }
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}