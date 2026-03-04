// ==========================================
// 设计令牌 - 主入口
// ==========================================
// 所有设计资源的统一出口
// ==========================================

export { colors, getFortuneColor, getFortuneLabel, getDimensionColor } from './colors';
export { spacing, space, radius, shadows, size, duration, easing, zIndex } from './spacing';
export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyle,
  getFontSizeClass,
  getFontWeightClass,
} from './typography';
export { breakpoints, breakpointClasses, mediaQueries, deviceTypes, useBreakpoint, useMediaQuery } from './breakpoints';

// 默认导出
export { default } from './colors';
