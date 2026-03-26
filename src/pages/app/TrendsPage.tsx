// ==========================================
// 运势轨迹 - 东方美学趋势分析页
// ==========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, BarChart3, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../contexts/AppContext';
import { 
  TrendDashboard as OrientalTrendDashboard,
  TimeRangeTabs,
  TrendChart,
  DualRadarChart,
  InsightCard,
  LuckyDayCard,
  StaggerContainer,
  StaggerItem,
  PageTransition 
} from '../../components/oriental';
import { DimensionData } from '../../components/oriental/FortuneCard/RadarChart';
import { TrendDataPoint } from '../../components/oriental/TrendDashboard/TrendChart';
import { InsightData } from '../../components/oriental/TrendDashboard/InsightCard';
import { getRecentTrends, getDimensionTrends, analyzeTrend, getTopDays } from '../../utils/trendsAnalysis';
import { updateAchievementProgress } from '../../utils/achievementStorage';

type TimeRange = '7days' | '30days' | '6months' | 'year';

// 将原有数据转换为新组件格式
const convertToDimensionData = (data: any): DimensionData => ({
  career: data.career || 70,
  wealth: data.wealth || 70,
  romance: data.romance || 70,
  health: data.health || 70,
  academic: data.academic || 70,
  travel: data.travel || 70
});

