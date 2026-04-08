'use client';

import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Insight } from '@/types';

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const categoryColors: Record<string, string> = {
    career: 'from-gold-100 to-gold-50 border-gold-200',
    relationship: 'from-rose-100 to-rose-50 border-rose-200',
    health: 'from-jade-100 to-jade-50 border-jade-200',
    wealth: 'from-gold-100 to-gold-50 border-gold-200',
    general: 'from-primary-100 to-primary-50 border-primary-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className={`crystal-card p-8 bg-gradient-to-br ${categoryColors[insight.category] || categoryColors.general}`}
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-white/80 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-6 h-6 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl font-semibold text-primary-950 mb-2">
            {insight.title}
          </h3>
          <p className="text-charcoal/70 leading-relaxed">
            {insight.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
