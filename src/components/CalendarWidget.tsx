// ==========================================
// 简化版日历组件（用于PC端侧边栏常驻显示）
// ==========================================

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalendarWidgetProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  getHistoryScore: (dateStr: string) => number | null;
}

interface DayData {
  date: Date;
  dateStr: string;
  score: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
}

export default function CalendarWidget({
  currentDate,
  onDateSelect,
  getHistoryScore,
}: CalendarWidgetProps) {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [monthDays, setMonthDays] = useState<DayData[]>([]);

  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    
    const days: DayData[] = [];
    
    // 添加上月的日期
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(createDayData(date, false));
    }
    
    // 添加当月日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(createDayData(date, true));
    }
    
    // 添加下月日期
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(createDayData(date, false));
    }
    
    setMonthDays(days);
  }, [viewDate, currentDate]);

  const createDayData = (date: Date, isCurrentMonth: boolean): DayData => {
    const dateStr = formatDate(date);
    const score = getHistoryScore(dateStr);
    const today = new Date();
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    
    return { date, dateStr, score, isToday, isCurrentMonth };
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day: DayData) => {
    if (day.isCurrentMonth) {
      onDateSelect(day.date);
    }
  };

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div>
      {/* 月份导航 */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          onClick={handlePrevMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </motion.button>
        <div className="text-sm font-bold text-gray-800">
          {viewDate.getFullYear()}年 {monthNames[viewDate.getMonth()]}
        </div>
        <motion.button
          onClick={handleNextMonth}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight size={16} className="text-gray-600" />
        </motion.button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-xs font-bold text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* 日期网格 */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, idx) => {
          const isSelected = formatDate(currentDate) === day.dateStr;
          return (
            <motion.button
              key={idx}
              onClick={() => handleDayClick(day)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`aspect-square rounded-lg text-xs flex flex-col items-center justify-center transition ${
                !day.isCurrentMonth
                  ? 'text-gray-300'
                  : day.isToday
                  ? 'bg-indigo-600 text-white font-bold'
                  : isSelected
                  ? 'bg-indigo-100 text-indigo-700 font-bold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{day.date.getDate()}</span>
              {day.score !== null && day.isCurrentMonth && (
                <span className={`text-[8px] mt-0.5 ${
                  day.score >= 80 ? 'text-green-600' :
                  day.score >= 60 ? 'text-yellow-600' : 'text-gray-400'
                }`}>
                  {day.score}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
