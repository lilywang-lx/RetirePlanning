import { Link } from 'react-router';
import { Home, FileQuestion } from 'lucide-react';
import { Button } from '../components/ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
          <FileQuestion className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">页面未找到</h1>
        <p className="text-xl text-gray-600 mb-8">
          抱歉，您访问的页面不存在
        </p>
        <Link to="/">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Home className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
    </div>
  );
}
