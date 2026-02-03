// ==========================================
// 同步存储工具
// ==========================================

import type { UserProfile } from '../components/ProfileSettings';
import type { HistoryRecord } from './historyStorage';
import type { Achievement } from './achievementStorage';
import type { CheckinRecord } from './checkinStorage';
import type { FeedbackRecord } from './feedbackStorage';
import type { SyncData } from '../services/sync';
import { getHistory } from './historyStorage';
import { getAllAchievements } from './achievementStorage';
import { getAllCheckinRecords } from './checkinStorage';
import { getAllFeedbacks } from './feedbackStorage';

const LAST_SYNC_TIME_KEY = 'last_sync_time';
const SYNC_QUEUE_KEY = 'sync_queue';
const SYNC_ENABLED_KEY = 'sync_enabled';

/**
 * 收集所有本地数据
 */
export function collectLocalData(profile: UserProfile): SyncData {
  return {
    profile: {
      ...profile,
      lastSyncTime: Date.now(),
    },
    history: getHistory(),
    achievements: getAllAchievements(),
    checkins: getAllCheckinRecords(),
    feedbacks: getAllFeedbacks(),
    lastSyncTime: getLastSyncTime(),
  };
}

/**
 * 应用同步数据到本地存储
 */
export function applySyncData(data: SyncData): void {
  // 应用用户档案
  if (data.profile) {
    localStorage.setItem('user_profile', JSON.stringify(data.profile));
  }

  // 应用历史记录
  if (data.history && data.history.length > 0) {
    localStorage.setItem('fortune_history', JSON.stringify(data.history));
  }

  // 应用成就
  if (data.achievements && data.achievements.length > 0) {
    localStorage.setItem('fortune_achievements', JSON.stringify(data.achievements));
  }

  // 应用签到记录
  if (data.checkins && data.checkins.length > 0) {
    localStorage.setItem('fortune_checkins', JSON.stringify(data.checkins));
  }

  // 应用反馈记录
  if (data.feedbacks && data.feedbacks.length > 0) {
    localStorage.setItem('fortune_feedbacks', JSON.stringify(data.feedbacks));
  }

  // 更新最后同步时间
  setLastSyncTime(data.lastSyncTime || Date.now());
}

/**
 * 获取最后同步时间
 */
export function getLastSyncTime(): number {
  try {
    const time = localStorage.getItem(LAST_SYNC_TIME_KEY);
    return time ? parseInt(time, 10) : 0;
  } catch {
    return 0;
  }
}

/**
 * 设置最后同步时间
 */
export function setLastSyncTime(time: number): void {
  try {
    localStorage.setItem(LAST_SYNC_TIME_KEY, time.toString());
  } catch (error) {
    console.error('保存同步时间失败:', error);
  }
}

/**
 * 添加到同步队列（离线时使用）
 */
export function addToSyncQueue(data: Partial<SyncData>): void {
  try {
    const queue = getSyncQueue();
    queue.push({
      ...data,
      timestamp: Date.now(),
    });
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('添加到同步队列失败:', error);
  }
}

/**
 * 获取同步队列
 */
export function getSyncQueue(): Array<Partial<SyncData> & { timestamp: number }> {
  try {
    const queue = localStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) : [];
  } catch {
    return [];
  }
}

/**
 * 清空同步队列
 */
export function clearSyncQueue(): void {
  try {
    localStorage.removeItem(SYNC_QUEUE_KEY);
  } catch (error) {
    console.error('清空同步队列失败:', error);
  }
}

/**
 * 检查是否需要同步
 */
export function needsSync(lastRemoteSyncTime: number): boolean {
  const lastLocalSyncTime = getLastSyncTime();
  return lastRemoteSyncTime > lastLocalSyncTime;
}

/**
 * 启用/禁用同步
 */
export function setSyncEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SYNC_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('设置同步状态失败:', error);
  }
}

/**
 * 检查同步是否启用
 */
export function isSyncEnabled(): boolean {
  try {
    const enabled = localStorage.getItem(SYNC_ENABLED_KEY);
    return enabled !== 'false'; // 默认启用
  } catch {
    return true;
  }
}

/**
 * 检查网络状态
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * 监听网络状态变化
 */
export function onNetworkStatusChange(callback: (online: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
