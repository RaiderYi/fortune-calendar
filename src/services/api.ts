// ==========================================
// API 服务层
// ==========================================

import type { AIChatRequest, AIChatResponse } from '../types';
import { fetchWithRetry, getCachedData, setCacheData } from '../utils/apiRetry';

const API_BASE_URL = '/api';

// 重试配置
const RETRY_CONFIG = {
  maxRetries: 3,
  delay: 1000,
  backoff: 1.5,
};

/**
 * AI 聊天请求（带重试机制）
 */
export async function chatWithAI(
  messages: AIChatRequest['messages'],
  baziContext: AIChatRequest['baziContext']
): Promise<AIChatResponse> {
  const requestBody = {
    messages,
    baziContext,
  } as AIChatRequest;

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
    return data;
  } catch (error) {
    console.error('AI 聊天请求失败（已重试）:', error);
    // 返回优雅降级的响应
    return {
      success: false,
      error: '服务暂时不可用，请稍后重试',
    };
  }
}

/**
 * 获取AI生成的今日锦囊
 */
export async function getTodayWisdom(baziContext: AIChatRequest['baziContext']): Promise<string> {
  try {
    const response = await chatWithAI(
      [
        {
          role: 'user',
          content: '请根据我的今日运势，生成一句富有哲理、治愈或实用的今日金句（一句话，30字以内，不要包含"今日"、"今天"等时间词）。',
        },
      ],
      baziContext
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
