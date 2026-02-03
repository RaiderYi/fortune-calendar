// ==========================================
// 数据迁移工具 - localStorage 数据迁移到云端
// ==========================================

import type { UserProfile } from '../components/ProfileSettings';
import type { SyncData } from '../services/sync';
import { uploadUserData, downloadUserData, mergeData } from '../services/sync';
import { collectLocalData, applySyncData, setLastSyncTime } from './syncStorage';
import { getHistory } from './historyStorage';
import { getAllAchievements } from './achievementStorage';
import { getAllCheckinRecords } from './checkinStorage';
import { getAllFeedbacks } from './feedbackStorage';

export interface MigrationResult {
  success: boolean;
  migratedItems: {
    profile: boolean;
    history: number;
    achievements: number;
    checkins: number;
    feedbacks: number;
  };
  conflicts?: number;
  error?: string;
}

/**
 * 检查本地是否有需要迁移的数据
 */
export function hasLocalData(): boolean {
  const profile = localStorage.getItem('user_profile');
  const history = getHistory();
  const achievements = getAllAchievements();
  const checkins = getAllCheckinRecords();
  const feedbacks = getAllFeedbacks();

  return !!(
    profile ||
    history.length > 0 ||
    achievements.some(a => a.unlockedAt !== null || a.progress > 0) ||
    checkins.length > 0 ||
    feedbacks.length > 0
  );
}

/**
 * 获取本地数据统计
 */
export function getLocalDataStats(): {
  hasProfile: boolean;
  historyCount: number;
  achievementsUnlocked: number;
  checkinsCount: number;
  feedbacksCount: number;
} {
  const profile = localStorage.getItem('user_profile');
  const history = getHistory();
  const achievements = getAllAchievements();
  const checkins = getAllCheckinRecords();
  const feedbacks = getAllFeedbacks();

  return {
    hasProfile: !!profile,
    historyCount: history.length,
    achievementsUnlocked: achievements.filter(a => a.unlockedAt !== null).length,
    checkinsCount: checkins.length,
    feedbacksCount: feedbacks.length,
  };
}

/**
 * 迁移本地数据到云端（首次登录时调用）
 */
export async function migrateLocalToCloud(profile: UserProfile): Promise<MigrationResult> {
  try {
    // 收集本地数据
    const localData = collectLocalData(profile);
    
    // 下载云端数据
    const cloudResponse = await downloadUserData();
    
    if (!cloudResponse.success && cloudResponse.error !== '未找到用户数据') {
      return {
        success: false,
        migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
        error: cloudResponse.error,
      };
    }

    const cloudData = cloudResponse.data || {
      profile: {} as UserProfile,
      history: [],
      achievements: [],
      checkins: [],
      feedbacks: [],
      lastSyncTime: 0,
    };

    // 合并数据
    const mergedData = mergeData(localData, cloudData);
    mergedData.lastSyncTime = Date.now();

    // 上传合并后的数据
    const uploadResponse = await uploadUserData(mergedData);
    
    if (!uploadResponse.success) {
      return {
        success: false,
        migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
        error: uploadResponse.error,
      };
    }

    // 更新本地同步时间
    setLastSyncTime(mergedData.lastSyncTime);

    return {
      success: true,
      migratedItems: {
        profile: !!mergedData.profile,
        history: mergedData.history.length,
        achievements: mergedData.achievements.filter(a => a.unlockedAt !== null).length,
        checkins: mergedData.checkins.length,
        feedbacks: mergedData.feedbacks.length,
      },
    };
  } catch (error) {
    console.error('数据迁移失败:', error);
    return {
      success: false,
      migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
      error: error instanceof Error ? error.message : '迁移失败',
    };
  }
}

/**
 * 从云端恢复数据到本地（切换设备时调用）
 */
export async function restoreFromCloud(): Promise<MigrationResult> {
  try {
    // 下载云端数据
    const cloudResponse = await downloadUserData();
    
    if (!cloudResponse.success) {
      return {
        success: false,
        migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
        error: cloudResponse.error || '下载失败',
      };
    }

    const cloudData = cloudResponse.data;
    
    if (!cloudData) {
      return {
        success: false,
        migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
        error: '云端无数据',
      };
    }

    // 应用到本地
    applySyncData(cloudData);

    return {
      success: true,
      migratedItems: {
        profile: !!cloudData.profile,
        history: cloudData.history.length,
        achievements: cloudData.achievements.filter(a => a.unlockedAt !== null).length,
        checkins: cloudData.checkins.length,
        feedbacks: cloudData.feedbacks.length,
      },
    };
  } catch (error) {
    console.error('数据恢复失败:', error);
    return {
      success: false,
      migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
      error: error instanceof Error ? error.message : '恢复失败',
    };
  }
}

/**
 * 清除本地数据（用户登出时可选）
 */
export function clearLocalData(keepProfile: boolean = false): void {
  const keysToRemove = [
    'fortune_history',
    'fortune_achievements',
    'fortune_checkin',
    'fortune_feedbacks',
    'last_sync_time',
    'sync_queue',
  ];

  if (!keepProfile) {
    keysToRemove.push('user_profile');
  }

  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`清除 ${key} 失败:`, error);
    }
  });
}

/**
 * 导出本地数据为 JSON 文件（备份功能）
 */
export function exportLocalData(profile: UserProfile): string {
  const data = collectLocalData(profile);
  return JSON.stringify(data, null, 2);
}

/**
 * 从 JSON 文件导入数据（恢复备份）
 */
export function importLocalData(jsonString: string): MigrationResult {
  try {
    const data = JSON.parse(jsonString) as SyncData;
    
    // 验证数据结构
    if (!data || typeof data !== 'object') {
      return {
        success: false,
        migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
        error: '无效的数据格式',
      };
    }

    // 应用数据
    applySyncData(data);

    return {
      success: true,
      migratedItems: {
        profile: !!data.profile,
        history: (data.history || []).length,
        achievements: (data.achievements || []).filter(a => a.unlockedAt !== null).length,
        checkins: (data.checkins || []).length,
        feedbacks: (data.feedbacks || []).length,
      },
    };
  } catch (error) {
    console.error('数据导入失败:', error);
    return {
      success: false,
      migratedItems: { profile: false, history: 0, achievements: 0, checkins: 0, feedbacks: 0 },
      error: error instanceof Error ? error.message : '导入失败',
    };
  }
}
