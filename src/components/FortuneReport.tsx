// ==========================================
// 运势报告组件
// 展示周报和月报
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Calendar, Download, Share2 } from 'lucide-react';
import {
  generateWeeklyReport,
  generateMonthlyReport,
  getWeekStart,
  getMonthStart,
  type FortuneReport,
} from '../utils/reportGenerator';

interface FortuneReportProps {
  isOpen: boolean;
  onClose: () => void;
  period?: 'week' | 'month';
}

export default function FortuneReport({
  isOpen,
  onClose,
  period: initialPeriod = 'week',
}: FortuneReportProps) {
  const [period, setPeriod] = useState<'week' | 'month'>(initialPeriod);
  const [report, setReport] = useState<FortuneReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadReport();
    }
  }, [isOpen, period]);

  const loadReport = () => {
    setLoading(true);
    try {
      const now = new Date();
      let newReport: FortuneReport | null = null;

      if (period === 'week') {
        const weekStart = getWeekStart(now);
        newReport = generateWeeklyReport(weekStart);
      } else {
        newReport = generateMonthlyReport(now.getFullYear(), now.getMonth() + 1);
      }

      setReport(newReport);
    } catch (error) {
      console.error('生成报告失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: 实现PDF导出
    console.log('导出报告');
  };

  const handleShare = () => {
    // TODO: 实现分享功能
    console.log('分享报告');
  };

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

      {/* 报告面板 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">运势报告</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPeriod('week')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  period === 'week'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                周报
              </button>
              <button
                onClick={() => setPeriod('month')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  period === 'month'
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                月报
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">生成报告中...</p>
            </div>
          ) : !report ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>暂无数据，请先查看一些日期的运势</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 概览卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">平均分</div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {report.avgScore}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">最高分</div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {report.maxScore.score}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">最低分</div>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {report.minScore.score}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">记录天数</div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {report.totalDays}
                  </div>
                </div>
              </div>

              {/* 趋势图（简化版，使用条形图） */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">运势趋势</h3>
                <div className="space-y-2">
                  {report.trend.slice(0, 7).map((item, index) => {
                    const percentage = (item.score / 100) * 100;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-20 text-sm text-gray-600 dark:text-gray-400">
                          {item.date.slice(5)}
                        </div>
                        <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ delay: index * 0.1 }}
                            className={`h-full ${
                              item.score >= 70
                                ? 'bg-green-500'
                                : item.score >= 50
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <div className="w-12 text-sm font-bold text-gray-700 dark:text-gray-300 text-right">
                          {item.score}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 维度统计 */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">维度分析</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(report.dimensionStats).map(([dim, stats]) => (
                    <div
                      key={dim}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {dim === 'career' ? '事业' :
                         dim === 'wealth' ? '财运' :
                         dim === 'romance' ? '情感' :
                         dim === 'health' ? '健康' :
                         dim === 'academic' ? '学业' : '出行'}
                      </div>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {stats.avg}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        最高 {stats.max} / 最低 {stats.min}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 统计摘要 */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4">统计摘要</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-green-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">高分日</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {report.highScoreDays} 天
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendingDown size={24} className="text-red-500" />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">低分日</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {report.lowScoreDays} 天
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 底部操作栏 */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <button
            onClick={handleExport}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Download size={18} />
            导出PDF
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-medium flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            分享
          </button>
        </div>
      </motion.div>
    </div>
  );
}
