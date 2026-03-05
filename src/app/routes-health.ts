import { Home, Users, MessageSquare, Settings } from 'lucide-react';
import { createBrowserRouter } from 'react-router';
import DashboardPage from './pages/health/DashboardPage';
import ProfilesPage from './pages/health/ProfilesPage';
import ChatPage from './pages/health/ChatPage';
import SettingsPage from './pages/health/SettingsPage';
import MainLayout from './components/health/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: 'profiles', Component: ProfilesPage },
      { path: 'chat', Component: ChatPage },
      { path: 'chat/:conversationId', Component: ChatPage },
      { path: 'settings', Component: SettingsPage },
    ],
  },
]);

// 导航配置
export const navigationItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/profiles', label: '健康档案', icon: Users },
  { path: '/chat', label: 'AI对话', icon: MessageSquare, badge: true },
  { path: '/settings', label: '设置', icon: Settings },
];