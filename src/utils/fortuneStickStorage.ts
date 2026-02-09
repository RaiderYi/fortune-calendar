// ==========================================
// 抽签历史与限流
// ==========================================

const DAILY_LIMIT = 3;
const STORAGE_KEY = 'fortune_stick_draws';
const HISTORY_KEY = 'fortune_stick_history';

export interface FortuneStickRecord {
  id: number;
  question: string;
  drawnAt: string; // ISO string
  stick: { id: number; level: string; poem: string; meaning: string; fortune: string };
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getRemainingDrawsToday(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DAILY_LIMIT;
    const data = JSON.parse(raw) as Record<string, number>;
    const today = getTodayKey();
    const used = data[today] ?? 0;
    return Math.max(0, DAILY_LIMIT - used);
  } catch {
    return DAILY_LIMIT;
  }
}

export function canDrawToday(): boolean {
  return getRemainingDrawsToday() > 0;
}

export function recordDraw(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    const today = getTodayKey();
    data[today] = (data[today] ?? 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function saveToHistory(record: FortuneStickRecord): void {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const history: FortuneStickRecord[] = raw ? JSON.parse(raw) : [];
    history.unshift(record);
    const trimmed = history.slice(0, 50); // 保留最近50条
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
  }
}

export function getHistory(): FortuneStickRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
