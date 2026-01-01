// src/utils/historyStorage.ts

export interface HistoryRecord {
  date: string; // YYYY-MM-DD 格式
  timestamp: number; // 查询时间戳
  fortune: {
    totalScore: number;
    mainTheme: {
      keyword: string;
      emoji: string;
    };
    dimensions: {
      career: { score: number };
      wealth: { score: number };
      romance: { score: number };
      health: { score: number };
      academic: { score: number };
      travel: { score: number };
    };
  };
}

const STORAGE_KEY = 'fortune_history';
const MAX_RECORDS = 30; // 最多保存30条记录

/**
 * 保存历史记录
 */
export function saveHistory(record: HistoryRecord): void {
  try {
    const history = getHistory();
    
    // 移除相同日期的旧记录
    const filtered = history.filter(h => h.date !== record.date);
    
    // 添加新记录到开头
    const newHistory = [record, ...filtered];
    
    // 限制最大记录数
    const trimmed = newHistory.slice(0, MAX_RECORDS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('保存历史记录失败:', error);
  }
}

/**
 * 获取所有历史记录
 */
export function getHistory(): HistoryRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const history = JSON.parse(data) as HistoryRecord[];
    
    // 按时间戳倒序排序（最新的在前）
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('获取历史记录失败:', error);
    return [];
  }
}

/**
 * 清除所有历史记录
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除历史记录失败:', error);
  }
}

/**
 * 获取指定日期范围的历史记录
 */
export function getHistoryByDateRange(startDate: Date, endDate: Date): HistoryRecord[] {
  const history = getHistory();
  
  return history.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= startDate && recordDate <= endDate;
  });
}

/**
 * 格式化日期显示
 */
export function formatHistoryDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // 重置时间为 00:00:00 以便比较日期
  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const compareYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (compareDate.getTime() === compareToday.getTime()) {
    return '今天';
  } else if (compareDate.getTime() === compareYesterday.getTime()) {
    return '昨天';
  } else {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}月${day}日`;
  }
}

/**
 * 获取统计信息
 */
export function getHistoryStats() {
  const history = getHistory();
  
  if (history.length === 0) {
    return null;
  }
  
  // 计算平均分
  const avgScore = history.reduce((sum, h) => sum + h.fortune.totalScore, 0) / history.length;
  
  // 找出最高分和最低分
  const maxRecord = history.reduce((max, h) => 
    h.fortune.totalScore > max.fortune.totalScore ? h : max
  );
  const minRecord = history.reduce((min, h) => 
    h.fortune.totalScore < min.fortune.totalScore ? h : min
  );
  
  return {
    total: history.length,
    avgScore: Math.round(avgScore),
    maxRecord,
    minRecord,
  };
}
