/* ============================================
   分数展示组件 - 带动画圆环
   Score Display with Animated Ring
   ============================================ */

import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  score: number;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  showRing?: boolean;
  variant?: 'default' | 'minimal' | 'seal';
}

export function ScoreDisplay({ 
  score, 
  label,
  sublabel,
  size = 'md',
  animate = true,
  showRing = true,
  variant = 'default'
}: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const motionScore = useMotionValue(animate ? 0 : score);
  const springScore = useSpring(motionScore, { 
    stiffness: 50, 
    damping: 20,
    mass: 1
  });
  
  const roundedScore = useTransform(springScore, (latest) => 
    Math.round(latest)
  );

  useEffect(() => {
    if (animate) {
      motionScore.set(score);
      const unsubscribe = roundedScore.on('change', (v) => setDisplayScore(v));
      return () => unsubscribe();
    } else {
      setDisplayScore(score);
    }
  }, [score, animate, motionScore, roundedScore]);

  // 尺寸配置
  const sizeConfig = {
    sm: {
      container: 'w-16 h-16',
      score: 'text-xl',
      label: 'text-xs',
      sublabel: 'text-[10px]',
      ring: 56,
      strokeWidth: 3
    },
    md: {
      container: 'w-24 h-24',
      score: 'text-3xl',
      label: 'text-sm',
      sublabel: 'text-xs',
      ring: 80,
      strokeWidth: 4
    },
    lg: {
      container: 'w-32 h-32',
      score: 'text-5xl',
      label: 'text-base',
      sublabel: 'text-sm',
      ring: 108,
      strokeWidth: 5
    },
    xl: {
      container: 'w-40 h-40',
      score: 'text-6xl',
      label: 'text-lg',
      sublabel: 'text-base',
      ring: 136,
      strokeWidth: 6
    }
  };

  const config = sizeConfig[size];

  // 根据分数决定颜色
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-vermilion';
    if (s >= 80) return 'text-gold';
    if (s >= 70) return 'text-qingdai';
    if (s >= 60) return 'text-ink-light';
    return 'text-muted';
  };

  // 根据分数获取印章样式
  const getSealStyle = (s: number) => {
    if (s >= 90) return 'bg-vermilion/10 text-vermilion border-vermilion/30';
    if (s >= 80) return 'bg-gold/10 text-gold-dark border-gold/30';
    if (s >= 70) return 'bg-qingdai/10 text-qingdai border-qingdai/30';
    return 'bg-gray-100 text-light-ink border-gray-200';
  };

  // 印章风格
  if (variant === 'seal') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`flex flex-col items-center justify-center ${config.container}`}
      >
        <div className={`
          relative flex flex-col items-center justify-center
          w-full h-full rounded-lg border-2 border-dashed
          ${getSealStyle(score)}
        `}>
          <span className={`font-serif font-bold ${config.score} ${getScoreColor(score)}`}>
            {displayScore}
          </span>
          {label && (
            <span className={`${config.label} font-serif mt-0.5 opacity-80`}>
              {label}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // 极简风格
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center"
      >
        <span className={`font-serif font-bold ${config.score} ${getScoreColor(score)}`}>
          {displayScore}
        </span>
        {label && (
          <span className={`${config.label} text-light-ink font-serif mt-1`}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className={`${config.sublabel} text-muted font-serif`}>
            {sublabel}
          </span>
        )}
      </motion.div>
    );
  }

  // 默认风格（带动画圆环）
  const circumference = config.ring * Math.PI;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col items-center justify-center ${config.container}`}
    >
      {showRing && (
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox={`0 0 ${config.ring + 16} ${config.ring + 16}`}
        >
          {/* 背景圆环 */}
          <circle
            cx={(config.ring + 16) / 2}
            cy={(config.ring + 16) / 2}
            r={config.ring / 2}
            fill="none"
            stroke="rgba(196, 92, 38, 0.1)"
            strokeWidth={config.strokeWidth}
          />
          {/* 进度圆环 */}
          <motion.circle
            cx={(config.ring + 16) / 2}
            cy={(config.ring + 16) / 2}
            r={config.ring / 2}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animate ? { strokeDashoffset: circumference } : false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4A574" />
              <stop offset="100%" stopColor="#C45C26" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* 分数数字 */}
      <div className="flex flex-col items-center">
        <span className={`font-serif font-bold ${config.score} ${getScoreColor(score)}`}>
          {displayScore}
        </span>
        
        {label && (
          <span className={`${config.label} text-light-ink font-serif`}>
            {label}
          </span>
        )}
        
        {sublabel && (
          <span className={`${config.sublabel} text-muted font-serif`}>
            {sublabel}
          </span>
        )}
      </div>
    </motion.div>
  );
}

// 主题标签徽章
interface ThemeBadgeProps {
  theme: '食神' | '偏财' | '七杀' | '桃花' | '正印' | '正官' | '偏印' | '比肩' | '劫财' | '伤官' | string;
  size?: 'sm' | 'md' | 'lg';
}

const themeColors: Record<string, string> = {
  '食神': 'bg-orange-100 text-orange-700 border-orange-200',
  '伤官': 'bg-orange-50 text-orange-600 border-orange-100',
  '偏财': 'bg-amber-100 text-amber-700 border-amber-200',
  '正财': 'bg-amber-50 text-amber-600 border-amber-100',
  '七杀': 'bg-slate-100 text-slate-700 border-slate-200',
  '正官': 'bg-slate-50 text-slate-600 border-slate-100',
  '偏印': 'bg-purple-100 text-purple-700 border-purple-200',
  '正印': 'bg-purple-50 text-purple-600 border-purple-100',
  '比肩': 'bg-blue-100 text-blue-700 border-blue-200',
  '劫财': 'bg-red-100 text-red-700 border-red-200',
  '桃花': 'bg-pink-100 text-pink-700 border-pink-200',
  'default': 'bg-gray-100 text-gray-700 border-gray-200'
};

export function ThemeBadge({ theme, size = 'md' }: ThemeBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const colorClass = themeColors[theme] || themeColors.default;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`
        inline-flex items-center justify-center
        rounded-full font-serif border
        ${sizeClasses[size]}
        ${colorClass}
      `}
    >
      {theme}
    </motion.span>
  );
}

// 运势等级徽章
interface FortuneLevelBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function FortuneLevelBadge({ score, size = 'md' }: FortuneLevelBadgeProps) {
  const getLevel = (s: number) => {
    if (s >= 95) return { text: '大吉', color: 'bg-red-50 text-red-600 border-red-200' };
    if (s >= 85) return { text: '吉', color: 'bg-orange-50 text-orange-600 border-orange-200' };
    if (s >= 75) return { text: '中吉', color: 'bg-amber-50 text-amber-600 border-amber-200' };
    if (s >= 65) return { text: '平', color: 'bg-gray-50 text-gray-600 border-gray-200' };
    return { text: '需谨慎', color: 'bg-slate-50 text-slate-500 border-slate-200' };
  };

  const level = getLevel(score);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span className={`
      inline-flex items-center justify-center
      rounded-full font-serif border
      ${sizeClasses[size]}
      ${level.color}
    `}>
      {level.text}
    </span>
  );
}
