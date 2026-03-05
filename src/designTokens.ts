// ==========================================
// 设计令牌 - 统一的设计系统
// ==========================================

// 颜色系统
export const colors = {
  // 主色调
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  // 背景色
  background: {
    primary: '#F5F5F7',
    secondary: '#FFFFFF',
    tertiary: '#F3F4F6',
    dark: '#0f172a',
  },
  // 文本色
  text: {
    primary: '#111827',
    secondary: '#4B5563',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  // 运势维度颜色
  dimensions: {
    career: {
      DEFAULT: '#3B82F6',
      light: '#93C5FD',
    },
    wealth: {
      DEFAULT: '#EAB308',
      light: '#FDE047',
    },
    love: {
      DEFAULT: '#EC4899',
      light: '#F9A8D4',
    },
    health: {
      DEFAULT: '#22C55E',
      light: '#86EFAC',
    },
    study: {
      DEFAULT: '#8B5CF6',
      light: '#C4B5FD',
    },
    travel: {
      DEFAULT: '#06B6D4',
      light: '#67E8F9',
    },
  },
  // 运势等级颜色
  fortune: {
    excellent: { bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)', text: '#FFFFFF' },
    good: { bg: 'linear-gradient(135deg, #86efac 0%, #22c55e 100%)', text: '#FFFFFF' },
    normal: { bg: 'linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)', text: '#FFFFFF' },
    poor: { bg: 'linear-gradient(135deg, #fca5a5 0%, #ef4444 100%)', text: '#FFFFFF' },
  },
};

// 间距系统
export const space = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
};

// 圆角系统
export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  '3xl': '24px',
  full: '9999px',
};

// 阴影系统
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
};

// 辅助函数：根据分数获取运势颜色
export function getFortuneColor(score: number): string {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#3b82f6';
  if (score >= 40) return '#eab308';
  return '#ef4444';
}

// 辅助函数：根据分数获取运势标签
export function getFortuneLabel(score: number): string {
  if (score >= 90) return '大吉';
  if (score >= 80) return '吉';
  if (score >= 60) return '平';
  if (score >= 40) return '凶';
  return '大凶';
}
