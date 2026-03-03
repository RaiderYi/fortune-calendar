// ==========================================
// 底部 Tab 导航组件 - 重构版
// 三层结构: 运势 / 规划 / 我的
// ==========================================

import { Link, useLocation } from 'react-router-dom';
import { Sparkles, CalendarDays, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export type MainTabType = 'fortune' | 'plan' | 'profile';

const tabToPath: Record<MainTabType, string> = {
  fortune: '/app/fortune/today',
  plan: '/app/plan/calendar',
  profile: '/app/profile',
};

const getTabFromPath = (pathname: string): MainTabType => {
  if (pathname.startsWith('/app/fortune') || pathname === '/app/today') {
    return 'fortune';
  }
  if (pathname.startsWith('/app/plan') || pathname === '/app/calendar') {
    return 'plan';
  }
  if (pathname.startsWith('/app/profile') || pathname === '/app/me') {
    return 'profile';
  }
  // 默认回到 fortune
  return 'fortune';
};

export default function BottomNav() {
  const { t } = useTranslation('common');
  const location = useLocation();
  
  // 根据当前路径确定活跃tab（优先使用传入的props，但可根据路径校正）
  const activeTab = getTabFromPath(location.pathname);
  
  const tabs: { id: MainTabType; label: string; icon: typeof Sparkles }[] = [
    { id: 'fortune', label: t('nav.fortune'), icon: Sparkles },
    { id: 'plan', label: t('nav.plan'), icon: CalendarDays },
    { id: 'profile', label: t('nav.profile'), icon: UserCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const to = tabToPath[tab.id];
          const isActive = activeTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              to={to}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeMainTab"
                  className="absolute inset-0 bg-gradient-to-t from-indigo-50 to-transparent dark:from-indigo-900/20 dark:to-transparent"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`
                relative z-10 p-1.5 rounded-full transition-all duration-200
                ${isActive 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40' 
                  : ''
                }
              `}>
                <Icon
                  size={22}
                  className={`transition-colors ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-medium relative z-10 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// 辅助函数：判断路径是否属于某个主分类
export const isFortunePath = (pathname: string): boolean => {
  return pathname.startsWith('/app/fortune') || 
         pathname === '/app/today' ||
         pathname === '/app/trends' ||
         pathname === '/app/ai' ||
         pathname === '/app/knowledge' ||
         pathname.startsWith('/app/history') ||
         pathname.startsWith('/app/lifemap');
};

export const isPlanPath = (pathname: string): boolean => {
  return pathname.startsWith('/app/plan') || 
         pathname === '/app/calendar' ||
         pathname === '/app/datepicker' ||
         pathname === '/app/checkin' ||
         pathname === '/app/diary';
};

export const isProfilePath = (pathname: string): boolean => {
  return pathname.startsWith('/app/profile') || 
         pathname === '/app/me' ||
         pathname === '/app/achievements' ||
         pathname === '/app/fortune-stick';
};
