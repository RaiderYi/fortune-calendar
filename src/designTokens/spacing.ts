// ==========================================
// 设计令牌 - 间距系统
// ==========================================
// 基于 4px 网格系统
// 黄金比例: 4, 8, 12, 16, 24, 32, 48, 64...
// ==========================================

export const spacing = {
  // 基础间距
  0: '0px',
  0.5: '2px',   // 极小
  1: '4px',     // 超小
  1.5: '6px',
  2: '8px',     // 小
  2.5: '10px',
  3: '12px',    // 中小
  3.5: '14px',
  4: '16px',    // 中
  5: '20px',
  6: '24px',    // 大
  7: '28px',
  8: '32px',    // 超大
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',   // 极大
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
  36: '144px',
  40: '160px',
  44: '176px',
  48: '192px',
  52: '208px',
  56: '224px',  // 侧边栏宽度
  60: '240px',
  64: '256px',
  72: '288px',
  80: '320px',
  96: '384px',
} as const;

// 语义化间距
export const space = {
  none: spacing[0],
  xs: spacing[1],     // 4px - 图标内边距
  sm: spacing[2],     // 8px - 紧凑间距
  md: spacing[4],     // 16px - 默认间距
  lg: spacing[6],     // 24px - 宽松间距
  xl: spacing[8],     // 32px - 区块间距
  '2xl': spacing[12], // 48px - 大区块间距
  '3xl': spacing[16], // 64px - 页面间距
  '4xl': spacing[24], // 96px - 超大间距
} as const;

// ==========================================
// 圆角系统
// ==========================================
export const radius = {
  none: '0px',
  sm: '6px',      // 小圆角 - 按钮、标签
  DEFAULT: '8px', // 默认圆角
  md: '12px',     // 中圆角 - 卡片
  lg: '16px',     // 大圆角 - 大卡片
  xl: '20px',     // 超大圆角
  '2xl': '24px',  // 2倍圆角 - 弹窗
  '3xl': '32px',  // 3倍圆角
  full: '9999px', // 完全圆形
} as const;

// ==========================================
// 阴影系统
// ==========================================
export const shadows = {
  // 基础阴影
  none: 'none',
  
  // 小阴影 - 按钮、输入框
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  
  // 默认阴影 - 卡片
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  
  // 中阴影 - 悬浮卡片
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  
  // 大阴影 - 下拉菜单、弹窗
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  
  // 超大阴影 - 模态框
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  
  // 2倍阴影
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  
  // 内阴影
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // 玻璃拟态阴影
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  
  // 彩色阴影 - 主色
  colored: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
  
  // 深色模式阴影
  dark: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
  },
} as const;

// ==========================================
// 尺寸系统
// ==========================================
export const size = {
  // 图标尺寸
  icon: {
    xs: '12px',
    sm: '16px',
    DEFAULT: '20px',
    lg: '24px',
    xl: '32px',
    '2xl': '40px',
    '3xl': '48px',
  },
  
  // 按钮高度
  button: {
    sm: '32px',
    DEFAULT: '40px',
    lg: '48px',
    xl: '56px',
  },
  
  // 输入框高度
  input: {
    sm: '32px',
    DEFAULT: '40px',
    lg: '48px',
  },
  
  // 侧边栏宽度
  sidebar: {
    sm: '200px',
    DEFAULT: '224px', // w-56
    lg: '256px',      // w-64
  },
  
  // 最大内容宽度
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

// ==========================================
// 动画时长
// ==========================================
export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  slowest: '700ms',
} as const;

// ==========================================
// 缓动函数
// ==========================================
export const easing = {
  // 标准缓动
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // 减速缓动 - 元素进入
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  
  // 加速缓动 - 元素离开
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
  
  // 弹性缓动
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Spring 缓动
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ==========================================
// Z-Index 层级
// ==========================================
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

export default { spacing, space, radius, shadows, size, duration, easing, zIndex };
