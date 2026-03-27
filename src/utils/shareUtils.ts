// ==========================================
// 分享功能工具
// Share Utilities
// ==========================================

import { addExp, EXP_RULES } from './userLevelStorage';
import { addCredits } from './creditsStorage';

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
  image?: string; // base64 或 blob URL
}

export type ShareType = 'daily_sign' | 'app' | 'fortune_result' | 'achievement' | 'invite';

// 分享奖励配置
export const SHARE_REWARDS = {
  daily_sign: { credits: 5, exp: EXP_RULES.SHARE_DAILY_SIGN },
  app: { credits: 3, exp: EXP_RULES.SHARE_APP },
  fortune_result: { credits: 3, exp: 5 },
  achievement: { credits: 5, exp: 8 },
  invite: { credits: 100, exp: EXP_RULES.INVITE_FRIEND },
};

// 每日分享次数限制
const SHARE_LIMIT_KEY = 'fc_share_daily_limit';
const SHARE_COUNT_KEY = 'fc_share_daily_count';

interface ShareLimit {
  date: string; // YYYY-MM-DD
  count: Record<ShareType, number>;
}

const DAILY_LIMITS: Record<ShareType, number> = {
  daily_sign: 3,
  app: 5,
  fortune_result: 3,
  achievement: 2,
  invite: 10, // 邀请无上限
};

/**
 * 获取今日分享次数
 */
export function getTodayShareCount(): ShareLimit {
  const today = new Date().toISOString().split('T')[0];
  const stored = localStorage.getItem(SHARE_COUNT_KEY);
  
  if (stored) {
    const data: ShareLimit = JSON.parse(stored);
    if (data.date === today) {
      return data;
    }
  }
  
  // 新的一天，重置计数
  const initial: ShareLimit = {
    date: today,
    count: {
      daily_sign: 0,
      app: 0,
      fortune_result: 0,
      achievement: 0,
      invite: 0,
    }
  };
  localStorage.setItem(SHARE_COUNT_KEY, JSON.stringify(initial));
  return initial;
}

/**
 * 增加分享计数
 */
function incrementShareCount(type: ShareType): void {
  const data = getTodayShareCount();
  data.count[type]++;
  localStorage.setItem(SHARE_COUNT_KEY, JSON.stringify(data));
}

/**
 * 检查是否达到分享上限
 */
export function isShareLimitReached(type: ShareType): boolean {
  if (type === 'invite') return false; // 邀请无上限
  const data = getTodayShareCount();
  return data.count[type] >= DAILY_LIMITS[type];
}

/**
 * 获取剩余分享次数
 */
export function getRemainingShares(type: ShareType): number {
  if (type === 'invite') return Infinity;
  const data = getTodayShareCount();
  return Math.max(0, DAILY_LIMITS[type] - data.count[type]);
}

/**
 * 原生分享（使用 Web Share API）
 */
export async function nativeShare(options: ShareOptions): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: options.title || '命运日历',
      text: options.text,
      url: options.url || window.location.href,
    });
    return true;
  } catch (error) {
    // 用户取消分享
    if ((error as Error).name === 'AbortError') {
      return false;
    }
    console.error('Native share failed:', error);
    return false;
  }
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Copy failed:', error);
    return false;
  }
}

/**
 * 生成分享文本
 */
export function generateShareText(type: ShareType, data?: any): string {
  const appUrl = 'https://fortune-calendar.vercel.app';
  
  switch (type) {
    case 'daily_sign':
      return `【${data?.date || '今日'}运势】\n` +
             `${data?.emoji || '✨'} ${data?.keyword || '运势满满'}\n` +
             `综合评分：${data?.score || 85}分\n\n` +
             `📱 查看详细运势：${appUrl}`;
    
    case 'fortune_result':
      return `【运势分析】\n` +
             `事业：${data?.career || '良好'}\n` +
             `财运：${data?.wealth || '稳定'}\n` +
             `桃花：${data?.romance || '有望'}\n\n` +
             `📱 来测测你的运势：${appUrl}`;
    
    case 'achievement':
      return `【成就解锁】🎉\n` +
             `我解锁了「${data?.name || '新成就'}」！\n` +
             `${data?.badge || '🏆'}\n\n` +
             `📱 一起来探索：${appUrl}`;
    
    case 'invite':
      return `【邀请好友】\n` +
             `我发现了一个超准的运势应用！\n` +
             `输入我的邀请码【${data?.inviteCode || ''}】，双方都能获得积分奖励！\n\n` +
             `📱 立即体验：${data?.inviteLink || appUrl}`;
    
    case 'app':
    default:
      return `【命运日历】\n` +
             `一款融合东方美学的运势查询应用\n` +
             `• 每日运势分析\n` +
             `• 八字命理推算\n` +
             `• 塔罗易经占卜\n\n` +
             `📱 免费体验：${appUrl}`;
  }
}

