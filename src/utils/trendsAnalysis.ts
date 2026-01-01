// src/utils/trendsAnalysis.ts

import { getHistory, getHistoryByDateRange, type HistoryRecord } from './historyStorage';

/**
 * 趋势数据点
 */
export interface TrendDataPoint {
  date: string; // YYYY-MM-DD
  score: number;
  label: string; // 如 "今天", "昨天", "12/28"
  keyword: string;
  emoji: string;
}

/**
 * 六维度趋势数据
 */
export interface DimensionTrendData {
  date: string;
  career: number;
  wealth: number;
  romance: number;
  health: number;
  academic: number;
  travel: number;
}

/**
 * 趋势分析结果
 */
export interface TrendAnalysis {
  trend: 'up' | 'down' | 'stable'; // 趋势方向
  avgScore: number; // 平均分
  maxDay: { date: string; score: number; keyword: string }; // 最好的一天
  minDay: { date: string; score: number; keyword: string }; // 最差的一天
  volatility: 'high' | 'medium' | 'low'; // 波动性
  suggestion: string; // 建议
}

/**
 * 获取最近N天的趋势数据
 */
export function getRecentTrends(days: number = 7): TrendDataPoint[] {
  const history = getHistory();
  
  // 按日期排序（从旧到新）
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // 取最近N天
  const recentHistory = sortedHistory.slice(-days);
  
  return recentHistory.map(record => ({
    date: record.date,
    score: record.fortune.totalScore,
    label: formatDateLabel(record.date),
    keyword: record.fortune.mainTheme.keyword,
    emoji: record.fortune.mainTheme.emoji,
  }));
}

/**
 * 获取六维度趋势数据
 */
export function getDimensionTrends(days: number = 7): DimensionTrendData[] {
  const history = getHistory();
  
  const sortedHistory = [...history].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const recentHistory = sortedHistory.slice(-days);
  
  return recentHistory.map(record => ({
    date: formatDateLabel(record.date),
    career: record.fortune.dimensions.career.score,
    wealth: record.fortune.dimensions.wealth.score,
    romance: record.fortune.dimensions.romance.score,
    health: record.fortune.dimensions.health.score,
    academic: record.fortune.dimensions.academic.score,
    travel: record.fortune.dimensions.travel.score,
  }));
}

/**
 * 分析趋势
 */
export function analyzeTrend(days: number = 7): TrendAnalysis | null {
  const trends = getRecentTrends(days);
  
  if (trends.length < 2) {
    return null; // 数据不足
  }
  
  // 计算平均分
  const avgScore = Math.round(
    trends.reduce((sum, t) => sum + t.score, 0) / trends.length
  );
  
  // 找出最高分和最低分
  const maxDay = trends.reduce((max, t) => 
    t.score > max.score ? t : max
  );
  const minDay = trends.reduce((min, t) => 
    t.score < min.score ? t : min
  );
  
  // 判断趋势方向（比较前半部分和后半部分的平均值）
  const mid = Math.floor(trends.length / 2);
  const firstHalf = trends.slice(0, mid);
  const secondHalf = trends.slice(mid);
  
  const firstAvg = firstHalf.reduce((sum, t) => sum + t.score, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, t) => sum + t.score, 0) / secondHalf.length;
  
  let trend: 'up' | 'down' | 'stable';
  if (secondAvg > firstAvg + 5) {
    trend = 'up';
  } else if (secondAvg < firstAvg - 5) {
    trend = 'down';
  } else {
    trend = 'stable';
  }
  
  // 计算波动性（标准差）
  const variance = trends.reduce((sum, t) => 
    sum + Math.pow(t.score - avgScore, 2), 0
  ) / trends.length;
  const stdDev = Math.sqrt(variance);
  
  let volatility: 'high' | 'medium' | 'low';
  if (stdDev > 15) {
    volatility = 'high';
  } else if (stdDev > 8) {
    volatility = 'medium';
  } else {
    volatility = 'low';
  }
  
  // 生成建议
  const suggestion = generateSuggestion(trend, avgScore, volatility, maxDay, minDay);
  
  return {
    trend,
    avgScore,
    maxDay: {
      date: maxDay.date,
      score: maxDay.score,
      keyword: maxDay.keyword,
    },
    minDay: {
      date: minDay.date,
      score: minDay.score,
      keyword: minDay.keyword,
    },
    volatility,
    suggestion,
  };
}

/**
 * 生成建议
 */
function generateSuggestion(
  trend: 'up' | 'down' | 'stable',
  avgScore: number,
  volatility: 'high' | 'medium' | 'low',
  maxDay: TrendDataPoint,
  minDay: TrendDataPoint
): string {
  if (trend === 'up') {
    if (avgScore >= 75) {
      return '运势持续走高，正是大展拳脚的好时机！继续保持积极进取的态度。';
    } else {
      return '运势正在回升，虽然还有提升空间，但趋势向好。把握机会，稳步前进。';
    }
  } else if (trend === 'down') {
    if (avgScore < 60) {
      return '运势处于低谷期，建议韬光养晦，专注内在成长。静待时机，厚积薄发。';
    } else {
      return '运势略有下滑，但整体尚可。适当调整节奏，避免冒进，稳健为上。';
    }
  } else {
    if (volatility === 'high') {
      return '运势波动较大，时好时坏。建议保持平常心，以不变应万变。';
    } else if (avgScore >= 75) {
      return '运势稳定在高位，非常理想的状态。继续保持现有节奏即可。';
    } else {
      return '运势平稳，虽无大起大落，但也缺少突破。可考虑主动寻求新机会。';
    }
  }
}

/**
 * 格式化日期标签
 */
function formatDateLabel(dateStr: string): string {
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
    return `${month}/${day}`;
  }
}

/**
 * 获取指定日期范围的数据
 */
export function getTrendsForDateRange(startDate: Date, endDate: Date): TrendDataPoint[] {
  const history = getHistoryByDateRange(startDate, endDate);
  
  return history
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(record => ({
      date: record.date,
      score: record.fortune.totalScore,
      label: formatDateLabel(record.date),
      keyword: record.fortune.mainTheme.keyword,
      emoji: record.fortune.mainTheme.emoji,
    }));
}

/**
 * 获取最佳运势日期（前N个）
 */
export function getTopDays(limit: number = 3): TrendDataPoint[] {
  const history = getHistory();
  
  return history
    .map(record => ({
      date: record.date,
      score: record.fortune.totalScore,
      label: formatDateLabel(record.date),
      keyword: record.fortune.mainTheme.keyword,
      emoji: record.fortune.mainTheme.emoji,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
