// ==========================================
// FortuneCard V2 - 极简专业版
// ==========================================
// 设计理念:
// - 克制配色：深色背景 + 金色点缀
// - 专业排版：清晰的视觉层级
// - 中国风元素： subtly融入
// - 留白艺术：呼吸感十足
// ==========================================

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FortuneCardV2Props {
  fortune: FortuneDataCompat;
  isLoading?: boolean;
  animate?: boolean;
}

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
}

// 克制配色方案
const colors = {
  bg: {
    primary: '#0f172a',      // 深蓝黑
    secondary: '#1e293b',    // 次级背景
    accent: '#1a1a2e',       // 卡片背景
  },
  gold: {
    primary: '#d4a574',      // 主金色
    light: '#e8c9a0',        // 浅金
    dark: '#b8935f',         // 暗金
    subtle: 'rgba(212, 165, 116, 0.1)', // 金色背景
  },
  text: {
    primary: '#f8fafc',      // 主文字
    secondary: '#94a3b8',    // 次级文字
    muted: '#64748b',        // 弱化文字
  },
  score: {
    excellent: '#d4a574',    // 金色
    good: '#86b8a6',         // 青绿
    normal: '#94a3b8',       // 灰蓝
    poor: '#a67b7b',         // 暗红
  }
};

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 85) return colors.score.excellent;
  if (score >= 70) return colors.score.good;
  if (score >= 50) return colors.score.normal;
  return colors.score.poor;
};

// 获取运势标签
const getScoreLabel = (score: number) => {
  if (score >= 90) return '大吉';
  if (score >= 80) return '吉';
  if (score >= 65) return '平';
  return '需谨慎';
};

// 六维标签
const dimensionLabels: Record<string, string> = {
  career: '事业',
  wealth: '财运', 
  love: '桃花',
  health: '健康',
  study: '学业',
  travel: '出行'
};

// 数字动画组件
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({ value, duration = 1000 }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {value}
    </motion.span>
  );
};

export const FortuneCardV2: React.FC<FortuneCardV2Props> = ({
  fortune,
  isLoading = false,
  animate = true,
}) => {
  const { totalScore, mainTheme, dimensions, yi = [], ji = [], dateStr, weekDay, lunarStr } = fortune;
  const scoreColor = getScoreColor(totalScore);
  const scoreLabel = getScoreLabel(totalScore);

  // 找出最高分的维度
  const topDimension = useMemo(() => {
    const entries = Object.entries(dimensions);
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return sorted[0];
  }, [dimensions]);

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-2xl h-96 animate-pulse" />
    );
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl"
      style={{ background: colors.bg.accent }}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* 微妙的背景纹理 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, ${colors.gold.subtle} 0%, transparent 50%)`,
        }}
      />

      {/* 顶部装饰线 */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.gold.primary}40, transparent)` }}
      />

      <div className="relative p-6 md:p-8">
        {/* 头部：日期信息 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">{dateStr}</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 text-sm">{weekDay}</span>
          </div>
          <span className="text-slate-500 text-xs tracking-wider">{lunarStr}</span>
        </div>

        {/* 核心区域：分数和主题 */}
        <div className="flex flex-col items-center mb-10">
          {/* 分数圆环 */}
          <div className="relative mb-6">
            <svg width="120" height="120" className="transform -rotate-90">
              {/* 背景圆 */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="4"
              />
              {/* 进度圆 */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={scoreColor}
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: totalScore / 100 }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{
                  filter: `drop-shadow(0 0 6px ${scoreColor}40)`,
                }}
              />
            </svg>
            {/* 中心分数 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span 
                className="text-4xl font-light tracking-tight"
                style={{ color: scoreColor }}
              >
                <AnimatedNumber value={totalScore} />
              </span>
              <span className="text-xs text-slate-500 mt-1">分</span>
            </div>
          </div>

          {/* 运势评级 */}
          <div 
            className="px-4 py-1.5 rounded-full text-sm mb-4"
            style={{ 
              background: colors.gold.subtle,
              color: colors.gold.primary,
              border: `1px solid ${colors.gold.primary}30`
            }}
          >
            {scoreLabel}
          </div>

          {/* 主题语 */}
          <h2 className="text-xl md:text-2xl text-slate-100 font-light tracking-wide text-center">
            {mainTheme}
          </h2>
        </div>

        {/* 六维分析 - 简洁条形图 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} style={{ color: colors.gold.primary }} />
            <span className="text-xs text-slate-500 uppercase tracking-wider">六维运势</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(dimensions).map(([key, score], index) => (
              <motion.div
                key={key}
                className="flex flex-col gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{dimensionLabels[key]}</span>
                  <span 
                    className="text-xs font-medium"
                    style={{ color: getScoreColor(score) }}
                  >
                    {score}
                  </span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: getScoreColor(score) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 宜忌 - 极简列表 */}
        <div className="grid grid-cols-2 gap-4">
          {yi.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(134, 184, 166, 0.08)' }}>
              <span className="text-xs text-emerald-400/80 uppercase tracking-wider mb-2 block">宜</span>
              <div className="flex flex-wrap gap-2">
                {yi.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-sm text-emerald-100/90">{item}</span>
                ))}
              </div>
            </div>
          )}
          {ji.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(166, 123, 123, 0.08)' }}>
              <span className="text-xs text-rose-400/80 uppercase tracking-wider mb-2 block">忌</span>
              <div className="flex flex-wrap gap-2">
                {ji.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-sm text-rose-100/90">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 最佳维度提示 */}
        {topDimension && topDimension[1] >= 80 && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-center text-sm text-slate-400">
              今日<span style={{ color: colors.gold.primary }}>{dimensionLabels[topDimension[0]]}</span>运势最佳，可把握机会
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FortuneCardV2;
