// ==========================================
// AI锦囊卡片组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getTodayWisdom } from '../services/api';
import type { BaziContext } from '../types';

interface AIWisdomCardProps {
  baziContext?: BaziContext;
  theme?: 'excellent' | 'good' | 'neutral' | 'poor';
  className?: string;
}

const themeStyles = {
  excellent: {
    gradient: 'from-amber-50 via-yellow-50 to-orange-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    quoteColor: 'border-amber-300',
    textColor: 'text-amber-900',
  },
  good: {
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    border: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    quoteColor: 'border-green-300',
    textColor: 'text-green-900',
  },
  neutral: {
    gradient: 'from-blue-50 via-indigo-50 to-purple-50',
    border: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    quoteColor: 'border-blue-300',
    textColor: 'text-blue-900',
  },
  poor: {
    gradient: 'from-orange-50 via-amber-50 to-yellow-50',
    border: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    quoteColor: 'border-orange-300',
    textColor: 'text-orange-900',
  },
};

export default function AIWisdomCard({
  baziContext,
  theme = 'neutral',
  className = '',
}: AIWisdomCardProps) {
  const { t, i18n } = useTranslation(['common', 'fortune']);
  const isEnglish = i18n.language === 'en';

  const [wisdom, setWisdom] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string>('');

  const styles = themeStyles[theme];

  // 加载锦囊
  useEffect(() => {
    if (baziContext && !wisdom && !isLoading) {
      loadWisdom();
    }
  }, [baziContext]);

  const loadWisdom = async () => {
    if (!baziContext) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const result = await getTodayWisdom(baziContext);
      if (result) {
        setWisdom(result);
      } else {
        // 使用默认锦囊
        setWisdom(isEnglish 
          ? 'Every day is a new beginning, embrace the possibilities.'
          : '每一天都是新的开始，拥抱无限可能。'
        );
      }
    } catch (err) {
      setError(isEnglish ? 'Failed to load' : '加载失败');
      setWisdom(isEnglish
        ? 'Stay positive, good things are coming.'
        : '保持积极，好事即将发生。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    if (!wisdom) return;
    
    try {
      await navigator.clipboard.writeText(wisdom);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 刷新锦囊
  const handleRefresh = () => {
    setWisdom('');
    loadWisdom();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${styles.gradient}
        border ${styles.border}
        p-4 ${className}
      `}
    >
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/30 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />

      {/* 头部 */}
      <div className="relative flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${styles.iconBg}`}>
            <Sparkles size={16} className={styles.iconColor} />
          </div>
          <span className={`text-xs font-semibold ${styles.iconColor}`}>
            {isEnglish ? 'AI Wisdom' : 'AI 锦囊'}
          </span>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-1">
          {wisdom && (
            <button
              onClick={handleCopy}
              className={`
                p-1.5 rounded-lg transition-colors
                ${isCopied 
                  ? 'bg-green-100 text-green-600' 
                  : 'hover:bg-white/50 text-gray-500'
                }
              `}
              title={isEnglish ? 'Copy' : '复制'}
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className={`
              p-1.5 rounded-lg transition-colors
              hover:bg-white/50 text-gray-500
              ${isLoading ? 'animate-spin' : ''}
            `}
            title={isEnglish ? 'Refresh' : '刷新'}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* 锦囊内容 */}
      <div className="relative">
        {isLoading ? (
          // 加载状态
          <div className="flex items-center gap-3 py-2">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={`w-2 h-2 rounded-full ${styles.iconBg.replace('bg-', 'bg-')}`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {isEnglish ? 'AI is thinking...' : 'AI正在思考今日运势...'}
            </span>
          </div>
        ) : (
          // 内容展示
          <div className="relative">
            {/* 左侧引号装饰 */}
            <div className={`absolute left-0 top-0 w-1 h-full rounded-full ${styles.quoteColor.replace('border-', 'bg-')}`} />
            
            <blockquote className={`pl-3 ${styles.textColor}`}>
              <p className="text-base font-medium leading-relaxed">
                {wisdom || (isEnglish ? 'Click refresh to get wisdom' : '点击刷新获取锦囊')}
              </p>
            </blockquote>
          </div>
        )}
      </div>

      {/* 底部提示 */}
      {!isLoading && wisdom && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mt-3 text-xs text-gray-500 text-right"
        >
          {isEnglish ? 'Powered by DeepSeek AI' : '由 DeepSeek AI 生成'}
        </motion.p>
      )}
    </motion.div>
  );
}
