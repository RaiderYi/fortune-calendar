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
  canDrawAgain?: boolean;
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
  canDrawAgain = true,
}: FortuneCardDrawerProps) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const [phase, setPhase] = useState<'idle' | 'shuffling' | 'flipping' | 'result'>('idle');
  const [drawnStick, setDrawnStick] = useState<FortuneStick | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [deckKey, setDeckKey] = useState(0);

  /** 每次进入抽牌时，从完整牌库随机抽取25张 */
  const currentDeck = useMemo(() => pickRandomCards(sticks, CARD_COUNT), [sticks, deckKey]);
  const cardOffsets = useMemo(
    () =>
      Array.from({ length: CARD_COUNT }).map((_, i) => {
        const seed = (i * 37 + deckKey * 13) % 360;
        return {
          tilt: (seed % 7) - 3,
          drift: (seed % 5) - 2,
        };
      }),
    [deckKey]
  );

  const handleDraw = useCallback(
    (clickedCardIndex: number) => {
      if (!canDrawAgain || currentDeck.length === 0 || phase !== 'idle') return;
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
    [canDrawAgain, currentDeck, phase, onDraw]
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
    if (level === '中中' || level === 'Neutral') return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    if (level === '中下' || level === 'Fair') return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    if (level === '下下' || level === 'Unfavorable') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
    return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 25张牌组 - 5x5 网格 */}
      <div
        className={`relative grid grid-cols-5 gap-2 sm:gap-2.5 mb-8 w-full max-w-sm mx-auto ${phase === 'shuffling' ? 'animate-pulse' : ''}`}
        style={{ perspective: 1400 }}
      >
        {Array.from({ length: CARD_COUNT }).map((_, i) => (
          <motion.div
            key={i}
            className="relative w-12 h-16 sm:w-14 sm:h-20 cursor-pointer fortune-card-shell rounded-md border border-white/15 bg-white/5"
            style={{ perspective: 1400 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: i * 0.02 },
            }}
            onClick={phase === 'idle' ? () => handleDraw(i) : undefined}
            whileHover={phase === 'idle' ? { rotateX: -6, rotateY: 8, scale: 1.05 } : undefined}
          >
            <motion.div
              className={`absolute inset-0 rounded-md overflow-hidden origin-center fortune-card-3d ${phase === 'result' && flippedIndex === i ? 'shadow-2xl shadow-cyan-400/50 ring-2 ring-white/60 ring-offset-2 ring-offset-slate-900' : ''}`}
              style={{
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
              animate={
                phase === 'flipping' && flippedIndex === i
                  ? {
                      rotateY: 180,
                      scale: 1.6,
                      y: -30,
                    }
                  : phase === 'result' && flippedIndex === i
                    ? {
                        rotateY: 180,
                        scale: 1.5,
                        y: -26,
                      }
                    : phase === 'result' && flippedIndex !== i
                      ? { opacity: 0.25, scale: 0.9 }
                      : {
                          rotateZ: cardOffsets[i]?.tilt ?? 0,
                          y: cardOffsets[i]?.drift ?? 0,
                        }
              }
              transition={{
                duration: 0.55,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* 牌背 */}
              <div
                className="absolute inset-0 fortune-card-face fortune-card-back flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/30 flex items-center justify-center shadow-[0_0_18px_rgba(56,189,248,0.45)]">
                  <Sparkles size={14} className="text-white/90 sm:w-4 sm:h-4" />
                </div>
              </div>
              {/* 牌面（翻转后） */}
              <div
                className="absolute inset-0 fortune-card-face fortune-card-front flex items-center justify-center p-1"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <span className="text-xs font-bold text-indigo-700">
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
          className="text-sm text-white/70 mb-4"
        >
          {isEnglish ? 'Tap any card to draw' : '点击任一张牌抽取'}
        </motion.p>
      )}

      {phase === 'shuffling' && (
        <motion.div
          animate={{ opacity: [0.5, 1], scale: [0.98, 1] }}
          transition={{ repeat: Infinity, duration: 0.4 }}
          className="text-cyan-200 text-sm"
        >
          {isEnglish ? 'Drawing...' : '抽牌中...'}
        </motion.div>
      )}

      {/* 结果展示 - 丰富内容 */}
      <AnimatePresence>
        {phase === 'result' && drawnStick && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative z-10 w-full max-w-md"
            >
              <div className="fortune-result-glow rounded-2xl bg-slate-900/80 border border-cyan-300/20 shadow-2xl shadow-cyan-500/30 overflow-hidden text-white backdrop-blur">
                {/* 3D 鍗＄墖绐佸嚭鏁堟灉 - 椤堕儴鍏夋檿 */}
                <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                <div className="p-6 space-y-4">
                  {/* 绛惧彿涓庡悏鍑?*/}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold border ${getFortuneColor(drawnStick.level)}`}
                    >
                      {drawnStick.level} 路 {drawnStick.fortune}
                    </span>
                    <span className="text-xs text-white/60 font-mono">
                      #{drawnStick.id}
                    </span>
                  </div>

                  {/* 绛捐瘲 */}
                  <p className="text-lg font-medium text-white leading-relaxed">
                    {drawnStick.poem}
                  </p>

                  {/* 绠€瑕佽В璇?*/}
                  <p className="text-sm text-white/70">
                    {drawnStick.meaning}
                  </p>

                  {/* 璇︾粏瑙ｈ锛堝鏈夛級 */}
                  {drawnStick.detail && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-sm text-white/70 leading-relaxed">
                        {drawnStick.detail}
                      </p>
                    </div>
                  )}

                  {/* 鍏蜂綋寤鸿锛堝鏈夛） */}
                  {drawnStick.advice && (
                    <div className="flex gap-2 p-3 rounded-xl bg-white/10 border border-white/15">
                      <Lightbulb size={18} className="text-cyan-300 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-cyan-200 mb-0.5">
                          {isEnglish ? 'Suggested actions' : '具体建议'}
                        </p>
                        <p className="text-sm text-white/80">
                          {drawnStick.advice}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 閫傜敤鍦烘櫙锛堝鏈夛） */}
                  {drawnStick.category && (
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Tag size={14} />
                      <span>
                        {isEnglish ? 'Applies to' : '适用场景'}: {drawnStick.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* 鎿嶄綔鎸夐挳 */}
                <div className="p-4 pt-0 flex gap-2">
                  <motion.button
                    onClick={handleReset}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm border ${
                      canDrawAgain
                        ? 'bg-cyan-500/15 text-cyan-200 border-cyan-400/30 cursor-pointer'
                        : 'bg-white/5 text-white/40 border-white/10 cursor-pointer'
                    }`}
                  >
                    <RotateCcw size={16} />
                    {canDrawAgain
                      ? (isEnglish ? 'Draw Again' : '再抽一次')
                      : (isEnglish ? 'Back' : '返回')}
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
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-white/70 font-medium text-sm"
                  >
                    <Share2 size={16} />
                    {isEnglish ? 'Share' : '分享'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

