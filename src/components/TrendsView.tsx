import { X, TrendingUp, TrendingDown, Minus, Calendar, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getRecentTrends, 
  getDimensionTrends, 
  analyzeTrend, 
  getTopDays,
  type TrendDataPoint,
  type TrendAnalysis 
} from '../utils/trendsAnalysis';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

interface TrendsViewProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

export default function TrendsView({ isOpen, onClose, onSelectDate }: TrendsViewProps) {
  const [days, setDays] = useState<7 | 14 | 30>(7);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [dimensionData, setDimensionData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<TrendAnalysis | null>(null);
  const [topDays, setTopDays] = useState<TrendDataPoint[]>([]);

  // 加载数据
  useEffect(() => {
    if (isOpen) {
      const trends = getRecentTrends(days);
      const dimensions = getDimensionTrends(days);
      const trendAnalysis = analyzeTrend(days);
      const best = getTopDays(3);
      
      setTrendData(trends);
      setDimensionData(dimensions);
      setAnalysis(trendAnalysis);
      setTopDays(best);
    }
  }, [isOpen, days]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 数据不足提示 */}
          {trendData.length < 2 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">数据不足</h3>
                <p className="text-gray-600 mb-6">
                  至少需要查询 2 天的运势才能生成趋势图哦！
                </p>
                <button
                  onClick={onClose}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  继续查询运势
                </button>
              </div>
            </motion.div>
          ) : (
            <>

              {/* 主内容 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-auto"
              >
                <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* 头部 */}
          <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-3xl z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={24} />
                <h2 className="text-2xl font-bold">运势趋势分析</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* 时间范围选择 */}
            <div className="flex gap-2">
              {[7, 14, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d as 7 | 14 | 30)}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    days === d 
                      ? 'bg-white text-indigo-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  {d} 天
                </button>
              ))}
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-6 space-y-6">
            {/* 趋势分析卡片 */}
            {analysis && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">趋势洞察</h3>
                    <div className="flex items-center gap-2">
                      {analysis.trend === 'up' && (
                        <>
                          <TrendingUp size={20} className="text-green-600" />
                          <span className="text-green-600 font-bold">上升趋势</span>
                        </>
                      )}
                      {analysis.trend === 'down' && (
                        <>
                          <TrendingDown size={20} className="text-red-600" />
                          <span className="text-red-600 font-bold">下降趋势</span>
                        </>
                      )}
                      {analysis.trend === 'stable' && (
                        <>
                          <Minus size={20} className="text-blue-600" />
                          <span className="text-blue-600 font-bold">平稳运行</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-indigo-600">{analysis.avgScore}</div>
                    <div className="text-xs text-gray-500">平均分</div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {analysis.suggestion}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">最佳日期</div>
                    <div className="font-bold text-green-600">{analysis.maxDay.keyword}</div>
                    <div className="text-2xl font-black text-gray-800">{analysis.maxDay.score}分</div>
                  </div>
                  <div className="bg-white/60 p-3 rounded-xl">
                    <div className="text-xs text-gray-500 mb-1">波动性</div>
                    <div className="font-bold text-gray-700">
                      {analysis.volatility === 'high' && '较大波动'}
                      {analysis.volatility === 'medium' && '中等波动'}
                      {analysis.volatility === 'low' && '相对稳定'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 总分趋势图 */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">运势走势</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="label" 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'score') return [`${value}分`, '运势分数'];
                      return [value, name];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 六维度对比图 */}
            {dimensionData.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">六维度对比</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dimensionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#9ca3af"
                      style={{ fontSize: '10px' }}
                    />
                    <YAxis 
                      stroke="#9ca3af"
                      style={{ fontSize: '12px' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    />
                    <Legend 
                      wrapperStyle={{ fontSize: '12px' }}
                    />
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

            {/* 最佳日期推荐 */}
            {topDays.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="text-yellow-500" size={20} />
                  历史最佳日期
                </h3>
                <div className="space-y-3">
                  {topDays.map((day, index) => (
                    <button
                      key={day.date}
                      onClick={() => {
                        // 修复：使用本地时区创建日期
                        const [year, month, dayNum] = day.date.split('-').map(Number);
                        const date = new Date(year, month - 1, dayNum, 12, 0, 0);
                        onSelectDate(date);
                        onClose();
                      }}
                      className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200 hover:border-yellow-400 transition text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
                          <div>
                            <div className="font-bold text-gray-800 flex items-center gap-2">
                              {day.emoji} {day.keyword}
                            </div>
                            <div className="text-xs text-gray-500">{day.label}</div>
                          </div>
                        </div>
                        <div className="text-3xl font-black text-yellow-600">
                          {day.score}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
                </div>
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
