// ==========================================
// 日记回顾组件
// 分析运势与实际情况的对比
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, X } from 'lucide-react';
import {
  getDiaryEntries,
  getDiaryStats,
  type DiaryEntry,
} from '../utils/diaryStorage';

interface DiaryReviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DiaryReview({ isOpen, onClose }: DiaryReviewProps) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getDiaryStats> | null>(null);

  useEffect(() => {
    if (isOpen) {
      const allEntries = getDiaryEntries();
      setEntries(allEntries);
      setStats(getDiaryStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 遮罩层 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* 回顾面板 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">日记回顾</h2>
              <p className="text-white/90 text-sm">分析运势预测的准确性</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {!stats ? (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无数据，请先记录一些日记</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 统计卡片 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={24} className="text-green-600" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">高分日准确率</div>
                  </div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.highScoreAccuracy}%
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingDown size={24} className="text-red-600" />
                    <div className="text-sm text-gray-600 dark:text-gray-400">低分日准确率</div>
                  </div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.lowScoreAccuracy}%
                  </div>
                </div>
              </div>

              {/* 心情分布 */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">心情分布</h3>
                <div className="space-y-3">
                  {Object.entries(stats.moodCounts).map(([mood, count]) => (
                    <div key={mood} className="flex items-center justify-between">
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        {mood === 'happy' ? '开心' :
                         mood === 'excited' ? '兴奋' :
                         mood === 'neutral' ? '平静' :
                         mood === 'sad' ? '难过' : '焦虑'}
                      </div>
                      <div className="flex items-center gap-3 flex-1 mx-4">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(count / stats.total) * 100}%`,
                            }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12 text-right">
                          {count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 准确性统计 */}
              {Object.keys(stats.accuracyCounts).length > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                  <h3 className="text-lg font-bold mb-4">预测准确性</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(stats.accuracyCounts).map(([accuracy, count]) => (
                      <div
                        key={accuracy}
                        className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                          {count}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {accuracy === 'accurate' ? '准确' :
                           accuracy === 'inaccurate' ? '不准确' : '一般'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 最近日记列表 */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">最近日记</h3>
                <div className="space-y-3">
                  {entries.slice(0, 5).map((entry) => (
                    <div
                      key={entry.date}
                      className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {entry.date}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          运势: {entry.fortuneScore}分
                        </div>
                      </div>
                      {entry.events.length > 0 && (
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {entry.events[0]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
