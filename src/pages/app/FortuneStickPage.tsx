// ==========================================
// 抽签页 - 现代抽牌样式
// ==========================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sparkles, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import EpicFortuneDrawer, { type FortuneStick } from '../../components/EpicFortuneDrawer';
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
      question: question || (isEnglish ? 'My question' : '\u6211\u7684\u95ee\u9898'),
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
            aria-label={isEnglish ? 'Back' : '\u8fd4\u56de'}
            >
              <ChevronLeft size={22} />
            </Link>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl p-3 bg-white/10 border border-white/20 shadow-[0_0_20px_rgba(56,189,248,0.35)]">
                <Sparkles size={22} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-wide">{isEnglish ? 'Fortune Card' : '\u62bd\u7b7e'}</h2>
                <p className="text-white/80 text-sm">
                  {isEnglish
                    ? 'Ask a question, enter the deck, and draw'
                    : '\u8f93\u5165\u95ee\u9898\uff0c\u8fdb\u5165\u724c\u5e93\u62bd\u7b7e\u5427'}
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
              : '\u4ec5\u4f9b\u5a31\u4e50\u53c2\u8003\u3002\u7ed3\u679c\u4e3a\u968f\u673a\u751f\u6210\uff0c\u4e0d\u6784\u6210\u4efb\u4f55\u4eba\u751f\u5efa\u8bae\u3002'}
          </p>
        </div>

        {/* 问题输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-white/70 mb-2">
            {isEnglish ? 'Your question (optional)' : '\u60f3\u95ee\u7684\u4e8b\uff08\u9009\u586b\uff09'}
          </label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              isEnglish
                ? 'e.g. Career change? Relationship?'
                : '\u5982\uff1a\u6362\u5de5\u4f5c\u662f\u5426\u5408\u9002\uff1f\u611f\u60c5\u8d70\u5411\uff1f'
            }
            className="w-full px-4 py-3 rounded-2xl border border-white/20 bg-white/10 text-white placeholder-white/40 focus:ring-2 focus:ring-cyan-400 focus:border-transparent backdrop-blur"
          />
        </div>

        {/* 剩余次数 */}
        <div className="mb-6 text-center text-sm text-white/70">
          {isEnglish
            ? `Remaining draws today: ${remaining}`
            : `\u4eca\u65e5\u5269\u4f59\u62bd\u53d6\u6b21\u6570\uff1a${remaining}`}
        </div>

        {showDrawer ? (
          <EpicFortuneDrawer
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
            className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur"
          >
            <motion.div
              animate={{ 
                rotate: 360,
                transition: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
              className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-dashed border-cyan-400/30"
            />
            <p className="text-cyan-200/80 mb-2">
              {isEnglish ? "Quantum field recharging..." : '量子场充能中...'}
            </p>
            <p className="text-sm text-white/50">
              {isEnglish ? 'Return tomorrow to continue your journey.' : '明日继续你的命运之旅。'}
            </p>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
}



