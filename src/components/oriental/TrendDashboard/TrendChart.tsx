/* ============================================
   趋势面积图 - 水墨风格
   Trend Area Chart (Ink Style)
   ============================================ */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Dot
} from 'recharts';

// 趋势数据点
interface TrendDataPoint {
  date: string;
  dateLabel: string;
  score: number;
  theme?: string;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  height?: number;
  onPointClick?: (point: TrendDataPoint) => void;
  highlightIndex?: number;
}

export function TrendChart({ 
  data, 
  height = 200,
  onPointClick,
  highlightIndex
}: TrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 计算平均值
  const averageScore = Math.round(
    data.reduce((sum, d) => sum + d.score, 0) / data.length
  );

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as TrendDataPoint;
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg p-3 shadow-card border border-border-subtle"
        >
          <p className="text-sm text-light-ink font-serif mb-1">{point.dateLabel}</p>
          <p className="text-lg font-serif font-bold text-ink">
            {point.score}分
          </p>
          {point.theme && (
            <p className="text-xs text-vermilion font-serif mt-1">
              {point.theme}
            </p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  // 自定义点
  const CustomDot = (props: any) => {
    const { cx, cy, index } = props;
    const isHovered = hoveredIndex === index;
    const isHighlighted = highlightIndex === index;
    
    if (cx == null || cy == null) return null;

    return (
      <motion.g
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => setHoveredIndex(null)}
        onClick={() => onPointClick?.(data[index])}
        style={{ cursor: onPointClick ? 'pointer' : 'default' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: index * 0.05 }}
      >
        {/* 外圈 */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={isHovered || isHighlighted ? 8 : 5}
          fill="white"
          stroke="#C45C26"
          strokeWidth={2}
          animate={{
            r: isHovered || isHighlighted ? 8 : 5,
            strokeWidth: isHovered || isHighlighted ? 3 : 2
          }}
          transition={{ duration: 0.2 }}
        />
        {/* 内圈 */}
        <circle
          cx={cx}
          cy={cy}
          r={3}
          fill="#D4A574"
        />
      </motion.g>
    );
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            {/* 水墨渐变 */}
            <linearGradient id="inkGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(196, 92, 38, 0.2)" />
              <stop offset="50%" stopColor="rgba(196, 92, 38, 0.08)" />
              <stop offset="95%" stopColor="rgba(196, 92, 38, 0)" />
            </linearGradient>
          </defs>
          
          {/* 网格线 - 极淡 */}
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(44, 44, 44, 0.04)"
            vertical={false}
          />
          
          {/* 平均线 */}
          <ReferenceLine 
            y={averageScore} 
            stroke="rgba(196, 92, 38, 0.3)"
            strokeDasharray="5 5"
          />
          
          {/* X轴 */}
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9A9A9A', fontSize: 11, fontFamily: 'Noto Serif SC' }}
            dy={10}
          />
          
          {/* Y轴 */}
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9A9A9A', fontSize: 11, fontFamily: 'Noto Serif SC' }}
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
          />
          
          {/* Tooltip */}
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: 'rgba(196, 92, 38, 0.3)', strokeWidth: 1 }}
          />
          
          {/* 面积 */}
          <Area
            type="monotone"
            dataKey="score"
            stroke="#C45C26"
            strokeWidth={2}
            fill="url(#inkGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
            dot={<CustomDot />}
            activeDot={{ r: 8, stroke: '#C45C26', strokeWidth: 2, fill: '#D4A574' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* 平均线标注 */}
      <div className="flex justify-end items-center gap-2 mt-2">
        <span className="text-xs text-light-ink font-serif">平均</span>
        <span className="text-sm font-serif text-vermilion">{averageScore}分</span>
      </div>
    </div>
  );
}

// 柱状对比图
interface BarCompareData {
  label: string;
  current: number;
  previous: number;
}

interface BarCompareChartProps {
  data: BarCompareData[];
  height?: number;
}

export function BarCompareChart({ data, height = 200 }: BarCompareChartProps) {
  // 简化的柱状图实现
  const maxValue = Math.max(...data.flatMap(d => [d.current, d.previous]));

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-around h-full pb-8 px-2">
        {data.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            {/* 柱子容器 */}
            <div className="flex items-end gap-1 h-32">
              {/* 上周/上月 */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.previous / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-3 bg-qingdai/30 rounded-t-sm"
              />
              {/* 本周/本月 */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item.current / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
                className="w-3 bg-vermilion/70 rounded-t-sm"
              />
            </div>
            
            {/* 标签 */}
            <span className="text-xs text-light-ink font-serif">{item.label}</span>
          </motion.div>
        ))}
      </div>
      
      {/* 图例 */}
      <div className="flex justify-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-qingdai/30 rounded-sm" />
          <span className="text-xs text-light-ink font-serif">上期</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-vermilion/70 rounded-sm" />
          <span className="text-xs text-light-ink font-serif">本期</span>
        </div>
      </div>
    </div>
  );
}

export type { TrendDataPoint, BarCompareData };
