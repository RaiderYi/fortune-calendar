// ==========================================
// 页面区块 - 统一 padding、max-width、背景
// ==========================================

import { ReactNode } from 'react';

interface PageSectionProps {
  children: ReactNode;
  className?: string;
  /** 浅色/深色背景交替 */
  variant?: 'default' | 'alt';
}

export default function PageSection({ children, className = '', variant = 'default' }: PageSectionProps) {
  const bgClass = variant === 'alt'
    ? 'bg-white dark:bg-slate-800/50'
    : 'bg-transparent';

  return (
    <section className={`py-16 lg:py-24 ${bgClass} ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}
