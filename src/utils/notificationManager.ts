// ==========================================
// 通知管理器
// 封装浏览器 Notification API，管理运势提醒
// ==========================================

export interface NotificationSettings {
  enabled: boolean;
  dailyTime: string; // HH:mm 格式
  types: string[]; // ['daily', 'important']
  soundEnabled: boolean;
}

const STORAGE_KEY = 'notification_settings';
const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  dailyTime: '09:00',
  types: ['daily'],
  soundEnabled: true,
};

/**
 * 获取通知设置
 */
export function getNotificationSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('读取通知设置失败:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * 保存通知设置
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('保存通知设置失败:', error);
  }
}

/**
 * 检查浏览器是否支持通知
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * 检查通知权限状态
 */
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    throw new Error('浏览器不支持通知功能');
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * 显示通知
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('浏览器不支持通知功能');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('通知权限未授予');
    return null;
  }

  const defaultOptions: NotificationOptions = {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'fortune-notification',
    requireInteraction: false,
    ...options,
  };

  try {
    const notification = new Notification(title, defaultOptions);
    
    // 自动关闭通知（5秒后）
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  } catch (error) {
    console.error('显示通知失败:', error);
    return null;
  }
}

/**
 * 显示每日运势提醒
 */
export function showDailyFortuneNotification(
  score: number,
  keyword: string,
  emoji: string
): void {
  const title = `今日运势：${score}分 ${emoji}`;
  const body = `今日主题：${keyword}\n点击查看详细运势分析`;

  showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'daily-fortune',
    data: {
      type: 'daily-fortune',
      score,
      keyword,
    },
  });
}

/**
 * 显示重要日期提醒
 */
export function showImportantDateNotification(
  title: string,
  message: string
): void {
  showNotification(title, {
    body: message,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: 'important-date',
    requireInteraction: true,
    data: {
      type: 'important-date',
    },
  });
}

/**
 * 计算下次提醒时间
 */
export function getNextNotificationTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const nextTime = new Date();
  
  nextTime.setHours(hours, minutes, 0, 0);
  
  // 如果今天的时间已过，设置为明天
  if (nextTime.getTime() <= now.getTime()) {
    nextTime.setDate(nextTime.getDate() + 1);
  }
  
  return nextTime.getTime();
}

/**
 * 设置每日提醒定时器
 */
export function setupDailyNotification(
  timeStr: string,
  callback: () => void
): () => void {
  const scheduleNext = () => {
    const nextTime = getNextNotificationTime(timeStr);
    const now = Date.now();
    const delay = nextTime - now;

    const timeoutId = setTimeout(() => {
      callback();
      // 设置下一次提醒（24小时后）
      scheduleNext();
    }, delay);

    return () => clearTimeout(timeoutId);
  };

  const cleanup = scheduleNext();
  return cleanup;
}

/**
 * 检查是否应该显示提醒
 */
export function shouldShowNotification(type: string): boolean {
  const settings = getNotificationSettings();
  
  if (!settings.enabled) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  return settings.types.includes(type);
}
