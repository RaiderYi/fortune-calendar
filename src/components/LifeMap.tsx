// ==========================================
// 人生大图景 - 大运生命曲线组件
// 支持流年详解、重要年份标记、个性化建议
// ==========================================

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Calendar, Loader2, Star, Lightbulb, ChevronRight, AlertTriangle, Sparkles, BookOpen } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, ReferenceDot } from 'recharts';
import type { UserProfile } from './ProfileSettings';
import { useTranslation } from 'react-i18next';

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
  isImportant?: boolean;
  importantReason?: string;
  advice?: string;
}

interface YearDetail {
  year: number;
  ganZhi: string;
  score: number;
  analysis: string;
  advice: string[];
  luckyElements: string[];
  unluckyElements: string[];
  keyEvents: string[];
}

export default function LifeMap({
  isOpen,
  onClose,
  userProfile,
}: LifeMapProps) {
  const { t, i18n } = useTranslation(['ui', 'fortune']);
  const isEnglish = i18n.language === 'en';
  const [dayunData, setDayunData] = useState<DayunData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<'career' | 'wealth' | 'romance' | 'health' | 'overall'>('overall');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [yearDetail, setYearDetail] = useState<YearDetail | null>(null);
  const [showYearDetail, setShowYearDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'timeline' | 'advice'>('chart');

  // 计算未来10年的大运数据
  useEffect(() => {
    if (isOpen && userProfile) {
      setIsLoading(true);
      calculateDayunTrends();
    }
  }, [isOpen, userProfile]);

  // 标记重要年份（峰值、低谷、重大转折）
  const markImportantYears = (data: DayunData[]): DayunData[] => {
    if (data.length < 3) return data;
    
    // 找出峰值和低谷
    const overallValues = data.map(d => d.overall);
    const maxOverall = Math.max(...overallValues);
    const minOverall = Math.min(...overallValues);
    
    return data.map((item, index) => {
      const prev = data[index - 1]?.overall || item.overall;
      const next = data[index + 1]?.overall || item.overall;
      const current = item.overall;
      
      // 检测峰值
      if (current >= maxOverall - 5 && current > 65) {
        return {
          ...item,
          isImportant: true,
          importantReason: isEnglish ? 'Peak Year - Best Fortune' : '高峰年 - 运势最佳',
          advice: isEnglish 
            ? 'Seize opportunities, take on challenges' 
            : '把握机会，勇于挑战，是实现突破的最佳时机',
        };
      }
      
      // 检测低谷
      if (current <= minOverall + 5 && current < 45) {
        return {
          ...item,
          isImportant: true,
          importantReason: isEnglish ? 'Cautious Year - Lower Fortune' : '低谷年 - 运势较低',
          advice: isEnglish 
            ? 'Stay cautious, avoid major decisions' 
            : '谨慎行事，避免重大决策，养精蓄锐等待时机',
        };
      }
      
      // 检测转折点
      if (Math.abs(current - prev) > 15 || Math.abs(next - current) > 15) {
        return {
          ...item,
          isImportant: true,
          importantReason: isEnglish ? 'Turning Point Year' : '转折年 - 运势变化',
          advice: isEnglish 
            ? 'Adapt to changes, be flexible' 
            : '顺势而为，灵活应对变化',
        };
      }
      
      return item;
    });
  };

  // 生成个性化建议
  const generatePersonalizedAdvice = (data: DayunData[]): string[] => {
    const advice: string[] = [];
    const currentYear = new Date().getFullYear();
    
    // 分析整体趋势
    const firstHalf = data.slice(0, 5);
    const secondHalf = data.slice(5);
    const firstHalfAvg = firstHalf.reduce((sum, d) => sum + d.overall, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, d) => sum + d.overall, 0) / secondHalf.length;
    
    if (firstHalfAvg > secondHalfAvg + 5) {
      advice.push(isEnglish 
        ? `📈 The next 5 years (${currentYear}-${currentYear + 4}) show an upward trend - plan long-term goals now`
        : `📈 未来5年(${currentYear}-${currentYear + 4})呈上升趋势，宜制定长期规划`);
    } else if (secondHalfAvg > firstHalfAvg + 5) {
      advice.push(isEnglish
        ? `🌟 Fortune improves in later years - be patient and prepare for future opportunities`
        : `🌟 后期运势更佳，需耐心积累，为未来机会做好准备`);
    }
    
    // 找出最佳事业年
    const bestCareerYear = data.reduce((best, d) => d.career > best.career ? d : best, data[0]);
    advice.push(isEnglish
      ? `💼 Best career year: ${bestCareerYear.year} - focus on career development then`
      : `💼 事业最佳年份: ${bestCareerYear.year}年，可重点推进职业发展`);
    
    // 找出最佳财运年
    const bestWealthYear = data.reduce((best, d) => d.wealth > best.wealth ? d : best, data[0]);
    advice.push(isEnglish
      ? `💰 Best wealth year: ${bestWealthYear.year} - consider investments then`
      : `💰 财运最佳年份: ${bestWealthYear.year}年，可考虑投资理财`);
    
    // 健康提醒
    const lowHealthYears = data.filter(d => d.health < 50);
    if (lowHealthYears.length > 0) {
      const years = lowHealthYears.map(d => d.year).join(', ');
      advice.push(isEnglish
        ? `🏥 Pay attention to health in: ${years}`
        : `🏥 需注意健康的年份: ${years}，建议定期体检`);
    }
    
    return advice;
  };

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

      // 标记重要年份
      const markedData = markImportantYears(data);
      setDayunData(markedData);
    } catch (error) {
      console.error('计算大运趋势失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 生成流年详解
  const getYearDetail = (year: number): YearDetail | null => {
    const yearData = dayunData.find(d => d.year === year);
    if (!yearData) return null;

    const score = yearData.overall;
    let analysis = '';
    const advice: string[] = [];
    const luckyElements: string[] = [];
    const unluckyElements: string[] = [];
    const keyEvents: string[] = [];

    // 基于分数生成分析
    if (score >= 70) {
      analysis = isEnglish 
        ? `${year} is a year of great fortune with abundant opportunities for success.`
        : `${year}年运势极佳，是充满机遇的一年，各方面都将有所突破。`;
      advice.push(isEnglish ? 'Take on big challenges' : '可以挑战大项目');
      advice.push(isEnglish ? 'Good for investments' : '适合投资置业');
      luckyElements.push(isEnglish ? 'Career advancement' : '事业晋升');
      luckyElements.push(isEnglish ? 'Wealth accumulation' : '财富积累');
      keyEvents.push(isEnglish ? 'Possible promotion' : '可能有晋升机会');
    } else if (score >= 50) {
      analysis = isEnglish
        ? `${year} is a stable year with steady progress expected.`
        : `${year}年运势平稳，宜稳扎稳打，循序渐进。`;
      advice.push(isEnglish ? 'Maintain steady progress' : '保持稳定节奏');
      advice.push(isEnglish ? 'Focus on skill improvement' : '注重能力提升');
      luckyElements.push(isEnglish ? 'Personal growth' : '个人成长');
      keyEvents.push(isEnglish ? 'Steady development' : '平稳发展');
    } else {
      analysis = isEnglish
        ? `${year} requires caution. Focus on defense rather than offense.`
        : `${year}年需谨慎行事，宜守不宜攻，积蓄力量等待时机。`;
      advice.push(isEnglish ? 'Avoid major changes' : '避免重大变动');
      advice.push(isEnglish ? 'Focus on health' : '注意身体健康');
      unluckyElements.push(isEnglish ? 'Risk decisions' : '冒险决策');
      unluckyElements.push(isEnglish ? 'Major investments' : '大额投资');
      keyEvents.push(isEnglish ? 'Time for reflection' : '韬光养晦期');
    }

    // 基于各维度添加具体建议
    if (yearData.career >= 70) {
      advice.push(isEnglish ? '💼 Great year for career moves' : '💼 事业发展大好时机');
      keyEvents.push(isEnglish ? 'Career opportunities' : '事业机遇');
    }
    if (yearData.wealth >= 70) {
      advice.push(isEnglish ? '💰 Favorable for financial growth' : '💰 财运亨通');
    }
    if (yearData.romance >= 70) {
      advice.push(isEnglish ? '💕 Good for relationships' : '💕 感情和谐');
    }
    if (yearData.health < 50) {
      advice.push(isEnglish ? '🏥 Pay attention to health' : '🏥 注意身体保养');
      unluckyElements.push(isEnglish ? 'Health issues' : '健康问题');
    }

    return {
      year,
      ganZhi: yearData.ganZhi,
      score,
      analysis,
      advice,
      luckyElements,
      unluckyElements,
      keyEvents,
    };
  };

  // 点击年份查看详情
  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    const detail = getYearDetail(year);
    setYearDetail(detail);
    setShowYearDetail(true);
  };

  // 计算个性化建议
  const personalizedAdvice = useMemo(() => {
    if (dayunData.length === 0) return [];
    return generatePersonalizedAdvice(dayunData);
  }, [dayunData]);

  const dimensionConfig = {
    career: { label: t('fortune:dimensions.career'), color: '#f97316', icon: '💼' },
    wealth: { label: t('fortune:dimensions.wealth'), color: '#eab308', icon: '💰' },
    romance: { label: t('fortune:dimensions.romance'), color: '#ec4899', icon: '💕' },
    health: { label: t('fortune:dimensions.health'), color: '#10b981', icon: '🏥' },
    overall: { label: isEnglish ? 'Overall' : '综合', color: '#6366f1', icon: '📊' },
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
                  <h2 className="text-xl font-bold">{t('ui:lifemap.title')}</h2>
                  <p className="text-sm opacity-90">{t('ui:lifemap.description')}</p>
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
                  <p>{isEnglish ? 'No data available' : '暂无数据'}</p>
                </div>
              ) : (
                <>
                  {/* 标签页切换 */}
                  <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    {[
                      { id: 'chart', label: isEnglish ? 'Chart' : '图表', icon: TrendingUp },
                      { id: 'timeline', label: isEnglish ? 'Timeline' : '时间线', icon: Calendar },
                      { id: 'advice', label: isEnglish ? 'Advice' : '建议', icon: Lightbulb },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition ${
                          activeTab === tab.id
                            ? 'bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                      >
                        <tab.icon size={16} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* 图表视图 */}
                  {activeTab === 'chart' && (
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
                          formatter={(value: number) => [`${value}${isEnglish ? ' pts' : '分'}`, dimensionConfig[selectedDimension].label]}
                          labelFormatter={(label) => isEnglish ? `Year ${label}` : `${label}年`}
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
                      <div className="text-xs text-green-600 dark:text-green-400 mb-1">{isEnglish ? 'Best Year' : '最佳年份'}</div>
                      <div className="text-2xl font-black text-green-700 dark:text-green-300">{peakYear.year}</div>
                      <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                        {peakYear.ganZhi} · {peakYear.value}{isEnglish ? ' pts' : '分'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800">
                      <div className="text-xs text-amber-600 dark:text-amber-400 mb-1">{isEnglish ? 'Cautious Year' : '需谨慎年份'}</div>
                      <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{lowYear.year}</div>
                      <div className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                        {lowYear.ganZhi} · {lowYear.value}{isEnglish ? ' pts' : '分'}
                      </div>
                    </div>
                  </div>

                  {/* 趋势分析 */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      {isEnglish ? 'Trend Analysis' : '趋势分析'}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedDimension === 'career' && (
                        isEnglish ? (
                          <>
                            <p>• Career fortune peaks in {peakYear.year}, a golden time to advance important projects</p>
                            <p>• Be cautious in {lowYear.year}, avoid major changes</p>
                          </>
                        ) : (
                          <>
                            <p>• 事业运势在 {peakYear.year} 年达到峰值，是推进重要项目的黄金期</p>
                            <p>• {lowYear.year} 年需要谨慎决策，避免重大变动</p>
                          </>
                        )
                      )}
                      {selectedDimension === 'wealth' && (
                        isEnglish ? (
                          <>
                            <p>• Wealth fortune is strongest in {peakYear.year}, suitable for investment</p>
                            <p>• Control expenses in {lowYear.year}, avoid impulsive spending</p>
                          </>
                        ) : (
                          <>
                            <p>• 财运在 {peakYear.year} 年最为旺盛，适合投资理财</p>
                            <p>• {lowYear.year} 年需控制支出，避免冲动消费</p>
                          </>
                        )
                      )}
                      {selectedDimension === 'romance' && (
                        isEnglish ? (
                          <>
                            <p>• Romance fortune peaks in {peakYear.year}, harmonious relationships</p>
                            <p>• More communication needed in {lowYear.year} to maintain relationships</p>
                          </>
                        ) : (
                          <>
                            <p>• 感情运势在 {peakYear.year} 年达到高峰，人际关系和谐</p>
                            <p>• {lowYear.year} 年需多沟通，维护感情关系</p>
                          </>
                        )
                      )}
                      {selectedDimension === 'health' && (
                        isEnglish ? (
                          <>
                            <p>• Health fortune is best in {peakYear.year}, full of energy</p>
                            <p>• Pay attention to health maintenance in {lowYear.year}</p>
                          </>
                        ) : (
                          <>
                            <p>• 健康运势在 {peakYear.year} 年最佳，精力充沛</p>
                            <p>• {lowYear.year} 年需注意保养，定期体检</p>
                          </>
                        )
                      )}
                      {selectedDimension === 'overall' && (
                        isEnglish ? (
                          <>
                            <p>• Overall fortune peaks in {peakYear.year}, seize the opportunities</p>
                            <p>• Be cautious in {lowYear.year}, steady progress is key</p>
                          </>
                        ) : (
                          <>
                            <p>• 综合运势在 {peakYear.year} 年达到最佳，把握机会</p>
                            <p>• {lowYear.year} 年需谨慎行事，稳中求进</p>
                          </>
                        )
                      )}
                    </div>
                  </div>
                    </>
                  )}

                  {/* 时间线视图 */}
                  {activeTab === 'timeline' && (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {isEnglish ? 'Click on any year to view detailed analysis' : '点击年份查看详细分析'}
                      </p>
                      {dayunData.map((item, index) => {
                        const isCurrentYear = item.year === new Date().getFullYear();
                        return (
                          <motion.div
                            key={item.year}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleYearClick(item.year)}
                            className={`relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition hover:shadow-lg ${
                              isCurrentYear 
                                ? 'bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-300 dark:border-indigo-600'
                                : item.isImportant
                                ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700'
                                : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                            }`}
                          >
                            {/* 时间线指示器 */}
                            <div className="flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full ${
                                isCurrentYear ? 'bg-indigo-500' : item.isImportant ? 'bg-amber-500' : 'bg-gray-400'
                              }`} />
                              {index < dayunData.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-300 dark:bg-gray-600 mt-1" />
                              )}
                            </div>

                            {/* 年份信息 */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                  {item.year}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {item.ganZhi}
                                </span>
                                {isCurrentYear && (
                                  <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                                    {isEnglish ? 'Current' : '当前'}
                                  </span>
                                )}
                                {item.isImportant && (
                                  <Star size={16} className="text-amber-500" />
                                )}
                              </div>
                              
                              {/* 分数条 */}
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.overall}%` }}
                                    transition={{ delay: index * 0.05, duration: 0.5 }}
                                    className={`h-full rounded-full ${
                                      item.overall >= 70 ? 'bg-green-500' : 
                                      item.overall >= 50 ? 'bg-blue-500' : 
                                      item.overall >= 30 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                  />
                                </div>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 w-12">
                                  {Math.round(item.overall)}{isEnglish ? 'pts' : '分'}
                                </span>
                              </div>

                              {/* 重要年份标记说明 */}
                              {item.isImportant && item.importantReason && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                                  <AlertTriangle size={14} />
                                  {item.importantReason}
                                </div>
                              )}
                            </div>

                            <ChevronRight size={20} className="text-gray-400" />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* 个性化建议视图 */}
                  {activeTab === 'advice' && (
                    <div className="space-y-6">
                      {/* 整体建议 */}
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="text-indigo-500" size={20} />
                          <h3 className="font-bold text-indigo-700 dark:text-indigo-300">
                            {isEnglish ? 'Personalized Insights' : '个性化洞察'}
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {personalizedAdvice.map((advice, index) => (
                            <motion.p
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                            >
                              {advice}
                            </motion.p>
                          ))}
                        </div>
                      </div>

                      {/* 年度建议卡片 */}
                      <div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                          <BookOpen size={18} />
                          {isEnglish ? 'Year-by-Year Recommendations' : '年度建议'}
                        </h3>
                        <div className="grid gap-4">
                          {dayunData.filter(d => d.isImportant).map((item, index) => (
                            <motion.div
                              key={item.year}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                    {item.year}
                                  </span>
                                  <span className="text-sm text-gray-500">{item.ganZhi}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  item.overall >= 70 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : item.overall >= 50
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                }`}>
                                  {Math.round(item.overall)}{isEnglish ? ' pts' : '分'}
                                </span>
                              </div>
                              <p className="text-sm text-amber-600 dark:text-amber-400 mb-2">
                                ⚠️ {item.importantReason}
                              </p>
                              {item.advice && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  💡 {item.advice}
                                </p>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* 流年详解弹窗 */}
            <AnimatePresence>
              {showYearDetail && yearDetail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
                  onClick={() => setShowYearDetail(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                          {yearDetail.year} {isEnglish ? 'Year Analysis' : '年详解'}
                        </h3>
                        <p className="text-sm text-gray-500">{yearDetail.ganZhi}</p>
                      </div>
                      <button
                        onClick={() => setShowYearDetail(false)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* 总分 */}
                    <div className="text-center mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl">
                      <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                        {yearDetail.score}
                      </div>
                      <div className="text-sm text-gray-500">{isEnglish ? 'Overall Score' : '综合评分'}</div>
                    </div>

                    {/* 分析 */}
                    <div className="mb-4">
                      <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isEnglish ? 'Analysis' : '年度分析'}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {yearDetail.analysis}
                      </p>
                    </div>

                    {/* 建议 */}
                    {yearDetail.advice.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">
                          {isEnglish ? 'Recommendations' : '行动建议'}
                        </h4>
                        <ul className="space-y-2">
                          {yearDetail.advice.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-green-500">✓</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 幸运/注意事项 */}
                    <div className="grid grid-cols-2 gap-4">
                      {yearDetail.luckyElements.length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                          <h5 className="text-xs font-bold text-green-700 dark:text-green-400 mb-2">
                            {isEnglish ? 'Lucky Elements' : '幸运要素'}
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {yearDetail.luckyElements.map((item, index) => (
                              <span key={index} className="px-2 py-0.5 bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {yearDetail.unluckyElements.length > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                          <h5 className="text-xs font-bold text-red-700 dark:text-red-400 mb-2">
                            {isEnglish ? 'Avoid' : '注意事项'}
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {yearDetail.unluckyElements.map((item, index) => (
                              <span key={index} className="px-2 py-0.5 bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
