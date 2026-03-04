// ==========================================
// 设计令牌 - 排版系统
// ==========================================
// 字体栈: 系统字体 + 中文回退
// 原则: 清晰层次 · 舒适阅读 · 东方韵味
// ==========================================

// ==========================================
// 字体族
// ==========================================
export const fontFamily = {
  // 无衬线字体 - 正文、UI
  sans: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    '"Noto Sans SC"',      // 中文
    '"PingFang SC"',       // 苹果中文
    '"Microsoft YaHei"',   // 微软雅黑
    'sans-serif',
  ].join(', '),
  
  // 衬线字体 - 标题、装饰
  serif: [
    'Georgia',
    '"Times New Roman"',
    '"Songti SC"',         // 宋体
    '"SimSun"',            // 宋体Windows
    'serif',
  ].join(', '),
  
  // 等宽字体 - 代码、数字
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    '"SF Mono"',
    'Consolas',
    '"Liberation Mono"',
    'Menlo',
    'Monaco',
    '"Courier New"',
    'monospace',
  ].join(', '),
  
  // 运势分数字体 - 更大更清晰
  display: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Noto Sans SC"',
    '"PingFang SC"',
    'sans-serif',
  ].join(', '),
} as const;

// ==========================================
// 字体大小
// ==========================================
export const fontSize = {
  // 极小文字 - 标签、徽章
  '2xs': ['10px', { lineHeight: '12px', letterSpacing: '0.02em' }],
  
  // 超小文字 - 辅助说明
  xs: ['12px', { lineHeight: '16px', letterSpacing: '0.01em' }],
  
  // 小文字 - 次要内容
  sm: ['14px', { lineHeight: '20px', letterSpacing: '0' }],
  
  // 默认文字 - 正文
  base: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
  
  // 大文字 - 强调正文
  lg: ['18px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
  
  // 超大文字 - 小标题
  xl: ['20px', { lineHeight: '28px', letterSpacing: '-0.02em' }],
  
  // 2倍 - 区块标题
  '2xl': ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
  
  // 3倍 - 页面标题
  '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
  
  // 4倍 - 大标题
  '4xl': ['36px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
  
  // 5倍 - 展示标题
  '5xl': ['48px', { lineHeight: '1', letterSpacing: '-0.03em' }],
  
  // 6倍 - 超大展示
  '6xl': ['60px', { lineHeight: '1', letterSpacing: '-0.04em' }],
  
  // 运势分数专用
  'score-sm': ['48px', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '700' }],
  'score-md': ['72px', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
  'score-lg': ['96px', { lineHeight: '1', letterSpacing: '-0.06em', fontWeight: '800' }],
} as const;

// ==========================================
// 字体粗细
// ==========================================
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

// ==========================================
// 行高
// ==========================================
export const lineHeight = {
  none: '1',           // 无行距 - 大标题
  tight: '1.25',       // 紧凑 - 小标题
  snug: '1.375',       // 稍紧 - 短文本
  normal: '1.5',       // 正常 - 正文
  relaxed: '1.625',    // 宽松 - 长文本
  loose: '2',          // 松散 - 宽松排版
} as const;

// ==========================================
// 字间距
// ==========================================
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// ==========================================
// 文本样式组合 (预设)
// ==========================================
export const textStyle = {
  // 页面大标题
  'page-title': {
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  // 区块标题
  'section-title': {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  
  // 卡片标题
  'card-title': {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },
  
  // 正文
  body: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // 小字说明
  caption: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  
  // 辅助文字
  helper: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  
  // 标签文字
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
    textTransform: 'uppercase',
  },
  
  // 运势分数
  'fortune-score': {
    fontSize: fontSize['score-md'],
    fontWeight: fontWeight.extrabold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tighter,
  },
  
  // 运势主题
  'fortune-theme': {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
    fontStyle: 'italic',
  },
  
  // 按钮文字
  button: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wide,
  },
  
  // 导航文字
  nav: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
} as const;

// ==========================================
// 工具函数
// ==========================================

/**
 * 获取字体大小类名
 */
export function getFontSizeClass(size: keyof typeof fontSize): string {
  const sizeMap: Record<string, string> = {
    '2xs': 'text-[10px]',
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
  };
  return sizeMap[size] || 'text-base';
}

/**
 * 获取字体粗细类名
 */
export function getFontWeightClass(weight: keyof typeof fontWeight): string {
  return `font-${weight}`;
}

export default {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
};
