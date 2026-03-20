// ==========================================
// 趋势分析 - 功能页
// ==========================================

import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, Calendar, Award, ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { updateAchievementProgress } from '../../utils/achievementStorage';
import {
  getRecentTrends,
  getDimensionTrends,
  analyzeTrend,
  getTopDays,
  type TrendDataPoint,
  type TrendAnalysis,
} from '../../utils/trendsAnalysis';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from 'react-i18next';

export default function TrendsPage() {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { setCurrentDate } = useAppContext();
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [dimensionData, setDimensionData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [topDays, setTopDays] = useState<TrendDataPoint[]>([]);

  useEffect(() => {
    const trends = getRecentTrends(days);
    const dimensions = getDimensionTrends(days);
    const trendAnalysis = analyzeTrend(days);
    const best = getTopDays(3);
    setTrendData(trends);
    setDimensionData(dimensions);
    setAnalysis(trendAnalysis);
    setTopDays(best);
    const viewCount = parseInt(localStorage.getItem('trends_view_count') || '0') + 1;
    localStorage.setItem('trends_view_count', viewCount.toString());
    updateAchievementProgress('trends_view', viewCount);
  }, [days]);

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    navigate('/app/fortune/today');
  };

  if (trendData.length < 2) {
    return (
      <div className="flex flex-col min-h-full">
        <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <Link to="/app/fortune/today" className="flex items-center gap-2 text-white/90 hover:text-white">
            <ChevronLeft size={24} />
            {isEnglish ? 'Back' : '返回'}
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F5F5F7] dark:bg-slate-900">
          <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            {isEnglish ? 'Not enough data' : '数据不足'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isEnglish ? 'Query at least 2 days of fortune to generate the trend chart.' : '至少需要查询 2 天的运势才能生成趋势图哦！'}
          </p>
          <Link
            to="/app/fortune/today"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
          >
            {isEnglish ? 'Query fortune' : '继续查询运势'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 lg:p-6 rounded-b-2xl">
        <div className="flex items-center justify-between mb-4">
          <Link to="/app/fortune/today" className="flex items-center gap-2 text-white/90 hover:text-white">
            <ChevronLeft size={24} />
            <div className="flex items-center gap-2">
              <TrendingUp size={24} />
              <h2 className="text-xl font-bold">{isEnglish ? 'Trend Analysis' : '运势趋势分析'}</h2>
            </div>
          </Link>
        </div>
        <div className="flex gap-2">
          {([7, 14, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                days === d ? 'bg-white text-indigo-600' : 'bg-white/20 hover:bg-white/30'
              }`}
            >
              {d} {isEnglish ? 'days' : '天'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6 bg-[#F5F5F7] dark:bg-slate-900">
        {analysis && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-1">
                  {isEnglish ? 'Trend Insight' : '趋势洞察'}
                </h3>
                <div className="flex items-center gap-2">
                  {analysis.trend === 'up' && (
                    <>
                      <TrendingUp size={20} className="text-green-600" />
                      <span className="text-green-600 font-bold">{isEnglish ? 'Upward' : '上升趋势'}</span>
                    </>
                  )}
                  {analysis.trend === 'down' && (
                    <>
                      <TrendingDown size={20} className="text-red-600" />
                      <span className="text-red-600 font-bold">{isEnglish ? 'Downward' : '下降趋势'}</span>
                    </>
                  )}
                  {analysis.trend === 'stable' && (
                    <>
                      <Minus size={20} className="text-blue-600" />
                      <span className="text-blue-600 font-bold">{isEnglish ? 'Stable' : '平稳运行'}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-indigo-600">{analysis.avgScore}</div>
                <div className="text-xs text-gray-500">{isEnglish ? 'Avg' : '平均分'}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{analysis.suggestion}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl">
                <div className="text-xs text-gray-500 mb-1">{isEnglish ? 'Best day' : '最佳日期'}</div>
                <div className="font-bold text-green-600">{analysis.maxDay.keyword}</div>
                <div className="text-2xl font-black text-gray-800 dark:text-gray-200">{analysis.maxDay.score}分</div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 p-3 rounded-xl">
                <div className="text-xs text-gray-500 mb-1">{isEnglish ? 'Volatility' : '波动性'}</div>
                <div className="font-bold text-gray-700 dark:text-gray-300">
                  {analysis.volatility === 'high' && (isEnglish ? 'High' : '较大波动')}
                  {analysis.volatility === 'medium' && (isEnglish ? 'Medium' : '中等波动')}
                  {analysis.volatility === 'low' && (isEnglish ? 'Low' : '相对稳定')}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">{isEnglish ? 'Fortune Trend' : '运势走势'}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" stroke="#9ca3af" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {dimensionData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">{isEnglish ? 'Six Dimensions' : '六维度对比'}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dimensionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '10px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="career" name="事业" fill="#f97316" />
                <Bar dataKey="wealth" name="财运" fill="#eab308" />
                <Bar dataKey="romance" name="感情" fill="#ec4899" />
                <Bar dataKey="health" name="健康" fill="#22c55e" />
                <Bar dataKey="academic" name="学业" fill="#3b82f6" />
                <Bar dataKey="travel" name="出行" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {topDays.length > 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              {isEnglish ? 'Best Days' : '历史最佳日期'}
            </h3>
            <div className="space-y-3">
              {topDays.map((day, index) => (
                <button
                  key={day.date}
                  onClick={() => {
                    const [year, month, dayNum] = day.date.split('-').map(Number);
                    handleSelectDate(new Date(year, month - 1, dayNum, 12, 0, 0));
                  }}
                  className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:border-yellow-400 transition text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                      <div>
                        <div className="font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                          {day.emoji} {day.keyword}
                        </div>
                        <div className="text-xs text-gray-500">{day.label}</div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-yellow-600">{day.score}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
