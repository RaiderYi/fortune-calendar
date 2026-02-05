// ==========================================
// 使用情况追踪
// 追踪用户会话和功能使用
// ==========================================

import { trackFeatureUsage, trackPageView } from './analytics';

interface SessionData {
  startTime: number;
  lastActivity: number;
  pageViews: string[];
  features: Record<string, number>;
}

const SESSION_KEY = 'fortune_session';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分钟

/**
 * 初始化会话
 */
export function initSession(): void {
  const session: SessionData = {
    startTime: Date.now(),
    lastActivity: Date.now(),
    pageViews: [],
    features: {},
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * 获取当前会话
 */
function getSession(): SessionData | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as SessionData;
    const now = Date.now();
    
    // 检查会话是否超时
    if (now - session.lastActivity > SESSION_TIMEOUT) {
      // 会话超时，开始新会话
      initSession();
      return getSession();
    }
    
    return session;
  } catch (error) {
    console.error('获取会话失败:', error);
    return null;
  }
}

/**
 * 更新会话活动
 */
function updateSession(updater: (session: SessionData) => void): void {
  const session = getSession();
  if (!session) {
    initSession();
    return;
  }
  
  updater(session);
  session.lastActivity = Date.now();
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * 追踪页面访问
 */
export function trackPage(page: string): void {
  updateSession(session => {
    if (!session.pageViews.includes(page)) {
      session.pageViews.push(page);
    }
  });
  trackPageView(page);
}

/**
 * 追踪功能使用
 */
export function trackFeature(feature: string): void {
  updateSession(session => {
    session.features[feature] = (session.features[feature] || 0) + 1;
  });
  trackFeatureUsage(feature);
}

/**
 * 获取会话统计
 */
export function getSessionStats(): {
  duration: number;
  pageViews: number;
  features: Record<string, number>;
} | null {
  const session = getSession();
  if (!session) return null;
  
  return {
    duration: Date.now() - session.startTime,
    pageViews: session.pageViews.length,
    features: { ...session.features },
  };
}

/**
 * 结束会话（发送统计数据）
 */
export function endSession(): void {
  const stats = getSessionStats();
  if (stats) {
    // 发送会话数据到后端
    trackFeatureUsage('session_end', stats);
  }
  localStorage.removeItem(SESSION_KEY);
}
