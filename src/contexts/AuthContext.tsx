// ==========================================
// 认证上下文 - 全局用户状态管理
// ==========================================

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import * as authApi from '../services/authApi';
import * as syncApi from '../services/syncApi';
import { SmartSyncManager } from '../services/SyncManager';

// 用户类型定义
export interface User {
  id: string;
  email: string;
  createdAt: string;
  inviteCode: string;
  rewards: {
    aiQuotaBonus?: number;
    templatesUnlocked?: string[];
    badges?: string[];
    allTemplates?: boolean;
    aiUnlimited?: boolean;
    premiumForever?: boolean;
  };
  inviteStats: {
    total: number;
    successful: number;
  };
  syncEnabled: boolean;
}

interface AuthContextType {
  // 状态
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  syncEnabled: boolean;
  
  // 操作
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (params: RegisterParams) => Promise<{ success: boolean; error?: string; rewards?: any[] }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  toggleSync: (enabled: boolean) => Promise<void>;
  
  // 邀请
  inviteInfo: InviteInfo | null;
  refreshInviteInfo: () => Promise<void>;
}

interface RegisterParams {
  email: string;
  password: string;
  verificationCode: string;
  inviteCode?: string;
}

interface InviteInfo {
  inviteCode: string;
  inviteLink: string;
  totalInvites: number;
  successfulInvites: number;
  currentRewards: User['rewards'];
  nextMilestone?: {
    target: number;
    current: number;
    remaining: number;
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [syncManager] = useState(() => new SmartSyncManager());

  // 初始化：检查登录状态
  useEffect(() => {
    const initAuth = async () => {
      if (authApi.isLoggedIn()) {
        try {
          // 尝试刷新token获取用户信息
          const refreshResult = await authApi.refreshToken();
          if (!refreshResult.success) {
            authApi.logout();
          }
          // 实际项目中这里应该调用获取用户信息的API
          // 暂时从本地存储恢复
          const savedUser = localStorage.getItem('fortune_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        } catch {
          authApi.logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // 用户变化时保存到本地
  useEffect(() => {
    if (user) {
      localStorage.setItem('fortune_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fortune_user');
    }
  }, [user]);

  // 登录
  const login = useCallback(async (
    email: string, 
    password: string, 
    rememberMe = false
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await authApi.login({ email, password, rememberMe });
      
      if (result.success) {
        setUser(result.user);
        
        // 登录成功后触发数据同步
        if (result.requiresSync) {
          setIsSyncing(true);
          try {
            await syncManager.onUserLogin(result.user.id);
          } finally {
            setIsSyncing(false);
          }
        }
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    } finally {
      setIsLoading(false);
    }
  }, [syncManager]);

  // 注册
  const register = useCallback(async (
    params: RegisterParams
  ): Promise<{ success: boolean; error?: string; rewards?: any[] }> => {
    try {
      setIsLoading(true);
      const result = await authApi.register(params);
      
      if (result.success) {
        setUser(result.user);
        
        // 注册后上传本地数据到云端
        setIsSyncing(true);
        try {
          await syncManager.onUserLogin(result.user.id);
        } finally {
          setIsSyncing(false);
        }
        
        return { 
          success: true, 
          rewards: result.rewards 
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: '网络错误，请稍后重试' };
    } finally {
      setIsLoading(false);
    }
  }, [syncManager]);

  // 登出
  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
    setInviteInfo(null);
    syncManager.clearLocalData();
  }, [syncManager]);

  // 更新用户信息
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  }, []);

  // 切换同步设置
  const toggleSync = useCallback(async (enabled: boolean) => {
    try {
      const result = await authApi.updateSyncSetting(enabled);
      if (result.success) {
        setUser(prev => prev ? { ...prev, syncEnabled: enabled } : null);
        syncManager.setSyncEnabled(enabled);
      }
    } catch (error) {
      console.error('Failed to update sync setting:', error);
    }
  }, [syncManager]);

  // 刷新邀请信息
  const refreshInviteInfo = useCallback(async () => {
    if (!user) return;
    
    try {
      const result = await authApi.getInviteInfo();
      if (result.success) {
        setInviteInfo({
          inviteCode: result.inviteCode,
          inviteLink: result.inviteLink,
          totalInvites: result.totalInvites,
          successfulInvites: result.successfulInvites,
          currentRewards: result.currentRewards,
          nextMilestone: result.nextMilestone,
        });
      }
    } catch (error) {
      console.error('Failed to fetch invite info:', error);
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoggedIn: !!user,
    isLoading,
    isSyncing,
    syncEnabled: user?.syncEnabled ?? false,
    login,
    register,
    logout,
    updateUser,
    toggleSync,
    inviteInfo,
    refreshInviteInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
