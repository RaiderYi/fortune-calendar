// ==========================================
// 会员与付费系统
// Membership & Payment System
// ==========================================

export type MembershipType = 'free' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime';

export interface Membership {
  type: MembershipType;
  startDate: number; // 开始时间戳
  endDate: number;   // 结束时间戳（终身会员为Infinity）
  autoRenew: boolean;
  benefits: MembershipBenefits;
}

export interface MembershipBenefits {
  aiDailyQuota: number;      // AI每日使用次数 (-1 为无限)
  aiMonthlyQuota: number;    // AI每月使用次数 (-1 为无限)
  exportFormats: string[];   // 支持的导出格式
  hasPrioritySupport: boolean;
  hasExclusiveThemes: boolean;
  hasAdvancedAnalysis: boolean;
  hasHistoryExport: boolean;
  discountPercent: number;   // 购买积分折扣
}

// 会员配置
export const MEMBERSHIP_CONFIG: Record<MembershipType, {
  name: string;
  icon: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  popular?: boolean;
  benefits: string[];
}> = {
  free: {
    name: '免费版',
    icon: '🌱',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: '基础运势查询功能',
    benefits: [
      '每日运势查询（3次）',
      '基础塔罗占卜',
      '基础易经问卦',
      '7天历史记录'
    ]
  },
  monthly: {
    name: '月度会员',
    icon: '⭐',
    monthlyPrice: 18,
    yearlyPrice: 18 * 12,
    description: '解锁全部基础功能',
    benefits: [
      '每日运势查询（无限次）',
      'AI智能咨询（每日10次）',
      '全部占卜功能',
      '30天历史记录',
      '运势轨迹分析',
      '专属主题皮肤'
    ]
  },
  quarterly: {
    name: '季度会员',
    icon: '💎',
    monthlyPrice: 15, // 相当于每月15元
    yearlyPrice: 15 * 12,
    description: '性价比之选',
    popular: true,
    benefits: [
      '包含月度会员全部权益',
      'AI智能咨询（每日20次）',
      '90天历史记录',
      '数据导出功能',
      '优先客服支持',
      '每月赠送100积分'
    ]
  },
  yearly: {
    name: '年度会员',
    icon: '👑',
    monthlyPrice: 12, // 相当于每月12元
    yearlyPrice: 12 * 12,
    description: '超值年度套餐',
    benefits: [
      '包含季度会员全部权益',
      'AI智能咨询（无限次）',
      '永久历史记录',
      '高级命理分析',
      '专属运势报告',
      '每月赠送200积分',
      '生日特权礼包'
    ]
  },
  lifetime: {
    name: '终身会员',
    icon: '🔮',
    monthlyPrice: 0,
    yearlyPrice: 298,
    description: '一次付费，终身使用',
    benefits: [
      '包含年度会员全部权益',
      '终身免费使用',
      '所有新功能优先体验',
      '专属身份标识',
      'VIP专属群组',
      '每月赠送500积分',
      '一对一命理咨询（每年1次）'
    ]
  }
};

// 会员权益配置
export const MEMBERSHIP_BENEFITS: Record<MembershipType, MembershipBenefits> = {
  free: {
    aiDailyQuota: 0,
    aiMonthlyQuota: 0,
    exportFormats: [],
    hasPrioritySupport: false,
    hasExclusiveThemes: false,
    hasAdvancedAnalysis: false,
    hasHistoryExport: false,
    discountPercent: 0,
  },
  monthly: {
    aiDailyQuota: 10,
    aiMonthlyQuota: 300,
    exportFormats: ['png'],
    hasPrioritySupport: false,
    hasExclusiveThemes: true,
    hasAdvancedAnalysis: false,
    hasHistoryExport: false,
    discountPercent: 5,
  },
  quarterly: {
    aiDailyQuota: 20,
    aiMonthlyQuota: 600,
    exportFormats: ['png', 'pdf'],
    hasPrioritySupport: true,
    hasExclusiveThemes: true,
    hasAdvancedAnalysis: true,
    hasHistoryExport: true,
    discountPercent: 10,
  },
  yearly: {
    aiDailyQuota: -1, // 无限
    aiMonthlyQuota: -1,
    exportFormats: ['png', 'pdf', 'csv'],
    hasPrioritySupport: true,
    hasExclusiveThemes: true,
    hasAdvancedAnalysis: true,
    hasHistoryExport: true,
    discountPercent: 15,
  },
  lifetime: {
    aiDailyQuota: -1,
    aiMonthlyQuota: -1,
    exportFormats: ['png', 'pdf', 'csv', 'json'],
    hasPrioritySupport: true,
    hasExclusiveThemes: true,
    hasAdvancedAnalysis: true,
    hasHistoryExport: true,
    discountPercent: 20,
  }
};

