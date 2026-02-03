// ==========================================
// API 重试与缓存工具
// ==========================================

interface RetryConfig {
  maxRetries?: number;
  delay?: number;
  backoff?: number; // 指数退避系数
  onRetry?: (attempt: number, error: Error) => void;
}

interface CacheConfig {
  ttl?: number; // 缓存时间（毫秒）
  key?: string;
}

// 内存缓存
const cache = new Map<string, { data: any; expires: number }>();

/**
 * 带重试的 fetch 请求
 */
export async function fetchWithRetry<T>(
  url: string,
  options?: RequestInit,
  config?: RetryConfig
): Promise<T> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 2,
    onRetry,
  } = config || {};

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries) {
        const waitTime = delay * Math.pow(backoff, attempt);
        onRetry?.(attempt + 1, lastError);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error('Request failed after retries');
}

/**
 * 带缓存的 fetch 请求
 */
export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  cacheConfig?: CacheConfig
): Promise<T> {
  const { ttl = 5 * 60 * 1000, key } = cacheConfig || {}; // 默认5分钟缓存
  const cacheKey = key || `${url}:${JSON.stringify(options?.body || '')}`;
  
  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  // 请求新数据
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // 存入缓存
  cache.set(cacheKey, {
    data,
    expires: Date.now() + ttl,
  });
  
  return data;
}

/**
 * 带重试和缓存的 fetch 请求
 */
export async function fetchWithRetryAndCache<T>(
  url: string,
  options?: RequestInit,
  config?: RetryConfig & CacheConfig
): Promise<T> {
  const { ttl, key, ...retryConfig } = config || {};
  const cacheKey = key || `${url}:${JSON.stringify(options?.body || '')}`;
  
  // 检查缓存
  const cached = cache.get(cacheKey);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  // 带重试的请求
  const data = await fetchWithRetry<T>(url, options, retryConfig);
  
  // 存入缓存
  if (ttl) {
    cache.set(cacheKey, {
      data,
      expires: Date.now() + ttl,
    });
  }
  
  return data;
}

/**
 * 清除指定缓存
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * 清除过期缓存
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (value.expires <= now) {
      cache.delete(key);
    }
  }
}

/**
 * 获取缓存数据（如果存在）
 * 用于离线/降级场景
 */
export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  return cached ? cached.data : null;
}

/**
 * 设置缓存数据
 */
export function setCacheData<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
  cache.set(key, {
    data,
    expires: Date.now() + ttl,
  });
}
