import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Crown,
  Flame,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';
import { getCustomYongShen } from '../../utils/yongShenStorage';
import {
  type DatePickerPurpose,
  type DatePickerRecommendation,
  type DatePickerResponseData,
  type WeekendPolicy,
  getDatePickerRecommendations,
} from '../../services/datePickerApi';

const PURPOSE_DIMENSION: Record<DatePickerPurpose, string> = {
  moving: 'career',
  opening: 'wealth',
  travel: 'travel',
  romance: 'romance',
  wealth: 'wealth',
  academic: 'academic',
  other: 'overall',
};

const PURPOSES: Array<{ id: DatePickerPurpose; zh: string; en: string; tone: string }> = [
  { id: 'moving', zh: '搬家安宅', en: 'Moving', tone: '稳住根基' },
  { id: 'opening', zh: '开业签约', en: 'Opening', tone: '扩张财势' },
  { id: 'travel', zh: '远行启程', en: 'Travel', tone: '顺路平安' },
  { id: 'romance', zh: '婚恋仪式', en: 'Romance', tone: '情感共振' },
  { id: 'wealth', zh: '求财理财', en: 'Wealth', tone: '资金效率' },
  { id: 'academic', zh: '考试晋级', en: 'Academic', tone: '专注提分' },
  { id: 'other', zh: '综合择日', en: 'General', tone: '均衡推进' },
];

const ANALYZE_PHASE_ZH = [
  '校准个人命盘...',
  '扫描未来时间线...',
  '识别低风险窗口...',
  '提炼高契合吉日...',
];
const ANALYZE_PHASE_EN = [
  'Calibrating your chart...',
  'Scanning timeline...',
  'Filtering low-risk windows...',
  'Finalizing top dates...',
];

function riskTone(level: string) {
  if (level === 'low') {
    return {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-300',
      labelZh: '低风险',
      labelEn: 'Low Risk',
      icon: ShieldCheck,
    };
  }
  if (level === 'high') {
    return {
      badge: 'bg-rose-100 text-rose-700 border-rose-300',
      labelZh: '高风险',
      labelEn: 'High Risk',
      icon: ShieldAlert,
    };
  }
  return {
    badge: 'bg-amber-100 text-amber-700 border-amber-300',
    labelZh: '中风险',
    labelEn: 'Medium Risk',
    icon: ShieldAlert,
  };
}

function trendText(trend: string, isEnglish: boolean) {
  if (trend === 'rising') return isEnglish ? 'Rising Momentum' : '趋势上扬';
  if (trend === 'falling') return isEnglish ? 'Cooling Momentum' : '趋势回落';
  return isEnglish ? 'Steady Momentum' : '趋势平稳';
}

function formatDateLabel(dateStr: string, isEnglish: boolean) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const weekDays = isEnglish
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return `${dateStr} · ${weekDays[d.getDay()] ?? ''}`;
}

