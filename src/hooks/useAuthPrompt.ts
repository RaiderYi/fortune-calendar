// ==========================================
// 登录引导 Hook - 在关键节点引导用户登录
// ==========================================

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { shouldShowLoginPrompt, getGuestStats } from '../components/auth/LoginPrompt';

type PromptType = 'ai_limit' | 'history_limit' | 'sync_prompt' | 'feature_lock' | 'data_migration';

interface UseAuthPromptReturn {
  showPrompt: boolean;
  promptType: PromptType | null;
  extraData: any;
  closePrompt: () => void;
  checkAndShowPrompt: (type: PromptType, force?: boolean) => boolean;
  incrementAICount: () => void;
  getAICount: () => number;
  canUseAI: () => boolean;
  checkHistoryLimit: () => boolean;
}

const AI_DAILY_LIMIT = 3;
const HISTORY_LIMIT = 10;

export function useAuthPrompt(): UseAuthPromptReturn {
  const { isLoggedIn } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<PromptType | null>(null);
  const [extraData, setExtraData] = useState<any>(null);

  // 获取今日 AI 使用次数
  const getAICount = useCallback((): number => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('guest_ai_daily');
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        return data.count;
      }
    }
    return 0;
  }, []);

  // 增加 AI 使用次数
  const incrementAICount = useCallback(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('guest_ai_daily');
    let count = 1;
    
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === today) {
        count = data.count + 1;
      }
    }
    
    localStorage.setItem('guest_ai_daily', JSON.stringify({ date: today, count }));
    
    // 同时更新总计数
    const totalCount = parseInt(localStorage.getItem('guest_ai_count') || '0');
    localStorage.setItem('guest_ai_count', (totalCount + 1).toString());
  }, []);

  // 检查是否可以使用 AI
  const canUseAI = useCallback((): boolean => {
    if (isLoggedIn) return true;
    return getAICount() < AI_DAILY_LIMIT;
  }, [isLoggedIn, getAICount]);

  // 检查历史记录限制
  const checkHistoryLimit = useCallback((): boolean => {
    if (isLoggedIn) return true;
    const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
    return history.length < HISTORY_LIMIT;
  }, [isLoggedIn]);

  // 检查并显示引导
  const checkAndShowPrompt = useCallback((type: PromptType, force: boolean = false): boolean => {
    // 已登录不需要显示
    if (isLoggedIn) return true;
    
    // 检查是否应该显示（7天内不重复）
    if (!force && !shouldShowLoginPrompt(type)) {
      return true; // 允许操作继续
    }

    // 根据不同类型检查条件
    switch (type) {
      case 'ai_limit':
        if (getAICount() >= AI_DAILY_LIMIT || force) {
          setPromptType('ai_limit');
          setExtraData(null);
          setShowPrompt(true);
          return false; // 阻止操作
        }
        return true;

      case 'history_limit':
        const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
        if (history.length >= HISTORY_LIMIT || force) {
          setPromptType('history_limit');
          setExtraData(null);
          setShowPrompt(true);
          return false;
        }
        return true;

      case 'sync_prompt':
        setPromptType('sync_prompt');
        setExtraData(null);
        setShowPrompt(true);
        return true;

      case 'feature_lock':
        setPromptType('feature_lock');
        setExtraData(null);
        setShowPrompt(true);
        return false;

      case 'data_migration':
        const stats = getGuestStats();
        if (stats.hasData) {
          setPromptType('data_migration');
          setExtraData(stats);
          setShowPrompt(true);
        }
        return true;

      default:
        return true;
    }
  }, [isLoggedIn, getAICount]);

  // 关闭引导
  const closePrompt = useCallback(() => {
    setShowPrompt(false);
    setPromptType(null);
    setExtraData(null);
  }, []);

  // 每天重置AI计数检查
  useEffect(() => {
    if (!isLoggedIn) {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('guest_ai_daily');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.date !== today) {
          localStorage.setItem('guest_ai_daily', JSON.stringify({ date: today, count: 0 }));
        }
      }
    }
  }, [isLoggedIn]);

  return {
    showPrompt,
    promptType,
    extraData,
    closePrompt,
    checkAndShowPrompt,
    incrementAICount,
    getAICount,
    canUseAI,
    checkHistoryLimit,
  };
}

// 在登录后检查是否需要数据迁移
export function checkDataMigrationOnLogin(): boolean {
  const stats = getGuestStats();
  return stats.hasData;
}
