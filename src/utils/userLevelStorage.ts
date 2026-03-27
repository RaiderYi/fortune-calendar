// ==========================================
// 用户等级与成长系统
// User Level & Growth System
// ==========================================

export interface UserLevel {
  level: number;
  title: string;
  icon: string;
  minExp: number;
  maxExp: number;
  benefits: string[];
}

export interface UserGrowth {
  level: number;
  currentExp: number;
  totalExp: number;
  nextLevelExp: number;
  streakDays: number; // 连续活跃天数
  totalCheckins: number; // 总签到天数
  totalQueries: number; // 总查询次数
  totalShares: number; // 总分享次数
  achievements: string[]; // 已解锁成就ID
}

// 等级配置
export const LEVEL_CONFIG: UserLevel[] = [
  {
    level: 1,
    title: '初入道门',
    icon: '🌱',
    minExp: 0,
    maxExp: 100,
    benefits: ['每日基础运势查询', '基础塔罗占卜']
  },
  {
    level: 2,
    title: '问道学徒',
    icon: '📿',
    minExp: 100,
    maxExp: 300,
    benefits: ['解锁运势轨迹', '易经问卦功能']
  },
  {
    level: 3,
    title: '寻道行者',
    icon: '☯️',
    minExp: 300,
    maxExp: 600,
    benefits: ['解锁合盘分析', 'AI智能咨询（每日3次）']
  },
  {
    level: 4,
    title: '悟道修士',
    icon: '🌟',
    minExp: 600,
    maxExp: 1000,
    benefits: ['解锁全部功能', 'AI咨询（每日5次）']
  },
  {
    level: 5,
    title: '得道真人',
    icon: '👑',
    minExp: 1000,
    maxExp: 1500,
    benefits: ['AI咨询（每日10次）', '专属客服支持']
  },
  {
    level: 6,
    title: '天人合一',
    icon: '☸️',
    minExp: 1500,
    maxExp: 2500,
    benefits: ['AI咨询无限次', '优先体验新功能']
  },
  {
    level: 7,
    title: '命运主宰',
    icon: '🔮',
    minExp: 2500,
    maxExp: Infinity,
    benefits: ['至尊身份标识', '专属运势解读']
  }
];

const GROWTH_KEY = 'fc_user_growth_v2';

// 经验值获取规则
export const EXP_RULES = {
  CHECKIN: 10,           // 每日签到
  CHECKIN_STREAK: 5,     // 连续签到额外奖励（每天）
  QUERY_FORTUNE: 5,      // 查询运势
  SHARE_DAILY_SIGN: 15,  // 分享日签
  SHARE_APP: 10,         // 分享应用
  INVITE_FRIEND: 50,     // 邀请好友
  COMPLETE_PROFILE: 30,  // 完善资料
  UNLOCK_ACHIEVEMENT: 20,// 解锁成就
  AI_CHAT: 3,            // 使用AI咨询
  VIEW_TRENDS: 2,        // 查看趋势分析
  VIEW_HISTORY: 1,       // 查看历史
  TAROT_DIVINATION: 5,   // 塔罗占卜
  YIJING_DIVINATION: 5,  // 易经问卦
};

/**
 * 获取用户成长数据
 */
