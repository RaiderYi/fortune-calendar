/* ============================================
   六维雷达图 - 手绘风格
   Six-Dimension Radar Chart (Hand-drawn Style)
   ============================================ */

import { motion } from 'framer-motion';
import { useMemo } from 'react';

export interface DimensionData {
  career: number;      // 事业
  wealth: number;      // 财运
  romance: number;     // 桃花
  health: number;      // 健康
  academic: number;    // 学业
  travel: number;      // 出行
}

interface RadarChartProps {
  data: DimensionData;
  size?: number;
  animate?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  variant?: 'default' | 'minimal' | 'compact';
  className?: string;
}

// 六维配置
const dimensions = [
  { key: 'career' as const, label: '事业', angle: -90 },
  { key: 'wealth' as const, label: '财运', angle: -30 },
  { key: 'romance' as const, label: '桃花', angle: 30 },
  { key: 'health' as const, label: '健康', angle: 90 },
  { key: 'academic' as const, label: '学业', angle: 150 },
  { key: 'travel' as const, label: '出行', angle: 210 }
];

export function RadarChart({ 
  data, 
  size = 200, 
  animate = true,
  showLabels = true,
  showGrid = true,
  variant = 'default',
  className = ''
}: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.32;
  const levels = 4;

  // 计算多边形顶点
  const getPoint = (value: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  };

  // 生成数据多边形路径
  const dataPoints = useMemo(() => 
    dimensions.map(d => getPoint(data[d.key], d.angle)),
    [data, radius]
  );

  const pathData = useMemo(() => 
    dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z',
    [dataPoints]
  );

  // 计算平均分
  const averageScore = useMemo(() => {
    const values = Object.values(data);
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [data]);

  // 紧凑模式
  if (variant === 'compact') {
    return (
      <div className={`relative ${className}`} style={{ width: size, height: size }}>
        <svg width={size} height={size} className="overflow-visible">
          {/* 简化背景网格 */}
          {Array.from({ length: 2 }).map((_, i) => {
            const levelRadius = ((i + 1) / 2) * radius;
            const points = dimensions.map(d => {
              const rad = (d.angle * Math.PI) / 180;
              return `${center + levelRadius * Math.cos(rad)},${center + levelRadius * Math.sin(rad)}`;
            }).join(' ');
            
            return (
              <polygon
                key={i}
                points={points}
                fill="none"
                stroke="rgba(44, 44, 44, 0.06)"
                strokeWidth="0.5"
              />
            );
          })}

          {/* 数据区域 */}
          <motion.path
            d={pathData}
            fill="rgba(196, 92, 38, 0.12)"
            stroke="#C45C26"
            strokeWidth="1.5"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : false}
            animate={animate ? { pathLength: 1, opacity: 1 } : false}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* 数据点 */}
          {dataPoints.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="3"
              fill="#D4A574"
              initial={animate ? { scale: 0 } : false}
              animate={animate ? { scale: 1 } : false}
              transition={{ delay: i * 0.05, duration: 0.2 }}
            />
          ))}
        </svg>
        
        {/* 中心分数 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-lg font-serif font-bold text-ink">
            {averageScore}
          </span>
        </div>
      </div>
    );
  }

  // 极简模式
  if (variant === 'minimal') {
    return (
      <svg width={size} height={size} className={`overflow-visible ${className}`}>
        {/* 背景网格 - 简化为2层 */}
        {showGrid && Array.from({ length: 2 }).map((_, i) => {
          const levelRadius = ((i + 1) / 2) * radius;
          const points = dimensions.map(d => {
            const rad = (d.angle * Math.PI) / 180;
            return `${center + levelRadius * Math.cos(rad)},${center + levelRadius * Math.sin(rad)}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(44, 44, 44, 0.08)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* 轴线 */}
        {showGrid && dimensions.map((d, i) => {
          const end = getPoint(100, d.angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(44, 44, 44, 0.05)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* 数据区域 */}
        <motion.path
          d={pathData}
          fill="rgba(196, 92, 38, 0.15)"
          stroke="#C45C26"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={animate ? { pathLength: 1, opacity: 1 } : false}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* 数据点 */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#D4A574"
            initial={animate ? { scale: 0 } : false}
            animate={animate ? { scale: 1 } : false}
            transition={{ delay: i * 0.08, duration: 0.2 }}
          />
        ))}

        {/* 维度标签 */}
        {showLabels && dimensions.map((d, i) => {
          const labelPos = getPoint(120, d.angle);
          return (
            <text
              key={i}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-light-ink font-serif"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    );
  }

  // 默认完整模式
  return (
    <div className={className}>
      <svg width={size} height={size} className="overflow-visible">
        {/* 背景网格 - 手绘风格虚线 */}
        {showGrid && Array.from({ length: levels }).map((_, i) => {
          const levelRadius = ((i + 1) / levels) * radius;
          const points = dimensions.map(d => {
            const rad = (d.angle * Math.PI) / 180;
            return `${center + levelRadius * Math.cos(rad)},${center + levelRadius * Math.sin(rad)}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(44, 44, 44, 0.08)"
              strokeWidth="0.5"
              strokeDasharray={i === levels - 1 ? "none" : "3 3"}
            />
          );
        })}

        {/* 轴线 */}
        {showGrid && dimensions.map((d, i) => {
          const end = getPoint(100, d.angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(44, 44, 44, 0.06)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* 数据区域 */}
        <motion.path
          d={pathData}
          fill="rgba(196, 92, 38, 0.12)"
          stroke="#C45C26"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0, opacity: 0 } : false}
          animate={animate ? { pathLength: 1, opacity: 1 } : false}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* 数据点 */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#D4A574"
            stroke="#FAF8F3"
            strokeWidth="2"
            initial={animate ? { scale: 0 } : false}
            animate={animate ? { scale: 1 } : false}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}

        {/* 维度标签 */}
        {showLabels && dimensions.map((d, i) => {
          const labelPos = getPoint(118, d.angle);
          return (
            <text
              key={i}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-light-ink font-serif"
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* 维度数值（可选） */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {dimensions.map((d) => (
          <div key={d.key} className="flex flex-col items-center">
            <span className="text-xs text-light-ink font-serif">{d.label}</span>
            <span className="text-sm font-medium text-ink">{data[d.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 双雷达对比图
interface DualRadarChartProps {
  data1: DimensionData;
  data2: DimensionData;
  label1?: string;
  label2?: string;
  size?: number;
  className?: string;
}

export function DualRadarChart({ 
  data1, 
  data2,
  label1 = '本周',
  label2 = '上周',
  size = 200,
  className = ''
}: DualRadarChartProps) {
  const center = size / 2;
  const radius = size * 0.32;

  const getPoint = (value: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  };

  const data1Points = dimensions.map(d => getPoint(data1[d.key], d.angle));
  const data2Points = dimensions.map(d => getPoint(data2[d.key], d.angle));

  const pathData1 = data1Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  const pathData2 = data2Points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className={className}>
      <svg width={size} height={size} className="overflow-visible">
        {/* 背景网格 */}
        {Array.from({ length: 4 }).map((_, i) => {
          const levelRadius = ((i + 1) / 4) * radius;
          const points = dimensions.map(d => {
            const rad = (d.angle * Math.PI) / 180;
            return `${center + levelRadius * Math.cos(rad)},${center + levelRadius * Math.sin(rad)}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(44, 44, 44, 0.06)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* 轴线 */}
        {dimensions.map((d, i) => {
          const end = getPoint(100, d.angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(44, 44, 44, 0.04)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* 数据2区域（背景层） */}
        <motion.path
          d={pathData2}
          fill="rgba(45, 90, 74, 0.1)"
          stroke="#2D5A4A"
          strokeWidth="1.5"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* 数据1区域（前景层） */}
        <motion.path
          d={pathData1}
          fill="rgba(196, 92, 38, 0.15)"
          stroke="#C45C26"
          strokeWidth="2"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />

        {/* 维度标签 */}
        {dimensions.map((d, i) => {
          const labelPos = getPoint(118, d.angle);
          return (
            <text
              key={i}
              x={labelPos.x}
              y={labelPos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs fill-light-ink font-serif"
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* 图例 */}
      <div className="mt-4 flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-vermilion/80" />
          <span className="text-sm text-light-ink font-serif">{label1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-qingdai/80" />
          <span className="text-sm text-light-ink font-serif">{label2}</span>
        </div>
      </div>
    </div>
  );
}
