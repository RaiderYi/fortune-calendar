// ==========================================
// 认证上下文
// ==========================================

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  login as loginService,
  register as registerService,
  logout as logoutService,
  getCurrentUser,
  isAuthenticated,
  refreshToken,
  verifyToken,
} from '../services/auth';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (emailOrPhone: string, password: string, isPhone?: boolean) => Promise<boolean>;
  register: (emailOrPhone: string, password: string, name: string, isPhone?: boolean) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  // 初始化：检查登录状态
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser && isAuthenticated()) {
          // 验证 Token 是否有效
          const isValid = await verifyToken();
          if (isValid) {
            setUser(currentUser);
          } else {
            // Token 无效，尝试刷新
            const refreshResult = await refreshToken();
            if (refreshResult.success && refreshResult.user) {
              setUser(refreshResult.user);
            } else {
              // 刷新失败，清除登录状态
              logoutService();
            }
          }
        }
      } catch (error) {
        console.error('初始化认证失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // 定期刷新 Token（每 30 分钟）
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated()) {
        await refreshToken();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  // 登录
  const login = useCallback(async (
    emailOrPhone: string,
    password: string,
    isPhone = false
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await loginService({
        [isPhone ? 'phone' : 'email']: emailOrPhone,
        password,
      });

      if (result.success && result.user) {
        setUser(result.user);
        showToast('登录成功', 'success');
        return true;
      } else {
        showToast(result.error || '登录失败', 'error');
        return false;
      }
    } catch (error) {
      console.error('登录错误:', error);
      showToast('登录失败，请稍后重试', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // 注册
  const register = useCallback(async (
    emailOrPhone: string,
    password: string,
    name: string,
    isPhone = false
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await registerService({
        [isPhone ? 'phone' : 'email']: emailOrPhone,
        password,
        name,
      });

      if (result.success && result.user) {
        setUser(result.user);
        showToast('注册成功', 'success');
        return true;
      } else {
        showToast(result.error || '注册失败', 'error');
        return false;
      }
    } catch (error) {
      console.error('注册错误:', error);
      showToast('注册失败，请稍后重试', 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  // 登出
  const handleLogout = useCallback(() => {
    logoutService();
    setUser(null);
    showToast('已退出登录', 'success');
  }, [showToast]);

  // 刷新认证
  const refreshAuth = useCallback(async () => {
    try {
      const result = await refreshToken();
      if (result.success && result.user) {
        setUser(result.user);
      } else if (result.error) {
        // Token 刷新失败，可能需要重新登录
        console.warn('Token 刷新失败:', result.error);
      }
    } catch (error) {
      console.error('刷新认证失败:', error);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout: handleLogout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 使用认证上下文
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
