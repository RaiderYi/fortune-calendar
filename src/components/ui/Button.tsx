// ==========================================
// UI 组件 - Button 按钮
// ==========================================
// 设计原则: 清晰的层次、一致的反馈、适当的间距
// ==========================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { colors, space, radius, shadows, fontSize, fontWeight, duration, easing } from '../../designTokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 按钮变体 */
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger';
  /** 按钮尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** 加载状态 */
  loading?: boolean;
  /** 全宽按钮 */
  fullWidth?: boolean;
  /** 左侧图标 */
  leftIcon?: React.ReactNode;
  /** 右侧图标 */
  rightIcon?: React.ReactNode;
  /** 点击动画 */
  animate?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      animate = true,
      disabled,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    // 基础样式
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: space.sm,
      border: 'none',
      borderRadius: radius.lg,
      fontFamily: 'inherit',
      fontWeight: fontWeight.semibold,
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      transition: `all ${duration.normal} ${easing.DEFAULT}`,
      width: fullWidth ? '100%' : 'auto',
      opacity: disabled || loading ? 0.6 : 1,
      position: 'relative' as const,
      overflow: 'hidden',
    };

    // 变体样式
    const variantStyles: Record<string, React.CSSProperties> = {
      primary: {
        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
        color: colors.text.inverse,
        boxShadow: shadows.colored,
      },
      secondary: {
        background: colors.background.elevated,
        color: colors.text.primary,
        border: `1px solid ${colors.border.DEFAULT}`,
        boxShadow: shadows.sm,
      },
      ghost: {
        background: 'transparent',
        color: colors.text.secondary,
      },
      glass: {
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        color: colors.text.inverse,
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: shadows.glass,
      },
      danger: {
        background: colors.functional.error,
        color: colors.text.inverse,
        boxShadow: `0 4px 14px 0 rgba(239, 68, 68, 0.39)`,
      },
    };

    // 尺寸样式
    const sizeStyles: Record<string, React.CSSProperties> = {
      sm: {
        height: '32px',
        padding: `0 ${space[3]}`,
        fontSize: fontSize.xs[0],
        borderRadius: radius.md,
      },
      md: {
        height: '40px',
        padding: `0 ${space[4]}`,
        fontSize: fontSize.sm[0],
      },
      lg: {
        height: '48px',
        padding: `0 ${space[6]}`,
        fontSize: fontSize.base[0],
      },
      xl: {
        height: '56px',
        padding: `0 ${space[8]}`,
        fontSize: fontSize.lg[0],
        borderRadius: radius.xl,
      },
    };

    const buttonStyles: React.CSSProperties = {
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...style,
    };

    const content = (
      <>
        {loading && (
          <span className="loading-spinner" style={{ marginRight: space.sm }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                animation: 'spin 1s linear infinite',
              }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </span>
        )}
        {!loading && leftIcon && <span className="button-icon">{leftIcon}</span>}
        <span className="button-text">{children}</span>
        {!loading && rightIcon && <span className="button-icon">{rightIcon}</span>}
      </>
    );

    // 动画变体
    const motionProps = animate
      ? {
          whileHover: { scale: disabled || loading ? 1 : 1.02 },
          whileTap: { scale: disabled || loading ? 1 : 0.98 },
          transition: { duration: 0.2 },
        }
      : {};

    return (
      <motion.button
        ref={ref}
        style={buttonStyles}
        className={`button button-${variant} button-${size} ${className}`}
        disabled={disabled || loading}
        {...motionProps}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
