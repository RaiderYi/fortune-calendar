// ==========================================
// Fortune Types - 运势相关类型定义
// ==========================================

// 六维键名
export type DimensionKey = 'career' | 'wealth' | 'love' | 'health' | 'study' | 'travel';

// 六维数据
export interface Dimensions {
  career: number;
  wealth: number;
  love: number;
  health: number;
  study: number;
  travel: number;
}

// 八字详情
export interface BaziDetail {
  yearPillar: string;
  monthPillar: string;
  dayPillar: string;
  hourPillar: string;
  dayMaster: string;
  dayMasterElement: string;
}

// 用神信息
export interface YongShen {
  name: string;
  element: string;
  description: string;
}

// 流年信息
export interface LiuNian {
  year: string;
  ganZhi: string;
  score: number;
}

// 运势数据
export interface FortuneData {
  dateStr: string;
  weekDay: string;
  lunarStr: string;
  totalScore: number;
  mainTheme: string;
  subTheme?: string;
  yi: string[];
  ji: string[];
  dimensions: Dimensions;
  baziDetail?: BaziDetail;
  yongShen?: YongShen | string;
  liuNian?: LiuNian;
  analysis?: string;
  suggestions?: string[];
}

// 历史记录项
export interface FortuneHistoryItem {
  dateStr: string;
  totalScore: number;
  mainTheme: string;
  dimensions: Dimensions;
}

// API 响应
export interface FortuneApiResponse {
  success: boolean;
  data?: FortuneData;
  error?: string;
}
