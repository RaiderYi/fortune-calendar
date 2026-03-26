/* ============================================
   运势洞察卡片
   Fortune Insight Card
   ============================================ */

import { motion } from 'framer-motion';
import { Lightbulb, Calendar, TrendingUp, TrendingDown, Minus, Sparkles, Star } from 'lucide-react';

interface InsightData {
  type: 'trend' | 'tip' | 'lucky-day';
  title: string;
  content: string;
  detail?: string;
  score?: number;
}

interface InsightCardProps {
  insights: InsightData[];
  className?: string;
}

export function InsightCard({ insights, className = '' }: InsightCardProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-base font-serif text-ink flex items-center gap-2">
        <Lightbulb size={16} className="text-vermilion" />
        运势洞察
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-paper-dark rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              {/* 图标 */}
              <div className="flex-shrink-0 mt-0.5">
                {insight.type === 'trend' && (
                  <div className="w-8 h-8 rounded-lg bg-vermilion/10 flex items-center justify-center">
                    <TrendingUp size={16} className="text-vermilion" />
                  </div>
                )}
                {insight.type === 'tip' && (
                  <div className="w-8 h-8 rounded-lg bg-qingdai/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-qingdai" />
                  </div>
                )}
                {insight.type === 'lucky-day' && (
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Calendar size={16} className="text-gold-dark" />
                  </div>
                )}
              </div>
              
              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-serif text-ink mb-1">
                  {insight.title}
                </h4>
                <p className="text-sm text-light-ink font-serif leading-relaxed">
                  {insight.content}
                </p>
                
                {insight.detail && (
                  <p className="text-xs text-muted font-serif mt-2">
                    {insight.detail}
                  </p>
                )}
                
                {insight.score && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < Math.round(insight.score! / 20) 
                            ? 'text-gold fill-gold' 
                            : 'text-gray-200'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm font-serif text-gold-dark">
                      {insight.score}分
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// 单条洞察（简化版）
interface SingleInsightProps {
  type: 'up' | 'down' | 'stable';
  dimension: string;
  description: string;
  suggestion?: string;
}

export function SingleInsight({ 
  type, 
  dimension, 
  description,
  suggestion 
}: SingleInsightProps) {
  const icons = {
    up: <TrendingUp size={14} className="text-green-600" />,
    down: <TrendingDown size={14} className="text-red-500" />,
    stable: <Minus size={14} className="text-gray-400" />
  };

  const colors = {
    up: 'text-green-600',
    down: 'text-red-500',
    stable: 'text-gray-500'
  };

  return (
    <div className="flex items-start gap-2 py-2">
      {icons[type]}
      <div className="flex-1">
        <span className={`text-sm font-medium font-serif ${colors[type]}`}>
          {dimension}
        </span>
        <p className="text-sm text-light-ink font-serif mt-0.5">
          {description}
        </p>
        {suggestion && (
          <p className="text-xs text-muted font-serif mt-1">
            建议：{suggestion}
          </p>
        )}
      </div>
    </div>
  );
}

// 吉日卡片
interface LuckyDayCardProps {
  date: string;
  weekday: string;
  score: number;
  activities: string[];
}

export function LuckyDayCard({ 
  date, 
  weekday, 
  score, 
  activities 
}: LuckyDayCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-gold/10 to-transparent rounded-xl p-4 border border-gold/20"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-lg font-serif text-ink">{date}</span>
          <span className="text-sm text-light-ink font-serif ml-2">{weekday}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star size={14} className="text-gold fill-gold" />
          <span className="text-lg font-serif text-gold-dark">{score}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activities.map((activity, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 bg-white/50 rounded-full text-light-ink font-serif"
          >
            {activity}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export type { InsightData, LuckyDayCardProps };
