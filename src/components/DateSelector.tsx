import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

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

  return (
    <div className="flex items-center justify-between px-6 py-2">
      <button
        onClick={onPrevDay}
        className="text-gray-400 hover:text-gray-800 p-2"
        aria-label="前一天"
      >
        <ChevronLeft />
      </button>

      <div className="flex flex-col items-center relative group cursor-pointer">
        {/* 隐形的原生日期选择器覆盖在文字上 */}
        <input
          type="date"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleDateInput}
          value={formattedDateValue}
          aria-label="选择日期"
        />
        <div className="flex items-center gap-1 group-hover:opacity-70 transition-opacity">
          <span className="text-2xl font-black font-mono tracking-tighter">
            {currentDate.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace('/', '.')}
          </span>
          {/* 仅用于视觉提示的小图标 */}
          <CalendarIcon size={14} className="text-gray-300" />
        </div>

        {(weekDay || lunarStr) && (
          <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full mt-1">
            {weekDay && lunarStr ? `${weekDay} · ${lunarStr}` : weekDay || lunarStr}
          </span>
        )}
      </div>

      <button
        onClick={onNextDay}
        className="text-gray-400 hover:text-gray-800 p-2"
        aria-label="后一天"
      >
        <ChevronRight />
      </button>
    </div>
  );
}