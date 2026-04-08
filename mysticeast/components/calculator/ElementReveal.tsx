'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ElementIcon } from './ElementIcon';
import { type DayMaster, type ElementScores } from '@/types';

interface ElementRevealProps {
  dayMaster: DayMaster;
  elements: ElementScores;
}

export function ElementReveal({ dayMaster, elements }: ElementRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // Trigger reveal animation after mount
    const timer = setTimeout(() => setIsRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getElementDescription = (element: string) => {
    const descriptions: Record<string, string> = {
      wood: 'Growth, creativity, and vision. Like a tree reaching toward the sun, you naturally expand and inspire.',
      fire: 'Passion, expression, and charisma. Your warmth lights up rooms and your enthusiasm is contagious.',
      earth: 'Nurturing, stability, and practicality. You provide grounding energy and build lasting foundations.',
      metal: 'Precision, structure, and determination. Your clarity cuts through confusion and you value excellence.',
      water: 'Wisdom, adaptability, and depth. You flow around obstacles and possess profound intuition.',
    };
    return descriptions[element.toLowerCase()] || 'A unique blend of energies shapes your path.';
  };

  return (
    <div className="text-center">
      {/* Element Icon Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={isRevealed ? { scale: 1, rotate: 0 } : {}}
        transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
        className="w-32 h-32 mx-auto mb-8"
      >
        <ElementIcon element={dayMaster.element} size="lg" />
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-jade-600 font-medium tracking-wider uppercase text-sm mb-2"
      >
        Your Day Master Element
      </motion.p>

      {/* Element Name */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="font-serif text-5xl md:text-6xl font-bold text-primary-950 mb-4"
      >
        {dayMaster.yinYang} {dayMaster.element}
      </motion.h2>

      {/* Stem Details */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-xl text-charcoal/60 mb-8"
      >
        Heavenly Stem: {dayMaster.stem} • Animal: {dayMaster.animal}
      </motion.p>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="crystal-card p-8 mb-8"
      >
        <p className="text-lg text-charcoal/80 leading-relaxed">
          {getElementDescription(dayMaster.element)}
        </p>
      </motion.div>

      {/* Element Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="grid grid-cols-5 gap-2 mb-8"
      >
        {Object.entries(elements).map(([element, score], index) => (
          <div key={element} className="text-center">
            <div className="relative h-24 bg-primary-50 rounded-lg overflow-hidden mb-2">
              <motion.div
                initial={{ height: 0 }}
                animate={isRevealed ? { height: `${score}%` } : {}}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className={`absolute bottom-0 left-0 right-0 rounded-lg ${
                  element === dayMaster.element.toLowerCase()
                    ? 'bg-gradient-to-t from-primary-500 to-primary-400'
                    : 'bg-primary-200'
                }`}
              />
            </div>
            <p className="text-xs font-medium text-charcoal/60 capitalize">{element}</p>
            <p className="text-sm font-semibold text-primary-950">{score}%</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
