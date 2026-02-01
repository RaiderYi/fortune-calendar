// ==========================================
// 人生大图景 - 大运生命曲线组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { UserProfile } from './ProfileSettings';

interface LifeMapProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

interface DayunData {
  year: number;
  ganZhi: string;
  career: number;
  wealth: number;
  romance: number;
  health: number;
  overall: number;
}

export default function LifeMap({
  isOpen,
  onClose,
  userProfile,
}: LifeMapProps) {
  const [dayunData, setDayunData] = useState<DayunData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<'career' | 'wealth' | 'romance' | 'health' | 'overall'>('overall');

  // 计算未来10年的大运数据
  useEffect(() => {
    if (isOpen && userProfile) {
      setIsLoading(true);
      calculateDayunTrends();
    }
  }, [isOpen, userProfile]);

  const calculateDayunTrends = async () => {
    try {
      // 获取当前年份
      const currentYear = new Date().getFullYear();
      const data: DayunData[] = [];

      // 模拟计算未来10年的大运趋势
      // 实际应该调用后端API，这里先用模拟数据
      for (let i = 0; i < 10; i++) {
        const year = currentYear + i;
        
        // 调用API获取该年的运势（使用年初日期）
        try {
          const dateStr = `${year}-01-15`; // 使用年初日期
          const res = await fetch('/api/fortune', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              date: dateStr,
              birthDate: userProfile.birthDate,
              birthTime: userProfile.birthTime,
              longitude: userProfile.longitude || 116.4,
              gender: userProfile.gender || 'male',
            }),
          });

          if (res.ok) {
            const fortune = await res.json();
            const liuNian = fortune.liuNian;
            
            data.push({
              year,
              ganZhi: liuNian?.year || `${year}年`,
              career: fortune.dimensions?.career?.score || 50,
              wealth: fortune.dimensions?.wealth?.score || 50,
              romance: fortune.dimensions?.romance?.score || 50,
              health: fortune.dimensions?.health?.score || 50,
              overall: fortune.totalScore || 50,
            });
          } else {
            // 如果API失败，使用模拟数据
            data.push({
              year,
              ganZhi: `${year}年`,
              career: 50 + Math.sin(i * 0.5) * 20,
              wealth: 50 + Math.cos(i * 0.5) * 20,
              romance: 50 + Math.sin(i * 0.7) * 15,
              health: 50 + Math.cos(i * 0.6) * 15,
              overall: 50 + Math.sin(i * 0.4) * 20,
            });
          }
        } catch (error) {
          // 使用模拟数据
          data.push({
            year,
            ganZhi: `${year}年`,
            career: 50 + Math.sin(i * 0.5) * 20,
            wealth: 50 + Math.cos(i * 0.5) * 20,
            romance: 50 + Math.sin(i * 0.7) * 15,
            health: 50 + Math.cos(i * 0.6) * 15,
            overall: 50 + Math.sin(i * 0.4) * 20,
          });
        }
      }

      setDayunData(data);
    } catch (error) {
      console.error('计算大运趋势失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const dimensionConfig = {
    career: { label: '事业', color: '#f97316', icon: '💼' },
    wealth: { label: '财运', color: '#eab308', icon: '💰' },
    romance: { label: '感情', color: '#ec4899', icon: '💕' },
    health: { label: '健康', color: '#10b981', icon: '🏥' },
    overall: { label: '综合', color: '#6366f1', icon: '📊' },
  };

  const chartData = dayunData.map((item) => ({
    year: item.year,
    value: Math.round(item[selectedDimension]),
    ganZhi: item.ganZhi,
  }));

  // 找出峰值和低谷
  const peakYear = chartData.reduce((max, item) => (item.value > max.value ? item : max), chartData[0] || { year: 0, value: 0 });
  const lowYear = chartData.reduce((min, item) => (item.value < min.value ? item : min), chartData[0] || { year: 0, value: 100 });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:z-50 backdrop-blur-sm"
          />

          {/* 抽屉/弹窗 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col lg:rounded-l-2xl"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <TrendingUp size={24} />
                <div>
                  <h2 className="text-xl font-bold">人生大图景</h2>
                  <p className="text-sm opacity-90">未来十年运势趋势</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                </div>
              ) : dayunData.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>暂无数据</p>
                </div>
              ) : (
                <>
                  {/* 维度选择 */}
                  <div className="grid grid-cols-5 gap-2 mb-6">
                    {(Object.keys(dimensionConfig) as Array<keyof typeof dimensionConfig>).map((key) => {
                      const config = dimensionConfig[key];
                      const isSelected = selectedDimension === key;
                      return (
                        <motion.button
                          key={key}
                          onClick={() => setSelectedDimension(key)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 rounded-xl text-sm font-medium transition ${
                            isSelected
                              ? 'bg-indigo-500 text-white shadow-lg'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="text-lg mb-1">{config.icon}</div>
                          <div>{config.label}</div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* 图表 */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="year"
                          stroke="#6b7280"
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <YAxis
                          domain={[0, 100]}
                          stroke="#6b7280"
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value}分`, dimensionConfig[selectedDimension].label]}
                          labelFormatter={(label) => `${label}年`}
                        />
                        <ReferenceLine y={50} stroke="#9ca3af" strokeDasharray="3 3" />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke={dimensionConfig[selectedDimension].color}
                          strokeWidth={3}
                          dot={{ fill: dimensionConfig[selectedDimension].color, r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 关键节点 */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="text-xs text-green-600 dark:text-green-400 mb-1">最佳年份</div>
                      <div className="text-2xl font-black text-green-700 dark:text-green-300">{peakYear.year}</div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {peakYear.ganZhi} · {peakYear.value}分
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                      <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">需谨慎年份</div>
                      <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{lowYear.year}</div>
                      <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                        {lowYear.ganZhi} · {lowYear.value}分
                      </div>
                    </div>
                  </div>

                  {/* 趋势分析 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">趋势分析</h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedDimension === 'career' && (
                        <>
                          <p>• 事业运势在 {peakYear.year} 年达到峰值，是推进重要项目的黄金期</p>
                          <p>• {lowYear.year} 年需要谨慎决策，避免重大变动</p>
                        </>
                      )}
                      {selectedDimension === 'wealth' && (
                        <>
                          <p>• 财运在 {peakYear.year} 年最为旺盛，适合投资理财</p>
                          <p>• {lowYear.year} 年需控制支出，避免冲动消费</p>
                        </>
                      )}
                      {selectedDimension === 'romance' && (
                        <>
                          <p>• 感情运势在 {peakYear.year} 年达到高峰，人际关系和谐</p>
                          <p>• {lowYear.year} 年需多沟通，维护感情关系</p>
                        </>
                      )}
                      {selectedDimension === 'health' && (
                        <>
                          <p>• 健康运势在 {peakYear.year} 年最佳，精力充沛</p>
                          <p>• {lowYear.year} 年需注意保养，定期体检</p>
                        </>
                      )}
                      {selectedDimension === 'overall' && (
                        <>
                          <p>• 综合运势在 {peakYear.year} 年达到最佳，把握机会</p>
                          <p>• {lowYear.year} 年需谨慎行事，稳中求进</p>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
