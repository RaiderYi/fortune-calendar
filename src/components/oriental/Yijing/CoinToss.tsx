/* ============================================
   铜钱摇卦动画
   Coin Toss Animation
   ============================================ */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// 铜钱面
export type CoinFace = 'head' | 'tail';

interface CoinProps {
  face: CoinFace;
  isFlipping?: boolean;
  delay?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Coin({ 
  face, 
  isFlipping = false,
  delay = 0,
  size = 'md',
  className = ''
}: CoinProps) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-base',
    lg: 'w-20 h-20 text-lg'
  };

  return (
    <div 
      className={`relative ${sizeClasses[size]} ${className}`}
      style={{ perspective: '400px' }}
    >
      <motion.div
        initial={false}
        animate={isFlipping ? {
          rotateY: [0, 720, 1440],
          y: [0, -60, 0]
        } : {
          rotateY: face === 'head' ? 0 : 180,
          y: 0
        }}
        transition={{
          duration: 1.5,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 正面 - 字 */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg border-2 border-amber-500"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-3/4 h-3/4 rounded-full border border-amber-600/30 flex items-center justify-center bg-gradient-to-br from-amber-300/50 to-transparent">
            <span className="font-serif text-amber-900 font-bold">乾隆</span>
          </div>
        </div>

        {/* 背面 - 纹 */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg border-2 border-amber-600"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="w-3/4 h-3/4 rounded-full border border-amber-800/30 flex items-center justify-center bg-gradient-to-br from-amber-400/50 to-transparent">
            {/* 龙纹装饰 */}
            <svg viewBox="0 0 40 40" className="w-2/3 h-2/3 opacity-50">
              <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" className="text-amber-900" />
              <path d="M20 5 L20 15 M20 25 L20 35 M5 20 L15 20 M25 20 L35 20" stroke="currentColor" strokeWidth="1" className="text-amber-900" />
            </svg>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// 三枚铜钱组合
interface ThreeCoinsProps {
  results?: [CoinFace, CoinFace, CoinFace];
  isTossing?: boolean;
  onTossComplete?: (results: [CoinFace, CoinFace, CoinFace]) => void;
  className?: string;
}

export function ThreeCoins({ 
  results,
  isTossing = false,
  onTossComplete,
  className = ''
}: ThreeCoinsProps) {
  const [localResults, setLocalResults] = useState<[CoinFace, CoinFace, CoinFace]>(
    results || ['head', 'head', 'head']
  );
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (isTossing && !isFlipping) {
      setIsFlipping(true);
      
      // 生成随机结果
      setTimeout(() => {
        const newResults: [CoinFace, CoinFace, CoinFace] = [
          Math.random() > 0.5 ? 'head' : 'tail',
          Math.random() > 0.5 ? 'head' : 'tail',
          Math.random() > 0.5 ? 'head' : 'tail'
        ];
        setLocalResults(newResults);
        setIsFlipping(false);
        onTossComplete?.(newResults);
      }, 1500);
    }
  }, [isTossing, isFlipping, onTossComplete]);

  useEffect(() => {
    if (results) {
      setLocalResults(results);
    }
  }, [results]);

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <Coin 
        face={localResults[0]} 
        isFlipping={isFlipping} 
        delay={0}
        size="md"
      />
      <Coin 
        face={localResults[1]} 
        isFlipping={isFlipping} 
        delay={0.1}
        size="md"
      />
      <Coin 
        face={localResults[2]} 
        isFlipping={isFlipping} 
        delay={0.2}
        size="md"
      />
    </div>
  );
}

// 摇卦按钮
interface TossButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isTossing?: boolean;
  remaining?: number;
  className?: string;
}

export function TossButton({ 
  onClick, 
  disabled = false,
  isTossing = false,
  remaining,
  className = ''
}: TossButtonProps) {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled || isTossing}
      className={`
        relative px-8 py-4 rounded-full font-serif text-lg
        transition-all duration-300
        ${disabled 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-vermilion/20 border-2 border-vermilion/50 text-vermilion-light hover:bg-vermilion/30'
        }
        ${className}
      `}
    >
      <span className="flex items-center gap-2">
        {isTossing ? (
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            摇卦中...
          </motion.span>
        ) : (
          <>
            {remaining !== undefined ? `第${7 - remaining}次摇卦` : '开始摇卦'}
            {remaining !== undefined && (
              <span className="text-sm opacity-60">（剩余{remaining}次）</span>
            )}
          </>
        )}
      </span>
    </motion.button>
  );
}

export type { CoinFace, CoinProps, ThreeCoinsProps, TossButtonProps };
