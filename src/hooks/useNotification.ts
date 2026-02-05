// ==========================================
// 通知 Hook
// React Hook 封装通知逻辑
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import {
  getNotificationSettings,
  saveNotificationSettings,
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  setupDailyNotification,
  shouldShowNotification,
  showDailyFortuneNotification,
  type NotificationSettings,
} from '../utils/notificationManager';

export function useNotification() {
  const [settings, setSettings] = useState<NotificationSettings>(getNotificationSettings);
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission);
  const [supported, setSupported] = useState(isNotificationSupported);

  // 更新权限状态
  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  // 请求权限
  const requestPermission = useCallback(async () => {
    try {
      const newPermission = await requestNotificationPermission();
      setPermission(newPermission);
      return newPermission === 'granted';
    } catch (error) {
      console.error('请求通知权限失败:', error);
      return false;
    }
  }, []);

  // 更新设置
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveNotificationSettings(updated);
  }, [settings]);

  // 显示每日运势通知
  const showDailyNotification = useCallback((score: number, keyword: string, emoji: string) => {
    if (shouldShowNotification('daily')) {
      showDailyFortuneNotification(score, keyword, emoji);
    }
  }, []);

  // 设置每日提醒
  useEffect(() => {
    if (!settings.enabled || permission !== 'granted') {
      return;
    }

    if (!settings.types.includes('daily')) {
      return;
    }

    const cleanup = setupDailyNotification(settings.dailyTime, () => {
      // 这里需要获取当日的运势数据
      // 暂时使用占位符，实际使用时需要传入真实数据
      console.log('每日提醒触发');
    });

    return cleanup;
  }, [settings.enabled, settings.dailyTime, settings.types, permission]);

  return {
    settings,
    permission,
    supported,
    requestPermission,
    updateSettings,
    showDailyNotification,
  };
}
