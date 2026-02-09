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
    <div className="flex flex-col min-h-full bg-[#F5F5F7] dark:bg-slate-900">
      {/* 头部 */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/app/today"
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label={isEnglish ? 'Back' : '返回'}
          >
            <ChevronLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{isEnglish ? 'Fortune Card' : '抽签'}</h2>
              <p className="text-white/90 text-sm">
                {isEnglish
                  ? 'Ask a question and draw a card'
                  : '输入问题，抽取一张牌'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {/* 免责说明 */}
        <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
          <Info size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            {isEnglish
              ? 'For entertainment only. Results are randomly generated and not intended as life advice.'
              : '仅供娱乐参考。结果为随机生成，不构成任何人生建议。'}
          </p>
        </div>

        {/* 问题输入 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* 剩余次数 */}
        <div className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
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
            className="text-center py-12 px-4 rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {isEnglish ? "You've used all draws for today." : '今日抽取次数已用完。'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {isEnglish ? 'Come back tomorrow for more.' : '明天再来吧。'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
