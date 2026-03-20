// ==========================================
// API 服务层
// ==========================================

import type {
  AIChatRequest,
  AIChatResponse,
  BaziContext,
  YijingContext,
  TarotContext,
} from '../types';
import { fetchWithRetry, getCachedData, setCacheData } from '../utils/apiRetry';
import { checkAIRateLimit, recordAIRequest } from '../utils/aiRateLimit';

const API_BASE_URL = '/api';

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  delay: 1000,
  backoff: 1.5,
};

/** 判断是否为限流/429 类错误 */
function isRateLimitError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  return /429|rate limit|too many|限流|过于频繁/i.test(msg);
}

/** AI 请求可选上下文（八字 / 易经 / 解梦 / 塔罗） */
export interface ChatWithAIOptions {
  baziContext?: BaziContext;
  yijingContext?: YijingContext;
  dreamContext?: { dreamText: string };
  tarotContext?: TarotContext;
}

/**
 * AI 聊天请求（带重试机制与客户端限流）
 */
export async function chatWithAI(
  messages: AIChatRequest['messages'],
  opts?: ChatWithAIOptions
): Promise<AIChatResponse> {
  if (!checkAIRateLimit()) {
    return { success: false, error: '请求过于频繁，请稍后再试' };
  }

  const requestBody: Record<string, unknown> = { messages };
  if (opts?.baziContext && Object.keys(opts.baziContext).length > 0) {
    requestBody.baziContext = opts.baziContext;
  }
  if (opts?.yijingContext) {
    requestBody.yijingContext = opts.yijingContext;
  }
  if (opts?.dreamContext) {
    requestBody.dreamContext = opts.dreamContext;
  }
  if (opts?.tarotContext) {
    requestBody.tarotContext = opts.tarotContext;
  }

  try {
    const data = await fetchWithRetry<AIChatResponse>(
      `${API_BASE_URL}/ai-chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
      {
        ...RETRY_CONFIG,
        onRetry: (attempt, error) => {
          console.warn(`AI 聊天请求第 ${attempt} 次重试:`, error.message);
        },
      }
    );
    recordAIRequest();
    return data;
  } catch (error) {
    console.error('AI 聊天请求失败（已重试）:', error);
    if (isRateLimitError(error)) {
      return { success: false, error: '请求过于频繁，请稍后再试' };
    }
    return {
      success: false,
      error: '服务暂时不可用，请稍后重试',
    };
  }
}

/**
 * 获取AI生成的今日锦囊
 */
export async function getTodayWisdom(baziContext?: BaziContext): Promise<string> {
  try {
    const response = await chatWithAI(
      [
        {
          role: 'user',
          content: '请根据我的今日运势，生成一句富有哲理、治愈或实用的今日金句（一句话，30字以内，不要包含"今日"、"今天"等时间词）。',
        },
      ],
      { baziContext }
    );

    if (response.success && response.message) {
      // 清理可能的引号或多余格式
      return response.message.replace(/^["']|["']$/g, '').trim();
    }
    return '';
  } catch (error) {
    console.error('获取今日锦囊失败:', error);
    return '';
  }
}

/** 月度运势 API 响应 */
export interface FortuneMonthData {
  year: number;
  month: number;
  summary: {
    avgScore: number;
    bestDay: string;
    worstDay: string;
    bestScore: number;
    worstScore: number;
  };
  fortune: {
    totalScore: number;
    dimensions: Record<
      string,
      { score: number; level: string; tag: string; inference: string }
    >;
    mainTheme: {
      keyword: string;
      subKeyword: string;
      emoji: string;
      description: string;
    };
    todoList: Array<{ type: string; content: string }>;
  };
  dailyScores: Array<{ date: string; score: number }>;
}

export interface FortuneMonthApiResult {
  success: boolean;
  data?: FortuneMonthData;
  error?: string;
}

/**
 * 获取指定年月的运势（含每日分数热力数据）
 */
export async function fetchFortuneMonth(params: {
  year: number;
  month: number;
  birthDate: string;
  birthTime: string;
  longitude: string;
  gender: string;
  customYongShen?: string | string[] | null;
}): Promise<FortuneMonthApiResult> {
  const body: Record<string, unknown> = {
    year: params.year,
    month: params.month,
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    longitude: params.longitude,
    gender: params.gender,
  };
  if (params.customYongShen != null) {
    body.customYongShen = params.customYongShen;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/fortune-month`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as FortuneMonthApiResult;
    return json;
  } catch (e) {
    console.error('fetchFortuneMonth failed:', e);
    return { success: false, error: '网络错误' };
  }
}

export interface YijingDivinationData {
  question: string;
  category: string;
  seed: number;
  benGua: string;
  bianGua: string;
  movingLines: number[];
  lines: Array<{ position: number; value: number; label: string; isMoving: boolean }>;
  principles: string[];
}

export async function fetchFortuneYear(params: {
  year: number;
  birthDate: string;
  birthTime: string;
  longitude: string;
  gender: string;
  customYongShen?: string | string[] | null;
}): Promise<{
  success: boolean;
  data?: { totalScore: number; dimensions: Record<string, unknown>; year: number };
  error?: string;
}> {
  const body: Record<string, unknown> = {
    year: params.year,
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    longitude: params.longitude,
    gender: params.gender,
  };
  if (params.customYongShen != null) body.customYongShen = params.customYongShen;
  try {
    const res = await fetch(`${API_BASE_URL}/fortune-year`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('fetchFortuneYear failed:', e);
    return { success: false, error: '网络错误' };
  }
}

export async function postHepan(body: {
  personA: Record<string, unknown>;
  personB: Record<string, unknown>;
}): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/hepan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('postHepan failed:', e);
    return { success: false, error: '网络错误' };
  }
}

export async function postYijingDivination(body: {
  question: string;
  category?: string;
  seed?: number;
}): Promise<{ success: boolean; data?: YijingDivinationData; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/yijing-divination`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (e) {
    console.error('postYijingDivination failed:', e);
    return { success: false, error: '网络错误' };
  }
}
