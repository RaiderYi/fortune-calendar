// ==========================================
// 报告生成器
// 生成运势周报和月报
// ==========================================

import { getHistory, getHistoryByDateRange, type HistoryRecord } from './historyStorage';

export interface FortuneReport {
  period: 'week' | 'month';
  startDate: string;
  endDate: string;
  avgScore: number;
  maxScore: { date: string; score: number };
  minScore: { date: string; score: number };
  trend: Array<{ date: string; score: number }>;
  dimensionStats: Record<string, {
    avg: number;
    max: number;
    min: number;
  }>;
  totalDays: number;
  highScoreDays: number; // 高分日（>=70）数量
  lowScoreDays: number; // 低分日（<50）数量
}

/**
 * 生成周报
 */
export function generateWeeklyReport(startDate: Date): FortuneReport | null {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  return generateReport(startDate, endDate, 'week');
}

/**
 * 生成月报
 */
export function generateMonthlyReport(year: number, month: number): FortuneReport | null {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // 当月最后一天

  return generateReport(startDate, endDate, 'month');
}

/**
 * 生成报告
 */
function generateReport(
  startDate: Date,
  endDate: Date,
  period: 'week' | 'month'
): FortuneReport | null {
  const records = getHistoryByDateRange(startDate, endDate);

  if (records.length === 0) {
    return null;
  }

  // 计算平均分
  const totalScore = records.reduce((sum, r) => sum + r.fortune.totalScore, 0);
  const avgScore = Math.round(totalScore / records.length);

  // 找出最高分和最低分
  const maxRecord = records.reduce((max, r) =>
    r.fortune.totalScore > max.fortune.totalScore ? r : max
  );
  const minRecord = records.reduce((min, r) =>
    r.fortune.totalScore < min.fortune.totalScore ? r : min
  );

  // 生成趋势数据
  const trend = records
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(r => ({
      date: r.date,
      score: r.fortune.totalScore,
    }));

  // 计算维度统计
  const dimensionStats: Record<string, { avg: number; max: number; min: number }> = {};
  const dimensions = ['career', 'wealth', 'romance', 'health', 'academic', 'travel'] as const;

  dimensions.forEach(dim => {
    const scores = records
      .map(r => r.fortune.dimensions[dim]?.score || 0)
      .filter(s => s > 0);

    if (scores.length > 0) {
      dimensionStats[dim] = {
        avg: Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length),
        max: Math.max(...scores),
        min: Math.min(...scores),
      };
    }
  });

  // 统计高分日和低分日
  const highScoreDays = records.filter(r => r.fortune.totalScore >= 70).length;
  const lowScoreDays = records.filter(r => r.fortune.totalScore < 50).length;

  return {
    period,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    avgScore,
    maxScore: {
      date: maxRecord.date,
      score: maxRecord.fortune.totalScore,
    },
    minScore: {
      date: minRecord.date,
      score: minRecord.fortune.totalScore,
    },
    trend,
    dimensionStats,
    totalDays: records.length,
    highScoreDays,
    lowScoreDays,
  };
}

/**
 * 格式化日期
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取本周开始日期（周一）
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 调整为周一
  return new Date(d.setDate(diff));
}

/**
 * 获取本月开始日期
 */
export function getMonthStart(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
