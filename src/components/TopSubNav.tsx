// ==========================================
// 顶部子导航组件 - 支持移动端和桌面端
// 移动端：顶部横向滚动
// 桌面端：左侧垂直导航
// ==========================================

import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, TrendingUp, MessageCircle, BookOpen, CalendarDays, Target, BookHeart, CheckCircle, UserCircle, Settings, Trophy } from 'lucide-react';

export type MainCategory = 'fortune' | 'plan' | 'profile';
export type SubTab = 'today' | 'trends' | 'ai' | 'knowledge' | 'calendar' | 'datepicker' | 'diary' | 'checkin';

interface SubNavItem {
  id: SubTab;
  label: string;
  icon: typeof Sparkles;
  path: string;
}

interface TopSubNavProps {
  category: MainCategory;
}

const subNavConfig: Record<MainCategory, SubNavItem[]> = {
  fortune: [
    { id: 'today', label: 'sub.today', icon: Sparkles, path: '/app/fortune/today' },
    { id: 'trends', label: 'sub.trends', icon: TrendingUp, path: '/app/fortune/trends' },
    { id: 'ai', label: 'sub.ai', icon: MessageCircle, path: '/app/fortune/ai' },
    { id: 'knowledge', label: 'sub.knowledge', icon: BookOpen, path: '/app/fortune/knowledge' },
  ],
  plan: [
    { id: 'calendar', label: 'sub.calendar', icon: CalendarDays, path: '/app/plan/calendar' },
    { id: 'datepicker', label: 'sub.datepicker', icon: Target, path: '/app/plan/datepicker' },
    { id: 'diary', label: 'sub.diary', icon: BookHeart, path: '/app/plan/diary' },
    { id: 'checkin', label: 'sub.checkin', icon: CheckCircle, path: '/app/plan/checkin' },
  ],
  profile: [
    { id: 'profile', label: 'sub.profile', icon: UserCircle, path: '/app/profile' },
    { id: 'achievements', label: 'sub.achievements', icon: Trophy, path: '/app/achievements' },
    { id: 'fortune-stick', label: 'sub.fortuneStick', icon: Sparkles, path: '/app/fortune-stick' },
  ],
};

export default function TopSubNav({ category }: TopSubNavProps) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();

  const items = subNavConfig[category];
  
  // 如果没有导航项，不显示
  if (items.length === 0) {
    return null;
  }

  const currentPath = location.pathname;

  return (
    <>
      {/* 移动端：顶部横向导航 */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  relative flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium
                  whitespace-nowrap transition-all duration-200
                  ${isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubTabMobile"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={16} className="relative z-10" />
                <span className="relative z-10">{t(item.label)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 桌面端：左侧垂直导航 */}
      <div className="hidden lg:block fixed left-0 top-16 bottom-0 w-56 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-gray-700 z-30 overflow-y-auto">
        <div className="p-4 space-y-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            {category === 'fortune' ? t('nav.fortune') : category === 'plan' ? t('nav.plan') : t('nav.profile')}
          </h3>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || currentPath.startsWith(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubTabDesktop"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className={`
                  p-2 rounded-lg
                  ${isActive 
                    ? 'bg-indigo-100 dark:bg-indigo-800/50' 
                    : 'bg-gray-100 dark:bg-slate-700'
                  }
                `}>
                  <Icon size={18} className="relative z-10" />
                </div>
                <span className="relative z-10">{t(item.label)}</span>
                
                {/* 活跃指示器 - 右侧圆点 */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute right-3 w-2 h-2 bg-indigo-500 rounded-full"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
        
        {/* 底部提示 */}
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {t('common:nav.switchCategory')}
          </p>
        </div>
      </div>
    </>
  );
}