/**
 * 执行分享并发放奖励
 */
export async function shareWithReward(
  type: ShareType, 
  options?: ShareOptions
): Promise<{
  success: boolean;
  native: boolean;
  rewarded: boolean;
  message: string;
}> {
  // 检查分享上限
  if (isShareLimitReached(type)) {
    return {
      success: false,
      native: false,
      rewarded: false,
      message: '今日分享次数已达上限'
    };
  }
  
  // 生成分享内容
  const shareText = options?.text || generateShareText(type, options);
  const shareData: ShareOptions = {
    ...options,
    text: shareText,
    url: options?.url || 'https://fortune-calendar.vercel.app'
  };
  
  // 尝试原生分享
  let nativeSuccess = false;
  if (navigator.share) {
    nativeSuccess = await nativeShare(shareData);
  }
  
  // 如果原生分享失败或不支持，提供复制选项
  if (!nativeSuccess) {
    const copySuccess = await copyToClipboard(shareText);
    if (!copySuccess) {
      return {
        success: false,
        native: false,
        rewarded: false,
        message: '分享失败，请重试'
      };
    }
  }
  
  // 记录分享次数
  incrementShareCount(type);
  
  // 发放奖励
  const rewards = SHARE_REWARDS[type];
  let rewarded = false;
  
  if (rewards) {
    // 添加积分
    if (rewards.credits > 0) {
      addCredits(rewards.credits, `share_${type}`);
    }
    // 添加经验
    if (rewards.exp > 0) {
      addExp(rewards.exp, `分享${type}`);
    }
    rewarded = true;
  }
  
  // 更新分享统计
  updateShareStats(type);
  
  return {
    success: true,
    native: nativeSuccess,
    rewarded,
    message: nativeSuccess 
      ? (rewarded ? '分享成功！获得奖励' : '分享成功！')
      : (rewarded ? '已复制分享内容！获得奖励' : '已复制分享内容！')
  };
}

/**
 * 生成分享图片（日签）
 */
export async function generateShareImage(
  element: HTMLElement
): Promise<string | null> {
  try {
    // 使用 html-to-image 库生成图片
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(element, {
      quality: 0.95,
      pixelRatio: 2,
      backgroundColor: '#FAF8F3'
    });
    return dataUrl;
  } catch (error) {
    console.error('Generate share image failed:', error);
    return null;
  }
}

/**
 * 下载图片
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

// 分享统计
const SHARE_STATS_KEY = 'fc_share_stats';

interface ShareStats {
  totalShares: number;
  byType: Record<ShareType, number>;
  lastShareAt: number;
}

/**
 * 更新分享统计
 */
function updateShareStats(type: ShareType): void {
  try {
    const raw = localStorage.getItem(SHARE_STATS_KEY);
    const stats: ShareStats = raw ? JSON.parse(raw) : {
      totalShares: 0,
      byType: { daily_sign: 0, app: 0, fortune_result: 0, achievement: 0, invite: 0 },
      lastShareAt: 0
    };
    
    stats.totalShares++;
    stats.byType[type]++;
    stats.lastShareAt = Date.now();
    
    localStorage.setItem(SHARE_STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

/**
 * 获取分享统计
 */
export function getShareStats(): ShareStats {
  try {
    const raw = localStorage.getItem(SHARE_STATS_KEY);
    return raw ? JSON.parse(raw) : {
      totalShares: 0,
      byType: { daily_sign: 0, app: 0, fortune_result: 0, achievement: 0, invite: 0 },
      lastShareAt: 0
    };
  } catch {
    return {
      totalShares: 0,
      byType: { daily_sign: 0, app: 0, fortune_result: 0, achievement: 0, invite: 0 },
      lastShareAt: 0
    };
  }
}

/**
 * 生成二维码（使用第三方API）
 */
export function generateQRCode(url: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
}

/**
 * 社交媒体分享链接
 */
export const socialShareLinks = {
  weibo: (text: string, url: string) => 
    `https://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  
  twitter: (text: string, url: string) => 
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  
  facebook: (url: string) => 
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  
  telegram: (text: string, url: string) => 
    `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  
  whatsapp: (text: string) => 
    `https://wa.me/?text=${encodeURIComponent(text)}`,
};
