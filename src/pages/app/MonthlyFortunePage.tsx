// ==========================================
// 每月运势 - 月历热力 + 流月解读
// ==========================================

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarRange, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchFortuneMonth, type FortuneMonthData } from '../../services/api';
import { getCustomYongShen } from '../../utils/yongShenStorage';
import { useAppContext } from '../../contexts/AppContext';
import { useToast } from '../../contexts/ToastContext';

interface UserProfile {
  birthDate: string;
  birthTime: string;
  longitude: string;
  gender: string;
}

function loadProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem('user_profile');
    if (!raw) return null;
    const p = JSON.parse(raw) as UserProfile;
    if (!p.birthDate) return null;
    return {
      birthDate: p.birthDate,
      birthTime: p.birthTime || '12:00',
      longitude: String(p.longitude ?? '116.40'),
      gender: p.gender || 'male',
    };
  } catch {
    return null;
  }
}

function scoreHue(score: number): string {
  if (score >= 75) return 'bg-emerald-500/90 text-white';
  if (score >= 60) return 'bg-amber-400/90 text-amber-950';
  if (score >= 45) return 'bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white';
  return 'bg-rose-400/90 text-white';
}

export default function MonthlyFortunePage() {
  const { t, i18n } = useTranslation(['common', 'ui']);
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { setCurrentDate } = useAppContext();
  const { showToast } = useToast();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FortuneMonthData | null>(null);

  const load = useCallback(async () => {
    const profile = loadProfile();
    if (!profile) {
      showToast(isEnglish ? 'Please set your profile first' : '请先完善个人档案', 'warning');
      return;
    }
    const customYongShen = getCustomYongShen(profile.birthDate, profile.birthTime);
    setLoading(true);
    try {
      const res = await fetchFortuneMonth({
        year,
        month,
        birthDate: profile.birthDate,
        birthTime: profile.birthTime,
        longitude: profile.longitude,
        gender: profile.gender,
        customYongShen,
      });
      if (res.success && res.data) {
        setData(res.data);
      } else {
        showToast(res.error || (isEnglish ? 'Load failed' : '加载失败'), 'error');
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  }, [year, month, isEnglish, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const blanks = Array.from({ length: firstWeekday }, (_, i) => i);
  const days = Array.from({ length: lastDate }, (_, i) => i + 1);

  const scoreMap = new Map<string, number>();
  data?.dailyScores.forEach((d) => scoreMap.set(d.date, d.score));

  const handleDayClick = (d: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const [y, m, day] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, day, 12, 0, 0));
    navigate('/app/fortune/today');
  };

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#F5F5F7] dark:bg-slate-900">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 lg:p-6 rounded-b-2xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/app/fortune/today"
            className="flex items-center gap-2 text-white/90 hover:text-white"
          >
            <ChevronLeft size={24} />
          </Link>
          <CalendarRange size={24} />
          <h1 className="text-xl font-bold">
            {isEnglish ? 'Monthly Fortune' : '每月运势'}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm font-medium"
          >
            {Array.from({ length: 11 }, (_, i) => now.getFullYear() - 5 + i).map((y) => (
              <option key={y} value={y} className="text-slate-900">
                {y}
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 text-sm font-medium"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m} className="text-slate-900">
                {m} {isEnglish ? '' : '月'}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="ml-auto px-4 py-2 bg-white text-indigo-600 rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin inline w-4 h-4" /> : t('common:buttons.refresh')}
          </button>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {loading && !data ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {isEnglish ? 'Month score' : '流月综合'}
                </div>
                <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                  {data.fortune.totalScore}
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500">{isEnglish ? 'Daily avg' : '日均分'}</div>
                <div className="text-3xl font-black text-violet-600">{data.summary.avgScore}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500">{isEnglish ? 'Best day' : '最佳日'}</div>
                <div className="text-lg font-bold text-emerald-600">{data.summary.bestDay.slice(5)}</div>
                <div className="text-sm text-gray-500">{data.summary.bestScore}</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="text-xs text-gray-500">{isEnglish ? 'Low day' : '注意日'}</div>
                <div className="text-lg font-bold text-rose-600">{data.summary.worstDay.slice(5)}</div>
                <div className="text-sm text-gray-500">{data.summary.worstScore}</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="text-amber-500" size={20} />
                <span className="font-bold text-gray-900 dark:text-white">
                  {data.fortune.mainTheme.emoji} {data.fortune.mainTheme.keyword}
                </span>
                <span className="text-sm text-gray-500">{data.fortune.mainTheme.subKeyword}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {data.fortune.mainTheme.description}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                {isEnglish ? 'Calendar heatmap' : '月历热力'}
              </h3>
              <p className="text-xs text-gray-500 mb-3">
                {isEnglish ? 'Tap a day to open daily fortune' : '点击日期查看当日详细运势'}
              </p>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                {(isEnglish
                  ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                  : ['日', '一', '二', '三', '四', '五', '六']
                ).map((w) => (
                  <div key={w}>{w}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {blanks.map((b) => (
                  <div key={`b-${b}`} className="aspect-square" />
                ))}
                {days.map((d) => {
                  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                  const sc = scoreMap.get(dateStr);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDayClick(d)}
                      className={`
                        aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-bold
                        transition hover:ring-2 hover:ring-indigo-400
                        ${sc !== undefined ? scoreHue(sc) : 'bg-gray-100 dark:bg-slate-700 text-gray-400'}
                      `}
                    >
                      <span>{d}</span>
                      {sc !== undefined && <span className="text-[10px] opacity-90">{sc}</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(data.fortune.dimensions).map(([key, dim]) => (
                <div
                  key={key}
                  className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-gray-100 dark:border-slate-700"
                >
                  <div className="text-xs text-gray-500">
                    {key === 'career'
                      ? isEnglish
                        ? 'Career'
                        : '事业'
                      : key === 'wealth'
                        ? isEnglish
                          ? 'Wealth'
                          : '财运'
                        : key === 'romance'
                          ? isEnglish
                            ? 'Love'
                            : '情感'
                          : key === 'health'
                            ? isEnglish
                              ? 'Health'
                              : '健康'
                            : key === 'academic'
                              ? isEnglish
                                ? 'Study'
                                : '学业'
                              : isEnglish
                                ? 'Travel'
                                : '出行'}
                  </div>
                  <div className="text-xl font-bold text-indigo-600">{dim.score}</div>
                  <div className="text-xs text-gray-600">{dim.tag}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            {isEnglish ? 'No data' : '暂无数据'}
          </div>
        )}
      </div>
    </div>
  );
}
