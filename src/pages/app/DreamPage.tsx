// ==========================================
// 周公解梦 · AI
// ==========================================

import { useState } from 'react';
import { Moon, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chatWithAI } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import { trySpendCredits, addCredits } from '../../utils/creditsStorage';
import { AppSubPageShell } from '../../components/layout/AppSubPageShell';
import {
  appDarkTextareaClass,
  appDarkSecondaryButtonClass,
  appDarkResultCardClass,
} from '../../constants/appUiClasses';

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
    <AppSubPageShell
      variant="dark"
      darkTone="slate"
      title={isEnglish ? 'Dream insight' : '周公解梦'}
      icon={Moon}
      iconClassName="text-indigo-300"
      contentClassName="space-y-4"
    >
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
        className={appDarkTextareaClass}
      />
      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className={appDarkSecondaryButtonClass}
      >
        {loading ? <Loader2 className="animate-spin" /> : null}
        {isEnglish ? 'Interpret' : 'AI 解读'}
      </button>
      {reply ? (
        <div className={`${appDarkResultCardClass} border-indigo-500/30 bg-indigo-950/60 whitespace-pre-wrap`}>
          {reply}
        </div>
      ) : null}
    </AppSubPageShell>
  );
}
