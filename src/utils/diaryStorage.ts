// ==========================================
// 日记存储工具
// 管理运势日记数据
// ==========================================

export interface DiaryEntry {
  date: string; // YYYY-MM-DD 格式
  timestamp: number; // 记录时间戳
  mood: 'happy' | 'neutral' | 'sad' | 'excited' | 'anxious';
  events: string[];
  notes: string;
  fortuneScore: number; // 当日运势分数
  accuracy?: 'accurate' | 'inaccurate' | 'neutral'; // 预测准确性
}

const STORAGE_KEY = 'fortune_diary';
const MAX_ENTRIES = 365; // 最多保存365条记录

/**
 * 保存日记
 */
export function saveDiaryEntry(entry: DiaryEntry): void {
  try {
    const entries = getDiaryEntries();
    
    // 移除相同日期的旧记录
    const filtered = entries.filter(e => e.date !== entry.date);
    
    // 添加新记录
    const newEntries = [entry, ...filtered];
    
    // 限制最大记录数
    const trimmed = newEntries.slice(0, MAX_ENTRIES);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('保存日记失败:', error);
  }
}

/**
 * 获取所有日记
 */
export function getDiaryEntries(): DiaryEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const entries = JSON.parse(data) as DiaryEntry[];
    
    // 按日期倒序排序（最新的在前）
    return entries.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('获取日记失败:', error);
    return [];
  }
}

/**
 * 获取指定日期的日记
 */
export function getDiaryEntry(date: string): DiaryEntry | null {
  const entries = getDiaryEntries();
  return entries.find(e => e.date === date) || null;
}

/**
 * 删除日记
 */
export function deleteDiaryEntry(date: string): void {
  try {
    const entries = getDiaryEntries();
    const filtered = entries.filter(e => e.date !== date);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('删除日记失败:', error);
  }
}

/**
 * 获取日期范围的日记
 */
export function getDiaryEntriesByDateRange(startDate: Date, endDate: Date): DiaryEntry[] {
  const entries = getDiaryEntries();
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startDate && entryDate <= endDate;
  });
}

/**
 * 获取日记统计
 */
export function getDiaryStats() {
  const entries = getDiaryEntries();
  
  if (entries.length === 0) {
    return null;
  }

  // 心情分布
  const moodCounts: Record<string, number> = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  // 预测准确性统计
  const accuracyCounts: Record<string, number> = {};
  entries.forEach(e => {
    if (e.accuracy) {
      accuracyCounts[e.accuracy] = (accuracyCounts[e.accuracy] || 0) + 1;
    }
  });

  // 高分日与实际情况对比
  const highScoreEntries = entries.filter(e => e.fortuneScore >= 70);
  const highScoreHappyDays = highScoreEntries.filter(e => 
    e.mood === 'happy' || e.mood === 'excited'
  ).length;

  // 低分日与实际情况对比
  const lowScoreEntries = entries.filter(e => e.fortuneScore < 50);
  const lowScoreSadDays = lowScoreEntries.filter(e => 
    e.mood === 'sad' || e.mood === 'anxious'
  ).length;

  return {
    total: entries.length,
    moodCounts,
    accuracyCounts,
    highScoreAccuracy: highScoreEntries.length > 0
      ? Math.round((highScoreHappyDays / highScoreEntries.length) * 100)
      : 0,
    lowScoreAccuracy: lowScoreEntries.length > 0
      ? Math.round((lowScoreSadDays / lowScoreEntries.length) * 100)
      : 0,
  };
}

/**
 * 获取最近N天的日记
 */
export function getRecentDiaryEntries(days: number = 7): DiaryEntry[] {
  const entries = getDiaryEntries();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= cutoffDate;
  });
}
