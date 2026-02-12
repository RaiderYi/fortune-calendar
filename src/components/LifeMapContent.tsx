import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Compass,
  Loader2,
  Radar,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import type { UserProfile } from './ProfileSettings';
import { getCustomYongShen } from '../utils/yongShenStorage';
import { useAppContext } from '../contexts/AppContext';
import { getLifeMapTrends, type LifeMapData, type LifeMapTrendPoint } from '../services/lifeMapApi';

interface LifeMapContentProps {
  userProfile: UserProfile;
  onOpenYongShenSettings?: () => void;
  onViewToday?: () => void;
}

type ActiveTab = 'cinema' | 'timeline' | 'strategy';
type DimensionKey = 'overall' | 'career' | 'wealth' | 'romance' | 'health';

const SCAN_PHASE_ZH = ['构建人生主线...', '识别趋势拐点...', '提取关键窗口...', '生成行动剧本...'];
const SCAN_PHASE_EN = ['Building life arc...', 'Detecting turning points...', 'Extracting key windows...', 'Generating strategy script...'];

const DIM_CONFIG: Record<DimensionKey, { color: string; zh: string; en: string }> = {
  overall: { color: '#0f766e', zh: '综合', en: 'Overall' },
  career: { color: '#2563eb', zh: '事业', en: 'Career' },
  wealth: { color: '#ca8a04', zh: '财运', en: 'Wealth' },
  romance: { color: '#db2777', zh: '感情', en: 'Romance' },
  health: { color: '#16a34a', zh: '健康', en: 'Health' },
};

function trendLabel(trend: string, isEnglish: boolean) {
  if (trend === 'rising') return isEnglish ? 'Rising' : '上升';
  if (trend === 'falling') return isEnglish ? 'Falling' : '回落';
  return isEnglish ? 'Stable' : '稳定';
}

function riskBadge(level: string) {
  if (level === 'low') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
  if (level === 'high') return 'bg-rose-100 text-rose-700 border-rose-300';
  return 'bg-amber-100 text-amber-700 border-amber-300';
}

