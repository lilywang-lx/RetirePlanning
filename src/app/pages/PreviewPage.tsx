import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Globe,
  FileDown,
  Check,
  X,
  PlayCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { storage } from '../utils';
import { PPTProject } from '../types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function PreviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<PPTProject | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight' && project && currentIndex < project.slides.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === 'Escape' && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, project, isFullScreen]);

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

  const currentSlide = project.slides[currentIndex];

  const handleExport = (format: 'pptx' | 'html' | 'pdf') => {
    // 模拟导出过程
    toast.success(`正在生成${format.toUpperCase()}文件...`, {
      description: '这是演示模式，实际应用中会生成真实文件',
    });
    
    setTimeout(() => {
      toast.success(`${format.toUpperCase()}文件已生成`, {
        description: `${project.name}.${format}`,
      });
      setShowExportDialog(false);
    }, 2000);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header - only show when not in fullscreen */}
      {!isFullScreen && (
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/editor/${project.id}`}>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <ChevronLeft className="w-4 h-4 mr-1" />
                返回编辑
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold text-white">{project.name}</h1>
              <p className="text-xs text-gray-400">
                第 {currentIndex + 1} / {project.slides.length} 页
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullScreen}
              className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              演示模式
            </Button>
            <Button
              size="sm"
              onClick={() => setShowExportDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              导出发布
            </Button>
          </div>
        </header>
      )}

      {/* Main Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>

        {/* Slide Content */}
        <div className="max-w-6xl w-full">
          <Card className="aspect-[16/9] overflow-hidden shadow-2xl">
            <div
              className="w-full h-full p-16 flex flex-col justify-center transition-all"
              style={{
                backgroundColor: currentSlide.content.backgroundColor || '#FFFFFF',
                color: currentSlide.content.textColor || '#000000',
              }}
            >
              {currentSlide.content.layout === 'title' ? (
                <div className="text-center">
                  <h1 className="text-6xl font-bold mb-6">
                    {currentSlide.content.title || '标题'}
                  </h1>
                  {currentSlide.content.subtitle && (
                    <p className="text-3xl opacity-80">
                      {currentSlide.content.subtitle}
                    </p>
                  )}
                </div>
              ) : currentSlide.content.layout === 'two-column' ? (
                <div>
                  <h2 className="text-4xl font-semibold mb-8 pb-4 border-b">
                    {currentSlide.content.title || '标题'}
                  </h2>
                  <div className="grid grid-cols-2 gap-12">
                    <div className="whitespace-pre-wrap text-2xl leading-relaxed">
                      {currentSlide.content.content}
                    </div>
                    <div className="bg-white/10 rounded-lg p-8 flex items-center justify-center">
                      <FileText className="w-24 h-24 opacity-30" />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-4xl font-semibold mb-8 pb-4 border-b">
                    {currentSlide.content.title || '标题'}
                  </h2>
                  <div className="space-y-6">
                    {currentSlide.content.bulletPoints?.map((point, i) => (
                      <div key={i} className="flex gap-6 text-2xl items-start">
                        <span className="text-blue-600 font-bold flex-shrink-0">•</span>
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Next Button */}
        <Button
          variant="ghost"
          size="lg"
          onClick={() =>
            setCurrentIndex(Math.min(project.slides.length - 1, currentIndex + 1))
          }
          disabled={currentIndex === project.slides.length - 1}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>

        {/* Slide Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {project.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Exit fullscreen hint */}
        {isFullScreen && (
          <div className="absolute top-4 right-4 text-white text-sm bg-black/50 px-4 py-2 rounded-lg">
            按 ESC 退出演示模式
          </div>
        )}
      </div>

      {/* Thumbnail Strip - only show when not in fullscreen */}
      {!isFullScreen && (
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <div className="max-w-6xl mx-auto flex gap-4 overflow-x-auto">
            {project.slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-32 border-2 rounded overflow-hidden transition-all ${
                  currentIndex === index
                    ? 'border-blue-500 ring-2 ring-blue-300'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div
                  className="aspect-[16/9] p-2 flex flex-col justify-center text-[8px]"
                  style={{
                    backgroundColor: slide.content.backgroundColor || '#FFFFFF',
                    color: slide.content.textColor || '#000000',
                  }}
                >
                  {slide.content.layout === 'title' ? (
                    <div className="text-center">
                      <div className="font-semibold line-clamp-2">
                        {slide.content.title}
                      </div>
                    </div>
                  ) : (
                    <div className="line-clamp-3">{slide.content.title}</div>
                  )}
                </div>
                <div className="bg-gray-700 px-2 py-1 text-[10px] text-gray-300 text-center">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>导出和发布</DialogTitle>
            <DialogDescription>
              选择您需要的输出格式。所有格式均兼容企业级应用场景。
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <Card
              className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => handleExport('pptx')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <FileDown className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">PowerPoint (PPTX)</CardTitle>
                    <p className="text-sm text-gray-500">
                      可编辑格式，兼容 PowerPoint / WPS / Keynote
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => handleExport('html')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">网页 (HTML)</CardTitle>
                    <p className="text-sm text-gray-500">
                      交互式网页，可直接在浏览器中演示
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:border-blue-500 hover:shadow-md transition-all"
              onClick={() => handleExport('pdf')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">PDF文档</CardTitle>
                    <p className="text-sm text-gray-500">
                      通用格式，便于打印和分享
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Check className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">纯前端演示模式</p>
                <p className="text-blue-700">
                  当前为模拟导出功能。实际应用中将生成真实的可编辑文件。
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
