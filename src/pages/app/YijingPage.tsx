// ==========================================
// 易经问卦 MVP：起卦 + AI 解读
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Flame, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { postYijingDivination, chatWithAI, type YijingDivinationData } from '../../services/api';
import type { YijingContext } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { trySpendCredits, addCredits } from '../../utils/creditsStorage';

const CATEGORIES = [
  { id: 'career', zh: '事业', en: 'Career' },
  { id: 'love', zh: '感情', en: 'Love' },
  { id: 'wealth', zh: '财运', en: 'Wealth' },
  { id: 'general', zh: '综合', en: 'General' },
];

export default function YijingPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const { showToast } = useToast();
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState<YijingDivinationData | null>(null);
  const [aiText, setAiText] = useState('');

  const handleCast = async () => {
    setLoading(true);
    setAiText('');
    try {
      const seed = Date.now() % 2147483647;
      const res = await postYijingDivination({
        question: question.trim(),
        category,
        seed,
      });
      if (res.success && res.data) {
        setResult(res.data);
        showToast(isEnglish ? 'Hexagram ready' : '起卦完成', 'success');
      } else {
        showToast(res.error || (isEnglish ? 'Failed' : '失败'), 'error');
        setResult(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAi = async () => {
    if (!result) return;
    if (!trySpendCredits(1, 'yijing_ai')) {
      showToast(isEnglish ? 'Not enough credits' : '积分不足', 'warning');
      return;
    }
    let needRefund = true;
    setAiLoading(true);
    try {
      const ctx: YijingContext = {
        question: result.question,
        benGua: result.benGua,
        bianGua: result.bianGua,
        movingLines: result.movingLines,
        lines: result.lines,
        seed: result.seed,
        category: result.category,
      };
      const res = await chatWithAI(
        [
          {
            role: 'user',
            content: isEnglish
              ? 'Please interpret this reading for my question.'
              : '请结合我的占问与卦象，给出完整解读与建议。',
          },
        ],
        { yijingContext: ctx }
      );
      if (res.success && res.message) {
        needRefund = false;
        setAiText(res.message);
      } else {
        showToast(res.error || (isEnglish ? 'AI failed' : 'AI 失败'), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(isEnglish ? 'Network error' : '网络异常', 'error');
    } finally {
      if (needRefund) {
        addCredits(1, 'yijing_ai_refund');
      }
      setAiLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-amber-950 via-slate-950 to-slate-950 text-white pb-24">
      <div className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <Link to="/app/fortune/today" className="p-2 hover:bg-white/10 rounded-lg">
          <ChevronLeft size={22} />
        </Link>
        <Flame className="text-amber-400" size={22} />
        <h1 className="text-lg font-bold">{isEnglish ? 'I Ching' : '易经问卦'}</h1>
      </div>

      <div className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-4 space-y-2 text-sm text-amber-100/80">
          <p className="font-medium text-amber-200">
            {isEnglish ? 'How to ask' : '如何提问'}
          </p>
          <ul className="list-disc pl-4 space-y-1">
            {(isEnglish
              ? [
                  'Be specific (timeframe + situation).',
                  'One matter per reading; avoid repeated casts.',
                  'For entertainment & reflection only.',
                ]
              : ['尽量具体（时间范围 + 情境）。', '一事一卜，同一件事勿反复起卦。', '结果仅供娱乐与自省参考。']
            ).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">
            {isEnglish ? 'Category' : '问题类型'}
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  category === c.id
                    ? 'bg-amber-500 text-slate-900'
                    : 'bg-white/10 text-white/80 hover:bg-white/15'
                }`}
              >
                {isEnglish ? c.en : c.zh}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">
            {isEnglish ? 'Your question' : '占问内容'}
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            placeholder={
              isEnglish
                ? 'e.g. Should I change jobs in the next three months?'
                : '例如：未来三个月内是否适合换工作？'
            }
            className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/35 focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"
          />
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleCast}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-900 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
          {isEnglish ? 'Cast hexagram' : '起卦'}
        </button>

        {result && (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <div className="text-sm text-white/50">{isEnglish ? 'Question' : '占问'}</div>
              <p className="text-white">{result.question}</p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <div className="text-xs text-white/50">{isEnglish ? 'Primary' : '本卦'}</div>
                  <div className="text-xl font-bold text-amber-300">{result.benGua}</div>
                </div>
                <div>
                  <div className="text-xs text-white/50">{isEnglish ? 'Changed' : '变卦'}</div>
                  <div className="text-xl font-bold text-amber-300">{result.bianGua}</div>
                </div>
              </div>
              <div className="text-xs text-white/50">
                {isEnglish ? 'Moving lines' : '动爻'}：
                {result.movingLines.length ? result.movingLines.join('、') : isEnglish ? 'None' : '无'}
              </div>
              <ul className="text-sm space-y-1 border-t border-white/10 pt-3">
                {result.lines.map((l) => (
                  <li key={l.position} className="flex justify-between text-white/85">
                    <span>
                      {isEnglish ? `Line ${l.position}` : `第${l.position}爻`}
                    </span>
                    <span>{l.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              disabled={aiLoading}
              onClick={handleAi}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? <Loader2 className="animate-spin" size={20} /> : null}
              {isEnglish ? 'AI interpretation' : 'AI 深度解读'}
            </button>

            {aiText && (
              <div className="bg-indigo-950/50 border border-indigo-500/30 rounded-2xl p-4 text-sm leading-relaxed text-indigo-100 whitespace-pre-wrap">
                {aiText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
