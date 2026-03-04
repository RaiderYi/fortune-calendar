// ==========================================
// 设计令牌 - 响应式断点
// ==========================================
// 移动优先的断点设计
// ==========================================

export const breakpoints = {
  // 极小设备 (小手机)
  xs: 375,
  // 小型设备 (手机)
  sm: 640,
  // 中型设备 (大手机/小平板)
  md: 768,
  // 大型设备 (平板)
  lg: 1024,
  // 超大型设备 (桌面)
  xl: 1280,
  // 2倍超大型设备 (大屏桌面)
  '2xl': 1536,
} as const;

// Tailwind 类名快捷方式
export const breakpointClasses = {
  xs: '', // 移动优先，默认就是 xs
  sm: 'sm:',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:',
  '2xl': '2xl:',
} as const;

// 媒体查询字符串
export const mediaQueries = {
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
  // 仅移动端
  mobile: `(max-width: ${breakpoints.lg - 1}px)`,
  // 仅桌面端
  desktop: `(min-width: ${breakpoints.lg}px)`,
} as const;

// 设备类型判断
export const deviceTypes = {
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
} as const;

// ==========================================
// 响应式工具 Hook
// ==========================================

import { useState, useEffect } from 'react';

/**
 * 监听媒体查询
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

/**
 * 断点检测 Hooks
 */
export function useBreakpoint() {
  const isXs = useMediaQuery(`(max-width: ${breakpoints.sm - 1}px)`);
  const isSm = useMediaQuery(mediaQueries.sm);
  const isMd = useMediaQuery(mediaQueries.md);
  const isLg = useMediaQuery(mediaQueries.lg);
  const isXl = useMediaQuery(mediaQueries.xl);
  const is2xl = useMediaQuery(mediaQueries['2xl']);

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    is2xl,
    // 常用组合
    isMobile: !isLg,
    isTablet: isMd && !isLg,
    isDesktop: isLg,
  };
}

export default breakpoints;
