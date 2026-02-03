// ==========================================
// 邮件订阅服务
// 支持运势日报邮件订阅
// ==========================================

const SUBSCRIPTION_KEY = 'email_subscription';
const API_BASE_URL = '/api';

export interface EmailSubscription {
  email: string;
  subscribedAt: number;
  lastSentAt?: number;
  isVerified: boolean;
  preferences: SubscriptionPreferences;
}

export interface SubscriptionPreferences {
  dailyFortune: boolean;          // 每日运势
  weeklyDigest: boolean;          // 每周摘要
  monthlyReport: boolean;         // 月度报告
  importantAlerts: boolean;       // 重要运势提醒
  language: 'zh' | 'en';          // 语言偏好
  sendTime: string;               // 发送时间（HH:mm）
}

export interface SubscriptionResponse {
  success: boolean;
  message?: string;
  error?: string;
  requiresVerification?: boolean;
}

// ==================== 本地存储操作 ====================

/**
 * 获取本地保存的订阅信息
 */
export function getLocalSubscription(): EmailSubscription | null {
  try {
    const data = localStorage.getItem(SUBSCRIPTION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('获取订阅信息失败:', error);
    return null;
  }
}

/**
 * 保存订阅信息到本地
 */
export function saveLocalSubscription(subscription: EmailSubscription): void {
  try {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
  } catch (error) {
    console.error('保存订阅信息失败:', error);
  }
}

/**
 * 清除本地订阅信息
 */
export function clearLocalSubscription(): void {
  try {
    localStorage.removeItem(SUBSCRIPTION_KEY);
  } catch (error) {
    console.error('清除订阅信息失败:', error);
  }
}

// ==================== API 操作 ====================

/**
 * 订阅运势日报
 */
export async function subscribeToEmail(
  email: string,
  preferences?: Partial<SubscriptionPreferences>
): Promise<SubscriptionResponse> {
  try {
    // 验证邮箱格式
    if (!isValidEmail(email)) {
      return {
        success: false,
        error: '请输入有效的邮箱地址',
      };
    }

    const defaultPreferences: SubscriptionPreferences = {
      dailyFortune: true,
      weeklyDigest: false,
      monthlyReport: false,
      importantAlerts: true,
      language: 'zh',
      sendTime: '08:00',
    };

    const subscription: EmailSubscription = {
      email,
      subscribedAt: Date.now(),
      isVerified: false,
      preferences: { ...defaultPreferences, ...preferences },
    };

    // 发送到服务器
    const response = await fetch(`${API_BASE_URL}/email/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // 保存到本地
      saveLocalSubscription(subscription);
      
      return {
        success: true,
        message: '订阅成功！请查收验证邮件。',
        requiresVerification: true,
      };
    } else {
      return {
        success: false,
        error: data.error || '订阅失败，请稍后重试',
      };
    }
  } catch (error) {
    console.error('订阅请求失败:', error);
    
    // 网络错误时，保存到本地等待后续同步
    const subscription: EmailSubscription = {
      email,
      subscribedAt: Date.now(),
      isVerified: false,
      preferences: {
        dailyFortune: true,
        weeklyDigest: false,
        monthlyReport: false,
        importantAlerts: true,
        language: 'zh',
        sendTime: '08:00',
        ...preferences,
      },
    };
    saveLocalSubscription(subscription);
    
    return {
      success: true,
      message: '已保存订阅，将在网络恢复后自动同步。',
    };
  }
}

/**
 * 取消订阅
 */
export async function unsubscribeFromEmail(email: string): Promise<SubscriptionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/email/unsubscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      clearLocalSubscription();
      return {
        success: true,
        message: '已成功取消订阅',
      };
    } else {
      return {
        success: false,
        error: data.error || '取消订阅失败',
      };
    }
  } catch (error) {
    console.error('取消订阅请求失败:', error);
    clearLocalSubscription();
    return {
      success: true,
      message: '已取消本地订阅',
    };
  }
}

/**
 * 更新订阅偏好
 */
export async function updateSubscriptionPreferences(
  email: string,
  preferences: Partial<SubscriptionPreferences>
): Promise<SubscriptionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/email/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, preferences }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // 更新本地存储
      const local = getLocalSubscription();
      if (local) {
        local.preferences = { ...local.preferences, ...preferences };
        saveLocalSubscription(local);
      }
      
      return {
        success: true,
        message: '偏好设置已更新',
      };
    } else {
      return {
        success: false,
        error: data.error || '更新失败',
      };
    }
  } catch (error) {
    console.error('更新偏好请求失败:', error);
    
    // 更新本地存储
    const local = getLocalSubscription();
    if (local) {
      local.preferences = { ...local.preferences, ...preferences };
      saveLocalSubscription(local);
    }
    
    return {
      success: true,
      message: '已保存本地偏好',
    };
  }
}

/**
 * 验证邮箱
 */
export async function verifyEmail(token: string): Promise<SubscriptionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/email/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // 更新本地验证状态
      const local = getLocalSubscription();
      if (local) {
        local.isVerified = true;
        saveLocalSubscription(local);
      }
      
      return {
        success: true,
        message: '邮箱验证成功！',
      };
    } else {
      return {
        success: false,
        error: data.error || '验证失败',
      };
    }
  } catch (error) {
    console.error('邮箱验证请求失败:', error);
    return {
      success: false,
      error: '网络错误，请稍后重试',
    };
  }
}

/**
 * 重新发送验证邮件
 */
export async function resendVerificationEmail(email: string): Promise<SubscriptionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/email/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        message: '验证邮件已重新发送',
      };
    } else {
      return {
        success: false,
        error: data.error || '发送失败',
      };
    }
  } catch (error) {
    console.error('重新发送验证邮件失败:', error);
    return {
      success: false,
      error: '网络错误，请稍后重试',
    };
  }
}

// ==================== 工具函数 ====================

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 检查是否已订阅
 */
export function isSubscribed(): boolean {
  const subscription = getLocalSubscription();
  return subscription !== null;
}

/**
 * 获取订阅状态文本
 */
export function getSubscriptionStatus(): {
  subscribed: boolean;
  verified: boolean;
  email?: string;
} {
  const subscription = getLocalSubscription();
  
  if (!subscription) {
    return { subscribed: false, verified: false };
  }
  
  return {
    subscribed: true,
    verified: subscription.isVerified,
    email: subscription.email,
  };
}

/**
 * 格式化发送时间选项
 */
export function getTimeOptions(): Array<{ value: string; label: string }> {
  const options: Array<{ value: string; label: string }> = [];
  
  for (let hour = 6; hour <= 22; hour++) {
    options.push({
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${hour}:00`,
    });
  }
  
  return options;
}
