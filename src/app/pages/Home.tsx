import { Link } from 'react-router';
import { FileText, Sparkles, Clock, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { storage } from '../utils';
import { useState, useEffect } from 'react';
import { PPTProject } from '../types';

export function Home() {
  const [projects, setProjects] = useState<PPTProject[]>([]);

  useEffect(() => {
    setProjects(storage.getProjects());
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">XX科技 AI PPT</h1>
              <p className="text-xs text-gray-500">智能生成 · 专业呈现</p>
            </div>
          </div>
          
          <Link to="/chat">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Sparkles className="w-4 h-4 mr-2" />
              创建新PPT
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            AI驱动的企业级PPT解决方案
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            5轮对话，生成专业PPT
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            通过AI对话定义目标、受众、内容、风格和格式，
            <br />
            自动生成符合企业规范的可编辑演示文稿
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>AI对话引导</CardTitle>
              <CardDescription>
                智能化五维需求收集，精准理解您的PPT目标
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>可视化编辑</CardTitle>
              <CardDescription>
                PowerPoint风格编辑器，所见即所得的流畅体验
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-blue-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>快速生成</CardTitle>
              <CardDescription>
                30分钟完成原本需要6小时的专业PPT制作
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-gray-900">最近的项目</h3>
            {projects.length > 0 && (
              <span className="text-sm text-gray-500">
                共 {projects.length} 个项目
              </span>
            )}
          </div>

          {projects.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-4">还没有PPT项目</p>
                <Link to="/chat">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="w-4 h-4 mr-2" />
                    创建第一个PPT
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-gray-500">
                        {project.slides.length} 页
                      </span>
                    </div>
                    <CardTitle className="line-clamp-1">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {project.description || project.metadata.objective || '暂无描述'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {formatDate(project.updatedAt)}
                      </span>
                      <Link to={`/editor/${project.id}`}>
                        <Button variant="ghost" size="sm" className="group-hover:bg-blue-50">
                          编辑
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          <p>© 2026 XX科技. 企业级AI PPT生成系统 · 思源黑体 + Inter字体</p>
        </div>
      </footer>
    </div>
  );
}