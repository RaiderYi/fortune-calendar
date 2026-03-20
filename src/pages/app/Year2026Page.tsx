// ==========================================
// 2026 丙午流年主题页
// ==========================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Sparkles, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchFortuneYear } from '../../services/api';
import { getCustomYongShen } from '../../utils/yongShenStorage';

export default function Year2026Page() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const raw = localStorage.getItem('user_profile');
        if (!raw) return;
        const p = JSON.parse(raw) as Record<string, string>;
        if (!p.birthDate) return;
        const customYongShen = getCustomYongShen(p.birthDate, p.birthTime || '12:00');
        setLoading(true);
        const res = await fetchFortuneYear({
          year: 2026,
          birthDate: p.birthDate,
          birthTime: p.birthTime || '12:00',
          longitude: String(p.longitude ?? '116.40'),
          gender: p.gender || 'male',
          customYongShen,
        });
        if (res.success && res.data) setScore(res.data.totalScore);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="min-h-full bg-gradient-to-b from-red-950 via-slate-950 to-slate-950 text-white pb-24">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Link to="/app/fortune/today">
          <ChevronLeft size={22} />
        </Link>
        <Sparkles className="text-amber-400" size={22} />
        <h1 className="font-bold">2026 {isEnglish ? 'Bingwu Year' : '丙午年'}</h1>
      </div>
      <div className="p-6 max-w-lg mx-auto space-y-6">
        <p className="text-white/80 leading-relaxed text-sm">
          {isEnglish
            ? '2026 is a fiery horse year in the sexagenary cycle. Use your personal annual score as a soft reference alongside daily habits and planning.'
            : '2026 为丙午火马之年。下方为结合您八字档案的流年综合分（软参考），重大决策请结合现实与专业意见。'}
        </p>
        <div className="rounded-2xl bg-white/10 border border-amber-500/30 p-6 text-center">
          {loading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : score != null ? (
            <>
              <div className="text-sm text-white/60 mb-2">
                {isEnglish ? 'Your 2026 index' : '您的 2026 流年指数'}
              </div>
              <div className="text-5xl font-black text-amber-400">{score}</div>
            </>
          ) : (
            <p className="text-white/60 text-sm">
              {isEnglish ? 'Set profile on Today page first.' : '请先在「今日运势」中完善个人档案。'}
            </p>
          )}
        </div>
        <ul className="text-sm text-white/70 space-y-2 list-disc pl-5">
          {(isEnglish
            ? [
                'Fire energy highlights visibility and pace—avoid burnout.',
                'Good window for learning and creative projects.',
                'Review investments; avoid FOMO decisions.',
              ]
            : [
                '火气偏旺，宜注意节奏与作息，避免急躁决策。',
                '利于学习、表达与创意类事务的推进。',
                '财务上宜稳健，忌跟风投机。',
              ]
          ).map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <Link
          to="/app/fortune/monthly"
          className="block text-center py-3 rounded-xl bg-amber-600 text-slate-900 font-bold"
        >
          {isEnglish ? 'View monthly heatmap' : '查看每月运势热力'}
        </Link>
      </div>
    </div>
  );
}
