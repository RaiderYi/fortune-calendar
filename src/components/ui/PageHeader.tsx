// ==========================================
// 页面标题 - 标题 + 简短描述
// ==========================================

import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  /** 可选：面包屑 */
  breadcrumb?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, description, breadcrumb, className = '' }: PageHeaderProps) {
  return (
    <div className={`mb-12 ${className}`}>
      {breadcrumb && <div className="mb-4">{breadcrumb}</div>}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {description && (
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
