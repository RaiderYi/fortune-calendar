// ==========================================
// 任务存储工具
// 管理运势任务系统
// ==========================================

export interface Task {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: {
    type: 'badge' | 'points' | 'theme' | 'unlock';
    value: any;
  };
  completedAt?: number;
  resetAt?: number; // 重置时间戳
}

export interface TaskProgress {
  taskId: string;
  progress: number;
  lastUpdate: number;
}

const STORAGE_KEY = 'fortune_tasks';
const PROGRESS_KEY = 'fortune_task_progress';

// 任务定义
export const TASK_DEFINITIONS: Omit<Task, 'progress' | 'completedAt' | 'resetAt'>[] = [
  // 每日任务
  {
    id: 'daily_view',
    type: 'daily',
    title: '查看今日运势',
    description: '打开应用查看今日运势',
    target: 1,
    reward: { type: 'points', value: 10 },
  },
  {
    id: 'daily_checkin',
    type: 'daily',
    title: '每日签到',
    description: '完成每日签到',
    target: 1,
    reward: { type: 'points', value: 20 },
  },
  {
    id: 'daily_diary',
    type: 'daily',
    title: '记录日记',
    description: '记录今日心情和事件',
    target: 1,
    reward: { type: 'points', value: 15 },
  },
  {
    id: 'daily_share',
    type: 'daily',
    title: '分享运势',
    description: '分享今日运势卡片',
    target: 1,
    reward: { type: 'points', value: 25 },
  },
  // 周任务
  {
    id: 'weekly_7days',
    type: 'weekly',
    title: '连续查看7天',
    description: '连续7天查看运势',
    target: 7,
    reward: { type: 'badge', value: 'week_streak' },
  },
  {
    id: 'weekly_share_3',
    type: 'weekly',
    title: '分享3次',
    description: '本周分享运势3次',
    target: 3,
    reward: { type: 'points', value: 100 },
  },
  {
    id: 'weekly_diary_5',
    type: 'weekly',
    title: '记录5天日记',
    description: '本周记录5天日记',
    target: 5,
    reward: { type: 'badge', value: 'diary_keeper' },
  },
  // 月任务
  {
    id: 'monthly_30days',
    type: 'monthly',
    title: '连续查看30天',
    description: '连续30天查看运势',
    target: 30,
    reward: { type: 'badge', value: 'month_streak' },
  },
  {
    id: 'monthly_complete_all',
    type: 'monthly',
    title: '完成所有每日任务',
    description: '本月完成所有每日任务',
    target: 30,
    reward: { type: 'theme', value: 'premium' },
  },
];

/**
 * 获取所有任务
 */
export function getAllTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('读取任务失败:', error);
  }

  // 初始化任务
  const now = Date.now();
  const tasks = TASK_DEFINITIONS.map(def => ({
    ...def,
    progress: 0,
    resetAt: getResetTime(def.type, now),
  }));

  saveTasks(tasks);
  return tasks;
}

/**
 * 保存任务
 */
function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('保存任务失败:', error);
  }
}

/**
 * 获取任务进度
 */
export function getTaskProgress(): Record<string, TaskProgress> {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('读取任务进度失败:', error);
  }
  return {};
}

/**
 * 保存任务进度
 */
function saveTaskProgress(progress: Record<string, TaskProgress>): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('保存任务进度失败:', error);
  }
}

/**
 * 更新任务进度
 */
export function updateTaskProgress(
  taskId: string,
  increment: number = 1
): { completed: boolean; task: Task | null } {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return { completed: false, task: null };
  }

  // 检查是否需要重置
  const now = Date.now();
  if (task.resetAt && now >= task.resetAt) {
    task.progress = 0;
    task.completedAt = undefined;
    task.resetAt = getResetTime(task.type, now);
  }

  // 如果已完成，不再增加进度
  if (task.progress >= task.target) {
    return { completed: false, task };
  }

  // 更新进度
  task.progress = Math.min(task.progress + increment, task.target);

  // 检查是否完成
  const completed = task.progress >= task.target;
  if (completed && !task.completedAt) {
    task.completedAt = now;
  }

  // 保存任务进度
  const progress = getTaskProgress();
  progress[taskId] = {
    taskId,
    progress: task.progress,
    lastUpdate: now,
  };
  saveTaskProgress(progress);

  saveTasks(tasks);
  return { completed, task };
}

/**
 * 获取重置时间
 */
function getResetTime(type: 'daily' | 'weekly' | 'monthly', baseTime: number): number {
  const date = new Date(baseTime);
  
  switch (type) {
    case 'daily':
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      // 重置到下周一的00:00
      const dayOfWeek = date.getDay();
      const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
      date.setDate(date.getDate() + daysUntilMonday);
      date.setHours(0, 0, 0, 0);
      break;
    case 'monthly':
      // 重置到下个月1号的00:00
      date.setMonth(date.getMonth() + 1);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      break;
  }
  
  return date.getTime();
}

/**
 * 获取今日任务
 */
export function getTodayTasks(): Task[] {
  const tasks = getAllTasks();
  const now = Date.now();
  
  return tasks.filter(task => {
    // 检查是否需要重置
    if (task.resetAt && now >= task.resetAt) {
      task.progress = 0;
      task.completedAt = undefined;
      task.resetAt = getResetTime(task.type, now);
    }
    
    return task.type === 'daily';
  });
}

/**
 * 获取本周任务
 */
export function getWeeklyTasks(): Task[] {
  const tasks = getAllTasks();
  const now = Date.now();
  
  return tasks.filter(task => {
    if (task.resetAt && now >= task.resetAt) {
      task.progress = 0;
      task.completedAt = undefined;
      task.resetAt = getResetTime(task.type, now);
    }
    
    return task.type === 'weekly';
  });
}

/**
 * 获取本月任务
 */
export function getMonthlyTasks(): Task[] {
  const tasks = getAllTasks();
  const now = Date.now();
  
  return tasks.filter(task => {
    if (task.resetAt && now >= task.resetAt) {
      task.progress = 0;
      task.completedAt = undefined;
      task.resetAt = getResetTime(task.type, now);
    }
    
    return task.type === 'monthly';
  });
}

/**
 * 获取已完成的任务数
 */
export function getCompletedTaskCount(type?: 'daily' | 'weekly' | 'monthly'): number {
  const tasks = type
    ? getAllTasks().filter(t => t.type === type)
    : getAllTasks();
  
  return tasks.filter(t => t.progress >= t.target).length;
}

/**
 * 获取任务完成率
 */
export function getTaskCompletionRate(type?: 'daily' | 'weekly' | 'monthly'): number {
  const tasks = type
    ? getAllTasks().filter(t => t.type === type)
    : getAllTasks();
  
  if (tasks.length === 0) return 0;
  
  const completed = tasks.filter(t => t.progress >= t.target).length;
  return Math.round((completed / tasks.length) * 100);
}

/**
 * 重置任务（用于测试或手动重置）
 */
export function resetTask(taskId: string): void {
  const tasks = getAllTasks();
  const task = tasks.find(t => t.id === taskId);
  
  if (task) {
    task.progress = 0;
    task.completedAt = undefined;
    task.resetAt = getResetTime(task.type, Date.now());
    saveTasks(tasks);
  }
}
