// ==========================================
// FortuneCard V2 - 玻璃拟态运势卡片
// ==========================================
// 设计特点:
// - 玻璃拟态 (Glassmorphism) 效果
// - 动态渐变背景根据运势分数
// - 环形分数进度条
// - 六维雷达图可视化
// - 精致微交互动画
// ==========================================

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Heart, Briefcase, GraduationCap, Plane, DollarSign, Activity } from 'lucide-react';
import { colors, space, radius, shadows, getFortuneColor, getFortuneLabel } from '../designTokens';
import type { FortuneData, DimensionKey } from '../types/fortune';
import SixDimensionDisplay from './SixDimensionDisplay';

interface FortuneCardV2Props {
  fortune: FortuneDataCompat;
  isLoading?: boolean;
  animate?: boolean;
}

// 六维配置
const DIMENSION_CONFIG: Record<DimensionKey, { icon: typeof Sparkles; label: string; color: string }> = {
  career: { icon: Briefcase, label: '事业', color: colors.dimensions.career.DEFAULT },
  wealth: { icon: DollarSign, label: '财运', color: colors.dimensions.wealth.DEFAULT },
  love: { icon: Heart, label: '桃花', color: colors.dimensions.love.DEFAULT },
  health: { icon: Activity, label: '健康', color: colors.dimensions.health.DEFAULT },
  study: { icon: GraduationCap, label: '学业', color: colors.dimensions.study.DEFAULT },
  travel: { icon: Plane, label: '出行', color: colors.dimensions.travel.DEFAULT },
};

// FortuneData 类型兼容定义
interface FortuneDataCompat {
  dateStr: string;
  weekDay: string;
  lunarStr: string;
  totalScore: number;
  mainTheme: string;
  yi?: string[];
  ji?: string[];
  dimensions: {
    career: number;
    wealth: number;
    love: number;
    health: number;
    study: number;
    travel: number;
  };
  baziDetail?: any;
  yongShen?: any;
  liuNian?: any;
}

// 辅助函数：转换维度数据
function normalizeDimensions(dims: any): Dimensions {
  return {
    career: dims?.career ?? dims?.事业 ?? 50,
    wealth: dims?.wealth ?? dims?.财运 ?? 50,
    love: dims?.love ?? dims?.桃花 ?? 50,
    health: dims?.health ?? dims?.健康 ?? 50,
    study: dims?.study ?? dims?.学业 ?? 50,
    travel: dims?.travel ?? dims?.出行 ?? 50,
  };
}

// 辅助函数：提取宜忌
function extractYiJi(todoList: any[]): { yi: string[]; ji: string[] } {
  const yi: string[] = [];
  const ji: string[] = [];
  
  if (Array.isArray(todoList)) {
    todoList.forEach(item => {
      if (item.type === 'up' && item.content) {
        yi.push(item.content);
      } else if (item.type === 'down' && item.content) {
        ji.push(item.content);
      }
    });
  }
  
  return { yi, ji };
}

// 环形进度条组件
const CircularProgress: React.FC<{
  score: number;
  size?: number;
  strokeWidth?: number;
}> = ({ score, size = 140, strokeWidth = 8 }) => {
  const fortuneColor = getFortuneColor(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const label = getFortuneLabel(score);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      {/* 背景圆环 */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
        />
        {/* 进度圆环 */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={fortuneColor.DEFAULT}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      {/* 中心内容 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <motion.span
          style={{
            fontSize: '42px',
            fontWeight: 800,
            lineHeight: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.2)',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px' }}>分</span>
        <motion.span
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginTop: '4px',
            padding: '2px 8px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {label}
        </motion.span>
      </div>
    </div>
  );
};

// 宜忌标签组件
const YiJiTag: React.FC<{
  type: 'yi' | 'ji';
  items: string[];
}> = ({ type, items }) => {
  const isYi = type === 'yi';
  const bgGradient = isYi
    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%)';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: space[3],
        padding: `${space[3]} ${space[4]}`,
        borderRadius: radius.lg,
        background: bgGradient,
        backdropFilter: 'blur(8px)',
        boxShadow: shadows.md,
      }}
    >
      <span
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'white',
        }}
      >
        {isYi ? '宜' : '忌'}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space[2] }}>
        {items.slice(0, 4).map((item, index) => (
          <motion.span
            key={index}
            style={{
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            {item}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

// 主卡片组件
export const FortuneCardV2: React.FC<FortuneCardV2Props> = ({
  fortune,
  isLoading = false,
  animate = true,
}) => {
  const { totalScore, mainTheme } = fortune;
  const dimensions = normalizeDimensions(fortune.dimensions);
  const { yi, ji } = fortune.yi && fortune.ji 
    ? { yi: fortune.yi, ji: fortune.ji }
    : extractYiJi((fortune as any).todo || []);
  
  // 根据运势分数获取背景渐变
  const fortuneColor = getFortuneColor(totalScore);
  const bgGradient = useMemo(() => {
    if (totalScore >= 90) return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)';
    if (totalScore >= 70) return 'linear-gradient(135deg, #86efac 0%, #22c55e 50%, #16a34a 100%)';
    if (totalScore >= 40) return 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 50%, #2563eb 100%)';
    return 'linear-gradient(135deg, #fca5a5 0%, #ef4444 50%, #dc2626 100%)';
  }, [totalScore]);

  // 容器动画
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
  };

  // 子元素动画
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div
        style={{
          borderRadius: radius['2xl'],
          height: '400px',
          background: colors.background.secondary,
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      />
    );
  }

  return (
    <motion.div
      style={{
        position: 'relative',
        borderRadius: radius['2xl'],
        overflow: 'hidden',
        background: bgGradient,
        boxShadow: shadows.xl,
      }}
      variants={containerVariants}
      initial={animate ? 'hidden' : 'visible'}
      animate="visible"
    >
      {/* 玻璃拟态背景层 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(40px) saturate(150%)',
        }}
      />

      {/* 装饰性光晕 */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* 主内容 */}
      <div
        style={{
          position: 'relative',
          padding: space[6],
          color: 'white',
        }}
      >
        {/* 头部：日期信息 */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: space[6],
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: space[2] }}>
            <Sparkles size={18} style={{ opacity: 0.9 }} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>
              {fortune.dateStr} · {fortune.weekDay}
            </span>
          </div>
          <span style={{ fontSize: '12px', opacity: 0.7 }}>{fortune.lunarStr}</span>
        </motion.div>

        {/* 中部：分数和主题 */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: space[4],
            marginBottom: space[6],
          }}
        >
          {/* 环形分数 */}
          <CircularProgress score={totalScore} />

          {/* 主题语 */}
          <motion.div
            style={{
              textAlign: 'center',
              padding: `${space[3]} ${space[6]}`,
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: radius.xl,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <p
              style={{
                fontSize: '18px',
                fontWeight: 500,
                fontStyle: 'italic',
                margin: 0,
                textShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            >
              「{mainTheme}」
            </p>
          </motion.div>
        </motion.div>

        {/* 六维分析 - 支持雷达图/条形图切换 */}
        <motion.div
          variants={itemVariants}
          style={{
            marginBottom: space[6],
          }}
        >
          <SixDimensionDisplay 
            dimensions={dimensions} 
            size={200}
            animate={animate}
            defaultView="radar"
            allowToggle={true}
          />
        </motion.div>

        {/* 底部：宜忌 */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: space[3],
          }}
        >
          {yi && yi.length > 0 && <YiJiTag type="yi" items={yi} />}
          {ji && ji.length > 0 && <YiJiTag type="ji" items={ji} />}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FortuneCardV2;
