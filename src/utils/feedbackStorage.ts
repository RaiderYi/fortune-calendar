// ==========================================
// 准确性反馈存储工具
// ==========================================

export interface FeedbackRecord {
  id: string; // 唯一标识符（用于同步）
  date: string; // YYYY-MM-DD
  timestamp: number;
  accuracy: 'accurate' | 'inaccurate' | 'partial'; // 准确、不准确、部分准确
  comment?: string; // 可选评论
}

const STORAGE_KEY = 'fortune_feedback';
const MAX_RECORDS = 100; // 最多保存100条反馈

/**
 * 保存反馈记录
 */
export function saveFeedback(record: FeedbackRecord): void {
  try {
    const feedbacks = getAllFeedbacks();
    
    // 移除相同日期的旧记录
    const filtered = feedbacks.filter(f => f.date !== record.date);
    
    // 添加新记录
    const newFeedbacks = [record, ...filtered];
    
    // 限制最大记录数
    const trimmed = newFeedbacks.slice(0, MAX_RECORDS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('保存反馈失败:', error);
  }
}

/**
 * 获取所有反馈记录
 */
export function getAllFeedbacks(): FeedbackRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as FeedbackRecord[];
  } catch (error) {
    console.error('获取反馈记录失败:', error);
    return [];
  }
}

/**
 * 获取指定日期的反馈
 */
export function getFeedbackByDate(date: string): FeedbackRecord | null {
  const feedbacks = getAllFeedbacks();
  return feedbacks.find(f => f.date === date) || null;
}

/**
 * 获取反馈统计
 */
export function getFeedbackStats(): {
  total: number;
  accurate: number;
  inaccurate: number;
  partial: number;
  accuracyRate: number; // 准确率（准确 + 部分准确 / 总数）
} {
  const feedbacks = getAllFeedbacks();
  const accurate = feedbacks.filter(f => f.accuracy === 'accurate').length;
  const inaccurate = feedbacks.filter(f => f.accuracy === 'inaccurate').length;
  const partial = feedbacks.filter(f => f.accuracy === 'partial').length;
  const total = feedbacks.length;
  
  const accuracyRate = total > 0 
    ? Math.round(((accurate + partial * 0.5) / total) * 100)
    : 0;
  
  return {
    total,
    accurate,
    inaccurate,
    partial,
    accuracyRate,
  };
}

/**
 * 删除反馈记录
 */
export function deleteFeedback(date: string): void {
  try {
    const feedbacks = getAllFeedbacks();
    const filtered = feedbacks.filter(f => f.date !== date);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('删除反馈失败:', error);
  }
}
