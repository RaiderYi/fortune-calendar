// ==========================================
// 塔罗三张牌 · AI
// ==========================================

import { useState, useMemo } from 'react';
import { LayoutGrid, Loader2, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TAROT_MAJOR } from '../../data/tarotMajor';
import { chatWithAI } from '../../services/api';
import type { TarotContext } from '../../types';
import { useToast } from '../../contexts/ToastContext';
import { trySpendCredits, addCredits } from '../../utils/creditsStorage';
import { AppSubPageShell } from '../../components/layout/AppSubPageShell';
import { appDarkPurpleButtonClass, appDarkResultCardClass } from '../../constants/appUiClasses';

function drawSpread(seed: number) {
  const rng = (function simple(s: number) {
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  })(seed);
  const idx: number[] = [];
  while (idx.length < 3) {
    const n = Math.floor(rng() * TAROT_MAJOR.length);
    if (!idx.includes(n)) idx.push(n);
  }
  const positions = ['过去', '现在', '未来'];
  const posEn = ['Past', 'Present', 'Future'];
  return idx.map((i, j) => ({
    name: TAROT_MAJOR[i].zh,
    nameEn: TAROT_MAJOR[i].en,
    reversed: rng() > 0.5,
    position: positions[j],
    positionEn: posEn[j],
  }));
}

export default function TarotPage() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const { showToast } = useToast();
  const [seed, setSeed] = useState(() => Date.now() % 1000000);
  const cards = useMemo(() => drawSpread(seed), [seed]);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');

  const ctx: TarotContext = {
    spread: isEnglish ? 'Three-card (past / present / future)' : '三张牌（过去 / 现在 / 未来）',
    cards: cards.map((c) => ({
      name: c.name,
      nameEn: c.nameEn,
      reversed: c.reversed,
      position: isEnglish ? c.positionEn : c.position,
    })),
  };

  const interpret = async () => {
    if (!trySpendCredits(1, 'tarot_ai')) {
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
            content: isEnglish ? 'Please read this spread for me.' : '请为我解读这组牌阵。',
          },
        ],
        { tarotContext: ctx }
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
        addCredits(1, 'tarot_ai_refund');
      }
      setLoading(false);
    }
  };

  return (
    <AppSubPageShell
      variant="dark"
      darkTone="purple"
      title={isEnglish ? 'Tarot' : '塔罗占卜'}
      icon={LayoutGrid}
      iconClassName="text-purple-300"
      contentClassName="space-y-6"
    >
      <p className="text-sm text-white/60">
        {isEnglish ? 'Major Arcana only. For reflection, not fortune-telling.' : '仅大阿尔卡那，供自省与娱乐。'}
      </p>
      <button
        type="button"
        onClick={() => {
          setSeed(Date.now() % 1000000);
          setReply('');
        }}
        className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-purple-300 transition hover:bg-white/10"
      >
        <RefreshCw size={16} />
        {isEnglish ? 'Redraw' : '重新抽牌'}
      </button>
      <div className="grid grid-cols-3 gap-2">
        {cards.map((c) => (
          <div
            key={c.position}
            className="flex min-h-[120px] flex-col justify-center rounded-xl border border-white/15 bg-white/10 p-3 text-center"
          >
            <div className="mb-1 text-[10px] text-white/50">{isEnglish ? c.positionEn : c.position}</div>
            <div className="text-sm font-bold">{isEnglish ? c.nameEn : c.name}</div>
            <div className="mt-1 text-xs text-amber-300">
              {c.reversed ? (isEnglish ? 'Reversed' : '逆位') : isEnglish ? 'Upright' : '正位'}
            </div>
          </div>
        ))}
      </div>
      <button type="button" disabled={loading} onClick={interpret} className={appDarkPurpleButtonClass}>
        {loading ? <Loader2 className="animate-spin" /> : null}
        {isEnglish ? 'AI reading' : 'AI 解读'}
      </button>
      {reply ? (
        <div className={`${appDarkResultCardClass} border-purple-500/30 bg-purple-950/50 whitespace-pre-wrap`}>
          {reply}
        </div>
      ) : null}
    </AppSubPageShell>
  );
}
