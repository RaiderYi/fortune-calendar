// ==========================================
// 自定义日期选择器组件
// ==========================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DatePickerProps {
  isOpen: boolean;
  onClose: () => void;
  value: Date;
  onSelect: (date: Date) => void;
}

export default function DatePicker({
  isOpen,
  onClose,
  value,
  onSelect
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value);
  const [viewMode, setViewMode] = useState<'date' | 'month' | 'year'>('date');
  const [currentYear, setCurrentYear] = useState(value.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(value.getMonth());
  const yearListRef = useRef<HTMLDivElement>(null);

  // 更新选中日期
  useEffect(() => {
    setSelectedDate(value);
    setCurrentYear(value.getFullYear());
    setCurrentMonth(value.getMonth());
  }, [value]);

  // 生成年份列表（1900-2030）
  const generateYears = () => {
    const years = [];
    for (let i = 1900; i <= 2030; i++) {
      years.push(i);
    }
    return years;
  };

  // 生成月份列表
  const generateMonths = () => {
    return [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
  };

  // 获取月份天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 生成日期网格
  const generateDateGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // 填充空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 填充日期
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // 选择日期
  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onSelect(newDate);
    onClose();
  };

  // 选择月份
  const handleMonthSelect = (month: number) => {
    setCurrentMonth(month);
    setViewMode('date');
  };

  // 选择年份
  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setViewMode('month');
  };

  // 上一个月
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // 下一个月
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // 滚动到当前年份
  useEffect(() => {
    if (viewMode === 'year' && yearListRef.current) {
      const yearIndex = currentYear - 1900;
      const yearElement = yearListRef.current.children[yearIndex] as HTMLElement;
      if (yearElement) {
        yearElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [viewMode, currentYear]);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth === selectedDate.getMonth() &&
      currentYear === selectedDate.getFullYear()
    );
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
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 日期选择器 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[70] max-h-[80vh] overflow-hidden flex flex-col"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-indigo-600" />
                <h3 className="text-lg font-bold">选择日期</h3>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} className="text-gray-500" />
              </motion.button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-4">
              {viewMode === 'date' && (
                <>
                  {/* 年月选择栏 */}
                  <div className="flex items-center justify-between mb-4">
                    <motion.button
                      onClick={handlePrevMonth}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronLeft size={20} />
                    </motion.button>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => setViewMode('year')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-lg font-bold text-gray-800 hover:bg-gray-100 rounded-lg"
                      >
                        {currentYear}年
                      </motion.button>
                      <motion.button
                        onClick={() => setViewMode('month')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-lg font-bold text-gray-800 hover:bg-gray-100 rounded-lg"
                      >
                        {currentMonth + 1}月
                      </motion.button>
                    </div>
                    <motion.button
                      onClick={handleNextMonth}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <ChevronRight size={20} />
                    </motion.button>
                  </div>

                  {/* 星期标题 */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['日', '一', '二', '三', '四', '五', '六'].map((day, idx) => (
                      <div key={idx} className="text-center text-xs font-bold text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* 日期网格 */}
                  <div className="grid grid-cols-7 gap-1">
                    {generateDateGrid().map((day, idx) => (
                      <div key={idx} className="aspect-square">
                        {day ? (
                          <motion.button
                            onClick={() => handleDateSelect(day)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-full h-full rounded-lg text-sm font-medium transition-colors ${
                              isSelected(day)
                                ? 'bg-indigo-600 text-white'
                                : isToday(day)
                                ? 'bg-indigo-100 text-indigo-600 font-bold'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {day}
                          </motion.button>
                        ) : (
                          <div />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {viewMode === 'month' && (
                <div className="grid grid-cols-3 gap-3">
                  {generateMonths().map((month, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleMonthSelect(idx)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-xl text-base font-medium transition-colors ${
                        currentMonth === idx
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {month}
                    </motion.button>
                  ))}
                </div>
              )}

              {viewMode === 'year' && (
                <div
                  ref={yearListRef}
                  className="max-h-[50vh] overflow-y-auto space-y-1"
                >
                  {generateYears().map((year) => (
                    <motion.button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-xl text-base font-medium transition-colors ${
                        currentYear === year
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {year}年
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
