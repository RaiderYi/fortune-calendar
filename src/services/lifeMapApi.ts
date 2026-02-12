import { fetchWithRetry } from '../utils/apiRetry';

export interface LifeMapTrendPoint {
  year: number;
  ganZhi: string;
  overall: number;
  career: number;
  wealth: number;
  romance: number;
  health: number;
  academic: number;
  travel: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  momentum: {
    delta: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export interface LifeMapMilestone {
  type: string;
  year: number;
  title: string;
  score: number;
  detail: string;
}

export interface LifeMapStrategyItem {
  id: string;
  title: string;
  detail: string;
  priority: 'high' | 'medium' | 'low';
}

export interface LifeMapSummary {
  average: number;
  volatility: number;
  trend: 'rising' | 'falling' | 'stable';
  confidence: number;
  peakYear: number;
  troughYear: number;
  failedYears: number[];
  milestoneCount: number;
}

export interface LifeMapData {
  startYear: number;
  years: number;
  points: LifeMapTrendPoint[];
  milestones: LifeMapMilestone[];
  summary: LifeMapSummary;
  strategy: LifeMapStrategyItem[];
  failedYears: number[];
}

export interface LifeMapRequest {
  birthDate: string;
  birthTime: string;
  longitude: string | number;
  gender?: string;
  customYongShen?: string | string[] | null;
  startYear?: number;
  years?: number;
}

interface LifeMapResponse {
  success: boolean;
  data?: LifeMapData;
  error?: string;
}

export async function getLifeMapTrends(payload: LifeMapRequest): Promise<LifeMapData> {
  const response = await fetchWithRetry<LifeMapResponse>(
    '/api/lifemap/trends',
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
    throw new Error(response.error || '获取人生大图景失败');
  }

  return response.data;
}
