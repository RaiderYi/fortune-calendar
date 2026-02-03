// ==========================================
// 数据同步服务
// ==========================================

import type { UserProfile } from '../components/ProfileSettings';
import type { HistoryRecord } from '../utils/historyStorage';
import type { Achievement } from '../utils/achievementStorage';
import type { CheckinRecord } from '../utils/checkinStorage';
import type { FeedbackRecord } from '../utils/feedbackStorage';
import { getAuthHeaders } from './auth';

export interface SyncData {
  profile: UserProfile;
  history: HistoryRecord[];
  achievements: Achievement[];
  checkins: CheckinRecord[];
  feedbacks: FeedbackRecord[];
  lastSyncTime: number;
}

export interface SyncResponse {
  success: boolean;
  data?: SyncData;
  conflicts?: Array<{
    type: string;
    local: any;
    remote: any;
  }>;
  error?: string;
}

const API_BASE_URL = '/api';

/**
 * 上传用户数据到服务器
 */
export async function uploadUserData(data: SyncData): Promise<SyncResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sync/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('上传数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络错误',
    };
  }
}

/**
 * 从服务器下载用户数据
 */
export async function downloadUserData(): Promise<SyncResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sync/download`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 404) {
        // 服务器上没有数据，返回空数据
        return {
          success: true,
          data: {
            profile: {} as UserProfile,
            history: [],
            achievements: [],
            checkins: [],
            feedbacks: [],
            lastSyncTime: 0,
          },
        };
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('下载数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络错误',
    };
  }
}

/**
 * 同步用户数据（双向同步，解决冲突）
 */
export async function syncUserData(localData: SyncData): Promise<SyncResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/sync/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        localData,
        localLastSyncTime: localData.lastSyncTime,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('同步数据失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '网络错误',
    };
  }
}

/**
 * 解决数据冲突（时间戳优先策略）
 */
export function resolveConflicts(
  local: any,
  remote: any,
  timestampField: string = 'timestamp'
): any {
  const localTime = local[timestampField] || 0;
  const remoteTime = remote[timestampField] || 0;

  // 时间戳优先：选择较新的数据
  if (localTime >= remoteTime) {
    return local;
  } else {
    return remote;
  }
}

/**
 * 合并数据（处理数组类型的冲突）
 */
export function mergeData(
  localData: SyncData,
  remoteData: SyncData
): SyncData {
  // 合并历史记录（去重，保留最新的）
  const historyMap = new Map<string, HistoryRecord>();
  localData.history.forEach(record => {
    historyMap.set(record.date, record);
  });
  remoteData.history.forEach(record => {
    const existing = historyMap.get(record.date);
    if (!existing || record.timestamp > existing.timestamp) {
      historyMap.set(record.date, record);
    }
  });

  // 合并成就（保留进度最高的）
  const achievementMap = new Map<string, Achievement>();
  localData.achievements.forEach(achievement => {
    achievementMap.set(achievement.id, achievement);
  });
  remoteData.achievements.forEach(achievement => {
    const existing = achievementMap.get(achievement.id);
    if (!existing || achievement.progress > existing.progress) {
      achievementMap.set(achievement.id, achievement);
    }
  });

  // 合并签到记录（去重，保留最新的）
  const checkinMap = new Map<string, CheckinRecord>();
  localData.checkins.forEach(record => {
    checkinMap.set(record.date, record);
  });
  remoteData.checkins.forEach(record => {
    const existing = checkinMap.get(record.date);
    if (!existing || record.timestamp > existing.timestamp) {
      checkinMap.set(record.date, record);
    }
  });

  // 合并反馈记录（去重，保留最新的）
  const feedbackMap = new Map<string, FeedbackRecord>();
  localData.feedbacks.forEach(record => {
    feedbackMap.set(record.id, record);
  });
  remoteData.feedbacks.forEach(record => {
    const existing = feedbackMap.get(record.id);
    if (!existing || record.timestamp > existing.timestamp) {
      feedbackMap.set(record.id, record);
    }
  });

  // 合并用户档案（使用较新的）
  const profile = localData.profile.lastSyncTime > remoteData.profile.lastSyncTime
    ? localData.profile
    : remoteData.profile;

  return {
    profile,
    history: Array.from(historyMap.values()),
    achievements: Array.from(achievementMap.values()),
    checkins: Array.from(checkinMap.values()),
    feedbacks: Array.from(feedbackMap.values()),
    lastSyncTime: Math.max(localData.lastSyncTime, remoteData.lastSyncTime),
  };
}
