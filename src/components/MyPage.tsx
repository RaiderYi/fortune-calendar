// ==========================================
// 我的页面组件
// ==========================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, BookOpen, MessageSquare, Settings, Trophy, Target, TrendingUp, Mail, LogIn, LogOut, Cloud, Bell } from 'lucide-react';
import LifeMap from './LifeMap';
import ContactModal from './ContactModal';
import LoginModal from './LoginModal';
import { getCheckinStats } from '../utils/checkinStorage';
import { getAchievementStats } from '../utils/achievementStorage';
import { useAuth } from '../contexts/AuthContext';
import type { UserProfile } from './ProfileSettings';
import { useTranslation } from 'react-i18next';

interface MyPageProps {
  userProfile: UserProfile;
  onSettingsClick: () => void;
  onCheckinClick: () => void;
  onAchievementClick: () => void;
  onKnowledgeClick: () => void;
  onFeedbackClick: () => void;
  onReportClick?: () => void;
  onDiaryReviewClick?: () => void;
  onDeveloperDashboardClick?: () => void;
}

export default function MyPage({
  userProfile,
  onSettingsClick,
  onCheckinClick,
  onAchievementClick,
  onKnowledgeClick,
  onFeedbackClick,
  onReportClick,
  onDiaryReviewClick,
  onDeveloperDashboardClick,
}: MyPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const [showLifeMap, setShowLifeMap] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const checkinStats = getCheckinStats();
  const achievementStats = getAchievementStats();
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    // 登录/登出（放在最前面）
    !isAuthenticated ? {
      id: 'login',
      label: isEnglish ? 'Login / Register' : '登录 / 注册',
      icon: LogIn,
      color: 'indigo',
      onClick: () => setShowLogin(true),
      highlight: true,
    } : null,
    {
      id: 'profile',
      label: t('menu.profile'),
      icon: User,
      color: 'indigo',
      onClick: onSettingsClick,
    },
    // 云同步（仅登录后显示）
    isAuthenticated ? {
      id: 'cloud',
      label: isEnglish ? 'Cloud Sync' : '云端同步',
      icon: Cloud,
      color: 'blue',
      onClick: () => {/* TODO: 打开同步设置 */},
      badge: isEnglish ? 'Synced' : '已同步',
    } : null,
    {
      id: 'checkin',
      label: t('menu.checkin'),
      icon: Target,
      color: 'green',
      onClick: onCheckinClick,
      badge: checkinStats.consecutiveDays > 0 ? `${checkinStats.consecutiveDays}${isEnglish ? ' days' : '天'}` : undefined,
    },
    {
      id: 'achievements',
      label: t('menu.achievements'),
      icon: Trophy,
      color: 'yellow',
      onClick: onAchievementClick,
      badge: achievementStats.unlocked > 0 ? `${achievementStats.unlocked}/${achievementStats.total}` : undefined,
    },
    {
      id: 'knowledge',
      label: t('menu.knowledge'),
      icon: BookOpen,
      color: 'blue',
      onClick: onKnowledgeClick,
    },
    {
      id: 'feedback',
      label: t('menu.feedback'),
      icon: MessageSquare,
      color: 'purple',
      onClick: onFeedbackClick,
    },
    onReportClick ? {
      id: 'report',
      label: isEnglish ? 'Fortune Report' : '运势报告',
      icon: FileText,
      color: 'purple',
      onClick: onReportClick,
    } : null,
    onDiaryReviewClick ? {
      id: 'diary',
      label: isEnglish ? 'Diary Review' : '日记回顾',
      icon: BookOpen,
      color: 'indigo',
      onClick: onDiaryReviewClick,
    } : null,
    onDeveloperDashboardClick ? {
      id: 'developer',
      label: isEnglish ? 'Developer Dashboard' : '开发者统计',
      icon: BarChart3,
      color: 'gray',
      onClick: onDeveloperDashboardClick,
      highlight: true,
    } : null,
    {
      id: 'contact',
      label: t('menu.contact'),
      icon: Mail,
      color: 'blue',
      onClick: () => setShowContact(true),
    },
    {
      id: 'lifemap',
      label: t('menu.lifemap'),
      icon: TrendingUp,
      color: 'purple',
      onClick: () => setShowLifeMap(true),
    },
    {
      id: 'settings',
      label: t('menu.settings'),
      icon: Settings,
      color: 'gray',
      onClick: onSettingsClick,
    },
    // 登出（仅登录后显示）
    isAuthenticated ? {
      id: 'logout',
      label: isEnglish ? 'Logout' : '退出登录',
      icon: LogOut,
      color: 'gray',
      onClick: logout,
    } : null,
  ].filter(Boolean) as Array<{
    id: string;
    label: string;
    icon: any;
    color: string;
    onClick: () => void;
    badge?: string;
    highlight?: boolean;
  }>;

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
              <h2 className="text-2xl font-bold">
                {isAuthenticated && user ? user.name : userProfile.name}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {isAuthenticated && user?.email ? user.email : userProfile.city}
              </p>
              {isAuthenticated && (
                <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                  <Cloud size={12} />
                  {isEnglish ? 'Synced' : '已同步'}
                </span>
              )}
            </div>
            {!isAuthenticated && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowLogin(true)}
                className="bg-white text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm"
              >
                {isEnglish ? 'Login' : '登录'}
              </motion.button>
            )}
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{checkinStats.consecutiveDays}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isEnglish ? 'Consecutive Days' : '连续签到'}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{achievementStats.unlocked}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{isEnglish ? 'Achievements Unlocked' : '已解锁成就'}</div>
          </div>
        </div>

        {/* 功能菜单 */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const colors = getColorClasses(item.color);
            const isHighlight = 'highlight' in item && item.highlight;
            
            return (
              <motion.button
                key={item.id}
                onClick={item.onClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-2xl shadow-sm border flex items-center gap-4 ${
                  isHighlight
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 border-indigo-400 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                }`}
              >
                <div className={isHighlight ? 'bg-white/20 rounded-xl p-3' : `${colors.bg} rounded-xl p-3`}>
                  <Icon size={20} className={isHighlight ? 'text-white' : colors.icon} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-bold ${isHighlight ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
                    {item.label}
                  </div>
                </div>
                {item.badge && (
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    isHighlight
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  }`}>
                    {item.badge}
                  </div>
                )}
                <div className={isHighlight ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}>›</div>
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

      {/* 联系我们 */}
      <ContactModal
        isOpen={showContact}
        onClose={() => setShowContact(false)}
      />

      {/* 登录/注册 */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </div>
  );
}
