// ==========================================
// 抽牌交互组件 - 完整牌库随机25张 + 3D效果
// ==========================================

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Share2, Lightbulb, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface FortuneStick {
  id: number;
  level: string;
  poem: string;
  meaning: string;
  fortune: string;
  advice?: string;
  category?: string;
  detail?: string;
}

interface FortuneCardDrawerProps {
  sticks: FortuneStick[];
  question: string;
  onDraw: (stick: FortuneStick) => void;
  onReset?: () => void;
}

const CARD_COUNT = 25;

/** 从完整牌库中随机抽取 N 张（无重复） */
function pickRandomCards(deck: FortuneStick[], count: number): FortuneStick[] {
  if (deck.length <= count) return [...deck];
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
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
  const [deckKey, setDeckKey] = useState(0);

  /** 每次进入抽牌时，从完整牌库随机抽取25张 */
  const currentDeck = useMemo(() => pickRandomCards(sticks, CARD_COUNT), [sticks, deckKey]);

  const handleDraw = useCallback(
    (clickedCardIndex: number) => {
      if (currentDeck.length === 0 || phase !== 'idle') return;
      const stick = currentDeck[clickedCardIndex];
      if (!stick) return;
      setPhase('shuffling');
      setTimeout(() => {
        setFlippedIndex(clickedCardIndex);
        setDrawnStick(stick);
        setPhase('flipping');
        setTimeout(() => {
          setPhase('result');
          onDraw(stick);
        }, 700);
      }, 600);
    },
    [currentDeck, phase, onDraw]
  );

  const handleReset = useCallback(() => {
    setDeckKey((k) => k + 1);
    setPhase('idle');
    setDrawnStick(null);
    setFlippedIndex(null);
    onReset?.();
  }, [onReset]);

  /** 五级运势配色：上上/上中/中中/中下/下下 */
  const getFortuneColor = (level: string) => {
    if (level === '上上' || level === 'Excellent') return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700';
    if (level === '上中' || level === 'Good') return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
    if (level === '中下' || level === 'Fair') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    if (level === '下下' || level === 'Unfavorable') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 25张牌组 - 5x5 网格 */}
      <div
        className="relative grid grid-cols-5 gap-1.5 sm:gap-2 mb-8 w-full max-w-sm mx-auto"
        style={{ perspective: 1200 }}
      >
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="relative w-12 h-16 sm:w-14 sm:h-20 cursor-pointer"
            style={{ perspective: 1200 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.02 },
            }}
            onClick={phase === 'idle' ? () => handleDraw(i) : undefined}
          >
            <motion.div
              className={`absolute inset-0 rounded-md overflow-hidden origin-center ${phase === 'result' && flippedIndex === i ? 'shadow-2xl shadow-indigo-500/40 ring-2 ring-white/50 ring-offset-2 ring-offset-indigo-100 dark:ring-offset-slate-800' : ''}`}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
              animate={
                phase === 'flipping' && flippedIndex === i
                  ? {
                      rotateY: 180,
                      scale: 1.5,
                      y: -28,
                    }
                  : phase === 'result' && flippedIndex === i
                    ? {
                        rotateY: 180,
                        scale: 1.4,
                        y: -24,
                      }
                    : phase === 'result' && flippedIndex !== i
                      ? { opacity: 0.25, scale: 0.9 }
                      : {}
              }
              transition={{
                duration: 0.55,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* 牌背 */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-md border border-indigo-400/40 flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Sparkles size={14} className="text-white/80 sm:w-4 sm:h-4" />
              </div>
              {/* 牌面（翻转后） */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 rounded-md border-2 border-indigo-200 dark:border-indigo-700 flex items-center justify-center p-1"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  #{drawnStick?.id ?? '?'}
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
          {isEnglish ? 'Tap any card to draw' : '点击任一张牌抽取'}
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

      {/* 结果展示 - 丰富内容 */}
      <AnimatePresence>
        {phase === 'result' && drawnStick && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-slate-600 shadow-2xl shadow-indigo-500/15 overflow-hidden">
              {/* 3D 卡片突出效果 - 顶部光晕 */}
              <div className="h-1 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent" />
              <div className="p-6 space-y-4">
                {/* 签号与吉凶 */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${getFortuneColor(drawnStick.level)}`}
                  >
                    {drawnStick.level} · {drawnStick.fortune}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    #{drawnStick.id}
                  </span>
                </div>

                {/* 签诗 */}
                <p className="text-lg font-medium text-gray-900 dark:text-white leading-relaxed">
                  {drawnStick.poem}
                </p>

                {/* 简要解读 */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {drawnStick.meaning}
                </p>

                {/* 详细解读（如有） */}
                {drawnStick.detail && (
                  <div className="pt-2 border-t border-gray-100 dark:border-slate-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {drawnStick.detail}
                    </p>
                  </div>
                )}

                {/* 具体建议（如有） */}
                {drawnStick.advice && (
                  <div className="flex gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                    <Lightbulb size={18} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 mb-0.5">
                        {isEnglish ? 'Suggested actions' : '具体建议'}
                      </p>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200">
                        {drawnStick.advice}
                      </p>
                    </div>
                  </div>
                )}

                {/* 适用场景（如有） */}
                {drawnStick.category && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Tag size={14} />
                    <span>
                      {isEnglish ? 'Applies to' : '适用场景'}: {drawnStick.category}
                    </span>
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="p-4 pt-0 flex gap-2">
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
                    const text = [
                      drawnStick.poem,
                      drawnStick.meaning,
                      drawnStick.advice && `\n${isEnglish ? 'Advice' : '建议'}: ${drawnStick.advice}`,
                    ]
                      .filter(Boolean)
                      .join('\n');
                    if (navigator.share) {
                      navigator.share({
                        title: isEnglish ? 'Fortune Card' : '抽签结果',
                        text,
                      });
                    } else {
                      navigator.clipboard?.writeText(text);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-400 font-medium text-sm"
                >
                  <Share2 size={16} />
                  {isEnglish ? 'Share' : '分享'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
