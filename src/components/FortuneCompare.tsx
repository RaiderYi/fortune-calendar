// ==========================================
// 运势对比组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, TrendingUp, BarChart3, Radar } from 'lucide-react';
import { getHistory, type HistoryRecord } from '../utils/historyStorage';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface FortuneCompareProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
}

interface CompareData {
  date: string;
  totalScore: number;
  dimensions: {
    career: number;
    wealth: number;
    romance: number;
    health: number;
    academic: number;
    travel: number;
  };
}

export default function FortuneCompare({
  isOpen,
  onClose,
  onSelectDate,
}: FortuneCompareProps) {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<CompareData[]>([]);
  const [viewMode, setViewMode] = useState<'radar' | 'bar'>('radar');

  useEffect(() => {
    if (isOpen) {
      loadCompareData();
    }
  }, [isOpen, selectedDates]);

  const loadCompareData = () => {
    const history = getHistory();
    const data: CompareData[] = selectedDates
      .map(dateStr => {
        const record = history.find(h => h.date === dateStr);
        if (!record) return null;
        return {
          date: dateStr,
          totalScore: record.fortune.totalScore,
          dimensions: {
            career: record.fortune.dimensions.career.score,
            wealth: record.fortune.dimensions.wealth.score,
            romance: record.fortune.dimensions.romance.score,
            health: record.fortune.dimensions.health.score,
            academic: record.fortune.dimensions.academic.score,
            travel: record.fortune.dimensions.travel.score,
          },
        };
      })
      .filter((d): d is CompareData => d !== null);
    setCompareData(data);
  };

  const handleDateToggle = (dateStr: string) => {
    setSelectedDates(prev => {
      if (prev.includes(dateStr)) {
        return prev.filter(d => d !== dateStr);
      } else if (prev.length < 3) {
        return [...prev, dateStr];
      } else {
        // 最多选择3个日期，替换最后一个
        return [prev[0], prev[1], dateStr];
      }
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00');
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 准备雷达图数据
  const radarData = [
    { dimension: '事业', ...compareData.reduce((acc, item) => {
      acc[formatDate(item.date)] = item.dimensions.career;
      return acc;
    }, {} as Record<string, number>) },
    { dimension: '财运', ...compareData.reduce((acc, item) => {
      acc[formatDate(item.date)] = item.dimensions.wealth;
      return acc;
    }, {} as Record<string, number>) },
    { dimension: '情感', ...compareData.reduce((acc, item) => {
      acc[formatDate(item.date)] = item.dimensions.romance;
      return acc;
    }, {} as Record<string, number>) },
    { dimension: '健康', ...compareData.reduce((acc, item) => {
      acc[formatDate(item.date)] = item.dimensions.health;
      return acc;
    }, {} as Record<string, number>) },
    { dimension: '学业', ...compareData.reduce((acc, item) => {
      acc[formatDate(item.date)] = item.dimensions.academic;
      return acc;
    }, {} as Record<string, number>) },
    { dimension: '出行', ...compareData.reduce((acc, item) => {
      acc[formatDate(item.date)] = item.dimensions.travel;
      return acc;
    }, {} as Record<string, number>) },
  ];

  // 准备柱状图数据
  const barData = [
    { name: '事业', ...compareData.reduce((acc, item, idx) => {
      acc[formatDate(item.date)] = item.dimensions.career;
      return acc;
    }, {} as Record<string, number>) },
    { name: '财运', ...compareData.reduce((acc, item, idx) => {
      acc[formatDate(item.date)] = item.dimensions.wealth;
      return acc;
    }, {} as Record<string, number>) },
    { name: '情感', ...compareData.reduce((acc, item, idx) => {
      acc[formatDate(item.date)] = item.dimensions.romance;
      return acc;
    }, {} as Record<string, number>) },
    { name: '健康', ...compareData.reduce((acc, item, idx) => {
      acc[formatDate(item.date)] = item.dimensions.health;
      return acc;
    }, {} as Record<string, number>) },
    { name: '学业', ...compareData.reduce((acc, item, idx) => {
      acc[formatDate(item.date)] = item.dimensions.academic;
      return acc;
    }, {} as Record<string, number>) },
    { name: '出行', ...compareData.reduce((acc, item, idx) => {
      acc[formatDate(item.date)] = item.dimensions.travel;
      return acc;
    }, {} as Record<string, number>) },
  ];

  const history = getHistory();
  const dimensionLabels = ['事业', '财运', '情感', '健康', '学业', '出行'];
  const dimensionKeys = ['career', 'wealth', 'romance', 'health', 'academic', 'travel'] as const;

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
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 对比抽屉/Modal - 移动端底部抽屉，PC端居中Modal */}
          <motion.div
            initial={{ y: '100%', scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-4 bg-white lg:bg-transparent rounded-t-3xl lg:rounded-3xl shadow-2xl z-[90] max-h-[90vh] lg:max-w-6xl lg:w-full overflow-hidden flex flex-col pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white lg:rounded-3xl lg:shadow-2xl lg:w-full lg:max-h-[90vh] flex flex-col overflow-hidden"
            >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">运势对比</h2>
                    <p className="text-white/90 text-sm">
                      选择最多3个日期进行对比
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X size={20} className="text-white" />
                </motion.button>
              </div>

              {/* 视图切换 */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => setViewMode('radar')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'radar'
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <Radar size={16} className="inline mr-1" />
                  雷达图
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('bar')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    viewMode === 'bar'
                      ? 'bg-white text-indigo-600'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <BarChart3 size={16} className="inline mr-1" />
                  柱状图
                </motion.button>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedDates.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Calendar size={48} className="mx-auto mb-4 opacity-30" />
                  <p>请从历史记录中选择日期进行对比</p>
                </div>
              ) : (
                <>
                  {/* 选中的日期 */}
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-500 mb-3">已选择日期</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedDates.map(dateStr => {
                        const record = history.find(h => h.date === dateStr);
                        return (
                          <motion.button
                            key={dateStr}
                            onClick={() => handleDateToggle(dateStr)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2"
                          >
                            {formatDate(dateStr)}
                            <span className="text-xs">({record?.fortune.totalScore}分)</span>
                            <X size={14} />
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 对比图表 */}
                  {compareData.length > 0 && (
                    <div className="mb-6">
                      {viewMode === 'radar' ? (
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <ResponsiveContainer width="100%" height={300}>
                            <RadarChart data={radarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="dimension" />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} />
                              {compareData.map((item, idx) => {
                                const colors = ['#3b82f6', '#8b5cf6', '#ec4899'];
                                return (
                                  <RechartsRadar
                                    key={idx}
                                    name={formatDate(item.date)}
                                    dataKey={formatDate(item.date)}
                                    stroke={colors[idx % colors.length]}
                                    fill={colors[idx % colors.length]}
                                    fillOpacity={0.3}
                                  />
                                );
                              })}
                              <Legend />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="bg-gray-50 rounded-2xl p-4">
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis domain={[0, 100]} />
                              <Tooltip />
                              <Legend />
                              {compareData.map((item, idx) => {
                                const colors = ['#3b82f6', '#8b5cf6', '#ec4899'];
                                return (
                                  <Bar
                                    key={idx}
                                    dataKey={formatDate(item.date)}
                                    fill={colors[idx % colors.length]}
                                    name={formatDate(item.date)}
                                  />
                                );
                              })}
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 详细对比表格 */}
                  {compareData.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-4">
                      <h3 className="text-sm font-bold text-gray-500 mb-3">详细对比</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 text-gray-600">维度</th>
                              {compareData.map((item, idx) => (
                                <th key={idx} className="text-center py-2 text-gray-600">
                                  {formatDate(item.date)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-200">
                              <td className="py-2 font-medium text-gray-700">总分</td>
                              {compareData.map((item, idx) => (
                                <td key={idx} className="text-center py-2 font-bold text-indigo-600">
                                  {item.totalScore}
                                </td>
                              ))}
                            </tr>
                            {dimensionKeys.map((key, dimIdx) => (
                              <tr key={key} className="border-b border-gray-200">
                                <td className="py-2 text-gray-700">{dimensionLabels[dimIdx]}</td>
                                {compareData.map((item, dateIdx) => {
                                  const score = item.dimensions[key];
                                  const maxScore = Math.max(...compareData.map(d => d.dimensions[key]));
                                  return (
                                    <td key={dateIdx} className="text-center py-2">
                                      <div className="flex items-center justify-center gap-2">
                                        <span className={`font-medium ${
                                          score === maxScore ? 'text-indigo-600 font-bold' : 'text-gray-600'
                                        }`}>
                                          {score}
                                        </span>
                                        {score === maxScore && (
                                          <span className="text-xs text-indigo-600">🏆</span>
                                        )}
                                      </div>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 历史记录列表 */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-500 mb-3">选择日期</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.slice(0, 20).map((record) => {
                    const isSelected = selectedDates.includes(record.date);
                    return (
                      <motion.button
                        key={record.date}
                        onClick={() => handleDateToggle(record.date)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!isSelected && selectedDates.length >= 3}
                        className={`w-full p-3 rounded-xl text-left transition-colors ${
                          isSelected
                            ? 'bg-indigo-100 border-2 border-indigo-500'
                            : selectedDates.length >= 3
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-800">{record.date}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {record.fortune.mainTheme.keyword} · {record.fortune.totalScore}分
                            </div>
                          </div>
                          {isSelected && (
                            <div className="text-indigo-600 font-bold">✓</div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
