// ==========================================
// 震动反馈工具
// ==========================================

/**
 * 震动反馈类型
 */
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * 震动模式配置
 */
const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  success: [10, 50, 20], // 轻-停-中
  warning: [20, 30, 20, 30, 20], // 连续短震
  error: [50, 100, 50], // 重-停-重
};

/**
 * 检查是否支持震动 API
 */
export function isHapticsSupported(): boolean {
  return 'vibrate' in navigator;
}

/**
 * 触发震动反馈
 * @param type 震动类型
 */
export function triggerHaptic(type: HapticType = 'light'): void {
  if (!isHapticsSupported()) {
    return;
  }

  try {
    const pattern = HAPTIC_PATTERNS[type];
    navigator.vibrate(pattern);
  } catch (error) {
    // 静默失败，不影响用户体验
    console.debug('Haptic feedback failed:', error);
  }
}

/**
 * 停止震动
 */
export function stopHaptic(): void {
  if (isHapticsSupported()) {
    navigator.vibrate(0);
  }
}

/**
 * React Hook: 提供震动反馈功能
 */
export function useHaptics() {
  return {
    isSupported: isHapticsSupported(),
    trigger: triggerHaptic,
    stop: stopHaptic,
    // 便捷方法
    light: () => triggerHaptic('light'),
    medium: () => triggerHaptic('medium'),
    heavy: () => triggerHaptic('heavy'),
    success: () => triggerHaptic('success'),
    warning: () => triggerHaptic('warning'),
    error: () => triggerHaptic('error'),
  };
}
