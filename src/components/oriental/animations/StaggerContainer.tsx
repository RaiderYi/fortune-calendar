/* ============================================
   列表交错动画容器
   Stagger Animation Container
   ============================================ */

import { motion, Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
}

// 容器变体
const containerVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// 子项变体
const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 从左侧滑入
const itemSlideLeftVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -30 
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 从右侧滑入
const itemSlideRightVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 30 
  },
  show: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 缩放淡入
const itemScaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9 
  },
  show: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 容器组件
export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.05,
  delayChildren = 0.1
}: StaggerContainerProps) {
  const customVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayChildren
      }
    }
  };

  return (
    <motion.div
      variants={customVariants}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 子项组件
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'slideLeft' | 'slideRight' | 'scale';
}

export function StaggerItem({ 
  children, 
  className,
  variant = 'default'
}: StaggerItemProps) {
  const variants = {
    default: itemVariants,
    slideLeft: itemSlideLeftVariants,
    slideRight: itemSlideRightVariants,
    scale: itemScaleVariants
  }[variant];

  return (
    <motion.div 
      variants={variants} 
      className={className}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

// 卡片列表容器（用于卡片网格）
interface CardGridProps {
  children: ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function CardGrid({ 
  children, 
  className,
  columns = 2
}: CardGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <StaggerContainer className={`grid ${colClasses[columns]} gap-4 ${className}`}>
      {children}
    </StaggerContainer>
  );
}

// 列表容器
interface ListContainerProps {
  children: ReactNode;
  className?: string;
  divide?: boolean;
}

export function ListContainer({ 
  children, 
  className,
  divide = false
}: ListContainerProps) {
  return (
    <StaggerContainer 
      className={`flex flex-col ${divide ? 'divide-y divide-border-subtle' : 'gap-3'} ${className}`}
    >
      {children}
    </StaggerContainer>
  );
}

// 列表项
export function ListItem({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <StaggerItem 
      variant="slideLeft"
      className={`py-3 ${className}`}
    >
      {children}
    </StaggerItem>
  );
}

// 淡入容器（一次性淡入，不交错的简单版本）
interface FadeContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function FadeContainer({ 
  children, 
  className,
  delay = 0,
  duration = 0.4
}: FadeContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