export default function TrendsPage() {
  const { t, i18n } = useTranslation(['ui', 'fortune']);
  const isEnglish = i18n.language === 'en';
  const navigate = useNavigate();
  const { setCurrentDate } = useAppContext();
  
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [currentDimensions, setCurrentDimensions] = useState<DimensionData>({
    career: 78, wealth: 82, romance: 65, health: 88, academic: 72, travel: 85
  });
  const [previousDimensions, setPreviousDimensions] = useState<DimensionData>({
    career: 72, wealth: 75, romance: 70, health: 85, academic: 68, travel: 80
  });
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [luckyDays, setLuckyDays] = useState<Array<{date: string; weekday: string; score: number; activities: string[]}>>([]);
  const [selectedPoint, setSelectedPoint] = useState<TrendDataPoint | null>(null);

  useEffect(() => {
    // 获取趋势数据
    const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 30;
    const trends = getRecentTrends(days);
    
    // 转换为新格式
    const convertedData: TrendDataPoint[] = trends.map(t => ({
      date: t.label || '',
      dateLabel: t.date || '',
      score: t.score || 70,
      theme: t.keyword || ''
    }));
    
    setTrendData(convertedData.length > 0 ? convertedData : generateMockData(days));
    
    // 获取维度数据
    const dimensions = getDimensionTrends(days);
    if (dimensions.length > 0) {
      setCurrentDimensions(convertToDimensionData(dimensions[dimensions.length - 1]));
      if (dimensions.length > 1) {
        setPreviousDimensions(convertToDimensionData(dimensions[dimensions.length - 2]));
      }
    }
    
    // 获取分析
    const analysis = analyzeTrend(days);
    const newInsights: InsightData[] = [
      {
        type: 'trend',
        title: isEnglish ? 'Fortune Trend' : '运势趋势',
        content: analysis?.suggestion || (isEnglish ? 'Your fortune shows steady progress.' : '你的运势呈现平稳上升趋势。'),
        detail: analysis?.trend === 'up' 
          ? (isEnglish ? 'Upward trend detected' : '检测到上升趋势')
          : analysis?.trend === 'down'
          ? (isEnglish ? 'Slight downward adjustment' : '略有下调')
          : (isEnglish ? 'Stable operation' : '运行平稳')
      },
      {
        type: 'tip',
        title: isEnglish ? 'Daily Advice' : '每日建议',
        content: isEnglish 
          ? 'Focus on your strengths and maintain a positive mindset.'
          : '关注自己的优势，保持积极心态。'
      }
    ];
    
    // 添加最佳日期
    const topDays = getTopDays(3);
    if (topDays.length > 0) {
      newInsights.push({
        type: 'lucky-day',
        title: isEnglish ? 'Best Day' : '最佳日期',
        content: `${topDays[0].date} ${topDays[0].keyword}`,
        score: topDays[0].score,
        detail: isEnglish ? 'Click to view details' : '点击查看详情'
      });
    }
    
    setInsights(newInsights);
    
    // 设置吉日
    setLuckyDays([
      { date: '3月28日', weekday: '周六', score: 95, activities: ['签约', '出行', '社交'] },
      { date: '3月30日', weekday: '周一', score: 88, activities: ['求职', '谈判'] }
    ]);
    
    // 更新成就
    const viewCount = parseInt(localStorage.getItem('trends_view_count') || '0') + 1;
    localStorage.setItem('trends_view_count', viewCount.toString());
    updateAchievementProgress('trends_view', viewCount);
  }, [timeRange, isEnglish]);

  // 生成模拟数据
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

  const handleSelectDate = (date: Date) => {
    setCurrentDate(date);
    navigate('/app/fortune/today');
  };

  const handlePointClick = (point: TrendDataPoint) => {
    setSelectedPoint(point);
  };

  // 数据不足提示
  if (trendData.length < 2) {
    return (
      <PageTransition className="min-h-screen bg-paper">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-paper-dark transition-colors"
            >
              <ChevronLeft size={20} className="text-ink" />
            </button>
            <h1 className="text-2xl font-serif text-ink">
              {isEnglish ? 'Trend Analysis' : '运势轨迹'}
            </h1>
          </div>
          
          <div className="bg-white rounded-2xl p-12 shadow-card text-center">
            <BarChart3 size={64} className="mx-auto mb-4 text-light-ink/30" />
            <h3 className="mb-2 text-xl font-serif text-ink">
              {isEnglish ? 'Not enough data' : '数据不足'}
            </h3>
            <p className="mb-6 text-light-ink font-serif">
              {isEnglish 
                ? 'Query at least 2 days of fortune to generate the trend chart.' 
                : '至少需要查询 2 天的运势才能生成趋势图哦！'}
            </p>
            <button
              onClick={() => navigate('/app/fortune/today')}
              className="px-6 py-3 bg-vermilion/10 border border-vermilion/40 text-vermilion rounded-full font-serif hover:bg-vermilion/20 transition-colors"
            >
              {isEnglish ? 'Query fortune' : '继续查询运势'}
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen bg-paper">
      {/* 顶部标题栏 */}
      <div className="bg-white border-b border-border-subtle">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl hover:bg-paper-dark transition-colors"
              >
                <ChevronLeft size={20} className="text-ink" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-vermilion/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-vermilion" />
              </div>
              <div>
                <h1 className="text-xl font-serif text-ink">
                  {isEnglish ? 'Trend Analysis' : '运势轨迹'}
                </h1>
                <p className="text-xs text-light-ink font-serif">
                  {isEnglish ? 'Track your fortune changes' : '追踪你的运势变化趋势'}
                </p>
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
              <h2 className="text-base font-serif text-ink mb-4">
                {isEnglish ? 'Fortune Trend' : '运势趋势'}
              </h2>
              <TrendChart 
                data={trendData}
                height={240}
                onPointClick={handlePointClick}
              />
            </section>
          </StaggerItem>

          {/* 六维对比 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-base font-serif text-ink mb-4">
                {isEnglish ? 'Six Dimensions' : '六维对比'}
              </h2>
              <div className="flex justify-center">
                <DualRadarChart 
                  data1={currentDimensions}
                  data2={previousDimensions}
                  label1={isEnglish ? 'Current' : '本期'}
                  label2={isEnglish ? 'Previous' : '上期'}
                  size={260}
                />
              </div>
            </section>
          </StaggerItem>

          {/* 洞察与建议 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <InsightCard insights={insights} />
            </section>
          </StaggerItem>

          {/* 吉日推荐 */}
          <StaggerItem>
            <section className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="text-base font-serif text-ink mb-4">
                {isEnglish ? 'Lucky Days' : '吉日推荐'}
              </h2>
              <div className="space-y-3">
                {luckyDays.map((day, index) => (
                  <LuckyDayCard key={index} {...day} />
                ))}
              </div>
            </section>
          </StaggerItem>
        </StaggerContainer>
      </div>

      {/* 选中日期的详情弹窗 */}
      {selectedPoint && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPoint(null)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-ink"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif text-ink mb-2">{selectedPoint.dateLabel}</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-serif font-bold text-vermilion">
                {selectedPoint.score}
              </div>
              <div>
                <span className="text-sm text-light-ink font-serif block">
                  {isEnglish ? 'Fortune Score' : '运势评分'}
                </span>
                {selectedPoint.theme && (
                  <span className="text-sm text-vermilion font-serif">{selectedPoint.theme}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedPoint(null)}
              className="w-full py-3 bg-vermilion/10 text-vermilion rounded-xl font-serif text-sm hover:bg-vermilion/20 transition-colors"
            >
              {isEnglish ? 'Close' : '关闭'}
            </button>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
