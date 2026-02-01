// ==========================================
// API 服务层
// ==========================================

import type { AIChatRequest, AIChatResponse } from '../types';

const API_BASE_URL = '/api';

/**
 * AI 聊天请求
 */
export async function chatWithAI(
  messages: AIChatRequest['messages'],
  baziContext: AIChatRequest['baziContext']
): Promise<AIChatResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        baziContext,
      } as AIChatRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data: AIChatResponse = await response.json();
    return data;
  } catch (error) {
    console.error('AI 聊天请求失败:', error);
    throw error;
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
