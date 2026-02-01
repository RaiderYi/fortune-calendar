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
