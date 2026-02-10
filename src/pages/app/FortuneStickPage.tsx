// ==========================================
// 抽签页 - 现代抽牌样式
// ==========================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FortuneCardDrawer, { type FortuneStick } from '../../components/FortuneCardDrawer';
import {
  canDrawToday,
  getRemainingDrawsToday,
  recordDraw,
  saveToHistory,
  type FortuneStickRecord,
} from '../../utils/fortuneStickStorage';
import zhSticks from '../../locales/zh/fortune-sticks.json';
import enSticks from '../../locales/en/fortune-sticks.json';

export default function FortuneStickPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const sticks = useMemo(
    () => (isEnglish ? (enSticks as { sticks: FortuneStick[] }).sticks : (zhSticks as { sticks: FortuneStick[] }).sticks),
    [isEnglish]
  );
  const [question, setQuestion] = useState('');
  const [remaining, setRemaining] = useState(getRemainingDrawsToday());
  /** 最后一次抽签后保留结果展示，避免因 immediate unmount 导致闪退 */
  const [showingLastDrawResult, setShowingLastDrawResult] = useState(false);

  const handleDraw = (stick: FortuneStick) => {
    recordDraw();
    const newRemaining = getRemainingDrawsToday();
    setRemaining(newRemaining);
    if (newRemaining === 0) setShowingLastDrawResult(true);
    const record: FortuneStickRecord = {
      id: stick.id,
      question: question || (isEnglish ? 'My question' : '我的问题'),
      drawnAt: new Date().toISOString(),
      stick,
    };
    saveToHistory(record);
  };

  const handleReset = () => {
    const newRemaining = getRemainingDrawsToday();
    setRemaining(newRemaining);
    if (newRemaining === 0) setShowingLastDrawResult(false);
  };

  const canDraw = canDrawToday();
  const showDrawer = canDraw || showingLastDrawResult;

  return (
    <div className="fortune-stick-scene fortune-stick-font min-h-full text-white">
      <div className="fortune-scanline" />
      <div className="fortune-stick-content flex flex-col min-h-full">
        {/* 澶撮儴 */}
        <div className="flex-shrink-0 px-4 pt-4 lg:px-8 lg:pt-6">
          <div className="flex items-center gap-3 mb-5">
            <Link
              to="/app/today"
              className="p-2 rounded-full transition bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur"
              aria-label={isEnglish ? 'Back' : '杩斿洖'}
            >
              <ChevronLeft size={22} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl p-3 bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">{isEnglish ? 'Fortune Card' : '鎶界'}</h2>
                <p className="text-white/80 text-sm">
                  {isEnglish
                    ? 'Ask a question, enter the deck, and draw'
                    : '杈撳叆闂锛岃繘鍏ョ墝搴撴娊绛惧惂'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-10 lg:px-8">
        {/* 免责说明 */}
        <div className="mb-5 flex items-start gap-2 p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur">
          <Info size={18} className="text-cyan-200 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-white/80">
            {isEnglish
              ? 'For entertainment only. Results are randomly generated and not intended as life advice.'
              : '仅供娱乐参考。结果为随机生成，不构成任何人生建议。'}
          </p>
        </div>

        {/* 问题输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/70 mb-2">
            {isEnglish ? 'Your question (optional)' : '想问的事（选填）'}
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              isEnglish
                ? 'e.g. Career change? Relationship?'
                : '如：换工作是否合适？感情走向？'
            }
            className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur"
          />
        </div>

        {/* 剩余次数 */}
        <div className="mb-6 text-center text-sm text-white/70">
          {isEnglish
            ? `Remaining draws today: ${remaining}`
            : `今日剩余抽取次数：${remaining}`}
        </div>

        {showDrawer ? (
          <FortuneCardDrawer
            sticks={sticks}
            question={question}
            onDraw={handleDraw}
            onReset={handleReset}
            canDrawAgain={canDraw}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 px-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur"
          >
            <p className="text-white/80 mb-2">
              {isEnglish ? "You've used all draws for today." : '今日抽取次数已用完。'}
            </p>
            <p className="text-sm text-white/60">
              {isEnglish ? 'Come back tomorrow for more.' : '明天再来吧。'}
            </p>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}



