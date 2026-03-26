/* ============================================
   每日运势签 - 折叠展开式卡片
   Daily Fortune Card (Collapsible)
   ============================================ */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ThumbsUp, ThumbsDown, Sparkles, BookOpen } from 'lucide-react';
import { ScoreDisplay, ThemeBadge, FortuneLevelBadge } from './ScoreDisplay';
import { RadarChart, DimensionData } from './RadarChart';

// 宜忌项接口
interface TodoItem {
  text: string;
  icon?: string;
}

// 八字信息接口
interface BaziInfo {
  year: string;
  month: string;
  day: string;
  hour: string;
  dayMaster: string;
  yongShen: string;
}

// 运势卡片属性
interface FortuneCardProps {
  // 基本信息
  date: string;
  lunarDate: string;
  
  // 运势分数
  totalScore: number;
  dimensions: DimensionData;
  
  // 主题信息
  theme: string;
  themeDescription: string;
  
  // 宜忌
  yi: TodoItem[];
  ji: TodoItem[];
  
  // 八字信息（可选展开）
  bazi?: BaziInfo;
  
  // 控制
  defaultExpanded?: boolean;
  className?: string;
}

export function FortuneCard({
  date,
  lunarDate,
  totalScore,
  dimensions,
  theme,
  themeDescription,
  yi,
  ji,
  bazi,
  defaultExpanded = false,
  className = ''
}: FortuneCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`
        relative bg-white rounded-2xl overflow-hidden
        shadow-card hover:shadow-card-hover
        transition-shadow duration-300
        ${className}
      `}
    >
      {/* 水墨装饰背景 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-vermilion/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-qingdai/5 blur-3xl" />
      </div>

      {/* 第一层：签面（默认展示） */}
      <div className="relative p-6">
        {/* 日期栏 */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-serif text-ink">{date}</h3>
            <p className="text-sm text-light-ink font-serif">{lunarDate}</p>
          </div>
          <FortuneLevelBadge score={totalScore} size="sm" />
        </div>

        {/* 中心内容区 */}
        <div className="flex flex-col items-center mb-6">
          {/* 分数展示 */}
          <ScoreDisplay 
            score={totalScore} 
            size="lg"
            animate={true}
            showRing={true}
          />

          {/* 主题标签 */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <ThemeBadge theme={theme} size="md" />
            <p className="text-sm text-light-ink font-serif text-center max-w-[200px]">
              {themeDescription}
            </p>
          </div>
        </div>

        {/* 展开按钮 */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 py-3 
                     text-sm text-light-ink font-serif
                     hover:text-ink transition-colors
                     border-t border-border-subtle"
        >
          <span>{isExpanded ? '收起详情' : '展开详情'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.button>
      </div>

      {/* 第二层：展开详情 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border-subtle"
          >
            <div className="p-6 space-y-6">
              {/* 六维雷达图 */}
              <section>
                <h4 className="text-sm font-serif text-ink mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-vermilion" />
                  六维分析
                </h4>
                <div className="flex justify-center">
                  <RadarChart 
                    data={dimensions} 
                    size={220} 
                    animate={true}
                    variant="compact"
                  />
                </div>
              </section>

              {/* 宜忌清单 */}
              <section className="grid grid-cols-2 gap-4">
                {/* 宜 */}
                <div className="bg-green-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-serif text-green-700 mb-3 flex items-center gap-2">
                    <ThumbsUp size={14} />
                    宜
                  </h4>
                  <ul className="space-y-2">
                    {yi.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-ink-light font-serif"
                      >
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* 忌 */}
                <div className="bg-red-50/50 rounded-xl p-4">
                  <h4 className="text-sm font-serif text-red-700 mb-3 flex items-center gap-2">
                    <ThumbsDown size={14} />
                    忌
                  </h4>
                  <ul className="space-y-2">
                    {ji.map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="text-sm text-ink-light font-serif"
                      >
                        {item.text}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 八字简析（可选） */}
              {bazi && (
                <section className="bg-paper-dark rounded-xl p-4">
                  <h4 className="text-sm font-serif text-ink mb-3 flex items-center gap-2">
                    <BookOpen size={14} className="text-qingdai" />
                    八字简析
                  </h4>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div className="text-center">
                      <span className="text-xs text-light-ink block">年柱</span>
                      <span className="text-sm font-serif text-ink">{bazi.year}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-light-ink block">月柱</span>
                      <span className="text-sm font-serif text-ink">{bazi.month}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-light-ink block">日柱</span>
                      <span className="text-sm font-serif text-ink">{bazi.day}</span>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-light-ink block">时柱</span>
                      <span className="text-sm font-serif text-ink">{bazi.hour}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-light-ink font-serif">
                      日主：<span className="text-ink">{bazi.dayMaster}</span>
                    </span>
                    <span className="text-light-ink font-serif">
                      用神：<span className="text-vermilion">{bazi.yongShen}</span>
                    </span>
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 简化版运势卡片（用于列表展示）
interface CompactFortuneCardProps {
  date: string;
  score: number;
  theme: string;
  onClick?: () => void;
  className?: string;
}

export function CompactFortuneCard({
  date,
  score,
  theme,
  onClick,
  className = ''
}: CompactFortuneCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        bg-white rounded-xl p-4 shadow-card
        cursor-pointer hover:shadow-card-hover
        transition-shadow duration-300
        flex items-center justify-between
        ${className}
      `}
    >
      <div>
        <p className="text-sm text-light-ink font-serif">{date}</p>
        <ThemeBadge theme={theme} size="sm" />
      </div>
      <ScoreDisplay 
        score={score} 
        size="sm" 
        variant="minimal"
        showRing={false}
      />
    </motion.div>
  );
}

// 导出类型
export type { FortuneCardProps, CompactFortuneCardProps, TodoItem, BaziInfo, DimensionData };