const MEMBERSHIP_KEY = 'fc_membership_v2';
const AI_USAGE_KEY = 'fc_ai_usage_v2';

/**
 * 获取会员信息
 */
export function getMembership(): Membership {
  try {
    const data = localStorage.getItem(MEMBERSHIP_KEY);
    if (!data) {
      // 默认免费会员
      return {
        type: 'free',
        startDate: Date.now(),
        endDate: Date.now() + 86400000, // 1天后过期（免费会员每天更新）
        autoRenew: false,
        benefits: MEMBERSHIP_BENEFITS.free
      };
    }
    return JSON.parse(data);
  } catch {
    return {
      type: 'free',
      startDate: Date.now(),
      endDate: Date.now() + 86400000,
      autoRenew: false,
      benefits: MEMBERSHIP_BENEFITS.free
    };
  }
}

/**
 * 保存会员信息
 */
export function saveMembership(membership: Membership): void {
  localStorage.setItem(MEMBERSHIP_KEY, JSON.stringify(membership));
  window.dispatchEvent(new CustomEvent('fc-membership-updated', { detail: membership }));
}

/**
 * 升级会员
 */
export function upgradeMembership(type: MembershipType, durationMonths?: number): Membership {
  const now = Date.now();
  const current = getMembership();
  
  // 计算结束时间
  let endDate: number;
  if (type === 'lifetime') {
    endDate = Infinity;
  } else if (type === 'yearly') {
    endDate = now + 365 * 24 * 60 * 60 * 1000;
  } else if (type === 'quarterly') {
    endDate = now + 90 * 24 * 60 * 60 * 1000;
  } else if (type === 'monthly') {
    endDate = now + 30 * 24 * 60 * 60 * 1000;
  } else {
    endDate = now + 24 * 60 * 60 * 1000;
  }
  
  // 如果当前是付费会员且未过期，累加时间
  if (current.type !== 'free' && current.endDate > now) {
    const remaining = current.endDate - now;
    endDate += remaining;
  }
  
  const newMembership: Membership = {
    type,
    startDate: now,
    endDate,
    autoRenew: type !== 'lifetime', // 终身会员不自动续费
    benefits: MEMBERSHIP_BENEFITS[type]
  };
  
  saveMembership(newMembership);
  return newMembership;
}

/**
 * 检查是否有效会员
 */
export function isValidMembership(): boolean {
  const membership = getMembership();
  if (membership.type === 'free') return true;
  if (membership.type === 'lifetime') return true;
  return membership.endDate > Date.now();
}

/**
 * 获取会员剩余天数
 */
export function getMembershipRemainingDays(): number {
  const membership = getMembership();
  if (membership.type === 'free') return 0;
  if (membership.type === 'lifetime') return -1; // 终身会员
  
  const remaining = membership.endDate - Date.now();
  return Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
}

/**
 * 检查AI使用配额
 */
export function checkAIQuota(): { allowed: boolean; remaining: number; total: number } {
  const membership = getMembership();
  if (!isValidMembership()) {
    return { allowed: false, remaining: 0, total: 0 };
  }
  
  const benefits = membership.benefits;
  if (benefits.aiDailyQuota === -1) {
    return { allowed: true, remaining: -1, total: -1 }; // 无限
  }
  
  // 获取今日使用次数
  const usage = getAIUsageToday();
  const remaining = Math.max(0, benefits.aiDailyQuota - usage);
  
  return {
    allowed: remaining > 0,
    remaining,
    total: benefits.aiDailyQuota
  };
}

/**
 * 获取今日AI使用次数
 */
function getAIUsageToday(): number {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(AI_USAGE_KEY);
    if (!raw) return 0;
    
    const data: Record<string, number> = JSON.parse(raw);
    return data[today] || 0;
  } catch {
    return 0;
  }
}

/**
 * 记录AI使用
 */
