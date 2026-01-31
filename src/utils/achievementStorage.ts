// ==========================================
// 成就系统存储工具
// ==========================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badge: string;
  category: 'checkin' | 'usage' | 'explore' | 'master';
  unlockedAt: number | null; // 解锁时间戳
  progress: number; // 当前进度
  target: number; // 目标值
}

export const ACHIEVEMENTS: Achievement[] = [
  // 签到类成就
  {
    id: 'checkin_3',
    name: '三日坚持',
    description: '连续签到3天',
    badge: '🌱',
    category: 'checkin',
    unlockedAt: null,
    progress: 0,
    target: 3,
  },
  {
    id: 'checkin_7',
    name: '一周坚持',
    description: '连续签到7天',
    badge: '⭐',
    category: 'checkin',
    unlockedAt: null,
    progress: 0,
    target: 7,
  },
  {
    id: 'checkin_30',
    name: '月度坚持',
    description: '连续签到30天',
    badge: '💎',
    category: 'checkin',
    unlockedAt: null,
    progress: 0,
    target: 30,
  },
  {
    id: 'checkin_100',
    name: '百日坚持',
    description: '连续签到100天',
    badge: '🏆',
    category: 'checkin',
    unlockedAt: null,
    progress: 0,
    target: 100,
  },
  // 使用类成就
  {
    id: 'query_10',
    name: '运势探索者',
    description: '查询运势10次',
    badge: '🔍',
    category: 'usage',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
  {
    id: 'query_50',
    name: '运势达人',
    description: '查询运势50次',
    badge: '🌟',
    category: 'usage',
    unlockedAt: null,
    progress: 0,
    target: 50,
  },
  {
    id: 'query_100',
    name: '运势大师',
    description: '查询运势100次',
    badge: '👑',
    category: 'usage',
    unlockedAt: null,
    progress: 0,
    target: 100,
  },
  // 探索类成就
  {
    id: 'dimension_all',
    name: '全面分析师',
    description: '查看所有六个维度的详情',
    badge: '📊',
    category: 'explore',
    unlockedAt: null,
    progress: 0,
    target: 6,
  },
  {
    id: 'trends_view',
    name: '趋势分析师',
    description: '查看趋势分析10次',
    badge: '📈',
    category: 'explore',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
  {
    id: 'history_clear',
    name: '数据管理员',
    description: '查看历史记录20次',
    badge: '📚',
    category: 'explore',
    unlockedAt: null,
    progress: 0,
    target: 20,
  },
  // 大师类成就
  {
    id: 'share_10',
    name: '分享达人',
    description: '分享日签10次',
    badge: '📤',
    category: 'master',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
  {
    id: 'feedback_10',
    name: '反馈专家',
    description: '反馈准确度10次',
    badge: '💬',
    category: 'master',
    unlockedAt: null,
    progress: 0,
    target: 10,
  },
];

const STORAGE_KEY = 'fortune_achievements';

/**
 * 获取所有成就数据
 */
export function getAllAchievements(): Achievement[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // 初始化成就数据
      const initialAchievements = ACHIEVEMENTS.map(a => ({ ...a }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialAchievements));
      return initialAchievements;
    }
    const saved = JSON.parse(data) as Achievement[];
    // 合并新的成就（如果添加了新成就）
    const merged = ACHIEVEMENTS.map(achievement => {
      const savedAchievement = saved.find(a => a.id === achievement.id);
      return savedAchievement || { ...achievement };
    });
    return merged;
  } catch (error) {
    console.error('获取成就数据失败:', error);
    return ACHIEVEMENTS.map(a => ({ ...a }));
  }
}

/**
 * 保存成就数据
 */
export function saveAchievements(achievements: Achievement[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
  } catch (error) {
    console.error('保存成就数据失败:', error);
  }
}

/**
 * 更新成就进度
 */
export function updateAchievementProgress(
  achievementId: string,
  progress: number
): Achievement | null {
  const achievements = getAllAchievements();
  const achievement = achievements.find(a => a.id === achievementId);
  
  if (!achievement) return null;
  
  // 如果已解锁，不更新
  if (achievement.unlockedAt) return achievement;
  
  // 更新进度
  achievement.progress = Math.min(progress, achievement.target);
  
  // 检查是否达成目标
  if (achievement.progress >= achievement.target && !achievement.unlockedAt) {
    achievement.unlockedAt = Date.now();
  }
  
  saveAchievements(achievements);
  return achievement;
}

/**
 * 批量更新成就进度
 */
export function updateAchievements(updates: Record<string, number>): Achievement[] {
  const achievements = getAllAchievements();
  let hasNewUnlock = false;
  
  achievements.forEach(achievement => {
    if (achievement.unlockedAt) return; // 已解锁的不更新
    
    const newProgress = updates[achievement.id];
    if (newProgress !== undefined) {
      const oldProgress = achievement.progress;
      achievement.progress = Math.min(newProgress, achievement.target);
      
      // 检查是否达成目标
      if (achievement.progress >= achievement.target && !achievement.unlockedAt) {
        achievement.unlockedAt = Date.now();
        hasNewUnlock = true;
      }
    }
  });
  
  saveAchievements(achievements);
  return achievements;
}

/**
 * 获取已解锁的成就
 */
export function getUnlockedAchievements(): Achievement[] {
  return getAllAchievements().filter(a => a.unlockedAt !== null);
}

/**
 * 获取成就统计
 */
export function getAchievementStats(): {
  total: number;
  unlocked: number;
  byCategory: Record<string, { total: number; unlocked: number }>;
} {
  const achievements = getAllAchievements();
  const unlocked = achievements.filter(a => a.unlockedAt !== null);
  
  const byCategory: Record<string, { total: number; unlocked: number }> = {};
  achievements.forEach(a => {
    if (!byCategory[a.category]) {
      byCategory[a.category] = { total: 0, unlocked: 0 };
    }
    byCategory[a.category].total++;
    if (a.unlockedAt) {
      byCategory[a.category].unlocked++;
    }
  });
  
  return {
    total: achievements.length,
    unlocked: unlocked.length,
    byCategory,
  };
}

/**
 * 检查是否有新解锁的成就
 */
export function checkNewUnlocks(): Achievement[] {
  // 这个方法会在每次查询运势时调用，检查是否有新成就解锁
  const achievements = getAllAchievements();
  return achievements.filter(a => {
    // 检查是否刚刚解锁（1分钟内）
    if (a.unlockedAt && Date.now() - a.unlockedAt < 60000) {
      return true;
    }
    return false;
  });
}
