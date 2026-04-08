/**
 * BaZi (Four Pillars) Type Definitions
 * Complete type system for BaZi calculations
 */

// Element types
export type Element = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';
export type YinYang = 'Yin' | 'Yang';

// Pillar (one column of the chart)
export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  element: Element;
  yinYang: YinYang;
  hiddenStems: string[];
}

// Four Pillars (complete chart)
export interface FourPillars {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;  // Contains Day Master
  hourPillar: Pillar;
}

// Day Master (core personality element)
export interface DayMaster {
  stem: string;
  element: Element;
  yinYang: YinYang;
  animal: string;  // Chinese zodiac animal
  description: string;
}

// Luck cycle (10-year periods)
export interface LuckCycle {
  age: number;
  yearStart: number;
  yearEnd: number;
  pillar: Pillar;
  element: Element;
  description: string;
}

// Element balance analysis
export interface ElementBalance {
  Wood: number;
  Fire: number;
  Earth: number;
  Metal: number;
  Water: number;
  dominant: Element;
  weakest: Element;
}

// Birth data input
export interface BirthData {
  date: string;      // YYYY-MM-DD
  time: string;      // HH:mm
  location: string;
  gender: 'male' | 'female' | 'non-binary';
  name?: string;
}

// Complete BaZi result
export interface BaZiResult {
  pillars: FourPillars;
  dayMaster: DayMaster;
  elementBalance: ElementBalance;
  luckCycles: LuckCycle[];
  favorableElements: Element[];
  unfavorableElements: Element[];
  personalityTraits: string[];
  careerIndications: string[];
  relationshipIndications: string[];
  healthIndications: string[];
}

// Mini result (for free calculator)
export interface MiniResult {
  dayMaster: DayMaster;
  elementBalance: ElementBalance;
  favorableElements: Element[];
  personalityTraits: string[];
}

// Fortune score for specific day
export interface FortuneScore {
  overall: number;
  career: number;
  wealth: number;
  relationships: number;
  health: number;
  creativity: number;
  date: string;
  description: string;
}

// API response types
export interface CalculateResponse {
  success: boolean;
  data?: BaZiResult;
  error?: string;
}

export interface MiniCalculateResponse {
  success: boolean;
  data?: MiniResult;
  error?: string;
}
