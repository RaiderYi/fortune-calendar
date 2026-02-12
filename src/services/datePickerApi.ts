import { fetchWithRetry } from '../utils/apiRetry';

export type DatePickerPurpose =
  | 'moving'
  | 'opening'
  | 'travel'
  | 'romance'
  | 'wealth'
  | 'academic'
  | 'other';

export type WeekendPolicy = 'all' | 'weekend_only' | 'workday_only';

export interface DatePickerRequest {
  birthDate: string;
  birthTime: string;
  longitude: string | number;
  gender?: string;
  customYongShen?: string | string[] | null;
  purpose: DatePickerPurpose;
  rangeDays: number;
  topN?: number;
  startDate?: string;
  weekendPolicy?: WeekendPolicy;
  excludedDates?: string[];
}

export interface DatePickerRecommendation {
  date: string;
  weekday: number;
  totalScore: number;
  purposeScore: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  riskWeight: number;
  riskFlags: string[];
  bestTimeWindow: string;
  mainTheme?: {
    keyword?: string;
    subKeyword?: string;
    emoji?: string;
    description?: string;
  };
  dimensions: Record<string, number>;
  highlights: string[];
  cautions: string[];
  tags: string[];
  liu?: {
    nian?: string;
    yue?: string;
    ri?: string;
  };
}

export interface DatePickerResponseData {
  purpose: DatePickerPurpose;
  startDate: string;
  rangeDays: number;
  scannedDays: number;
  skippedDays: number;
  failedDays: number;
  recommendedCount: number;
  recommendations: DatePickerRecommendation[];
  timeline: DatePickerRecommendation[];
  summary: {
    bestDate: string;
    bestScore: number;
    worstDate: string;
    worstScore: number;
    trend: 'rising' | 'stable' | 'falling';
    averageConfidence: number;
    failedDays: number;
  };
}

export interface DatePickerApiResponse {
  success: boolean;
  data?: DatePickerResponseData;
  error?: string;
}

export async function getDatePickerRecommendations(
  payload: DatePickerRequest
): Promise<DatePickerResponseData> {
  const response = await fetchWithRetry<DatePickerApiResponse>(
    '/api/date-picker/recommend',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    {
      maxRetries: 2,
      delay: 800,
      backoff: 1.5,
    }
  );

  if (!response.success || !response.data) {
    throw new Error(response.error || '获取择日推荐失败');
  }

  return response.data;
}
