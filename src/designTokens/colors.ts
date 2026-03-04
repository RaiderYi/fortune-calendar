// ==========================================
// 设计令牌 - 颜色系统
// ==========================================
// 核心理念: 禅意 · 温暖 · 精致
// 主色调: 温暖紫 - 代表智慧、宁静、东方美学
// ==========================================

export const colors = {
  // ========================================
  // 主色调 - 温暖紫 (Purple)
  // ========================================
  primary: {
    50: '#f5f3ff',   // 极浅紫 - 背景强调
    100: '#ede9fe',  // 很浅紫 - 悬停背景
    200: '#ddd6fe',  // 浅紫 - 边框、分隔线
    300: '#c4b5fd',  // 中浅紫 - 禁用状态
    400: '#a78bfa',  // 中紫 - 次要元素
    500: '#8b5cf6',  // 主色 - 按钮、链接、高亮
    600: '#7c3aed',  // 深紫 - 悬停状态
    700: '#6d28d9',  // 很深紫 - 按下状态
    800: '#5b21b6',  // 极深紫 - 文字
    900: '#4c1d95',  // 最深紫 - 标题
    950: '#2e1065',  // 超深紫 - 特殊强调
  },

  // ========================================
  // 背景色 - 温暖中性色
  // ========================================
  background: {
    primary: '#fafaf9',      // 暖白 - 主背景
    secondary: '#f5f5f4',    // 暖灰 - 次级背景
    tertiary: '#e7e5e4',     // 深暖灰 - 第三层背景
    elevated: '#ffffff',     // 纯白 - 卡片、浮层
    dark: '#1c1917',         // 深色模式主背景
    darkSecondary: '#292524', // 深色模式次级背景
    darkElevated: '#44403c',  // 深色模式卡片
  },

  // ========================================
  // 文字色
  // ========================================
  text: {
    primary: '#1c1917',      // 主文字 - 近黑
    secondary: '#57534e',    // 次级文字 - 深灰
    tertiary: '#a8a29e',     // 第三级文字 - 中灰
    disabled: '#d6d3d1',     // 禁用文字 - 浅灰
    inverse: '#fafaf9',      // 反色文字 - 用于深色背景
    inverseSecondary: '#e7e5e4', // 次级反色文字
  },

  // ========================================
  // 边框与分隔线
  // ========================================
  border: {
    light: '#e7e5e4',        // 浅色边框
    DEFAULT: '#d6d3d1',      // 默认边框
    dark: '#a8a29e',         // 深色边框
    focus: '#8b5cf6',        // 聚焦边框 - 主色
  },

  // ========================================
  // 运势等级颜色 - 渐变色定义
  // ========================================
  fortune: {
    // 大吉 (90-100分) - 温暖金色
    excellent: {
      DEFAULT: '#f59e0b',
      light: '#fbbf24',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      bg: 'rgba(251, 191, 36, 0.1)',
    },
    // 吉 (70-89分) - 生机绿色
    good: {
      DEFAULT: '#22c55e',
      light: '#86efac',
      gradient: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)',
      bg: 'rgba(134, 239, 172, 0.1)',
    },
    // 平 (40-69分) - 平静蓝色
    normal: {
      DEFAULT: '#3b82f6',
      light: '#93c5fd',
      gradient: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)',
      bg: 'rgba(147, 197, 253, 0.1)',
    },
    // 凶 (0-39分) - 警示红色
    poor: {
      DEFAULT: '#ef4444',
      light: '#fca5a5',
      gradient: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)',
      bg: 'rgba(252, 165, 165, 0.1)',
    },
  },

  // ========================================
  // 六维运势颜色
  // ========================================
  dimensions: {
    career: {      // 事业
      DEFAULT: '#8b5cf6',
      light: '#c4b5fd',
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
    },
    wealth: {      // 财运
      DEFAULT: '#f59e0b',
      light: '#fcd34d',
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    },
    love: {        // 桃花
      DEFAULT: '#ec4899',
      light: '#fbcfe8',
      gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
    },
    health: {      // 健康
      DEFAULT: '#22c55e',
      light: '#86efac',
      gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    },
    study: {       // 学业
      DEFAULT: '#3b82f6',
      light: '#93c5fd',
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
    },
    travel: {      // 出行
      DEFAULT: '#06b6d4',
      light: '#a5f3fc',
      gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
    },
  },

  // ========================================
  // 功能色
  // ========================================
  functional: {
    success: '#22c55e',      // 成功
    warning: '#f59e0b',      // 警告
    error: '#ef4444',        // 错误
    info: '#3b82f6',         // 信息
  },

  // ========================================
  // 深色模式特定颜色
  // ========================================
  darkMode: {
    primary: '#a78bfa',      // 深色模式主色更亮
    background: '#1c1917',   // 深色背景
    surface: '#292524',      // 深色表面
    elevated: '#44403c',     // 深色浮层
    text: '#fafaf9',         // 深色文字
    textSecondary: '#a8a29e', // 深色次级文字
  },
} as const;

// ========================================
// 颜色工具函数
// ========================================

/**
 * 根据运势分数获取对应颜色
 */
export function getFortuneColor(score: number): typeof colors.fortune.excellent {
  if (score >= 90) return colors.fortune.excellent;
  if (score >= 70) return colors.fortune.good;
  if (score >= 40) return colors.fortune.normal;
  return colors.fortune.poor;
}

/**
 * 根据运势分数获取文字标签
 */
export function getFortuneLabel(score: number): string {
  if (score >= 90) return '大吉';
  if (score >= 70) return '吉';
  if (score >= 40) return '平';
  return '凶';
}

/**
 * 获取六维颜色
 */
export function getDimensionColor(dimension: keyof typeof colors.dimensions): typeof colors.dimensions.career {
  return colors.dimensions[dimension];
}

export default colors;
