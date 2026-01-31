// ==========================================
// 日历页面组件
// ==========================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import CalendarWidget from './CalendarWidget';
import HistoryDrawer from './HistoryDrawer';
import TrendsView from './TrendsView';
import FortuneCompare from './FortuneCompare';
import type { HistoryRecord } from '../utils/historyStorage';

interface CalendarPageProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function CalendarPage({ currentDate, onDateChange }: CalendarPageProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showTrends, setShowTrends] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-24">
      <div className="space-y-4">
        {/* 页面标题 */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">日历</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">查看历史运势与趋势</p>
        </div>

        {/* 日历组件 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
          <CalendarWidget
            currentDate={currentDate}
            onDateSelect={onDateChange}
            getHistoryScore={(dateStr) => {
              try {
                const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
                const record = history.find((h: HistoryRecord) => h.date === dateStr);
                return record ? record.fortune.totalScore : null;
              } catch {
                return null;
              }
            }}
          />
        </div>

        {/* 快捷功能卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={() => setShowHistory(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2"
          >
            <div className="bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-3">
              <Clock size={24} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200">历史记录</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">查看过往运势</span>
          </motion.button>

          <motion.button
            onClick={() => setShowTrends(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2"
          >
            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-full p-3">
              <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200">趋势分析</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">查看运势趋势</span>
          </motion.button>

          <motion.button
            onClick={() => setShowCompare(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2 col-span-2"
          >
            <div className="bg-pink-100 dark:bg-pink-900/30 rounded-full p-3">
              <BarChart3 size={24} className="text-pink-600 dark:text-pink-400" />
            </div>
            <span className="font-bold text-gray-800 dark:text-gray-200">运势对比</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">对比多个日期的运势</span>
          </motion.button>
        </div>
      </div>

      {/* 历史记录抽屉 */}
      <HistoryDrawer
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectDate={(date) => {
          onDateChange(date);
          setShowHistory(false);
        }}
        onCompareClick={() => {
          setShowHistory(false);
          setShowCompare(true);
        }}
      />

      {/* 趋势视图 */}
      <TrendsView
        isOpen={showTrends}
        onClose={() => setShowTrends(false)}
        onSelectDate={(date) => {
          onDateChange(date);
          setShowTrends(false);
        }}
      />

      {/* 运势对比 */}
      <FortuneCompare
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        onSelectDate={(date) => {
          onDateChange(date);
          setShowCompare(false);
        }}
      />
    </div>
  );
}
