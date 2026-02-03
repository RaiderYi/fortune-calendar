// ==========================================
// 滑动手势 Hook
// ==========================================

import { useRef, useCallback } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minDistance?: number; // 最小滑动距离
  maxTime?: number; // 最大滑动时间（毫秒）
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
}

/**
 * 滑动手势 Hook
 * 用于检测和处理滑动手势
 */
export function useSwipeGesture(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minDistance = 50,
    maxTime = 300,
  } = config;

  const touchData = useRef<TouchData | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchData.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchData.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchData.current.startX;
    const deltaY = touch.clientY - touchData.current.startY;
    const deltaTime = Date.now() - touchData.current.startTime;

    // 检查是否在时间限制内
    if (deltaTime > maxTime) {
      touchData.current = null;
      return;
    }

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // 判断滑动方向
    if (absX > absY && absX >= minDistance) {
      // 水平滑动
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absY > absX && absY >= minDistance) {
      // 垂直滑动
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    touchData.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minDistance, maxTime]);

  const handleTouchCancel = useCallback(() => {
    touchData.current = null;
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchCancel,
  };
}

/**
 * 创建滑动手势的绑定属性
 * 用于直接绑定到元素上
 */
export function createSwipeHandlers(config: SwipeConfig) {
  let touchData: TouchData | null = null;
  const { minDistance = 50, maxTime = 300 } = config;

  return {
    onTouchStart: (e: TouchEvent) => {
      const touch = e.touches[0];
      touchData = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
      };
    },
    onTouchEnd: (e: TouchEvent) => {
      if (!touchData) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchData.startX;
      const deltaY = touch.clientY - touchData.startY;
      const deltaTime = Date.now() - touchData.startTime;

      if (deltaTime <= maxTime) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY && absX >= minDistance) {
          if (deltaX > 0) {
            config.onSwipeRight?.();
          } else {
            config.onSwipeLeft?.();
          }
        } else if (absY > absX && absY >= minDistance) {
          if (deltaY > 0) {
            config.onSwipeDown?.();
          } else {
            config.onSwipeUp?.();
          }
        }
      }

      touchData = null;
    },
  };
}
