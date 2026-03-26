/* ============================================
   东方美学组件索引
   Oriental Components Index
   ============================================ */

// 动画组件
export {
  PageTransition,
  InkPageTransition,
  AnimatedRoutes,
  PageContainer,
  StaggerContainer,
  StaggerItem,
  CardGrid,
  ListContainer,
  ListItem,
  FadeContainer,
  InkLoader,
  FullScreenLoader,
  InlineLoader,
  Skeleton,
  CardSkeleton,
  InkDropAnimation
} from './animations';

// 运势卡片
export {
  FortuneCard,
  CompactFortuneCard,
  ScoreDisplay,
  ThemeBadge,
  FortuneLevelBadge,
  RadarChart,
  DualRadarChart
} from './FortuneCard';

export type {
  FortuneCardProps,
  CompactFortuneCardProps,
  DimensionData,
  TodoItem,
  BaziInfo
} from './FortuneCard';

// 趋势看板
export {
  TrendDashboard,
  TimeRangeTabs,
  CompactTimeTabs,
  TrendChart,
  BarCompareChart,
  InsightCard,
  SingleInsight,
  LuckyDayCard
} from './TrendDashboard';

export type {
  TimeRange,
  TrendDataPoint,
  BarCompareData,
  InsightData,
  LuckyDayCardProps
} from './TrendDashboard';

// 塔罗
export {
  TarotExperience,
  Card3D,
  CardSelector,
  InkSpread,
  GoldenParticles,
  BreathingGlow
} from './Tarot';

export type {
  TarotPhase,
  TarotCard,
  TarotExperienceProps
} from './Tarot';

// 易经
export {
  YijingExperience,
  Coin,
  ThreeCoins,
  TossButton,
  Hexagram,
  YaoLine,
  coinsToYao,
  generateHexagram,
  getHexagramName
} from './Yijing';

export type {
  YijingPhase,
  CoinFace,
  YaoType,
  HexagramData
} from './Yijing';
