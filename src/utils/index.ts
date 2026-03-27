// ==========================================
// 工具函数统一导出
// Utils Index
// ==========================================

// 成就系统
export {
  ACHIEVEMENTS,
  getAllAchievements,
  saveAchievements,
  updateAchievementProgress,
  updateAchievements,
  getUnlockedAchievements,
  getAchievementStats,
  checkNewUnlocks,
} from './achievementStorage';
export type { Achievement } from './achievementStorage';

// 签到系统
export {
  getCheckinData,
  recordCheckin,
  getMonthlyCheckinData,
  getConsecutiveDays,
  getTotalCheckinDays,
  getMonthlyStats,
} from './checkinStorage';
export type { CheckinData, MonthlyCheckinData } from './checkinStorage';

// 积分系统
export {
  getCreditsBalance,
  addCredits,
  trySpendCredits,
  rewardInviteBonus,
} from './creditsStorage';

// 历史记录
export {
  getHistory,
  addHistory,
  clearHistory,
  getHistoryStats,
} from './historyStorage';
export type { HistoryRecord } from './historyStorage';

// 用户等级与成长
export {
  LEVEL_CONFIG,
  EXP_RULES,
  getUserGrowth,
  saveUserGrowth,
  addExp,
  updateGrowthStats,
  addAchievement,
  getCurrentLevelConfig,
  getNextLevelConfig,
  getLevelProgressPercent,
  getExpLogs,
  calculateStreakBonus,
  getLevelLeaderboard,
} from './userLevelStorage';
export type { UserLevel, UserGrowth } from './userLevelStorage';

// 分享功能
export {
  SHARE_REWARDS,
  getTodayShareCount,
  isShareLimitReached,
  getRemainingShares,
  nativeShare,
  copyToClipboard,
  generateShareText,
  shareWithReward,
  generateShareImage,
  downloadImage,
  getShareStats,
  generateQRCode,
  socialShareLinks,
} from './shareUtils';
export type { ShareOptions, ShareType } from './shareUtils';

// 会员系统
export {
  MEMBERSHIP_CONFIG,
  MEMBERSHIP_BENEFITS,
  getMembership,
  saveMembership,
  upgradeMembership,
  isValidMembership,
  getMembershipRemainingDays,
  checkAIQuota,
  recordAIUsage,
  getAIUsageHistory,
  calculateMembershipPrice,
  addPurchaseRecord,
  getPurchaseHistory,
  getMembershipStatusText,
  exportMembershipData,
} from './membershipStorage';
export type { MembershipType, Membership, MembershipBenefits } from './membershipStorage';

// 同步功能
export {
  getLocalDataForSync,
  applyServerData,
  mergeData,
  getLastSyncTime,
  setLastSyncTime,
} from './syncStorage';

// 任务系统
export {
  getTasks,
  updateTaskProgress,
  claimTaskReward,
  getTasksByCategory,
  getUnclaimedRewards,
} from './taskStorage';
export type { Task, TaskCategory } from './taskStorage';

// 城市数据
export { CITY_LONGITUDE_MAP, getCityLongitude, getCitySuggestions } from './cityData';

// SEO工具
export { updateSEOMeta, getDefaultMeta } from './seo';

// 分析追踪
export { trackPageView, trackEvent } from './analytics';
