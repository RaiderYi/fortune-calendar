/* ============================================
   时间范围切换标签
   Time Range Tabs
   ============================================ */

import { motion } from 'framer-motion';

type TimeRange = '7days' | '30days' | '6months' | 'year';

interface TimeRangeTabsProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '7days', label: '近7日' },
  { value: '30days', label: '近30日' },
  { value: '6months', label: '近半年' },
  { value: 'year', label: '全年' }
];

export function TimeRangeTabs({ 
  value, 
  onChange,
  className = ''
}: TimeRangeTabsProps) {
  return (
    <div className={`inline-flex p-1 bg-paper-dark rounded-xl ${className}`}>
      {timeRanges.map((range) => (
        <motion.button
          key={range.value}
          onClick={() => onChange(range.value)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative px-4 py-2 text-sm font-serif rounded-lg
            transition-colors duration-200
            ${value === range.value 
              ? 'text-ink' 
              : 'text-light-ink hover:text-ink-light'
            }
          `}
        >
          {/* 选中背景 */}
          {value === range.value && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-lg shadow-sm"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          
          {/* 文字 */}
          <span className="relative z-10">{range.label}</span>
        </motion.button>
      ))}
    </div>
  );
}

// 简化的标签按钮（用于较小空间）
interface CompactTimeTabsProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  className?: string;
}

export function CompactTimeTabs({ 
  value, 
  onChange,
  className = ''
}: CompactTimeTabsProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {timeRanges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`
            px-3 py-1.5 text-xs font-serif rounded-md
            transition-all duration-200
            ${value === range.value 
              ? 'bg-vermilion/10 text-vermilion' 
              : 'text-light-ink hover:bg-paper-dark hover:text-ink-light'
            }
          `}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}

export type { TimeRange };
