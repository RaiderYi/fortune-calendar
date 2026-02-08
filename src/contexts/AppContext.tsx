// ==========================================
// 应用内共享状态 - 供功能页使用
// ==========================================

import { createContext, useContext, ReactNode } from 'react';
import type { UserProfile } from '../components/ProfileSettings';
import type { CheckinRecord } from '../utils/checkinStorage';

interface DailyFortuneBasic {
  dateStr: string;
  totalScore: number;
  mainTheme?: { keyword: string; emoji: string };
  dimensions?: { [key: string]: { score?: number } };
}

interface AppContextValue {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  fortune: any; // DailyFortune from App
  userProfile: UserProfile;
  changeDate: (delta: number) => void;
  onCompareClick?: () => void;
  onCheckinSuccess?: (record: CheckinRecord) => void;
  /** 获取指定日期的运势（用于择日等） */
  fetchFortuneForDate?: (date: Date) => Promise<DailyFortuneBasic | null>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppContextProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AppContextValue;
}) {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppContextProvider');
  return ctx;
}
