// ==========================================
// 类型定义文件
// ==========================================

// AI 聊天相关类型
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface BaziContext {
  baziDetail?: {
    year: string;
    month: string;
    day: string;
    hour: string;
    dayMaster: string;
  };
  yongShen?: {
    strength: string;
    yongShen: string[];
    xiShen: string[];
    jiShen: string[];
  };
  dimensions?: {
    [key: string]: {
      score: number;
      level: string;
      tag: string;
      inference: string;
    };
  };
  mainTheme?: {
    keyword: string;
    subKeyword: string;
    emoji: string;
    description: string;
  };
  totalScore?: number;
  liuNian?: {
    year: string;
    month: string;
    day: string;
    yearGan: string;
    yearZhi: string;
    monthGan: string;
    monthZhi: string;
    dayGan: string;
    dayZhi: string;
  };
}

/** 易经问卦上下文（与 baziContext 二选一或并存） */
export interface YijingContext {
  question: string;
  benGua: string;
  bianGua: string;
  movingLines: number[];
  lines: Array<{
    position: number;
    value: number;
    label: string;
    isMoving: boolean;
  }>;
  seed?: number;
  category?: string;
}

export interface TarotContext {
  spread: string;
  cards: Array<{
    name: string;
    nameEn: string;
    reversed: boolean;
    position: string;
  }>;
}

export interface AIChatRequest {
  messages: ChatMessage[];
  baziContext?: BaziContext;
  yijingContext?: YijingContext;
}

export interface AIChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// 快捷问题类型
export interface QuickQuestion {
  id: string;
  text: string;
  icon?: string;
}
