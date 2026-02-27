import { createBrowserRouter } from 'react-router';
import { WelcomePage } from './pages/retirement/WelcomePage';
import { ChatInputPage } from './pages/retirement/ChatInputPage';
import { DashboardPage } from './pages/retirement/DashboardPage';
import { ActionPlanPage } from './pages/retirement/ActionPlanPage';
import { ProgressPage } from './pages/retirement/ProgressPage';
import { FinancialAssessmentPage } from './pages/financial/AssessmentPage';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: WelcomePage,
  },
  {
    path: '/retirement',
    Component: WelcomePage,
  },
  {
    path: '/retirement/input',
    Component: ChatInputPage,
  },
  {
    path: '/retirement/dashboard',
    Component: DashboardPage,
  },
  {
    path: '/retirement/action',
    Component: ActionPlanPage,
  },
  {
    path: '/retirement/progress',
    Component: ProgressPage,
  },
  // 养老财务评估系统
  {
    path: '/financial',
    Component: FinancialAssessmentPage,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);