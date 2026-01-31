// ==========================================
// 成就展示组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Trophy, Star, Target, Sparkles } from 'lucide-react';
import {
  getAllAchievements,
  getAchievementStats,
  type Achievement,
} from '../utils/achievementStorage';

interface AchievementViewProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_CONFIG = {
  checkin: { name: '签到', icon: Target, color: 'from-green-500 to-emerald-600' },
  usage: { name: '使用', icon: Star, color: 'from-blue-500 to-cyan-600' },
  explore: { name: '探索', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
  master: { name: '大师', icon: Trophy, color: 'from-orange-500 to-red-600' },
};

export default function AchievementView({ isOpen, onClose }: AchievementViewProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState(getAchievementStats());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAchievements(getAllAchievements());
      setStats(getAchievementStats());
    }
  }, [isOpen]);

  const filteredAchievements = selectedCategory
    ? achievements.filter(a => a.category === selectedCategory)
    : achievements;

  const getCategoryIcon = (category: string) => {
    const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
    return config ? config.icon : Award;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 成就展示抽屉/Modal - 移动端底部抽屉，PC端居中Modal */}
          <motion.div
            initial={{ y: '100%', scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-4 bg-white lg:bg-transparent rounded-t-3xl lg:rounded-3xl shadow-2xl z-[90] max-h-[90vh] lg:max-w-4xl lg:w-full overflow-hidden flex flex-col pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white lg:rounded-3xl lg:shadow-2xl lg:w-full lg:max-h-[90vh] flex flex-col overflow-hidden"
            >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">成就系统</h2>
                    <p className="text-white/90 text-sm">
                      已解锁 {stats.unlocked} / {stats.total} 个成就
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X size={20} className="text-white" />
                </motion.button>
              </div>

              {/* 统计卡片 */}
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
                  const categoryStats = stats.byCategory[key] || { total: 0, unlocked: 0 };
                  const Icon = config.icon;
                  return (
                    <div
                      key={key}
                      className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center"
                    >
                      <Icon size={20} className="mx-auto mb-1" />
                      <div className="text-xs opacity-90 mb-1">{config.name}</div>
                      <div className="text-lg font-bold">
                        {categoryStats.unlocked}/{categoryStats.total}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="p-4 border-b border-gray-200 flex gap-2 overflow-x-auto">
              <motion.button
                onClick={() => setSelectedCategory(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === null
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                全部
              </motion.button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <motion.button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                    selectedCategory === key
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {config.name}
                </motion.button>
              ))}
            </div>

            {/* 成就列表 */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-3">
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
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* 徽章 */}
                        <div
                          className={`text-4xl shrink-0 ${
                            isUnlocked ? '' : 'grayscale opacity-50'
                          }`}
                        >
                          {achievement.badge}
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-bold text-lg ${
                                isUnlocked ? 'text-gray-800' : 'text-gray-500'
                              }`}
                            >
                              {achievement.name}
                            </h3>
                            {isUnlocked && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-yellow-500"
                              >
                                ✓
                              </motion.div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {achievement.description}
                          </p>

                          {/* 进度条 */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>进度</span>
                              <span>
                                {achievement.progress} / {achievement.target}
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5 }}
                                className={`h-full rounded-full ${
                                  isUnlocked
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                                    : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                                }`}
                              />
                            </div>
                          </div>
                        </div>

                        {/* 分类图标 */}
                        <div className="shrink-0">
                          <CategoryIcon
                            size={20}
                            className={isUnlocked ? 'text-yellow-600' : 'text-gray-400'}
                          />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
