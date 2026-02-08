// ==========================================
// AI 接口客户端限流
// 防止短时间内频繁请求
// ==========================================

const STORAGE_KEY = 'ai_request_timestamps';
const MAX_REQUESTS_PER_MINUTE = 15;
const WINDOW_MS = 60 * 1000;

function getTimestamps(): number[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as number[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveTimestamps(ts: number[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ts));
  } catch {}
}

/**
 * 检查是否超过限流
 * @returns true 表示可以请求，false 表示已限流
 */
export function checkAIRateLimit(): boolean {
  const now = Date.now();
  const timestamps = getTimestamps().filter((t) => now - t < WINDOW_MS);
  return timestamps.length < MAX_REQUESTS_PER_MINUTE;
}

/**
 * 记录一次 AI 请求
 */
export function recordAIRequest(): void {
  const now = Date.now();
  const timestamps = getTimestamps().filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  saveTimestamps(timestamps);
}

