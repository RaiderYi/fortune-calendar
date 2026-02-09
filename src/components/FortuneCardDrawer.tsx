// ==========================================
// 抽牌交互组件 - 现代抽牌样式
// ==========================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface FortuneStick {
  id: number;
  level: string;
  poem: string;
  meaning: string;
  fortune: string;
}

interface FortuneCardDrawerProps {
  sticks: FortuneStick[];
  question: string;
  onDraw: (stick: FortuneStick) => void;
  onReset?: () => void;
}

const CARD_COUNT = 5; // 展示的牌数量

function getRandomIndex(max: number): number {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export default function FortuneCardDrawer({
  sticks,
  question,
  onDraw,
  onReset,
}: FortuneCardDrawerProps) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const [phase, setPhase] = useState<'idle' | 'shuffling' | 'flipping' | 'result'>('idle');
  const [drawnStick, setDrawnStick] = useState<FortuneStick | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleDraw = useCallback(() => {
    if (sticks.length === 0 || phase !== 'idle') return;
    setPhase('shuffling');
    // 模拟洗牌效果
    setTimeout(() => {
      const idx = getRandomIndex(sticks.length);
      const stick = sticks[idx];
      const pickCard = Math.floor(Math.random() * CARD_COUNT);
      setFlippedIndex(pickCard);
      setDrawnStick(stick);
      setPhase('flipping');
      setTimeout(() => {
        setPhase('result');
        onDraw(stick);
      }, 600);
    }, 800);
  }, [sticks, phase, onDraw]);

  const handleReset = useCallback(() => {
    setPhase('idle');
    setDrawnStick(null);
    setFlippedIndex(null);
    onReset?.();
  }, [onReset]);

  return (
    <div className="flex flex-col items-center">
      {/* 牌组 */}
      <div className="relative flex justify-center gap-1 mb-8" style={{ perspective: 1000 }}>
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="relative w-14 h-20 sm:w-16 sm:h-24 cursor-pointer"
            style={{ perspective: 1000 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.05 },
            }}
            onClick={phase === 'idle' ? handleDraw : undefined}
          >
            <motion.div
              className="absolute inset-0 rounded-lg shadow-lg overflow-hidden"
              style={{ transformStyle: 'preserve-3d' }}
              animate={
                phase === 'flipping' && flippedIndex === i
                  ? { rotateY: 180 }
                  : phase === 'result' && flippedIndex === i
                    ? { rotateY: 180 }
                    : {}
              }
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {/* 牌背 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-lg border-2 border-indigo-400/30 flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Sparkles size={20} className="text-white/80" />
              </div>
              {/* 牌面（翻转后） */}
              <div
                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg border-2 border-indigo-200 dark:border-slate-600 flex items-center justify-center p-2"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate">
                  {drawnStick?.id ?? '?'}
                </span>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {phase === 'idle' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 dark:text-gray-400 mb-4"
        >
          {isEnglish ? 'Tap a card to draw' : '点击任一张牌抽取'}
        </motion.p>
      )}

      {phase === 'shuffling' && (
        <motion.div
          animate={{ opacity: [0.5, 1], scale: [0.98, 1] }}
          transition={{ repeat: Infinity, duration: 0.4 }}
          className="text-indigo-600 dark:text-indigo-400 text-sm"
        >
          {isEnglish ? 'Drawing...' : '抽牌中...'}
        </motion.div>
      )}

      {/* 结果展示 */}
      <AnimatePresence>
        {phase === 'result' && drawnStick && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-slate-600 shadow-xl shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold ${
                  drawnStick.fortune === '大吉' || drawnStick.fortune === 'Very Lucky'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : drawnStick.fortune === '凶' || drawnStick.fortune === 'Unlucky'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400'
                }`}
              >
                {drawnStick.level} · {drawnStick.fortune}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                #{drawnStick.id}
              </span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2 leading-relaxed">
              {drawnStick.poem}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {drawnStick.meaning}
            </p>
            <div className="flex gap-2">
              <motion.button
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium text-sm"
              >
                <RotateCcw size={16} />
                {isEnglish ? 'Draw Again' : '再抽一次'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: isEnglish ? 'Fortune Card' : '抽签结果',
                      text: `${drawnStick.poem}\n${drawnStick.meaning}`,
                    });
                  } else {
                    navigator.clipboard?.writeText(`${drawnStick.poem}\n${drawnStick.meaning}`);
                  }
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 font-medium text-sm"
              >
                <Share2 size={16} />
                {isEnglish ? 'Share' : '分享'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
