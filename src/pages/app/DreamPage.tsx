// ==========================================
// 周公解梦 · AI
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Moon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chatWithAI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { trySpendCredits, addCredits } from '../../utils/creditsStorage';

export default function DreamPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');

  const submit = async () => {
    if (text.trim().length < 8) {
      showToast(isEnglish ? 'Describe more detail' : '请多写一点梦境细节', 'warning');
      return;
    }
    if (!trySpendCredits(1, 'dream_ai')) {
      showToast(isEnglish ? 'Not enough credits' : '积分不足', 'warning');
      return;
    }
    let needRefund = true;
    setLoading(true);
    setReply('');
    try {
      const res = await chatWithAI(
        [
          {
            role: 'user',
            content: isEnglish ? 'Interpret my dream.' : '请解读我的梦境。',
          },
        ],
        { dreamContext: { dreamText: text.trim() } }
      );
      if (res.success && res.message) {
        needRefund = false;
        setReply(res.message);
      } else {
        showToast(res.error || (isEnglish ? 'Error' : '解读失败'), 'error');
      }
    } catch (e) {
      console.error(e);
      showToast(isEnglish ? 'Network error' : '网络异常', 'error');
    } finally {
      if (needRefund) {
        addCredits(1, 'dream_ai_refund');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-950 text-white pb-24">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Link to="/app/fortune/today">
          <ChevronLeft size={22} />
        </Link>
        <Moon className="text-indigo-300" size={22} />
        <h1 className="font-bold">{isEnglish ? 'Dream insight' : '周公解梦'}</h1>
      </div>
      <div className="p-4 max-w-lg mx-auto space-y-4">
        <p className="text-sm text-white/60">
          {isEnglish
            ? 'Psychological & cultural symbols only. Not medical advice.'
            : '侧重心理与象征，非医疗建议，仅供娱乐与自省。'}
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={isEnglish ? 'What did you dream?' : '请描述梦境…'}
          className="w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/35"
        />
        <button
          type="button"
          disabled={loading}
          onClick={submit}
          className="w-full py-3 rounded-xl bg-indigo-600 font-bold flex justify-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" /> : null}
          {isEnglish ? 'Interpret' : 'AI 解读'}
        </button>
        {reply && (
          <div className="rounded-xl bg-indigo-950/60 border border-indigo-500/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {reply}
          </div>
        )}
      </div>
    </div>
  );
}
