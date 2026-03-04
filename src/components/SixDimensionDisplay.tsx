// ==========================================
// SixDimensionDisplay - 六维运势展示
// ==========================================
// 支持两种视图模式:
// - radar: SVG雷达图 (新设计)
// - bars: 条形图 (保留原有风格)
// ==========================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, BarChart3 } from 'lucide-react';
import { colors, space, radius, shadows, fontSize, fontWeight } from '../designTokens';
import type { DimensionKey, Dimensions } from '../types/fortune';
import SixDimensionRadar from './SixDimensionRadar';

interface SixDimensionDisplayProps {
  dimensions: Dimensions;
  size?: number;
  animate?: boolean;
  defaultView?: 'radar' | 'bars';
  allowToggle?: boolean;
}

// 六维配置
const DIMENSION_CONFIG: Record<DimensionKey, { 
  label: string; 
  color: string; 
  gradient: string;
  icon: string;
}> = {
  career: { 
    label: '事业', 
    color: colors.dimensions.career.DEFAULT,
    gradient: colors.dimensions.career.gradient,
    icon: '💼',
  },
  wealth: { 
    label: '财运', 
    color: colors.dimensions.wealth.DEFAULT,
    gradient: colors.dimensions.wealth.gradient,
    icon: '💰',
  },
  love: { 
    label: '桃花', 
    color: colors.dimensions.love.DEFAULT,
    gradient: colors.dimensions.love.gradient,
    icon: '❤️',
  },
  health: { 
    label: '健康', 
    color: colors.dimensions.health.DEFAULT,
    gradient: colors.dimensions.health.gradient,
    icon: '💪',
  },
  study: { 
    label: '学业', 
    color: colors.dimensions.study.DEFAULT,
    gradient: colors.dimensions.study.gradient,
    icon: '📚',
  },
  travel: { 
    label: '出行', 
    color: colors.dimensions.travel.DEFAULT,
    gradient: colors.dimensions.travel.gradient,
    icon: '✈️',
  },
};

// 条形图视图
const BarsView: React.FC<{
  dimensions: Dimensions;
  animate: boolean;
}> = ({ dimensions, animate }) => {
  const sortedDimensions = (Object.keys(DIMENSION_CONFIG) as DimensionKey[])
    .map(key => ({ key, ...DIMENSION_CONFIG[key], score: dimensions[key] }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space[3] }}>
      {sortedDimensions.map((dim, index) => (
        <motion.div
          key={dim.key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: space[3],
          }}
          initial={animate ? { opacity: 0, x: -20 } : {}}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          {/* 图标和标签 */}
          <div
            style={{
              width: '60px',
              display: 'flex',
              alignItems: 'center',
              gap: space[2],
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '16px' }}>{dim.icon}</span>
            <span
              style={{
                fontSize: fontSize.sm[0],
                fontWeight: fontWeight.medium,
                color: colors.text.secondary,
              }}
            >
              {dim.label}
            </span>
          </div>

          {/* 进度条 */}
          <div
            style={{
              flex: 1,
              height: '10px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: radius.full,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: dim.gradient,
                borderRadius: radius.full,
                boxShadow: `0 2px 8px ${dim.color}40`,
              }}
              initial={animate ? { width: 0 } : { width: `${dim.score}%` }}
              animate={{ width: `${dim.score}%` }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* 分数 */}
          <motion.span
            style={{
              width: '32px',
              textAlign: 'right',
              fontSize: fontSize.sm[0],
              fontWeight: fontWeight.bold,
              color: 'white',
            }}
            initial={animate ? { opacity: 0 } : {}}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {dim.score}
          </motion.span>
        </motion.div>
      ))}
    </div>
  );
};

// 主组件
export const SixDimensionDisplay: React.FC<SixDimensionDisplayProps> = ({
  dimensions,
  size = 240,
  animate = true,
  defaultView = 'radar',
  allowToggle = true,
}) => {
  const [viewMode, setViewMode] = useState<'radar' | 'bars'>(defaultView);

  return (
    <div style={{ width: '100%' }}>
      {/* 头部：标题和切换按钮 */}
      {allowToggle && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: space[4],
          }}
        >
          <h4
            style={{
              fontSize: fontSize.base[0],
              fontWeight: fontWeight.semibold,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
            }}
          >
            六维分析
          </h4>
          
          {/* 视图切换按钮组 */}
          <div
            style={{
              display: 'flex',
              gap: space[1],
              padding: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: radius.md,
              backdropFilter: 'blur(8px)',
            }}
          >
            <motion.button
              onClick={() => setViewMode('radar')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: `${space[1.5]} ${space[3]}`,
                borderRadius: radius.sm,
                border: 'none',
                background: viewMode === 'radar' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: viewMode === 'radar' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                fontSize: fontSize.xs[0],
                fontWeight: fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Radar size={14} />
              雷达
            </motion.button>
            <motion.button
              onClick={() => setViewMode('bars')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: `${space[1.5]} ${space[3]}`,
                borderRadius: radius.sm,
                border: 'none',
                background: viewMode === 'bars' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                color: viewMode === 'bars' ? 'white' : 'rgba(255, 255, 255, 0.6)',
                fontSize: fontSize.xs[0],
                fontWeight: fontWeight.medium,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 size={14} />
              条形
            </motion.button>
          </div>
        </div>
      )}

      {/* 内容区域 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: viewMode === 'radar' ? size : 'auto',
        }}
      >
        <AnimatePresence mode="wait">
          {viewMode === 'radar' ? (
            <motion.div
              key="radar"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <SixDimensionRadar 
                dimensions={dimensions} 
                size={size} 
                animate={animate} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="bars"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', maxWidth: '320px' }}
            >
              <BarsView dimensions={dimensions} animate={animate} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 最高/最低维度提示 */}
      <motion.div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: space[4],
          marginTop: space[4],
          padding: `${space[3]} ${space[4]}`,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: radius.lg,
          backdropFilter: 'blur(8px)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {(() => {
          const entries = Object.entries(dimensions) as [DimensionKey, number][];
          const maxEntry = entries.reduce((a, b) => a[1] > b[1] ? a : b);
          const minEntry = entries.reduce((a, b) => a[1] < b[1] ? a : b);
          
          return (
            <>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', opacity: 0.7, display: 'block' }}>最旺</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  {DIMENSION_CONFIG[maxEntry[0]].icon} {maxEntry[1]}分
                </span>
              </div>
              <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '11px', opacity: 0.7, display: 'block' }}>注意</span>
                <span style={{ fontSize: '14px', fontWeight: 600 }}>
                  {DIMENSION_CONFIG[minEntry[0]].icon} {minEntry[1]}分
                </span>
              </div>
            </>
          );
        })()}
      </motion.div>
    </div>
  );
};

export default SixDimensionDisplay;
