/* ============================================
   趋势看板组件索引
   Trend Dashboard Components Index
   ============================================ */

export { TrendDashboard } from './index.tsx';
export { TrendChart, BarCompareChart } from './TrendChart';
export { TimeRangeTabs, CompactTimeTabs } from './TimeRangeTabs';
export { InsightCard, SingleInsight, LuckyDayCard } from './InsightCard';

export type { 
  TrendChartProps, 
  TrendDataPoint, 
  BarCompareData 
} from './TrendChart';
export type { TimeRange } from './TimeRangeTabs';
export type { InsightData, LuckyDayCardProps } from './InsightCard';
