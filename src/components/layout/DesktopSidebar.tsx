// ==========================================
// 桌面端左侧边栏导航
// ==========================================

import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  TrendingUp, 
  Sparkles, 
  BookOpen,
  User,
  Settings
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DesktopSidebar() {
  const { t } = useTranslation('ui');
  const location = useLocation();

  const navItems = [
    { to: '/app/fortune/today', icon: Home, label: '今日运势' },
    { to: '/app/plan/calendar', icon: Calendar, label: '日历' },
    { to: '/app/fortune/trends', icon: TrendingUp, label: '趋势' },
    { to: '/app/fortune/ai', icon: Sparkles, label: 'AI咨询' },
    { to: '/app/fortune/knowledge', icon: BookOpen, label: '学堂' },
    { to: '/app/profile', icon: User, label: '我的' },
  ];

  const isActive = (path: string) => {
    if (path === '/app/fortune/today') {
      return location.pathname === '/app/fortune/today' || location.pathname === '/app/today';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-56 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex-col z-30">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">命</span>
          </div>
          <span className="font-bold text-lg">{t('header.title', { defaultValue: '命运日历' })}</span>
        </Link>
      </div>

      {/* 导航链接 */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 底部设置 */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <Link
          to="/app/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition"
        >
          <Settings size={20} />
          <span className="font-medium">设置</span>
        </Link>
      </div>
    </aside>
  );
}
