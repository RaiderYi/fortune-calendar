/* ============================================
   页面转场动画组件
   Page Transition Animations
   ============================================ */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
  mode?: 'fade' | 'slide' | 'ink';
}

// 基础淡入淡出转场
const fadeVariants = {
  initial: { 
    opacity: 0,
    filter: 'blur(4px)'
  },
  animate: { 
    opacity: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    filter: 'blur(4px)',
    transition: { duration: 0.3 }
  }
};

// 滑动转场
const slideVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(4px)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: 0.3 }
  }
};

// 水墨晕染转场
const inkVariants = {
  initial: { 
    opacity: 0,
    scale: 0.95,
    filter: 'blur(8px)'
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 1.02,
    filter: 'blur(6px)',
    transition: { duration: 0.4 }
  }
};

export function PageTransition({ 
  children, 
  className,
  mode = 'slide' 
}: PageTransitionProps) {
  const variants = {
    fade: fadeVariants,
    slide: slideVariants,
    ink: inkVariants
  }[mode];

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

// 带水墨背景扩散效果的转场
export function InkPageTransition({ 
  children, 
  className 
}: Omit<PageTransitionProps, 'mode'>) {
  return (
    <div className="relative overflow-hidden">
      {/* 水墨扩散背景层 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 0.15, 0], 
          scale: [0.8, 1.5, 2] 
        }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut" 
        }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, rgba(196, 92, 38, 0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* 内容层 */}
      <motion.div
        variants={inkVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
        style={{ willChange: 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// 路由包裹组件（用于AnimatePresence）
interface AnimatedRoutesProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedRoutes({ children, className }: AnimatedRoutesProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// 页面内容容器（用于页面内部元素）
export function PageContainer({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-paper transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
}
