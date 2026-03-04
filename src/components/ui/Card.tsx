// ==========================================
// UI 组件 - Card 卡片
// ==========================================
// 设计原则: 清晰的层次、柔和的阴影、适当的圆角
// ==========================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { colors, space, radius, shadows, duration, easing } from '../../designTokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 卡片变体 */
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  /** 悬停效果 */
  hover?: boolean;
  /** 点击效果 */
  clickable?: boolean;
  /** 内边距 */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** 是否有阴影 */
  shadow?: boolean;
  /** 动画 */
  animate?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = 'default',
      hover = false,
      clickable = false,
      padding = 'md',
      shadow = true,
      animate = true,
      className = '',
      style,
      onClick,
      ...props
    },
    ref
  ) => {
    // 基础样式
    const baseStyles: React.CSSProperties = {
      background: variant === 'glass' 
        ? 'rgba(255, 255, 255, 0.7)' 
        : colors.background.elevated,
      borderRadius: radius.xl,
      transition: `all ${duration.normal} ${easing.DEFAULT}`,
      position: 'relative' as const,
      overflow: 'hidden',
    };

    // 变体样式
    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        border: '1px solid transparent',
        boxShadow: shadow ? shadows.md : 'none',
      },
      elevated: {
        border: '1px solid transparent',
        boxShadow: shadow ? shadows.lg : shadows.md,
      },
      outlined: {
        border: `1px solid ${colors.border.light}`,
        boxShadow: 'none',
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: shadow ? shadows.glass : 'none',
      },
    };

    // 内边距
    const paddingStyles: Record<string, React.CSSProperties> = {
      none: { padding: 0 },
      sm: { padding: space[3] },
      md: { padding: space[4] },
      lg: { padding: space[6] },
      xl: { padding: space[8] },
    };

    // 悬停样式
    const hoverStyles: React.CSSProperties = hover || clickable
      ? {
          cursor: clickable ? 'pointer' : 'default',
        }
      : {};

    const cardStyles: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...paddingStyles[padding],
      ...hoverStyles,
      ...style,
    };

    // 动画变体
    const motionProps = animate
      ? {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          whileHover: hover || clickable
            ? { 
                y: -2, 
                boxShadow: variant === 'glass' 
                  ? '0 8px 32px 0 rgba(31, 38, 135, 0.25)' 
                  : shadows.lg 
              }
            : undefined,
        }
      : {};

    return (
      <motion.div
        ref={ref}
        style={cardStyles}
        className={`card card-${variant} ${className}`}
        onClick={onClick}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ==========================================
// Card 子组件
// ==========================================

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: space[4],
      }}
      className={`card-header ${className}`}
      {...props}
    >
      <div style={{ flex: 1 }}>
        {title && (
          <h3
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: colors.text.primary,
              margin: 0,
              marginBottom: subtitle ? space[1] : 0,
            }}
          >
            {title}
          </h3>
        )}
        {subtitle && (
          <p
            style={{
              fontSize: '14px',
              color: colors.text.secondary,
              margin: 0,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && <div style={{ marginLeft: space[4] }}>{action}</div>}
    </div>
  );
};

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: space[3],
        marginTop: space[4],
        paddingTop: space[4],
        borderTop: `1px solid ${colors.border.light}`,
      }}
      className={`card-footer ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
