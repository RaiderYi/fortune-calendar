/* ============================================
   水墨风格加载动画
   Ink Style Loading Animations
   ============================================ */

import { motion } from 'framer-motion';

interface InkLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  variant?: 'default' | 'minimal' | 'ripple';
}

// 默认水墨加载器
export function InkLoader({ 
  size = 'md', 
  text,
  variant = 'default'
}: InkLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const strokeWidth = {
    sm: 2,
    md: 2.5,
    lg: 3,
    xl: 4
  };

  if (variant === 'ripple') {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className={`relative ${sizeClasses[size]}`}>
          {/* 涟漪层1 */}
          <motion.div
            animate={{ 
              scale: [1, 2],
              opacity: [0.6, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute inset-0 rounded-full border-2 border-vermilion/30"
          />
          {/* 涟漪层2 */}
          <motion.div
            animate={{ 
              scale: [1, 2],
              opacity: [0.6, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5
            }}
            className="absolute inset-0 rounded-full border-2 border-qingdai/30"
          />
          {/* 中心点 */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 m-auto w-1/3 h-1/3 rounded-full bg-vermilion/60"
          />
        </div>
        {text && (
          <p className="text-sm text-light-ink font-serif animate-pulse-gentle">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className={`relative ${sizeClasses[size]}`}>
          <svg viewBox="0 0 50 50" className="w-full h-full animate-rotate-slow">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="rgba(196, 92, 38, 0.2)"
              strokeWidth={strokeWidth[size]}
            />
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="url(#minimalGradient)"
              strokeWidth={strokeWidth[size]}
              strokeLinecap="round"
              strokeDasharray="80 120"
            />
            <defs>
              <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D4A574" />
                <stop offset="100%" stopColor="#C45C26" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {text && (
          <p className="text-sm text-light-ink font-serif">
            {text}
          </p>
        )}
      </div>
    );
  }

  // 默认版本
  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* 外圈 - 缓慢旋转 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-vermilion/30"
        />
        
        {/* 中圈 - 反向旋转 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-2 rounded-full border-2 border-dotted border-qingdai/30"
        />
        
        {/* 内圈 - 金色点缀 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute inset-4 rounded-full"
          style={{
            border: '2px solid transparent',
            borderTopColor: 'rgba(212, 165, 116, 0.6)',
            borderRightColor: 'rgba(212, 165, 116, 0.3)'
          }}
        />
        
        {/* 中心点 - 呼吸效果 */}
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.5, 1, 0.5] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-vermilion/60"
        />
      </div>
      
      {text && (
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-sm text-light-ink font-serif"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// 全屏加载覆盖层
interface FullScreenLoaderProps {
  text?: string;
  subtext?: string;
  variant?: 'default' | 'minimal' | 'ripple';
}

export function FullScreenLoader({ 
  text, 
  subtext,
  variant = 'default'
}: FullScreenLoaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-paper/95 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <InkLoader size="lg" text={text} variant={variant} />
      {subtext && (
        <p className="mt-4 text-sm text-muted">
          {subtext}
        </p>
      )}
    </motion.div>
  );
}

// 内联加载器（用于按钮内部等）
export function InlineLoader({ 
  size = 'sm' 
}: { 
  size?: 'xs' | 'sm' | 'md';
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 1, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className={`${sizeClasses[size]} border-2 border-current border-t-transparent rounded-full`}
    />
  );
}

// 骨架屏加载
interface SkeletonProps {
  className?: string;
  circle?: boolean;
}

export function Skeleton({ 
  className = '',
  circle = false
}: SkeletonProps) {
  return (
    <div 
      className={`
        animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
        ${circle ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={{
        backgroundSize: '200% 100%'
      }}
    />
  );
}

// 卡片骨架屏
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}

// 水墨滴落动画
export function InkDropAnimation({ 
  onComplete 
}: { 
  onComplete?: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1, 2, 3],
        opacity: [0, 0.8, 0.4, 0]
      }}
      transition={{ 
        duration: 1.2,
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      className="absolute inset-0 pointer-events-none"
      style={{
        background: 'radial-gradient(circle, rgba(196, 92, 38, 0.3) 0%, transparent 60%)'
      }}
    />
  );
}
