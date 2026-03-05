// 主布局组件：双栏布局
import { Outlet, Link, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { Bell, Menu, X, ChevronLeft, User } from 'lucide-react';
import { navigationItems } from '../../routes-health';
import ComplianceBanner from './ComplianceBanner';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { conversationStorage, initializeDemoData } from '../../utils/health-storage';

export default function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // 初始化演示数据
  useEffect(() => {
    initializeDemoData();
    
    // 计算未读消息数
    const conversations = conversationStorage.getAll();
    const total = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    setUnreadCount(total);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 全局合规提示 */}
      <ComplianceBanner />

      <div className="flex">
        {/* 左侧导航栏 - 桌面端 */}
        <aside
          className={`
            hidden lg:block bg-white border-r border-gray-200 transition-all duration-300 sticky top-[52px] h-[calc(100vh-52px)]
            ${sidebarOpen ? 'w-64' : 'w-20'}
          `}
        >
          {/* 顶部切换按钮 */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            {sidebarOpen && <span className="font-semibold text-gray-900">菜单</span>}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const showBadge = item.badge && unreadCount > 0;

              return (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="font-medium">{item.label}</span>
                    )}
                    {showBadge && (
                      <Badge className="ml-auto bg-red-500">{unreadCount}</Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* 移动端侧边栏 */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setMobileMenuOpen(false)}>
            <aside className="bg-white w-64 h-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-900">菜单</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const showBadge = item.badge && unreadCount > 0;

                  return (
                    <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                      <div
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative
                          ${isActive 
                            ? 'bg-blue-50 text-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium">{item.label}</span>
                        {showBadge && (
                          <Badge className="ml-auto bg-red-500">{unreadCount}</Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </aside>
          </div>
        )}

        {/* 主内容区 */}
        <main className="flex-1 relative">
          {/* 移动端菜单按钮 */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden fixed top-[60px] left-4 z-30 bg-white shadow-md"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}