export function recordAIUsage(): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(AI_USAGE_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    
    data[today] = (data[today] || 0) + 1;
    localStorage.setItem(AI_USAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

/**
 * 获取AI使用情况（最近7天）
 */
export function getAIUsageHistory(): Array<{ date: string; used: number; quota: number }> {
  const membership = getMembership();
  const quota = membership.benefits.aiDailyQuota;
  
  try {
    const raw = localStorage.getItem(AI_USAGE_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    
    const result: Array<{ date: string; used: number; quota: number }> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      result.push({
        date: dateStr,
        used: data[dateStr] || 0,
        quota: quota === -1 ? 999 : quota
      });
    }
    
    return result;
  } catch {
    return [];
  }
}

/**
 * 计算会员价格（考虑折扣）
 */
export function calculateMembershipPrice(
  type: MembershipType, 
  couponCode?: string
): { 
  originalPrice: number; 
  finalPrice: number; 
  discount: number;
  discountReason?: string;
} {
  const config = MEMBERSHIP_CONFIG[type];
  const originalPrice = config.yearlyPrice;
  
  let discount = 0;
  let discountReason: string | undefined;
  
  // 优惠券折扣
  if (couponCode) {
    const coupon = validateCoupon(couponCode);
    if (coupon.valid) {
      discount += coupon.discount;
      discountReason = coupon.reason;
    }
  }
  
  // 新用户首单优惠
  if (isFirstPurchase()) {
    discount += 20;
    discountReason = discountReason ? `${discountReason} + 新用户优惠` : '新用户首单8折';
  }
  
  // 限时活动折扣
  const eventDiscount = getCurrentEventDiscount();
  if (eventDiscount > 0) {
    discount += eventDiscount;
  }
  
  const finalPrice = Math.max(0, Math.round(originalPrice * (1 - discount / 100)));
  
  return {
    originalPrice,
    finalPrice,
    discount,
    discountReason
  };
}

/**
 * 验证优惠券
 */
function validateCoupon(code: string): { valid: boolean; discount: number; reason: string } {
  // 模拟优惠券验证
  const coupons: Record<string, { discount: number; reason: string }> = {
    'WELCOME2024': { discount: 20, reason: '欢迎优惠' },
    'VIP50': { discount: 50, reason: 'VIP专属' },
    'SPRING30': { discount: 30, reason: '春季特惠' },
  };
  
  const coupon = coupons[code.toUpperCase()];
  if (coupon) {
    return { valid: true, ...coupon };
  }
  
  return { valid: false, discount: 0, reason: '无效优惠码' };
}

/**
 * 是否首次购买
 */
function isFirstPurchase(): boolean {
  const membership = getMembership();
  return membership.type === 'free';
}

/**
 * 获取当前活动折扣
 */
function getCurrentEventDiscount(): number {
  // 可以根据时间返回不同的活动折扣
  const now = new Date();
  const month = now.getMonth();
  
  // 春节特惠（2月）
  if (month === 1) return 15;
  // 双11特惠（11月）
  if (month === 10) return 25;
  // 周年庆（根据实际上线时间调整）
  if (month === 3) return 20;
  
  return 0;
}

// 购买记录
interface PurchaseRecord {
  id: string;
  type: MembershipType;
  price: number;
  originalPrice: number;
  discount: number;
  couponCode?: string;
  purchasedAt: number;
  expiresAt: number;
  paymentMethod: string;
}

const PURCHASE_HISTORY_KEY = 'fc_purchase_history';

/**
 * 添加购买记录
 */
export function addPurchaseRecord(record: PurchaseRecord): void {
  try {
    const raw = localStorage.getItem(PURCHASE_HISTORY_KEY);
    const records: PurchaseRecord[] = raw ? JSON.parse(raw) : [];
    records.push(record);
    localStorage.setItem(PURCHASE_HISTORY_KEY, JSON.stringify(records.slice(-20)));
  } catch {
    // ignore
  }
}

/**
 * 获取购买记录
 */
export function getPurchaseHistory(): PurchaseRecord[] {
  try {
    const raw = localStorage.getItem(PURCHASE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * 获取会员状态文本
 */
export function getMembershipStatusText(): string {
  const membership = getMembership();
  
  if (membership.type === 'lifetime') {
    return '终身会员';
  }
  
  if (membership.type === 'free') {
    return '免费用户';
  }
  
  const remainingDays = getMembershipRemainingDays();
  if (remainingDays <= 0) {
    return '会员已过期';
  }
  
  if (remainingDays <= 7) {
    return `会员即将过期（${remainingDays}天）`;
  }
  
  return `${MEMBERSHIP_CONFIG[membership.type].name}（${remainingDays}天）`;
}

/**
 * 导出会员数据（用于备份）
 */
export function exportMembershipData(): string {
  const data = {
    membership: getMembership(),
    purchaseHistory: getPurchaseHistory(),
    aiUsage: getAIUsageHistory(),
    exportedAt: Date.now()
  };
  return JSON.stringify(data, null, 2);
}
