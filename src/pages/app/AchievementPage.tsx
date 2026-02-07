// ==========================================
// 成就系统 - 功能页
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, Sparkles, Award, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllAchievements, getAchievementStats, type Achievement } from '../../utils/achievementStorage';
import { useTranslation } from 'react-i18next';

const CATEGORY_CONFIG: Record<string, { name: string; nameEn: string; icon: typeof Trophy }> = {
  checkin: { name: '签到', nameEn: 'Check-in', icon: Target },
  usage: { name: '使用', nameEn: 'Usage', icon: Star },
  explore: { name: '探索', nameEn: 'Explore', icon: Sparkles },
  master: { name: '大师', nameEn: 'Master', icon: Trophy },
};

export default function AchievementPage() {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState(getAchievementStats());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    setAchievements(getAllAchievements());
    setStats(getAchievementStats());
  }, []);

  const filteredAchievements = selectedCategory ? achievements.filter((a) => a.category === selectedCategory) : achievements;

  const getCategoryIcon = (category: string) => CATEGORY_CONFIG[category]?.icon || Award;

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F7] dark:bg-slate-900">
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/app/today" className="flex items-center gap-2 text-white/90 hover:text-white">
            <ChevronLeft size={24} />
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                <Trophy size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{isEnglish ? 'Achievements' : '成就系统'}</h2>
                <p className="text-white/90 text-sm">
                  {stats.unlocked} / {stats.total} {isEnglish ? 'unlocked' : '已解锁'}
                </p>
              </div>
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const categoryStats = stats.byCategory[key] || { total: 0, unlocked: 0 };
            const Icon = config.icon;
            return (
              <div key={key} className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
                <Icon size={20} className="mx-auto mb-1" />
                <div className="text-xs opacity-90 mb-1">{isEnglish ? config.nameEn : config.name}</div>
                <div className="text-lg font-bold">
                  {categoryStats.unlocked}/{categoryStats.total}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              selectedCategory === null ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {isEnglish ? 'All' : '全部'}
          </motion.button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedCategory(key)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedCategory === key ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {isEnglish ? config.nameEn : config.name}
            </motion.button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = achievement.unlockedAt !== null;
            const progress = (achievement.progress / achievement.target) * 100;
            const CategoryIcon = getCategoryIcon(achievement.category);

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 border-2 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-300 dark:border-yellow-700'
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`text-4xl shrink-0 ${isUnlocked ? '' : 'grayscale opacity-50'}`}>{achievement.badge}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg ${isUnlocked ? 'text-gray-800 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        {achievement.name}
                      </h3>
                      {isUnlocked && <span className="text-yellow-500">✓</span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{isEnglish ? 'Progress' : '进度'}</span>
                        <span>
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className={`h-full rounded-full ${
                            isUnlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                  <CategoryIcon size={20} className={`shrink-0 ${isUnlocked ? 'text-yellow-600' : 'text-gray-400'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
