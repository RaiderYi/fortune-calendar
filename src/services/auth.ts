// ==========================================
// 认证服务
// ==========================================

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  refreshToken?: string;
  error?: string;
}

export interface RegisterRequest {
  email?: string;
  phone?: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
}

const API_BASE_URL = '/api';
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user';

/**
 * 注册新用户
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: AuthResponse = await response.json();

    if (result.success && result.token && result.user) {
      // 保存 Token 和用户信息
      localStorage.setItem(TOKEN_KEY, result.token);
      if (result.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error('注册失败:', error);
    return {
      success: false,
      error: '网络错误，请稍后重试',
    };
  }
}

/**
 * 用户登录
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: AuthResponse = await response.json();

    if (result.success && result.token && result.user) {
      // 保存 Token 和用户信息
      localStorage.setItem(TOKEN_KEY, result.token);
      if (result.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      }
      localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    }

    return result;
  } catch (error) {
    console.error('登录失败:', error);
    return {
      success: false,
      error: '网络错误，请稍后重试',
    };
  }
}

/**
 * 登出
 */
export function logout(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * 获取当前用户
 */
export function getCurrentUser(): User | null {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

/**
 * 获取 Token
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 获取 Refresh Token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * 刷新 Token
 */
export async function refreshToken(): Promise<AuthResponse> {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return {
        success: false,
        error: '未找到刷新令牌',
      };
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    const result: AuthResponse = await response.json();

    if (result.success && result.token) {
      localStorage.setItem(TOKEN_KEY, result.token);
      if (result.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, result.refreshToken);
      }
    }

    return result;
  } catch (error) {
    console.error('刷新 Token 失败:', error);
    return {
      success: false,
      error: '网络错误，请稍后重试',
    };
  }
}

/**
 * 检查是否已登录
 */
export function isAuthenticated(): boolean {
  return !!getToken() && !!getCurrentUser();
}

/**
 * 请求密码重置
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return await response.json();
  } catch (error) {
    console.error('请求密码重置失败:', error);
    return {
      success: false,
      error: '网络错误，请稍后重试',
    };
  }
}

/**
 * 验证 Token 是否有效
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const token = getToken();
    if (!token) return false;

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * 带认证的请求头
 */
export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}