export function getUserGrowth(): UserGrowth {
  try {
    const data = localStorage.getItem(GROWTH_KEY);
    if (!data) {
      const initial: UserGrowth = {
        level: 1,
        currentExp: 0,
        totalExp: 0,
        nextLevelExp: 100,
        streakDays: 0,
        totalCheckins: 0,
        totalQueries: 0,
        totalShares: 0,
        achievements: []
      };
      localStorage.setItem(GROWTH_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  } catch {
    return {
      level: 1,
      currentExp: 0,
      totalExp: 0,
      nextLevelExp: 100,
      streakDays: 0,
      totalCheckins: 0,
      totalQueries: 0,
      totalShares: 0,
      achievements: []
    };
  }
}

/**
 * 保存用户成长数据
 */
export function saveUserGrowth(growth: UserGrowth): void {
  localStorage.setItem(GROWTH_KEY, JSON.stringify(growth));
  // 触发更新事件
  window.dispatchEvent(new CustomEvent('fc-growth-updated', { detail: growth }));
}

/**
 * 增加经验值
 * @returns 是否升级
 */
export function addExp(amount: number, reason?: string): { 
  growth: UserGrowth; 
  leveledUp: boolean; 
  newLevel?: UserLevel;
  oldLevel?: number;
} {
  const growth = getUserGrowth();
  const oldLevel = growth.level;
  
  growth.currentExp += amount;
  growth.totalExp += amount;
  
  // 检查升级
  let leveledUp = false;
  let newLevelConfig: UserLevel | undefined;
  
  const currentLevelConfig = LEVEL_CONFIG.find(l => l.level === growth.level);
  if (currentLevelConfig && growth.currentExp >= currentLevelConfig.maxExp) {
    // 升级
    const nextLevel = LEVEL_CONFIG.find(l => l.level === growth.level + 1);
    if (nextLevel) {
      growth.level = nextLevel.level;
      growth.currentExp = growth.currentExp - currentLevelConfig.maxExp;
      growth.nextLevelExp = nextLevel.maxExp;
      leveledUp = true;
      newLevelConfig = nextLevel;
    }
  }
  
  saveUserGrowth(growth);
  
  // 记录经验值日志
  appendExpLog(amount, reason);
  
  return {
    growth,
    leveledUp,
    newLevel: newLevelConfig,
    oldLevel
  };
}

/**
 * 更新统计数据
 */
export function updateGrowthStats(stats: Partial<Pick<UserGrowth, 'streakDays' | 'totalCheckins' | 'totalQueries' | 'totalShares'>>): UserGrowth {
  const growth = getUserGrowth();
  Object.assign(growth, stats);
  saveUserGrowth(growth);
  return growth;
}

/**
 * 添加成就
 */
export function addAchievement(achievementId: string): UserGrowth {
  const growth = getUserGrowth();
  if (!growth.achievements.includes(achievementId)) {
    growth.achievements.push(achievementId);
    saveUserGrowth(growth);
    // 成就奖励经验
    addExp(EXP_RULES.UNLOCK_ACHIEVEMENT, '解锁成就');
  }
  return growth;
}

/**
 * 获取当前等级配置
 */
export function getCurrentLevelConfig(level?: number): UserLevel {
  const growth = getUserGrowth();
  const targetLevel = level || growth.level;
  return LEVEL_CONFIG.find(l => l.level === targetLevel) || LEVEL_CONFIG[0];
}

/**
 * 获取下一等级配置
 */
export function getNextLevelConfig(): UserLevel | null {
  const growth = getUserGrowth();
  const nextLevel = LEVEL_CONFIG.find(l => l.level === growth.level + 1);
  return nextLevel || null;
}

/**
 * 计算升级进度百分比
 */
export function getLevelProgressPercent(): number {
  const growth = getUserGrowth();
  const currentLevel = getCurrentLevelConfig();
  const expInCurrentLevel = growth.currentExp;
  const expNeeded = currentLevel.maxExp - currentLevel.minExp;
  return Math.min(100, Math.round((expInCurrentLevel / expNeeded) * 100));
}

// 经验值日志
interface ExpLog {
  t: number;
  amount: number;
  reason?: string;
  balance: number;
}

const EXP_LOG_KEY = 'fc_exp_log_v1';

function appendExpLog(amount: number, reason?: string) {
  try {
    const growth = getUserGrowth();
    const raw = localStorage.getItem(EXP_LOG_KEY);
    const list: ExpLog[] = raw ? JSON.parse(raw) : [];
    list.push({ 
      t: Date.now(), 
      amount, 
      reason,
      balance: growth.totalExp 
    });
    localStorage.setItem(EXP_LOG_KEY, JSON.stringify(list.slice(-50)));
  } catch {
    // ignore
  }
}

/**
 * 获取经验值日志
 */
export function getExpLogs(): ExpLog[] {
  try {
    const raw = localStorage.getItem(EXP_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 计算连续签到奖励
 */
export function calculateStreakBonus(streakDays: number): number {
  // 连续签到奖励：每连续一天额外5点，上限50点
  return Math.min(50, streakDays * EXP_RULES.CHECKIN_STREAK);
}

/**
 * 获取等级排行（模拟）
 */
export function getLevelLeaderboard(): Array<{
  rank: number;
  name: string;
  level: number;
  title: string;
  exp: number;
  isCurrentUser?: boolean;
}> {
  // 模拟排行榜数据，实际应该从服务器获取
  const growth = getUserGrowth();
  const currentLevel = getCurrentLevelConfig();
  
  const mockData = [
    { rank: 1, name: '命运之子', level: 7, title: '命运主宰', exp: 3200 },
    { rank: 2, name: '天命所归', level: 6, title: '天人合一', exp: 2800 },
    { rank: 3, name: '悟道真人', level: 5, title: '得道真人', exp: 1800 },
    { rank: 4, name: '你', level: growth.level, title: currentLevel.title, exp: growth.totalExp, isCurrentUser: true },
    { rank: 5, name: '寻道者', level: 3, title: '寻道行者', exp: 450 },
  ];
  
  return mockData.sort((a, b) => b.exp - a.exp).map((item, index) => ({
    ...item,
    rank: index + 1
  }));
}
