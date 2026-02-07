// ==========================================
// 快捷操作右侧栏 - 分组 + 网格布局，适合网页交互
// ==========================================

import { motion } from 'framer-motion';
import {
  Target,
  Trophy,
  Clock,
  TrendingUp,
  BookOpen,
  Sparkles,
  Mail,
  Loader2,
  Share2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAchievementStats } from '../utils/achievementStorage';

interface QuickActionsSidebarProps {
  onCheckin: () => void;
  onAchievements: () => void;
  onHistory: () => void;
  onTrends: () => void;
  onKnowledge: () => void;
  onAIDeduction: () => void;
  onLifeMap: () => void;
  onContact: () => void;
  onGenerateImage: () => void;
  isGenerating: boolean;
  hasFortune: boolean;
}

export default function QuickActionsSidebar({
  onCheckin,
  onAchievements,
  onHistory,
  onTrends,
  onKnowledge,
  onAIDeduction,
  onLifeMap,
  onContact,
  onGenerateImage,
  isGenerating,
  hasFortune,
}: QuickActionsSidebarProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const achievementStats = getAchievementStats();

  const actionBtn =
    'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';

  return (
    <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
      {/* 成就统计卡片 */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
          {t('ui:desktop.achievementProgress')}
        </h3>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {achievementStats.unlocked}/{achievementStats.total}
          </span>
          <motion.button
            onClick={onAchievements}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${actionBtn} bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 text-indigo-600 dark:text-indigo-400`}
          >
            {t('ui:desktop.viewAllAchievements')}
          </motion.button>
        </div>
      </div>

      {/* 今日工具 - 2x2 网格 */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
          {isEnglish ? 'Today' : '今日工具'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={onCheckin}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${actionBtn} bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400`}
          >
            <Target size={18} />
            {t('ui:menu.checkin')}
          </motion.button>
          <motion.button
            onClick={onTrends}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${actionBtn} bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400`}
          >
            <TrendingUp size={18} />
            {t('ui:header.trendAnalysis')}
          </motion.button>
          <motion.button
            onClick={onHistory}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${actionBtn} bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400`}
          >
            <Clock size={18} />
            {t('ui:menu.history')}
          </motion.button>
          <motion.button
            onClick={onKnowledge}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${actionBtn} bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400`}
          >
            <BookOpen size={18} />
            {t('ui:menu.knowledge')}
          </motion.button>
        </div>
      </div>

      {/* 深度分析 */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">
          {isEnglish ? 'Deep Analysis' : '深度分析'}
        </h3>
        <div className="space-y-2">
          <motion.button
            onClick={onAIDeduction}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-3 rounded-xl text-sm font-medium shadow-lg transition"
          >
            <Sparkles size={20} />
            {t('ui:header.aiConsult')}
          </motion.button>
          <motion.button
            onClick={onLifeMap}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full ${actionBtn} bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400`}
          >
            <TrendingUp size={18} />
            {t('ui:menu.lifemap')}
          </motion.button>
        </div>
      </div>

      {/* 支持 */}
      <motion.button
        onClick={onContact}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full ${actionBtn} bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400`}
      >
        <Mail size={18} />
        {t('ui:menu.contact')}
      </motion.button>

      {/* 生成日签 */}
      <motion.button
        onClick={onGenerateImage}
        disabled={isGenerating || !hasFortune}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-4 py-3 rounded-xl shadow-lg font-bold transition hover:bg-black dark:hover:bg-slate-600 disabled:opacity-70"
      >
        {isGenerating ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Share2 size={18} />
        )}
        {isGenerating ? t('ui:todayPage.generating') : t('ui:todayPage.generateSign')}
      </motion.button>
    </div>
  );
}
