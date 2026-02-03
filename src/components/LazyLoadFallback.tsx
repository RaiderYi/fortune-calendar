// ==========================================
// 懒加载 Fallback 组件
// ==========================================

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LazyLoadFallbackProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LazyLoadFallback({ 
  message = '加载中...', 
  fullScreen = false 
}: LazyLoadFallbackProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 p-8"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={32} className="text-indigo-500" />
      </motion.div>
      <span className="text-sm text-gray-500 dark:text-gray-400">{message}</span>
    </motion.div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
