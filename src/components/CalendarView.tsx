import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

interface CalendarViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  getHistoryScore: (dateStr: string) => number | null;
}

interface DayData {
  date: Date;
  dateStr: string;
  score: number | null;
  isToday: boolean;
  isCurrentMonth: boolean;
  isWeekend: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onDateSelect,
  onClose,
  getHistoryScore
}) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate));
  const [monthDays, setMonthDays] = useState<DayData[]>([]);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [bestDays, setBestDays] = useState<DayData[]>([]);

  // 生成月历数据
  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // 获取第一天是周几（0=周日，1=周一...）
    const firstDayOfWeek = firstDay.getDay();
    
    // 生成日历数组（包含上月尾部和下月开头）
    const days: DayData[] = [];
    
    // 添加上月的日期（填充第一周）
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push(createDayData(date, false));
    }
    
    // 添加当月所有日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push(createDayData(date, true));
    }
    
    // 添加下月的日期（填充最后一周）
    const remainingDays = 42 - days.length; // 6周 * 7天 = 42
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      days.push(createDayData(date, false));
    }
    
    setMonthDays(days);
    
    // 计算统计数据
    calculateStats(days.filter(d => d.isCurrentMonth));
  }, [viewDate]);

  // 创建单日数据
  const createDayData = (date: Date, isCurrentMonth: boolean): DayData => {
    const dateStr = formatDate(date);
    const score = getHistoryScore(dateStr);
    const today = new Date();
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    
    return {
      date,
      dateStr,
      score,
      isToday,
      isCurrentMonth,
      isWeekend
    };
  };

  // 格式化日期
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 计算统计数据
  const calculateStats = (currentMonthDays: DayData[]) => {
    const scoresWithData = currentMonthDays
      .filter(d => d.score !== null)
      .map(d => d.score!);
    
    if (scoresWithData.length === 0) {
      setAverageScore(null);
      setBestDays([]);
      return;
    }
    
    // 计算平均分
    const avg = scoresWithData.reduce((a, b) => a + b, 0) / scoresWithData.length;
    setAverageScore(Math.round(avg));
    
    // 找出最佳日期（前3名）
    const sortedDays = currentMonthDays
      .filter(d => d.score !== null)
      .sort((a, b) => b.score! - a.score!)
      .slice(0, 3);
    setBestDays(sortedDays);
  };

  // 获取日期颜色类（根据分数）
  const getScoreColorClass = (score: number | null): string => {
    if (score === null) return 'bg-gray-50 text-gray-400';
    
    if (score >= 85) return 'bg-gradient-to-br from-green-400 to-emerald-500 text-white font-semibold shadow-md';
    if (score >= 70) return 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white font-medium shadow-sm';
    if (score >= 60) return 'bg-gradient-to-br from-yellow-300 to-amber-400 text-gray-800 font-medium shadow-sm';
    if (score >= 50) return 'bg-gradient-to-br from-orange-300 to-orange-400 text-white font-medium shadow-sm';
    return 'bg-gradient-to-br from-red-400 to-rose-500 text-white font-medium shadow-sm';
  };

  // 获取分数emoji
  const getScoreEmoji = (score: number | null): string => {
    if (score === null) return '';
    if (score >= 85) return '🌟';
    if (score >= 70) return '😊';
    if (score >= 60) return '😐';
    if (score >= 50) return '😕';
    return '😰';
  };

  // 处理日期点击
  const handleDayClick = (dayData: DayData) => {
    onDateSelect(dayData.date);
    onClose();
  };

  // 切换月份
  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setViewDate(newDate);
  };

  // 跳转到今天
  const goToToday = () => {
    setViewDate(new Date());
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const monthName = viewDate.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8" />
              <h2 className="text-2xl font-bold">运势日历</h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* 月份导航 */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => changeMonth(-1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xl font-semibold">{monthName}</span>
              <button
                onClick={goToToday}
                className="px-4 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm font-medium transition-all hover:scale-105"
              >
                今天
              </button>
            </div>

            <button
              onClick={() => changeMonth(1)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 统计卡片 */}
          {averageScore !== null && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* 平均运势 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">本月平均运势</span>
                </div>
                <div className="text-3xl font-bold text-blue-600">{averageScore}分</div>
              </div>

              {/* 最佳日期 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border-2 border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🌟</span>
                  <span className="text-sm font-medium text-gray-700">最佳日期</span>
                </div>
                <div className="flex gap-2">
                  {bestDays.map((day, idx) => (
                    <div
                      key={idx}
                      className="flex-1 text-center bg-white rounded-lg p-2 cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleDayClick(day)}
                    >
                      <div className="text-xs text-gray-600">
                        {day.date.getMonth() + 1}/{day.date.getDate()}
                      </div>
                      <div className="text-lg font-bold text-green-600">{day.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, idx) => (
              <div
                key={day}
                className={`text-center text-sm font-semibold py-2 ${
                  idx === 0 || idx === 6 ? 'text-red-500' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 日历格子 */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((dayData, idx) => {
              const colorClass = getScoreColorClass(dayData.score);
              const emoji = getScoreEmoji(dayData.score);
              
              return (
                <button
                  key={idx}
                  onClick={() => handleDayClick(dayData)}
                  disabled={dayData.score === null && !dayData.isCurrentMonth}
                  className={`
                    relative aspect-square rounded-xl p-2 transition-all duration-200
                    ${colorClass}
                    ${dayData.isToday ? 'ring-4 ring-purple-400 ring-offset-2' : ''}
                    ${!dayData.isCurrentMonth ? 'opacity-30' : ''}
                    ${dayData.score !== null ? 'hover:scale-110 hover:z-10 cursor-pointer' : 'cursor-default'}
                    ${dayData.isWeekend && dayData.isCurrentMonth && dayData.score === null ? 'bg-red-50 text-red-400' : ''}
                  `}
                >
                  {/* 日期 */}
                  <div className="text-sm font-medium">
                    {dayData.date.getDate()}
                  </div>
                  
                  {/* 分数和emoji */}
                  {dayData.score !== null && (
                    <>
                      <div className="text-xs mt-1 opacity-90">
                        {dayData.score}分
                      </div>
                      <div className="absolute top-1 right-1 text-xs">
                        {emoji}
                      </div>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* 图例 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-3">运势图例</div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: '极佳', range: '85+', class: 'from-green-400 to-emerald-500', emoji: '🌟' },
                { label: '良好', range: '70-84', class: 'from-blue-400 to-cyan-500', emoji: '😊' },
                { label: '平稳', range: '60-69', class: 'from-yellow-300 to-amber-400', emoji: '😐' },
                { label: '一般', range: '50-59', class: 'from-orange-300 to-orange-400', emoji: '😕' },
                { label: '欠佳', range: '<50', class: 'from-red-400 to-rose-500', emoji: '😰' }
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded bg-gradient-to-br ${item.class} flex items-center justify-center text-xs`}>
                    {item.emoji}
                  </div>
                  <div className="text-xs">
                    <div className="font-medium text-gray-700">{item.label}</div>
                    <div className="text-gray-500">{item.range}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 提示 */}
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div className="flex-1 text-sm text-gray-700">
                <p className="font-medium mb-1">温馨提示</p>
                <p>点击任意已查询的日期可查看详细运势。灰色日期表示尚未查询，点击后将自动查询并显示。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
