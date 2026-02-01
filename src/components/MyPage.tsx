// ==========================================
// 我的页面组件
// ==========================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, BookOpen, MessageSquare, Settings, Trophy, Target, TrendingUp } from 'lucide-react';
import LifeMap from './LifeMap';
import { getCheckinStats } from '../utils/checkinStorage';
import { getAchievementStats } from '../utils/achievementStorage';
import type { UserProfile } from './ProfileSettings';

interface MyPageProps {
  userProfile: UserProfile;
  onSettingsClick: () => void;
  onCheckinClick: () => void;
  onAchievementClick: () => void;
  onKnowledgeClick: () => void;
  onFeedbackClick: () => void;
}

export default function MyPage({
  userProfile,
  onSettingsClick,
  onCheckinClick,
  onAchievementClick,
  onKnowledgeClick,
  onFeedbackClick,
}: MyPageProps) {
  const [showLifeMap, setShowLifeMap] = useState(false);
  const checkinStats = getCheckinStats();
  const achievementStats = getAchievementStats();

  const menuItems = [
    {
      id: 'profile',
      label: '个人档案',
      icon: User,
      color: 'indigo',
      onClick: onSettingsClick,
    },
    {
      id: 'checkin',
      label: '每日签到',
      icon: Target,
      color: 'green',
      onClick: onCheckinClick,
      badge: checkinStats.consecutiveDays > 0 ? `${checkinStats.consecutiveDays}天` : undefined,
    },
    {
      id: 'achievements',
      label: '成就系统',
      icon: Trophy,
      color: 'yellow',
      onClick: onAchievementClick,
      badge: achievementStats.unlocked > 0 ? `${achievementStats.unlocked}/${achievementStats.total}` : undefined,
    },
    {
      id: 'knowledge',
      label: '八字学堂',
      icon: BookOpen,
      color: 'blue',
      onClick: onKnowledgeClick,
    },
    {
      id: 'feedback',
      label: '反馈建议',
      icon: MessageSquare,
      color: 'purple',
      onClick: onFeedbackClick,
    },
    {
      id: 'lifemap',
      label: '人生大图景',
      icon: TrendingUp,
      color: 'purple',
      onClick: () => setShowLifeMap(true),
    },
    {
      id: 'settings',
      label: '设置',
      icon: Settings,
      color: 'gray',
      onClick: onSettingsClick,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; icon: string }> = {
      indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', icon: 'text-indigo-600 dark:text-indigo-400' },
      green: { bg: 'bg-green-100 dark:bg-green-900/30', icon: 'text-green-600 dark:text-green-400' },
      yellow: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: 'text-yellow-600 dark:text-yellow-400' },
      blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', icon: 'text-blue-600 dark:text-blue-400' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', icon: 'text-purple-600 dark:text-purple-400' },
      gray: { bg: 'bg-gray-100 dark:bg-gray-800', icon: 'text-gray-600 dark:text-gray-400' },
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-24">
      <div className="space-y-4">
        {/* 用户信息卡片 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mt-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
              <User size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-white/80 text-sm mt-1">{userProfile.city}</p>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{checkinStats.consecutiveDays}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">连续签到</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{achievementStats.unlocked}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">已解锁成就</div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const colors = getColorClasses(item.color);
            
            return (
              <motion.button
                key={item.id}
                onClick={item.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4"
              >
                <div className={`${colors.bg} rounded-xl p-3`}>
                  <Icon size={20} className={colors.icon} />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-gray-800 dark:text-gray-200">{item.label}</div>
                </div>
                {item.badge && (
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">
                    {item.badge}
                  </div>
                )}
                <div className="text-gray-400 dark:text-gray-500">›</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 人生大图景 */}
      <LifeMap
        isOpen={showLifeMap}
        onClose={() => setShowLifeMap(false)}
        userProfile={userProfile}
      />
    </div>
  );
}
