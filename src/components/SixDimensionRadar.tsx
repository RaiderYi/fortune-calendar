// ==========================================
// SixDimensionRadar - 六维运势雷达图
// ==========================================
// 使用 SVG 实现高性能雷达图
// 支持动画、交互提示
// ==========================================

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { colors, duration } from '../designTokens';
import type { DimensionKey, Dimensions } from '../types/fortune';

interface SixDimensionRadarProps {
  dimensions: Dimensions;
  size?: number;
  animate?: boolean;
}

const DIMENSION_CONFIG: Record<DimensionKey, { label: string; color: string; angle: number }> = {
  career: { label: '事业', color: colors.dimensions.career.DEFAULT, angle: 0 },
  wealth: { label: '财运', color: colors.dimensions.wealth.DEFAULT, angle: 60 },
  love: { label: '桃花', color: colors.dimensions.love.DEFAULT, angle: 120 },
  health: { label: '健康', color: colors.dimensions.health.DEFAULT, angle: 180 },
  study: { label: '学业', color: colors.dimensions.study.DEFAULT, angle: 240 },
  travel: { label: '出行', color: colors.dimensions.travel.DEFAULT, angle: 300 },
};

export const SixDimensionRadar: React.FC<SixDimensionRadarProps> = ({
  dimensions,
  size = 200,
  animate = true,
}) => {
  const [hoveredDimension, setHoveredDimension] = useState<DimensionKey | null>(null);
  
  const center = size / 2;
  const radius = size * 0.35;
  const maxScore = 100;
  
  // 计算六边形顶点坐标
  const getPoint = (angle: number, distance: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: center + distance * Math.cos(radian),
      y: center + distance * Math.sin(radian),
    };
  };

  // 生成网格线
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  
  // 生成维度数据点
  const dimensionPoints = useMemo(() => {
    return (Object.keys(DIMENSION_CONFIG) as DimensionKey[]).map((key) => {
      const config = DIMENSION_CONFIG[key];
      const score = dimensions[key] || 0;
      const normalizedScore = (score / maxScore) * radius;
      const point = getPoint(config.angle, normalizedScore);
      const labelPoint = getPoint(config.angle, radius + 20);
      return {
        key,
        score,
        point,
        labelPoint,
        ...config,
      };
    });
  }, [dimensions, radius]);

  // 生成多边形路径
  const polygonPath = useMemo(() => {
    return dimensionPoints
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${d.point.x} ${d.point.y}`)
      .join(' ') + ' Z';
  }, [dimensionPoints]);

  // 动画路径
  const pathVariants = {
    hidden: { 
      pathLength: 0, 
      opacity: 0,
    },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        duration: 1.2, 
        ease: 'easeInOut',
      },
    },
  };

  // 点动画
  const pointVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.4,
        ease: [0.34, 1.56, 0.64, 1], // spring
      },
    }),
  };

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ overflow: 'visible' }}>
        {/* 背景网格 - 同心六边形 */}
        {gridLevels.map((level, i) => {
          const levelRadius = radius * level;
          const points = (Object.keys(DIMENSION_CONFIG) as DimensionKey[]).map((key) => {
            const point = getPoint(DIMENSION_CONFIG[key].angle, levelRadius);
            return `${point.x},${point.y}`;
          }).join(' ');
          
          return (
            <polygon
              key={i}
              points={points}
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth={1}
              strokeDasharray={level === 1 ? 'none' : '4,4'}
            />
          );
        })}

        {/* 轴线 */}
        {(Object.keys(DIMENSION_CONFIG) as DimensionKey[]).map((key) => {
          const endPoint = getPoint(DIMENSION_CONFIG[key].angle, radius);
          return (
            <line
              key={key}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={1}
            />
          );
        })}

        {/* 数据区域 - 渐变填充 */}
        <defs>
          <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.5)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
          </radialGradient>
        </defs>

        {/* 数据多边形 */}
        <motion.path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth={2}
          strokeLinejoin="round"
          variants={animate ? pathVariants : undefined}
          initial={animate ? 'hidden' : 'visible'}
          animate="visible"
        />

        {/* 数据点 */}
        {dimensionPoints.map((d, i) => (
          <motion.g key={d.key}>
            {/* 可交互区域 */}
            <circle
              cx={d.point.x}
              cy={d.point.y}
              r={15}
              fill="transparent"
              cursor="pointer"
              onMouseEnter={() => setHoveredDimension(d.key)}
              onMouseLeave={() => setHoveredDimension(null)}
            />
            
            {/* 外圈 */}
            <motion.circle
              cx={d.point.x}
              cy={d.point.y}
              r={8}
              fill={d.color}
              stroke="white"
              strokeWidth={2}
              custom={i}
              variants={animate ? pointVariants : undefined}
              initial={animate ? 'hidden' : 'visible'}
              animate="visible"
              style={{
                filter: hoveredDimension === d.key ? 'brightness(1.3)' : 'none',
                transition: 'filter 0.2s',
              }}
            />
            
            {/* 内圈 - 发光效果 */}
            <motion.circle
              cx={d.point.x}
              cy={d.point.y}
              r={4}
              fill="white"
              custom={i}
              variants={animate ? pointVariants : undefined}
              initial={animate ? 'hidden' : 'visible'}
              animate="visible"
            />
          </motion.g>
        ))}

        {/* 标签 */}
        {dimensionPoints.map((d) => {
          const isHovered = hoveredDimension === d.key;
          const textAnchor = d.labelPoint.x > center ? 'start' : d.labelPoint.x < center ? 'end' : 'middle';
          const dx = d.labelPoint.x > center ? 8 : d.labelPoint.x < center ? -8 : 0;
          
          return (
            <motion.text
              key={`label-${d.key}`}
              x={d.labelPoint.x + dx}
              y={d.labelPoint.y + 4}
              textAnchor={textAnchor}
              fill={isHovered ? 'white' : 'rgba(255, 255, 255, 0.8)'}
              fontSize={isHovered ? 14 : 12}
              fontWeight={isHovered ? 600 : 500}
              style={{
                transition: 'all 0.2s',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {d.label}
            </motion.text>
          );
        })}
      </svg>

      {/* 悬浮提示 */}
      {hoveredDimension && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '8px 16px',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {DIMENSION_CONFIG[hoveredDimension].label}: {dimensions[hoveredDimension]}分
        </motion.div>
      )}
    </div>
  );
};

export default SixDimensionRadar;
