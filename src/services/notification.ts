// ==========================================
// 推送通知服务
// 支持 Web Push API 和本地通知
// ==========================================

const NOTIFICATION_SETTINGS_KEY = 'notification_settings';
const PUSH_SUBSCRIPTION_KEY = 'push_subscription';

export interface NotificationSettings {
  enabled: boolean;
  dailyFortune: boolean;      // 每日运势推送
  dailyFortuneTime: string;   // 推送时间（HH:mm）
  importantDates: boolean;    // 重要日期提醒
  checkinReminder: boolean;   // 签到提醒
  aiResponse: boolean;        // AI 回复通知
}

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: number;
  data?: Record<string, any>;
}

// ==================== 权限和支持检查 ====================

/**
 * 检查浏览器是否支持通知
 */
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

/**
 * 检查是否支持 Service Worker 和 Push API
 */
export function isPushSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

/**
 * 获取当前通知权限状态
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * 请求通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';
  
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error('请求通知权限失败:', error);
    return 'denied';
  }
}

// ==================== 本地通知 ====================

/**
 * 显示本地通知
 */
export async function showLocalNotification(
  title: string,
  options: NotificationOptions & { data?: Record<string, any> } = {}
): Promise<Notification | null> {
  if (!isNotificationSupported()) {
    console.warn('浏览器不支持通知');
    return null;
  }

  const permission = getNotificationPermission();
  if (permission !== 'granted') {
    console.warn('通知权限未授予');
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: '/favicon.ico',
      badge: '/apple-touch-icon.png',
      tag: options.tag || 'fortune-notification',
      requireInteraction: false,
      ...options,
    });

    // 点击通知时的处理
    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      notification.close();
      
      // 如果有自定义数据，可以处理跳转
      if (options.data?.url) {
        window.location.href = options.data.url;
      }
    };

    return notification;
  } catch (error) {
    console.error('显示通知失败:', error);
    return null;
  }
}

/**
 * 显示每日运势通知
 */
export async function showDailyFortuneNotification(
  score: number,
  keyword: string,
  emoji: string
): Promise<Notification | null> {
  return showLocalNotification('今日运势已更新', {
    body: `${emoji} ${keyword} - ${score}分`,
    tag: 'daily-fortune',
    data: { url: '/' },
    icon: '/favicon.ico',
  });
}

/**
 * 显示签到提醒
 */
export async function showCheckinReminder(): Promise<Notification | null> {
  return showLocalNotification('签到提醒', {
    body: '今天还没有签到哦，连续签到可获得成就徽章！',
    tag: 'checkin-reminder',
    data: { url: '/' },
  });
}

/**
 * 显示重要日期提醒
 */
export async function showImportantDateNotification(
  title: string,
  description: string
): Promise<Notification | null> {
  return showLocalNotification(title, {
    body: description,
    tag: 'important-date',
    data: { url: '/my' },
  });
}

// ==================== 设置管理 ====================

/**
 * 获取通知设置
 */
export function getNotificationSettings(): NotificationSettings {
  try {
    const data = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('获取通知设置失败:', error);
  }

  // 默认设置
  return {
    enabled: false,
    dailyFortune: true,
    dailyFortuneTime: '08:00',
    importantDates: true,
    checkinReminder: true,
    aiResponse: true,
  };
}

/**
 * 保存通知设置
 */
export function saveNotificationSettings(settings: NotificationSettings): void {
  try {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('保存通知设置失败:', error);
  }
}

/**
 * 启用通知
 */
export async function enableNotifications(): Promise<boolean> {
  const permission = await requestNotificationPermission();
  
  if (permission === 'granted') {
    const settings = getNotificationSettings();
    settings.enabled = true;
    saveNotificationSettings(settings);
    
    // 设置定时任务
    scheduleDailyFortuneNotification();
    
    return true;
  }
  
  return false;
}

/**
 * 禁用通知
 */
export function disableNotifications(): void {
  const settings = getNotificationSettings();
  settings.enabled = false;
  saveNotificationSettings(settings);
  
  // 清除定时任务
  clearScheduledNotifications();
}

// ==================== 定时通知 ====================

let dailyFortuneTimer: NodeJS.Timeout | null = null;
let checkinReminderTimer: NodeJS.Timeout | null = null;

/**
 * 计算下一次通知时间（毫秒）
 */
function getNextNotificationTime(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  
  target.setHours(hours, minutes, 0, 0);
  
  // 如果目标时间已过，设置为明天
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  return target.getTime() - now.getTime();
}

/**
 * 调度每日运势通知
 */
export function scheduleDailyFortuneNotification(): void {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || !settings.dailyFortune) return;
  
  // 清除现有定时器
  if (dailyFortuneTimer) {
    clearTimeout(dailyFortuneTimer);
  }
  
  const delay = getNextNotificationTime(settings.dailyFortuneTime);
  
  dailyFortuneTimer = setTimeout(async () => {
    // 显示通知
    await showLocalNotification('查看今日运势', {
      body: '新的一天开始了，看看今天的运势如何吧！',
      tag: 'daily-fortune-reminder',
      data: { url: '/' },
    });
    
    // 重新调度明天的通知
    scheduleDailyFortuneNotification();
  }, delay);
}

/**
 * 调度签到提醒
 */
export function scheduleCheckinReminder(): void {
  const settings = getNotificationSettings();
  
  if (!settings.enabled || !settings.checkinReminder) return;
  
  // 清除现有定时器
  if (checkinReminderTimer) {
    clearTimeout(checkinReminderTimer);
  }
  
  // 每天晚上 20:00 提醒签到
  const delay = getNextNotificationTime('20:00');
  
  checkinReminderTimer = setTimeout(async () => {
    await showCheckinReminder();
    scheduleCheckinReminder();
  }, delay);
}

/**
 * 清除所有定时通知
 */
export function clearScheduledNotifications(): void {
  if (dailyFortuneTimer) {
    clearTimeout(dailyFortuneTimer);
    dailyFortuneTimer = null;
  }
  if (checkinReminderTimer) {
    clearTimeout(checkinReminderTimer);
    checkinReminderTimer = null;
  }
}

/**
 * 初始化通知服务
 */
export function initNotificationService(): void {
  const settings = getNotificationSettings();
  
  if (settings.enabled && getNotificationPermission() === 'granted') {
    scheduleDailyFortuneNotification();
    scheduleCheckinReminder();
  }
}

// ==================== Push 订阅（需要 Service Worker）====================

/**
 * 订阅 Push 通知
 */
export async function subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    console.warn('浏览器不支持 Push API');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    // 保存订阅信息
    localStorage.setItem(PUSH_SUBSCRIPTION_KEY, JSON.stringify(subscription.toJSON()));

    // 发送到服务器
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error('订阅 Push 失败:', error);
    return null;
  }
}

/**
 * 取消 Push 订阅
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      localStorage.removeItem(PUSH_SUBSCRIPTION_KEY);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('取消 Push 订阅失败:', error);
    return false;
  }
}

/**
 * 发送订阅信息到服务器
 */
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  try {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON()),
    });
  } catch (error) {
    console.error('发送订阅信息失败:', error);
  }
}

/**
 * 工具函数：将 Base64 转换为 Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
