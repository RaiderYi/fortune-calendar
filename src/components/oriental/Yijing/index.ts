/* ============================================
   易经组件索引
   Yijing Components Index
   ============================================ */

export { YijingExperience } from './index.tsx';
export { Coin, ThreeCoins, TossButton } from './CoinToss';
export { 
  Hexagram, 
  YaoLine, 
  coinsToYao, 
  generateHexagram, 
  getHexagramName 
} from './Hexagram';

export type { YijingPhase, YijingExperienceProps } from './index.tsx';
export type { CoinFace, CoinProps, ThreeCoinsProps, TossButtonProps } from './CoinToss';
export type { YaoType, HexagramData, YaoLineProps, HexagramProps } from './Hexagram';
