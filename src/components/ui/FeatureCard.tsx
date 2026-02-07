// ==========================================
// 功能卡片 - 图标 + 标题 + 描述，可点击
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** 可点击跳转的链接 */
  to?: string;
  /** 索引，用于动画延迟 */
  index?: number;
}

export default function FeatureCard({ icon: Icon, title, description, to, index = 0 }: FeatureCardProps) {
  const cardClass =
    'p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 ' +
    'hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-card-hover ' +
    'focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ' +
    'transition-shadow duration-200 ease-out';

  const content = (
    <>
      <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
        <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={to ? '' : 'contents'}
    >
      {to ? (
        <Link to={to} className={`block ${cardClass}`}>
          {content}
        </Link>
      ) : (
        <div className={cardClass}>{content}</div>
      )}
    </motion.div>
  );
}
