// ==========================================
// PageContainer - 统一页面容器
// ==========================================
// 提供一致的页面内边距和最大宽度
// ==========================================

import React from 'react';
import { space, size } from '../../designTokens';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  maxWidth = 'xl',
  padding = 'md',
  centered = false,
}) => {
  const maxWidthMap = {
    sm: size.container.sm,
    md: size.container.md,
    lg: size.container.lg,
    xl: size.container.xl,
    '2xl': size.container['2xl'],
    full: '100%',
  };

  const paddingMap = {
    none: 0,
    sm: `${space[4]}`,
    md: `${space[4]} ${space[6]}`,
    lg: `${space[6]} ${space[8]}`,
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: maxWidthMap[maxWidth],
        margin: centered ? '0 auto' : undefined,
        padding: paddingMap[padding],
        boxSizing: 'border-box',
      }}
      className={`page-container ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;
