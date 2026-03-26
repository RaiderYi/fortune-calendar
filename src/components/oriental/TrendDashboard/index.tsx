/* ============================================
   趋势看板主组件
   Trend Dashboard Main Component
   ============================================ */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, BarChart3, Sparkles } from 'lucide-react';
import { TimeRangeTabs, TimeRange } from './TimeRangeTabs';
import { TrendChart, TrendDataPoint } from './TrendChart';
import { DualRadarChart } from '../FortuneCard/RadarChart';
import { DimensionData } from '../FortuneCard/RadarChart';
import { InsightCard, LuckyDayCard } from './InsightCard';
import { StaggerContainer, StaggerItem } from '../animations';

// 模拟数据生成器
const generateMockData = (days: number): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  const today = new Date();
  const themes = ['食神日', '偏财日', '正官日', '桃花日', '正印日'];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      dateLabel: `${date.getMonth() + 1}月${date.getDate()}日`,
      score: Math.floor(Math.random() * 30) + 65,
      theme: themes[Math.floor(Math.random() * themes.length)]
    });
  }
  
  return data;
};

// 模拟六维数据
const mockCurrentDimensions: DimensionData = {
  career: 78,
  wealth: 82,
  romance: 65,
  health: 88,
  academic: 72,
  travel: 85
};

const mockPreviousDimensions: DimensionData = {
  career: 72,
  wealth: 75,
  romance: 70,
  health: 85,
  academic: 68,
  travel: 80
};

// 洞察数据
const mockInsights = [
  {
    type: 'trend' as const,
    title: '财运上升趋势',
    content: '你的「财运」本周有上升趋势，特别是周三、周五的投资机会值得关注。',
    detail: '相比上周提升了7个百分点'
  },
  {
    type: 'tip' as const,
    title: '健康提醒',
    content: '健康运势较好，适合开始新的运动计划或调整作息。',
    detail: '建议保持当前的生活习惯'
  },
  {
    type: 'lucky-day' as const,
    title: '即将到来的吉日',
    content: '3月28日（周六）综合运势将达到本周高峰',
    score: 95,
    detail: '适合签约、出行、社交'
  }
];

interface TrendDashboardProps {
  className?: string;
}

export function TrendDashboard({ className = '' }: TrendDashboardProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [selectedPoint, setSelectedPoint] = useState<TrendDataPoint | null>(null);

  // 根据时间范围获取数据
  const getDaysFromRange = (range: TimeRange): number => {
    switch (range) {
      case '7days': return 7;
      case '30days': return 30;
      case '6months': return 30; // 简化为30天
      case 'year': return 30; // 简化为30天
      default: return 7;
    }
  };

  const trendData = generateMockData(getDaysFromRange(timeRange));

  // 计算变化
  const currentAvg = Math.round(
    Object.values(mockCurrentDimensions).reduce((a, b) => a + b, 0) / 6
  );
  const previousAvg = Math.round(
    Object.values(mockPreviousDimensions).reduce((a, b) => a + b, 0) / 6
  );
  const change = currentAvg - previousAvg;

  return (
    <div className={`min-h-screen bg-paper ${className}`}>
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-vermilion/10 flex items-center justify-center">
                <BarChart3 size={20} className="text-vermilion" />
              </div>
              <div>
                <h1 className="text-xl font-serif text-ink">运势轨迹</h1>
                <p className="text-xs text-light-ink font-serif">追踪你的运势变化趋势</p>
              </div>
            </div>
            
            {/* 时间范围切换 */}
            <TimeRangeTabs value={timeRange} onChange={setTimeRange} />
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <StaggerContainer staggerDelay={0.1}>
          {/* 趋势图表 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-base font-serif text-ink mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-vermilion" />
                运势趋势
              </h2>
              <TrendChart 
                data={trendData}
                height={240}
                onPointClick={setSelectedPoint}
              />
            </section>
          </StaggerItem>

          {/* 六维对比 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-serif text-ink flex items-center gap-2">
                  <Sparkles size={16} className="text-vermilion" />
                  六维对比
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-light-ink font-serif">综合评分</span>
                  <span className="text-lg font-serif text-ink">{currentAvg}</span>
                  <span className={`text-sm font-serif ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {change >= 0 ? '+' : ''}{change}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <DualRadarChart 
                  data1={mockCurrentDimensions}
                  data2={mockPreviousDimensions}
                  label1="本周"
                  label2="上周"
                  size={260}
                />
              </div>
            </section>
          </StaggerItem>

          {/* 洞察与建议 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <InsightCard insights={mockInsights} />
            </section>
          </StaggerItem>

          {/* 即将到来的吉日 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-base font-serif text-ink mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-vermilion" />
                吉日推荐
              </h2>
              <div className="space-y-3">
                <LuckyDayCard
                  date="3月28日"
                  weekday="周六"
                  score={95}
                  activities={['签约', '出行', '社交', '开业']}
                />
                <LuckyDayCard
                  date="3月30日"
                  weekday="周一"
                  score={88}
                  activities={['求职', '谈判', '学习']}
                />
              </div>
            </section>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* 选中日期的详情弹窗 */}
      {selectedPoint && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPoint(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif text-ink mb-2">{selectedPoint.dateLabel}</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-serif font-bold text-vermilion">
                {selectedPoint.score}
              </div>
              <div>
                <span className="text-sm text-light-ink font-serif block">运势评分</span>
                {selectedPoint.theme && (
                  <span className="text-sm text-vermilion font-serif">{selectedPoint.theme}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="w-full py-3 bg-vermilion/10 text-vermilion rounded-xl font-serif text-sm hover:bg-vermilion/20 transition-colors"
            >
              关闭
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default TrendDashboard;
