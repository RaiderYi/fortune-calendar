/* ============================================
   3D翻转塔罗牌
   3D Flippable Tarot Card
   ============================================ */

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Card3DProps {
  frontImage?: string;
  backImage?: string;
  cardName?: string;
  isFlipped?: boolean;
  onFlip?: () => void;
  size?: 'sm' | 'md' | 'lg';
  isReversed?: boolean;
  className?: string;
}

export function Card3D({
  frontImage,
  backImage,
  cardName = '塔罗牌',
  isFlipped: controlledFlipped,
  onFlip,
  size = 'md',
  isReversed = false,
  className = ''
}: Card3DProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const isFlipped = controlledFlipped ?? internalFlipped;

  const handleFlip = () => {
    if (controlledFlipped === undefined) {
      setInternalFlipped(!internalFlipped);
    }
    onFlip?.();
  };

  const sizeClasses = {
    sm: { container: 'w-24 h-36', text: 'text-xs' },
    md: { container: 'w-32 h-48', text: 'text-sm' },
    lg: { container: 'w-40 h-60', text: 'text-base' }
  };

  const config = sizeClasses[size];

  return (
    <div 
      className={`${config.container} ${className}`}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        onClick={handleFlip}
      >
        {/* 牌背 */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-lg"
          style={{ 
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2A2A3E 100%)'
          }}
        >
          {backImage ? (
            <img 
              src={backImage} 
              alt="Card Back" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              {/* 东方云纹装饰 */}
              <svg viewBox="0 0 100 140" className="w-full h-full opacity-60">
                <defs>
                  <pattern id="cloudPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="10" cy="10" r="2" fill="rgba(212, 165, 116, 0.3)" />
                  </pattern>
                </defs>
                <rect width="100" height="140" fill="url(#cloudPattern)" />
                <path
                  d="M50 30 Q60 40 50 50 Q40 60 50 70 Q60 80 50 90 Q40 100 50 110"
                  stroke="#D4A574"
                  strokeWidth="1"
                  fill="none"
                  opacity="0.4"
                />
                <circle cx="50" cy="70" r="20" stroke="#D4A574" strokeWidth="1" fill="none" opacity="0.3" />
              </svg>
              
              {/* 中心符号 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-gold/30 flex items-center justify-center">
                  <span className="text-gold/60 font-serif text-lg">☯</span>
                </div>
              </div>
            </div>
          )}
          
          {/* 边框装饰 */}
          <div className="absolute inset-2 border border-gold/20 rounded-lg pointer-events-none" />
        </div>

        {/* 牌面 */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-white"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {frontImage ? (
            <img 
              src={frontImage} 
              alt={cardName}
              className={`w-full h-full object-cover ${isReversed ? 'rotate-180' : ''}`}
            />
          ) : (
            <div className={`w-full h-full flex flex-col items-center justify-center p-4 ${isReversed ? 'rotate-180' : ''}`}>
              <span className="text-4xl mb-2">🌙</span>
              <span className={`${config.text} font-serif text-ink text-center`}>
                {cardName}
              </span>
            </div>
          )}
          
          {/* 边框装饰 */}
          <div className="absolute inset-2 border border-vermilion/20 rounded-lg pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}

// 卡牌选择器（多张卡牌）
interface CardSelectorProps {
  count?: number;
  selectedIndex?: number;
  onSelect?: (index: number) => void;
  className?: string;
}

export function CardSelector({ 
  count = 5, 
  selectedIndex,
  onSelect,
  className = ''
}: CardSelectorProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            scale: selectedIndex === index ? 1.1 : 1,
            z: selectedIndex === index ? 50 : 0
          }}
          transition={{ 
            delay: index * 0.1,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1]
          }}
          whileHover={{ 
            scale: selectedIndex === undefined ? 1.05 : undefined,
            y: selectedIndex === undefined ? -10 : undefined
          }}
          onClick={() => onSelect?.(index)}
          className={`
            cursor-pointer transition-shadow duration-300
            ${selectedIndex === index ? 'z-10' : 'z-0'}
          `}
          style={{
            filter: selectedIndex !== undefined && selectedIndex !== index 
              ? 'brightness(0.5)' 
              : 'none'
          }}
        >
          <div 
            className="w-20 h-32 rounded-lg overflow-hidden shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #1A1A2E 0%, #2A2A3E 100%)'
            }}
          >
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gold/40 font-serif text-2xl">?</span>
            </div>
            <div className="absolute inset-1.5 border border-gold/20 rounded-md pointer-events-none" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export type { Card3DProps, CardSelectorProps };
