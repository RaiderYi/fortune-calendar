import { Settings, Sparkles, Clock, TrendingUp, Calendar, Award, Trophy, BookOpen, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { isCheckedInToday, getCheckinStats } from '../utils/checkinStorage';
import { getAchievementStats } from '../utils/achievementStorage';
import { useTheme } from '../contexts/ThemeContext';
import { useState, useEffect } from 'react';

interface HeaderProps {
  userName: string;
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  onTrendsClick: () => void;
  onCalendarClick: () => void;
  onCheckinClick: () => void;
  onAchievementClick: () => void;
  onKnowledgeClick: () => void;
  onAIClick: () => void;
}

export default function Header({ 
  userName, 
  onSettingsClick,
  onHistoryClick,
  onTrendsClick,
  onCalendarClick,
  onCheckinClick,
  onAchievementClick,
  onKnowledgeClick,
  onAIClick
}: HeaderProps) {
  const { effectiveTheme, toggleTheme } = useTheme();
  const [checkedIn, setCheckedIn] = useState(isCheckedInToday());
  const [checkinStats, setCheckinStats] = useState(getCheckinStats());
  const [achievementStats, setAchievementStats] = useState(getAchievementStats());

  useEffect(() => {
    setCheckedIn(isCheckedInToday());
    setCheckinStats(getCheckinStats());
    setAchievementStats(getAchievementStats());
  }, []);

  return (
    <div className="flex items-center justify-between px-5 pt-5 lg:px-0 lg:pt-0">
      <div className="flex items-center gap-2">
        <Sparkles size={20} className="text-yellow-500" />
        <h1 className="text-xl font-black text-gray-800 dark:text-gray-200 lg:text-2xl">
          {userName}，今日如何？
        </h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-3">
        {/* AI 咨询按钮 */}
        <motion.button
          onClick={onAIClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-full transition shadow-lg"
          aria-label="AI 命理咨询"
          title="AI 深度推演"
        >
          <Sparkles size={20} className="text-white" />
        </motion.button>

        {/* 知识库按钮 */}
        <motion.button
          onClick={onKnowledgeClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="八字学堂"
        >
          <BookOpen size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.button>

        {/* 成就按钮 */}
        <motion.button
          onClick={onAchievementClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative"
          aria-label="成就系统"
        >
          <Trophy size={20} className="text-gray-600 dark:text-gray-300" />
          {achievementStats.unlocked > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white"
            >
              {achievementStats.unlocked}
            </motion.div>
          )}
        </motion.button>

        {/* 签到按钮 */}
        <motion.button
          onClick={onCheckinClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`p-2 rounded-full transition relative ${
            checkedIn ? 'bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          aria-label="每日签到"
        >
          <Award size={20} className={checkedIn ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300'} />
          {checkedIn && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white"
            />
          )}
        </motion.button>

        {/* 日历按钮 */}
        <motion.button
          onClick={onCalendarClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="运势日历"
        >
          <Calendar size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.button>
        
        {/* 趋势按钮 */}
        <motion.button
          onClick={onTrendsClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="趋势分析"
        >
          <TrendingUp size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.button>
        
        {/* 历史按钮 */}
        <motion.button
          onClick={onHistoryClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="历史记录"
        >
          <Clock size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.button>
        
        {/* 深色模式切换 */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="切换主题"
        >
          {effectiveTheme === 'dark' ? (
            <Sun size={20} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-600" />
          )}
        </motion.button>

        {/* 设置按钮 */}
        <motion.button
          onClick={onSettingsClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          aria-label="设置"
        >
          <Settings size={20} className="text-gray-600 dark:text-gray-300" />
        </motion.button>
      </div>
    </div>
  );
}
