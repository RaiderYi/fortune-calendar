// ==========================================
// 数据收集工具
// 收集用户行为数据用于统计分析
// ==========================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface AnalyticsEvent {
  type: string;
  timestamp: number;
  userId?: string;
  data?: Record<string, any>;
}

/**
 * 发送分析事件
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  try {
    // 异步发送，不阻塞主流程
    fetch(`${API_BASE_URL}/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).catch(error => {
      console.error('发送分析事件失败:', error);
    });
  } catch (error) {
    console.error('trackEvent 错误:', error);
  }
}

/**
 * 追踪页面访问
 */
export function trackPageView(page: string): void {
  trackEvent({
    type: 'page_view',
    timestamp: Date.now(),
    data: { page },
  });
}

/**
 * 追踪功能使用
 */
export function trackFeatureUsage(feature: string, action?: string): void {
  trackEvent({
    type: 'feature_usage',
    timestamp: Date.now(),
    data: { feature, action },
  });
}

/**
 * 追踪用户操作
 */
export function trackUserAction(action: string, data?: Record<string, any>): void {
  trackEvent({
    type: 'user_action',
    timestamp: Date.now(),
    data: { action, ...data },
  });
}
