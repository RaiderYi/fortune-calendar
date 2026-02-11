// ==========================================
// 认证API服务 - 邮箱注册/登录/邀请
// ==========================================

import { fetchWithRetryAndCache } from '../utils/apiRetry';

const API_BASE = '/api';

// Token管理
export const TokenManager = {
  getAccessToken(): string | null {
    return localStorage.getItem('fortune_access_token');
  },
  
  getRefreshToken(): string | null {
    return localStorage.getItem('fortune_refresh_token');
  },
  
  setTokens(access: string, refresh: string) {
    localStorage.setItem('fortune_access_token', access);
    localStorage.setItem('fortune_refresh_token', refresh);
  },
  
  clearTokens() {
    localStorage.removeItem('fortune_access_token');
    localStorage.removeItem('fortune_refresh_token');
  },
  
  getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

// 发送验证码
export async function sendVerificationCode(email: string) {
  const response = await fetch(`${API_BASE}/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return response.json();
}

// 注册
export async function register(params: {
  email: string;
  password: string;
  verificationCode: string;
  inviteCode?: string;
}) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    TokenManager.setTokens(data.token, data.refreshToken);
  }
  
  return data;
}

// 登录
export async function login(params: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    TokenManager.setTokens(data.token, data.refreshToken);
  }
  
  return data;
}

// 刷新Token
export async function refreshToken() {
  const refreshToken = TokenManager.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token');
  }
  
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  
  const data = await response.json();
  
  if (data.success && data.token) {
    const currentRefresh = TokenManager.getRefreshToken();
    TokenManager.setTokens(data.token, currentRefresh || '');
  }
  
  return data;
}

// 登出
export function logout() {
  TokenManager.clearTokens();
  // 可选：调用后端使token失效
}

// 验证邀请码
export async function validateInviteCode(code: string) {
  const response = await fetch(`${API_BASE}/invite/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return response.json();
}

// 获取邀请信息
export async function getInviteInfo() {
  const response = await fetch(`${API_BASE}/invite/info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...TokenManager.getAuthHeaders(),
    },
  });
  return response.json();
}

// 更新同步设置
export async function updateSyncSetting(enabled: boolean) {
  const response = await fetch(`${API_BASE}/user/sync-setting`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...TokenManager.getAuthHeaders(),
    },
    body: JSON.stringify({ enabled }),
  });
  return response.json();
}

// 检查是否已登录
export function isLoggedIn(): boolean {
  return !!TokenManager.getAccessToken();
}

// 带自动刷新的请求封装
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...options.headers,
    ...TokenManager.getAuthHeaders(),
  };
  
  let response = await fetch(url, { ...options, headers });
  
  // Token过期，尝试刷新
  if (response.status === 401) {
    try {
      await refreshToken();
      // 使用新token重试
      const newHeaders = {
        ...options.headers,
        ...TokenManager.getAuthHeaders(),
      };
      response = await fetch(url, { ...options, headers: newHeaders });
    } catch {
      // 刷新失败，清除token
      logout();
      window.location.href = '/login';
    }
  }
  
  return response;
}