export default function LifeMapContent({
  userProfile,
  onOpenYongShenSettings,
  onViewToday,
}: LifeMapContentProps) {
  const { i18n } = useTranslation(['ui', 'fortune']);
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { setCurrentDate } = useAppContext();

  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('cinema');
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey>('overall');
  const [data, setData] = useState<LifeMapData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<LifeMapTrendPoint | null>(null);

  const hasCustomYongShen = Boolean(getCustomYongShen(userProfile.birthDate, userProfile.birthTime));

  useEffect(() => {
    if (!isLoading) return undefined;
    const timer = window.setInterval(() => {
      setPhase((prev) => (prev + 1) % SCAN_PHASE_ZH.length);
    }, 850);
    return () => window.clearInterval(timer);
  }, [isLoading]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    setData(null);
    setSelectedPoint(null);
    setPhase(0);
    try {
      const customYongShen = getCustomYongShen(userProfile.birthDate, userProfile.birthTime);
      const result = await getLifeMapTrends({
        birthDate: userProfile.birthDate,
        birthTime: userProfile.birthTime,
        longitude: userProfile.longitude || 120.0,
        gender: userProfile.gender || 'male',
        customYongShen,
        years: 10,
      });
      setData(result);
    } catch (err) {
      console.error('人生大图景加载失败:', err);
      setError(isEnglish ? 'Failed to load life map.' : '人生大图景加载失败，请稍后重试。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.birthDate, userProfile.birthTime, userProfile.longitude, userProfile.gender]);

  const points = data?.points ?? [];
  const milestones = data?.milestones ?? [];
  const summary = data?.summary;
  const strategy = data?.strategy ?? [];

  const chartData = useMemo(
    () =>
      points.map((p) => ({
        year: p.year,
        value: selectedDimension === 'overall' ? p.overall : p[selectedDimension],
        overall: p.overall,
      })),
    [points, selectedDimension]
  );

  const peakPoint = useMemo(() => points.reduce((acc, p) => (p.overall > acc.overall ? p : acc), points[0] || ({} as LifeMapTrendPoint)), [points]);
  const lowPoint = useMemo(() => points.reduce((acc, p) => (p.overall < acc.overall ? p : acc), points[0] || ({} as LifeMapTrendPoint)), [points]);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.12),transparent_35%),linear-gradient(170deg,#f8fafc_0%,#ecfeff_50%,#f8fafc_100%)]">
      {!hasCustomYongShen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} />
            {isEnglish ? 'Set Yong Shen for higher annual accuracy.' : '建议先设置用神，年度趋势会更准确。'}
          </div>
          {onOpenYongShenSettings && (
            <button
              onClick={onOpenYongShenSettings}
              className="rounded-lg bg-amber-200 px-3 py-1 text-xs text-amber-900"
            >
              {isEnglish ? 'Set Now' : '去设置'}
            </button>
          )}
        </motion.div>
      )}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 text-slate-100 p-6"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(20,184,166,0.26),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(56,189,248,0.24),transparent_35%)]" />
        <div className="relative grid lg:grid-cols-[1.35fr_1fr] gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs tracking-[0.12em] uppercase text-cyan-200">
              <Sparkles size={14} />
              {isEnglish ? 'Life Map Director' : '人生大图景导演台'}
            </div>
            <h2 className="text-2xl lg:text-3xl font-black">
              {isEnglish ? 'Your 10-Year Life Arc' : '未来十年人生主线'}
            </h2>
            <p className="text-slate-200/85 text-sm">
              {isEnglish
                ? 'One scan for yearly trend, momentum turning points, and tactical actions.'
                : '一次扫描，生成年度趋势、拐点与可执行策略。'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur p-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>{isEnglish ? 'Trend' : '趋势'}</span>
              <span className="font-bold">{summary ? trendLabel(summary.trend, isEnglish) : '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{isEnglish ? 'Average' : '平均分'}</span>
              <span className="font-bold">{summary?.average ?? '-'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{isEnglish ? 'Confidence' : '可信度'}</span>
              <span className="font-bold">{summary?.confidence ?? '-'}</span>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mt-5 grid xl:grid-cols-[1.25fr_1fr] gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Radar size={18} className="text-cyan-700" />
              <h3 className="font-bold">{isEnglish ? 'Dimension Lens' : '维度镜头'}</h3>
            </div>
            <button
              onClick={fetchData}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              {isEnglish ? 'Refresh' : '刷新'}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DIM_CONFIG) as DimensionKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedDimension(key)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  selectedDimension === key ? 'bg-slate-900 text-cyan-200' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {isEnglish ? DIM_CONFIG[key].en : DIM_CONFIG[key].zh}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-slate-50 p-4">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" stroke="#64748b" />
                <YAxis domain={[0, 100]} stroke="#64748b" />
                <Tooltip
                  formatter={(value: number) => [`${value}`, isEnglish ? DIM_CONFIG[selectedDimension].en : DIM_CONFIG[selectedDimension].zh]}
                  labelFormatter={(label) => `${label}`}
                />
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={DIM_CONFIG[selectedDimension].color}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 space-y-3">
          <div className="flex items-center gap-2 text-slate-700">
            <Target size={18} className="text-emerald-700" />
            <h3 className="font-bold">{isEnglish ? 'Milestone Windows' : '里程碑窗口'}</h3>
          </div>
          {milestones.slice(0, 5).map((item) => (
            <div key={`${item.type}-${item.year}`} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-800">{item.title}</div>
                <span className="text-xs text-slate-500">{item.year}</span>
              </div>
              <div className="text-sm text-slate-600 mt-1">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex gap-2 mb-4">
          {[
            { id: 'cinema', icon: TrendingUp, zh: '主线', en: 'Arc' },
            { id: 'timeline', icon: Calendar, zh: '时间线', en: 'Timeline' },
            { id: 'strategy', icon: Compass, zh: '策略', en: 'Strategy' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-slate-900 text-cyan-200' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {isEnglish ? tab.en : tab.zh}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 text-center">
              <Loader2 className="mx-auto animate-spin text-cyan-700" />
              <div className="mt-3 text-sm text-slate-600">{isEnglish ? SCAN_PHASE_EN[phase] : SCAN_PHASE_ZH[phase]}</div>
            </motion.div>
          )}

          {!isLoading && error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </motion.div>
          )}

          {!isLoading && !error && activeTab === 'cinema' && (
            <motion.div key="cinema" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">{isEnglish ? 'Peak Year' : '峰值年份'}</div>
                <div className="text-2xl font-black text-emerald-700">{peakPoint?.year ?? '-'}</div>
                <div className="text-sm text-slate-600">{isEnglish ? 'Overall score' : '综合分'} {peakPoint?.overall ?? '-'}</div>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500">{isEnglish ? 'Caution Year' : '谨慎年份'}</div>
                <div className="text-2xl font-black text-amber-700">{lowPoint?.year ?? '-'}</div>
                <div className="text-sm text-slate-600">{isEnglish ? 'Overall score' : '综合分'} {lowPoint?.overall ?? '-'}</div>
              </div>
            </motion.div>
          )}

          {!isLoading && !error && activeTab === 'timeline' && (
            <motion.div key="timeline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {points.map((point) => (
                <button
                  key={point.year}
                  onClick={() => setSelectedPoint(point)}
                  className="w-full text-left rounded-xl border border-slate-200 p-4 hover:border-cyan-400 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{point.year} · {point.ganZhi}</div>
                      <div className="text-xs text-slate-500">
                        {isEnglish ? 'Momentum' : '动量'}: {point.momentum.delta >= 0 ? '+' : ''}{point.momentum.delta}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full border text-xs ${riskBadge(point.riskLevel)}`}>
                        {point.riskLevel}
                      </span>
                      <div className="font-black text-cyan-700">{point.overall}</div>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}

          {!isLoading && !error && activeTab === 'strategy' && (
            <motion.div key="strategy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              {strategy.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800">{item.title}</div>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      item.priority === 'high' ? 'bg-rose-100 text-rose-700' : item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{item.detail}</div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedPoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={() => setSelectedPoint(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl border border-white/20 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-800">{selectedPoint.year} · {selectedPoint.ganZhi}</h3>
                  <div className="text-sm text-slate-500">
                    {isEnglish ? 'Overall' : '综合'} {selectedPoint.overall} · {isEnglish ? 'Confidence' : '可信度'} {selectedPoint.confidence}
                  </div>
                </div>
                <button onClick={() => setSelectedPoint(null)} className="p-2 rounded-lg hover:bg-slate-100">
                  <X size={18} />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {(['career', 'wealth', 'romance', 'health', 'academic', 'travel'] as const).map((k) => (
                  <div key={k} className="rounded-lg bg-slate-50 px-3 py-2 flex items-center justify-between">
                    <span className="text-slate-600">{k}</span>
                    <span className="font-bold text-slate-800">{selectedPoint[k]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedPoint(null);
                    if (onViewToday) onViewToday();
                    else {
                      setCurrentDate(new Date());
                      navigate('/app/today');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-cyan-200 text-sm"
                >
                  {isEnglish ? 'Open Today Fortune' : '查看今日运势'}
                </button>
                <button onClick={() => setSelectedPoint(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm">
                  {isEnglish ? 'Close' : '关闭'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
