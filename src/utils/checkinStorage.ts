// ==========================================
// 每日签到存储工具
// ==========================================

import { addCredits } from './creditsStorage';

export interface CheckinRecord {
  date: string; // YYYY-MM-DD
  timestamp: number;
  consecutiveDays: number; // 连续签到天数
}

export interface CheckinStats {
  totalDays: number; // 总签到天数
  consecutiveDays: number; // 当前连续签到天数
  longestStreak: number; // 最长连续签到天数
  lastCheckinDate: string | null; // 最后签到日期
  checkinDates: Set<string>; // 所有签到日期集合
}

const STORAGE_KEY = 'fortune_checkin';
const CHECKIN_REWARDS = {
  3: { name: '三日坚持', badge: '🌱' },
  7: { name: '一周坚持', badge: '⭐' },
  14: { name: '两周坚持', badge: '🌟' },
  30: { name: '月度坚持', badge: '💎' },
  60: { name: '双月坚持', badge: '👑' },
  100: { name: '百日坚持', badge: '🏆' },
};

/**
 * 获取今日日期字符串
 */
function getTodayString(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
}

/**
 * 获取昨日日期字符串
 */
function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
}

/**
 * 检查今日是否已签到
 */
export function isCheckedInToday(): boolean {
  const today = getTodayString();
  const stats = getCheckinStats();
  return stats.checkinDates.has(today);
}

/**
 * 执行签到
 */
export function checkIn(): CheckinRecord | null {
  const today = getTodayString();
  const stats = getCheckinStats();

  // 如果今天已签到，返回null
  if (stats.checkinDates.has(today)) {
    return null;
  }

  // 计算连续签到天数
  let consecutiveDays = 1;
  const yesterday = getYesterdayString();
  if (stats.checkinDates.has(yesterday)) {
    consecutiveDays = stats.consecutiveDays + 1;
  }

  // 创建签到记录
  const record: CheckinRecord = {
    date: today,
    timestamp: Date.now(),
    consecutiveDays,
  };

  // 保存签到记录
  try {
    const allRecords = getAllCheckinRecords();
    allRecords.push(record);
    
    // 只保留最近90天的记录
    const recentRecords = allRecords
      .filter(r => {
        const recordDate = new Date(r.date);
        const daysDiff = (Date.now() - recordDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 90;
      })
      .sort((a, b) => b.timestamp - a.timestamp);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentRecords));
    try {
      addCredits(5, 'daily_checkin');
    } catch {
      /* ignore */
    }
  } catch (error) {
    console.error('保存签到记录失败:', error);
  }

  return record;
}

/**
 * 获取所有签到记录
 */
export function getAllCheckinRecords(): CheckinRecord[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as CheckinRecord[];
  } catch (error) {
    console.error('获取签到记录失败:', error);
    return [];
  }
}

/**
 * 获取签到统计信息
 */
export function getCheckinStats(): CheckinStats {
  const records = getAllCheckinRecords();
  const checkinDates = new Set(records.map(r => r.date));
  
  // 计算最长连续签到天数
  let longestStreak = 0;
  let currentStreak = 0;
  const sortedDates = Array.from(checkinDates).sort();
  
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const daysDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  // 计算当前连续签到天数
  let consecutiveDays = 0;
  const today = getTodayString();
  const yesterday = getYesterdayString();
  
  if (checkinDates.has(today)) {
    // 如果今天已签到，从今天往前计算
    let checkDate = new Date(today);
    while (checkinDates.has(
      `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
    )) {
      consecutiveDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (checkinDates.has(yesterday)) {
    // 如果今天未签到，从昨天往前计算
    let checkDate = new Date(yesterday);
    while (checkinDates.has(
      `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
    )) {
      consecutiveDays++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // 获取最后签到日期
  const lastRecord = records.sort((a, b) => b.timestamp - a.timestamp)[0];
  const lastCheckinDate = lastRecord ? lastRecord.date : null;

  return {
    totalDays: checkinDates.size,
    consecutiveDays,
    longestStreak,
    lastCheckinDate,
    checkinDates,
  };
}

/**
 * 获取签到奖励信息
 */
export function getCheckinReward(consecutiveDays: number): { name: string; badge: string } | null {
  // 找到最接近的奖励里程碑
  const milestones = Object.keys(CHECKIN_REWARDS).map(Number).sort((a, b) => b - a);
  for (const milestone of milestones) {
    if (consecutiveDays >= milestone) {
      return CHECKIN_REWARDS[milestone as keyof typeof CHECKIN_REWARDS];
    }
  }
  return null;
}

/**
 * 获取签到日历数据（最近30天）
 */
export function getCheckinCalendar(): { date: string; checked: boolean; isToday: boolean }[] {
  const stats = getCheckinStats();
  const calendar: { date: string; checked: boolean; isToday: boolean }[] = [];
  const today = getTodayString();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    calendar.push({
      date: dateStr,
      checked: stats.checkinDates.has(dateStr),
      isToday: dateStr === today,
    });
  }
  
  return calendar;
}