export default function DatePickerPage() {
  const { i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { userProfile, setCurrentDate, fetchFortuneForDate } = useAppContext();

  const [purpose, setPurpose] = useState<DatePickerPurpose>('other');
  const [rangeDays, setRangeDays] = useState<7 | 14 | 21 | 30>(14);
  const [topN, setTopN] = useState<5 | 8 | 10>(8);
  const [weekendPolicy, setWeekendPolicy] = useState<WeekendPolicy>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<DatePickerResponseData | null>(null);
  const [compareDates, setCompareDates] = useState<string[]>([]);
  const [lockedDate, setLockedDate] = useState<DatePickerRecommendation | null>(null);

  const recommendations = resultData?.recommendations ?? [];
  const timeline = resultData?.timeline ?? [];

  useEffect(() => {
    if (!isLoading) return undefined;
    const timer = window.setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % ANALYZE_PHASE_ZH.length);
    }, 850);
    return () => window.clearInterval(timer);
  }, [isLoading]);

  const compareItems = useMemo(() => {
    if (!resultData) return [];
    return compareDates
      .map((date) => resultData.recommendations.find((item) => item.date === date))
      .filter((item): item is DatePickerRecommendation => Boolean(item));
  }, [compareDates, resultData]);

  const currentPurpose = PURPOSES.find((p) => p.id === purpose) || PURPOSES[0];

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null);
    setResultData(null);
    setCompareDates([]);
    setPhaseIndex(0);

    try {
      const customYongShen = getCustomYongShen(userProfile.birthDate, userProfile.birthTime);
      const data = await getDatePickerRecommendations({
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime,
        longitude: userProfile.longitude || 120.0,
        gender: userProfile.gender || 'male',
        customYongShen,
        purpose,
        rangeDays,
        topN,
        weekendPolicy,
      });
      setResultData(data);
    } catch (err) {
      console.error('择日推荐失败，降级使用前端扫描:', err);

      if (!fetchFortuneForDate) {
        setError(isEnglish ? 'Failed to analyze dates.' : '择日分析失败，请稍后重试。');
        setIsLoading(false);
        return;
      }

      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const fallbackResults: DatePickerRecommendation[] = [];

        for (let i = 0; i < rangeDays; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const weekday = d.getDay();
          const isWeekend = weekday === 0 || weekday === 6;
          if (weekendPolicy === 'weekend_only' && !isWeekend) continue;
          if (weekendPolicy === 'workday_only' && isWeekend) continue;

          const fortune = await fetchFortuneForDate(d);
          if (!fortune?.dateStr) continue;

          const dimKey = PURPOSE_DIMENSION[purpose];
          const dimScore = dimKey === 'overall' ? fortune.totalScore : (fortune.dimensions?.[dimKey]?.score ?? fortune.totalScore);
          const purposeScore = Math.max(0, Math.min(100, Math.round(dimScore * 0.65 + fortune.totalScore * 0.35)));
          const riskLevel = purposeScore >= 78 ? 'low' : purposeScore >= 60 ? 'medium' : 'high';
          const riskWeight = riskLevel === 'low' ? 1 : riskLevel === 'medium' ? 2 : 4;

          fallbackResults.push({
            date: fortune.dateStr,
            weekday: d.getDay() === 0 ? 6 : d.getDay() - 1,
            totalScore: fortune.totalScore,
            purposeScore,
            confidence: Math.max(35, Math.min(95, purposeScore - riskWeight * 4)),
            riskLevel,
            riskWeight,
            riskFlags: [],
            bestTimeWindow: purposeScore > 80 ? '09:00-11:00（强推）' : '09:00-11:00',
            mainTheme: fortune.mainTheme ?? {},
            dimensions: {
              career: fortune.dimensions?.career?.score ?? fortune.totalScore,
              wealth: fortune.dimensions?.wealth?.score ?? fortune.totalScore,
              romance: fortune.dimensions?.romance?.score ?? fortune.totalScore,
              health: fortune.dimensions?.health?.score ?? fortune.totalScore,
              academic: fortune.dimensions?.academic?.score ?? fortune.totalScore,
              travel: fortune.dimensions?.travel?.score ?? fortune.totalScore,
            },
            highlights: [isEnglish ? 'Fallback mode active' : '已启用降级模式', isEnglish ? 'Use as reference' : '结果可作参考'],
            cautions: [isEnglish ? 'Backend unavailable' : '后端接口异常，结果精度较低'],
            tags: [isEnglish ? 'Fallback' : '降级推荐'],
            liu: {},
          });
        }

        fallbackResults.sort((a, b) => {
          if (b.purposeScore !== a.purposeScore) return b.purposeScore - a.purposeScore;
          return a.date.localeCompare(b.date);
        });

        const recommendationsFallback = fallbackResults.slice(0, topN);
        const timelineFallback = [...fallbackResults].sort((a, b) => a.date.localeCompare(b.date));
        const best = recommendationsFallback[0];
        const worst = timelineFallback[timelineFallback.length - 1];
        const half = Math.max(1, Math.floor(timelineFallback.length / 2));
        const firstAvg = timelineFallback.slice(0, half).reduce((sum, item) => sum + item.purposeScore, 0) / half;
        const secondHalf = timelineFallback.slice(half);
        const secondAvg = secondHalf.reduce((sum, item) => sum + item.purposeScore, 0) / Math.max(1, secondHalf.length);
        const trend = secondAvg > firstAvg + 4 ? 'rising' : firstAvg > secondAvg + 4 ? 'falling' : 'stable';

        setResultData({
          purpose,
          startDate: today.toISOString().slice(0, 10),
          rangeDays,
          scannedDays: fallbackResults.length,
          skippedDays: 0,
          failedDays: 0,
          recommendedCount: recommendationsFallback.length,
          recommendations: recommendationsFallback,
          timeline: timelineFallback,
          summary: {
            bestDate: best?.date ?? '',
            bestScore: best?.purposeScore ?? 0,
            worstDate: worst?.date ?? '',
            worstScore: worst?.purposeScore ?? 0,
            trend,
            averageConfidence: Math.round(timelineFallback.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, timelineFallback.length)),
            failedDays: 0,
          },
        });
      } catch (fallbackError) {
        console.error('前端降级扫描也失败:', fallbackError);
        setError(isEnglish ? 'Failed to analyze dates.' : '择日分析失败，请稍后重试。');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, d, 12, 0, 0));
    navigate('/app/today');
  };

  const toggleCompare = (dateStr: string) => {
    setCompareDates((prev) => {
      if (prev.includes(dateStr)) return prev.filter((d) => d !== dateStr);
      if (prev.length < 2) return [...prev, dateStr];
      return [prev[1], dateStr];
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.14),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.14),transparent_40%),linear-gradient(160deg,#f8fafc_0%,#eef2ff_40%,#f8fafc_100%)]">
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 text-slate-100 p-6 lg:p-8"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(16,185,129,0.26),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.24),transparent_40%)]" />
          <div className="relative grid lg:grid-cols-[1.35fr_1fr] gap-6 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs tracking-[0.14em] uppercase text-amber-200">
                <Flame size={14} />
                {isEnglish ? 'Cinematic Date Lab' : '命运电影场'}
              </div>
              <h1 className="text-3xl lg:text-4xl font-black leading-tight">
                {isEnglish ? 'Auspicious Date Director' : '电影级择日导演台'}
              </h1>
              <p className="text-slate-200/85 max-w-xl">
                {isEnglish
                  ? 'Scan timeline, rank low-risk windows, and lock your best date with clear evidence.'
                  : '扫描未来时间线，筛选低风险窗口，用可解释证据锁定你的关键吉日。'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{isEnglish ? 'Current Purpose' : '当前场景'}</span>
                <span className="font-bold text-amber-200">{isEnglish ? currentPurpose.en : currentPurpose.zh}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{isEnglish ? 'Tone' : '运势主轴'}</span>
                <span className="font-medium">{currentPurpose.tone}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{isEnglish ? 'Scan Range' : '扫描范围'}</span>
                <span className="font-medium">{rangeDays} {isEnglish ? 'days' : '天'}</span>
              </div>
              <div className="pt-2 border-t border-white/15 text-xs text-slate-300">
                {isEnglish ? 'Tip: compare two candidate dates before locking.' : '建议先对比两天，再执行锁定仪式。'}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid xl:grid-cols-[1.2fr_1fr] gap-5">
          <div className="rounded-3xl border border-slate-200 bg-white/85 backdrop-blur p-5 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.55)] space-y-5">
            <div className="flex items-center gap-2 text-slate-700">
              <Target size={18} className="text-cyan-700" />
              <h2 className="font-bold">{isEnglish ? 'Mission Setup' : '任务设定'}</h2>
            </div>

            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">
                {isEnglish ? 'Purpose' : '场景'}
              </div>
              <div className="flex flex-wrap gap-2">
                {PURPOSES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setPurpose(item.id)}
                    className={`px-3.5 py-2 rounded-xl text-sm transition ${
                      purpose === item.id
                        ? 'bg-slate-900 text-amber-200 shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isEnglish ? item.en : item.zh}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">{isEnglish ? 'Range' : '时域'}</div>
                <div className="flex gap-2 flex-wrap">
                  {([7, 14, 21, 30] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setRangeDays(item)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        rangeDays === item ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item}{isEnglish ? 'd' : '天'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">{isEnglish ? 'Results' : '榜单数量'}</div>
                <div className="flex gap-2 flex-wrap">
                  {([5, 8, 10] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setTopN(item)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${
                        topN === item ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      Top {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-[0.12em] text-slate-500">{isEnglish ? 'Policy' : '周末策略'}</div>
                <select
                  value={weekendPolicy}
                  onChange={(e) => setWeekendPolicy(e.target.value as WeekendPolicy)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <option value="all">{isEnglish ? 'All days' : '全时段'}</option>
                  <option value="weekend_only">{isEnglish ? 'Weekend only' : '仅周末'}</option>
                  <option value="workday_only">{isEnglish ? 'Workday only' : '仅工作日'}</option>
                </select>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={isLoading}
            className="rounded-3xl border border-slate-200 bg-[linear-gradient(145deg,#0f172a_0%,#1e293b_55%,#0f766e_100%)] p-6 text-left text-white shadow-[0_24px_70px_-40px_rgba(15,23,42,0.75)] disabled:opacity-70"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-amber-200 text-xs tracking-[0.12em] uppercase">
                <Sparkles size={14} />
                {isEnglish ? 'Action' : '执行'}
              </div>
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Calendar size={20} />}
            </div>
            <h3 className="text-2xl font-black mt-3">
              {isEnglish ? 'Launch Date Scan' : '启动择日扫描'}
            </h3>
            <p className="text-slate-200/85 mt-2 text-sm">
              {isEnglish
                ? 'Generate ranked dates with risk layers, reasons, and time windows.'
                : '生成带风险分层、理由说明与最佳时段的吉日榜单。'}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs">
              {isLoading ? (isEnglish ? 'Analyzing...' : '正在分析...') : (isEnglish ? 'Start Now' : '立即开始')}
              <ChevronRight size={14} />
            </div>
          </motion.button>
        </section>

        <AnimatePresence>
          {isLoading && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="rounded-3xl border border-slate-200 bg-white/85 backdrop-blur p-6"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                    className="h-14 w-14 rounded-full border-2 border-cyan-700 border-t-transparent"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                    className="absolute inset-3 rounded-full bg-amber-400/30"
                  />
                </div>
                <div className="text-lg font-bold text-slate-800">
                  {isEnglish ? ANALYZE_PHASE_EN[phaseIndex] : ANALYZE_PHASE_ZH[phaseIndex]}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {resultData && (
          <section className="space-y-5">
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-4">
                <div className="flex items-center gap-2 text-slate-700">
                  <TrendingUp size={18} className="text-emerald-700" />
                  <h3 className="font-bold">{isEnglish ? 'Campaign Summary' : '战况概览'}</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="text-xs text-slate-500">{isEnglish ? 'Best Date' : '最优日期'}</div>
                    <div className="font-black text-slate-800">{resultData.summary.bestDate}</div>
                    <div className="text-sm text-emerald-700">{resultData.summary.bestScore}</div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="text-xs text-slate-500">{isEnglish ? 'Trend' : '走势'}</div>
                    <div className="font-black text-slate-800">{trendText(resultData.summary.trend, isEnglish)}</div>
                    <div className="text-sm text-slate-600">
                      {isEnglish ? 'Confidence' : '平均可信度'} {resultData.summary.averageConfidence}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-100 p-3">
                    <div className="text-xs text-slate-500">{isEnglish ? 'Coverage' : '覆盖天数'}</div>
                    <div className="font-black text-slate-800">{resultData.scannedDays}/{resultData.rangeDays}</div>
                    <div className="text-sm text-slate-600">{isEnglish ? 'Failed' : '失败'} {resultData.failedDays}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-700">{isEnglish ? 'Timeline Heat' : '时间线热度'}</h3>
                  <span className="text-xs text-slate-500">{isEnglish ? 'By purpose score' : '按场景分值'}</span>
                </div>
                <div className="grid grid-cols-10 gap-1.5 items-end h-24">
                  {timeline.slice(0, 30).map((item) => (
                    <motion.div
                      key={item.date}
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(12, item.purposeScore)}%` }}
                      transition={{ duration: 0.45 }}
                      className={`${item.riskLevel === 'low' ? 'bg-emerald-500' : item.riskLevel === 'medium' ? 'bg-amber-500' : 'bg-rose-500'} rounded-sm`}
                      title={`${item.date} / ${item.purposeScore}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-800">{isEnglish ? 'Ranked Recommendations' : '吉日揭榜'}</h3>
                <div className="text-xs text-slate-500">{isEnglish ? 'Select 2 for duel mode' : '可选择 2 天进入对决模式'}</div>
              </div>

              {recommendations.map((item, index) => {
                const tone = riskTone(item.riskLevel);
                const RiskIcon = tone.icon;
                const isCompared = compareDates.includes(item.date);
                return (
                  <motion.article
                    key={item.date}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-900 text-amber-200 flex items-center justify-center font-black">{index + 1}</div>
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-2">
                            <span>{item.mainTheme?.emoji || '✨'}</span>
                            {formatDateLabel(item.date, isEnglish)}
                          </div>
                          <div className="text-xs text-slate-500">{item.mainTheme?.keyword || (isEnglish ? 'Auspicious candidate' : '候选吉日')}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full border text-xs ${tone.badge}`}>
                          <RiskIcon size={12} />
                          {isEnglish ? tone.labelEn : tone.labelZh}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500">{isEnglish ? 'Purpose' : '场景分'}</div>
                          <div className="text-xl font-black text-cyan-700">{item.purposeScore}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid lg:grid-cols-[1.4fr_1fr] gap-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                            <span>{isEnglish ? 'Confidence' : '可信度'}</span>
                            <span>{item.confidence}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.confidence}%` }} transition={{ duration: 0.55 }} className="h-full bg-gradient-to-r from-cyan-600 to-emerald-500" />
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600"><Clock3 size={12} />{item.bestTimeWindow}</span>
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-amber-100 text-amber-700 px-2 py-1">{tag}</span>
                          ))}
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div className="font-semibold text-slate-700">{isEnglish ? 'Highlights' : '亮点'}</div>
                          {item.highlights.slice(0, 2).map((line) => (
                            <div key={line} className="flex items-start gap-2"><CheckCircle2 size={14} className="mt-0.5 text-emerald-600" /><span>{line}</span></div>
                          ))}
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <div className="font-semibold text-slate-700">{isEnglish ? 'Cautions' : '注意点'}</div>
                          {item.cautions.slice(0, 2).map((line) => (
                            <div key={line} className="flex items-start gap-2"><ShieldAlert size={14} className="mt-0.5 text-amber-600" /><span>{line}</span></div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-3 space-y-2">
                        <div className="text-xs text-slate-500">{isEnglish ? 'Core Metrics' : '核心指标'}</div>
                        <div className="flex items-center justify-between text-sm"><span>{isEnglish ? 'Total' : '综合分'}</span><span className="font-bold">{item.totalScore}</span></div>
                        <div className="flex items-center justify-between text-sm"><span>{isEnglish ? 'Liu Day' : '流日'}</span><span className="font-bold">{item.liu?.ri || '-'}</span></div>
                        <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-2">
                          <button onClick={() => toggleCompare(item.date)} className={`px-2.5 py-1.5 rounded-lg text-xs ${isCompared ? 'bg-cyan-700 text-white' : 'bg-white border border-slate-300 text-slate-700'}`}>
                            {isCompared ? (isEnglish ? 'Compared' : '已加入对决') : (isEnglish ? 'Compare' : '加入对决')}
                          </button>
                          <button onClick={() => setLockedDate(item)} className="px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 text-amber-200">{isEnglish ? 'Lock Date' : '锁定吉日'}</button>
                          <button onClick={() => handleSelectDate(item.date)} className="px-2.5 py-1.5 rounded-lg text-xs bg-emerald-700 text-white">{isEnglish ? 'Open Day' : '进入当日'}</button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}

        <AnimatePresence>
          {compareItems.length === 2 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-3xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center gap-2 mb-4"><Crown size={18} className="text-amber-600" /><h3 className="font-black text-slate-800">{isEnglish ? 'Duel Mode' : '双日对决'}</h3></div>
              <div className="grid md:grid-cols-2 gap-3">
                {compareItems.map((item) => (
                  <div key={item.date} className="rounded-xl border border-slate-200 p-3 space-y-2">
                    <div className="font-bold text-slate-800">{formatDateLabel(item.date, isEnglish)}</div>
                    <div className="text-sm text-slate-600">{isEnglish ? 'Purpose Score' : '场景分'}: <b>{item.purposeScore}</b></div>
                    <div className="text-sm text-slate-600">{isEnglish ? 'Confidence' : '可信度'}: <b>{item.confidence}</b></div>
                    <div className="text-sm text-slate-600">{isEnglish ? 'Time Window' : '吉时'}: <b>{item.bestTimeWindow}</b></div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {lockedDate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm p-4 flex items-center justify-center"
              onClick={() => setLockedDate(null)}
            >
              <motion.div
                initial={{ scale: 0.92, y: 18 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, y: 12 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-3xl border border-white/20 bg-[linear-gradient(155deg,#0f172a_0%,#064e3b_100%)] text-white p-6"
              >
                <div className="flex items-center gap-2 text-amber-200 text-xs uppercase tracking-[0.12em]"><Sparkles size={14} />{isEnglish ? 'Lock Ceremony' : '锁定仪式'}</div>
                <h3 className="text-2xl font-black mt-2">{isEnglish ? 'Date Confirmed' : '吉日已锁定'}</h3>
                <p className="mt-2 text-slate-200">{formatDateLabel(lockedDate.date, isEnglish)} · {isEnglish ? 'Score' : '场景分'} {lockedDate.purposeScore}</p>
                <div className="mt-4 rounded-xl bg-white/10 p-3 text-sm space-y-1">
                  <div>{isEnglish ? 'Best window' : '推荐时段'}: <b>{lockedDate.bestTimeWindow}</b></div>
                  <div>{isEnglish ? 'Main note' : '关键提示'}: <b>{lockedDate.highlights[0] || '-'}</b></div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button onClick={() => handleSelectDate(lockedDate.date)} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold">{isEnglish ? 'Go To This Day' : '进入该日运势'}</button>
                  <button onClick={() => setLockedDate(null)} className="px-4 py-2 rounded-xl bg-white/15 text-white text-sm">{isEnglish ? 'Close' : '关闭'}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
