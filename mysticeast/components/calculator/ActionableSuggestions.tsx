'use client';

import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface ActionableSuggestionsProps {
  suggestions: string[];
}

export function ActionableSuggestions({ suggestions }: ActionableSuggestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95, duration: 0.5 }}
      className="mt-8 crystal-card p-8 bg-gradient-to-br from-jade-50 to-primary-50 border border-jade-200/60"
    >
      <div className="mb-6">
        <h3 className="font-serif text-2xl font-semibold text-primary-950 mb-2">
          Three ways to work with your energy this week
        </h3>
        <p className="text-charcoal/70 leading-relaxed">
          Start small. These suggestions are designed to help you use your natural strengths with more clarity and balance.
        </p>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion}
            className="flex items-start space-x-4 rounded-2xl border border-white/60 bg-white/70 p-4"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-jade-100 text-jade-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-jade-700/80">
                Suggestion {index + 1}
              </p>
              <p className="mt-1 text-charcoal/80 leading-relaxed">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
