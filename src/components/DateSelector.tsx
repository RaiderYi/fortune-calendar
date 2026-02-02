import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Home, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface DateSelectorProps {
  currentDate: Date;
  weekDay?: string;
  lunarStr?: string;
  onPrevDay: () => void;
  onNextDay: () => void;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({
  currentDate,
  weekDay,
  lunarStr,
  onPrevDay,
  onNextDay,
  onDateChange
}: DateSelectorProps) {
  const { t, i18n } = useTranslation(['ui']);
  const isEnglish = i18n.language === 'en';

  // 格式化日期为 YYYY-MM-DD 供 input 使用
  const formattedDateValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  // 处理日期选择器输入
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 修复时区问题，直接解析 YYYY-MM-DD
    const [y, m, d] = e.target.value.split('-').map(Number);
    if (y && m && d) {
      const newDate = new Date(y, m - 1, d);
      onDateChange(newDate);
    }
  };

  // 检查是否是今天
  const isToday = (() => {
    const today = new Date();
    return (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getDate() === today.getDate()
    );
  })();

  // 跳转到今天
  const handleGoToToday = () => {
    onDateChange(new Date());
  };

  // 快捷菜单状态
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 快捷日期选项
  const quickOptions = [
    { label: t('ui:dateSelector.yesterday'), days: -1 },
    { label: t('ui:dateSelector.weekAgo'), days: -7 },
    { label: t('ui:dateSelector.monthAgo'), days: -30 },
    { label: t('ui:dateSelector.threeMonthsAgo'), days: -90 },
  ];

  // 处理快捷跳转
  const handleQuickJump = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
    setShowQuickMenu(false);
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowQuickMenu(false);
      }
    };

    if (showQuickMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showQuickMenu]);

  return (
    <div className="flex flex-col px-6 py-2 lg:px-0 lg:py-3 relative">
      <div className="flex items-center justify-between">
        <motion.button
          onClick={onPrevDay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-800 p-2"
          aria-label={t('ui:dateSelector.prevDay')}
        >
          <ChevronLeft />
        </motion.button>

        <div className="flex flex-col items-center relative group cursor-pointer flex-1">
          {/* 隐形的原生日期选择器覆盖在文字上 */}
          <input
            type="date"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleDateInput}
            value={formattedDateValue}
            aria-label={t('ui:dateSelector.selectDate')}
          />
          <div className="flex items-center gap-1 group-hover:opacity-70 transition-opacity">
            <span className="text-2xl font-black font-mono tracking-tighter text-gray-800 dark:text-gray-200">
              {currentDate.toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', { month: '2-digit', day: '2-digit' }).replace('/', '.')}
            </span>
            {/* 仅用于视觉提示的小图标 */}
            <CalendarIcon size={14} className="text-gray-300 dark:text-gray-600" />
          </div>
          
          {/* 快捷菜单按钮 */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowQuickMenu(!showQuickMenu);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-0 p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label={t('ui:dateSelector.quickMenu')}
          >
            <MoreVertical size={14} />
          </motion.button>

          {(weekDay || lunarStr) && (
            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full mt-1">
              {weekDay && lunarStr ? `${weekDay} · ${lunarStr}` : weekDay || lunarStr}
            </span>
          )}
        </div>

        <motion.button
          onClick={onNextDay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-800 p-2"
          aria-label="后一天"
        >
          <ChevronRight />
        </motion.button>
      </div>

      {/* 一键回到今天按钮 - 移到下方居中 */}
      <AnimatePresence>
        {!isToday && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex justify-center mt-2"
          >
            <motion.button
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={handleGoToToday}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1"
              aria-label={t('ui:dateSelector.backToToday')}
            >
              <Home size={12} />
              {t('ui:calendar.today')}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快捷菜单 */}
      <AnimatePresence>
        {showQuickMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-30 min-w-[140px]"
          >
            {quickOptions.map((option) => (
              <button
                key={option.label}
                onClick={() => handleQuickJump(option.days)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}