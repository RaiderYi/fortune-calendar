// ==========================================
// 底部 Tab 导航组件
// ==========================================

import { Home, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'today' | 'calendar' | 'my';

interface BottomNavProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const tabs: { id: TabType; label: string; icon: typeof Home }[] = [
    { id: 'today', label: '今日', icon: Home },
    { id: 'calendar', label: '日历', icon: Calendar },
    { id: 'my', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 safe-area-bottom">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 rounded-t-2xl"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon
                size={22}
                className={`relative z-10 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <span
                className={`text-xs font-medium relative z-10 transition-colors ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
