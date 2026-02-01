// ==========================================
// 可折叠区域组件
// ==========================================

import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  defaultExpanded?: boolean;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode; // 标题栏右侧操作按钮
}

export default function CollapsibleSection({
  title,
  icon,
  defaultExpanded = false,
  children,
  className = '',
  headerAction,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      <div className="w-full p-4 flex items-center justify-between">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
          className="flex-1 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              {title}
            </h3>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={16} className="text-gray-400 dark:text-gray-500" />
          </motion.div>
        </motion.button>
        {headerAction && (
          <div className="ml-2" onClick={(e) => e.stopPropagation()}>
            {headerAction}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
