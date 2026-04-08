// BaZi Types

export interface BirthData {
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm
  timezone: string;
  location?: string;
}

export interface DayMaster {
  element: string;   // Wood, Fire, Earth, Metal, Water
  stem: string;      // Jia, Yi, Bing, Ding, etc.
  yinYang: string;   // Yang or Yin
  animal?: string;   // Horse, Goat, etc.
}

export interface ElementScores {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface BaZiChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

export interface Pillar {
  stem: string;
  branch: string;
  element: string;
}

export interface Insight {
  title: string;
  description: string;
  category: 'career' | 'relationship' | 'health' | 'wealth' | 'general';
}

export interface CalculationResult {
  dayMaster: DayMaster;
  chart: BaZiChart;
  elements: ElementScores;
  insight: Insight;
}

// Email Types

export interface EmailCaptureData {
  email: string;
  dayMaster: string;
  element: string;
  consent: boolean;
  source: string;
}

// UI Types

export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  features: string[];
  popular?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  avatar?: string;
  rating: number;
}
