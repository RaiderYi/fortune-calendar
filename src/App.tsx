import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import FortuneCard from './components/FortuneCard';
import DimensionCard from './components/DimensionCard';
import HistoryDrawer from './components/HistoryDrawer';
import TrendsView from './components/TrendsView';
import CalendarView from './components/CalendarView';
import CalendarWidget from './components/CalendarWidget';
import Onboarding from './components/Onboarding';
import ProfileSettings from './components/ProfileSettings';
import type { UserProfile } from './components/ProfileSettings';
import CheckinModal from './components/CheckinModal';
import AchievementView from './components/AchievementView';
import FortuneCompare from './components/FortuneCompare';
import KnowledgeBase from './components/KnowledgeBase';
import FeedbackModal from './components/FeedbackModal';
import AIDeduction from './components/AIDeduction';
import BottomNav, { type TabType } from './components/BottomNav';
import TodayPage from './components/TodayPage';
import CalendarPage from './components/CalendarPage';
import MyPage from './components/MyPage';
import DailySignThemeSelector, { type DailySignTheme } from './components/DailySignThemeSelector';
import TimeEnergyBall from './components/TimeEnergyBall';
import { updateAchievements, checkNewUnlocks } from './utils/achievementStorage';
import { saveHistory } from './utils/historyStorage';
import type { HistoryRecord } from './utils/historyStorage';
import { useToast } from './contexts/ToastContext';
import { SkeletonFortuneCard, SkeletonDimensionCard } from './components/SkeletonLoader';
import {
  Share2, Eye, EyeOff, Sparkles,  // ← Sparkles 必须保留
  Briefcase, Coins, Heart, Zap, BookOpen, Map, TrendingUp,
  Crown, Loader2, X, Download, MapPin
} from 'lucide-react';
import { toPng } from 'html-to-image';
import { CITY_LONGITUDE_MAP } from './utils/cityData';
// 常量与配置
// ==========================================

// 常用城市经度表 (用于真太阳时校准) - 已扩展到330+个城市
const CHINA_CITIES = CITY_LONGITUDE_MAP;

// 安全颜色映射表 (解决 html2canvas 不支持 oklch 颜色的问题)
const SAFE_THEMES: Record<string, { bg: string, text: string }> = {
  '食神': { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', text: '#7c2d12' },
  '松弛': { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', text: '#7c2d12' },

  '偏财': { bg: 'linear-gradient(135deg, #fef08a 0%, #fcd34d 100%)', text: '#78350f' },
  '吸金': { bg: 'linear-gradient(135deg, #fef08a 0%, #fcd34d 100%)', text: '#78350f' },
  '破财': { bg: 'linear-gradient(135deg, #fef08a 0%, #fcd34d 100%)', text: '#78350f' },

  '七杀': { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', text: '#f1f5f9' },
  '气场': { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', text: '#f1f5f9' },
  '硬刚': { bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', text: '#f1f5f9' },

  '桃花': { bg: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)', text: '#881337' },
  '万人迷': { bg: 'linear-gradient(135deg, #fbcfe8 0%, #fda4af 100%)', text: '#881337' },

  '正印': { bg: 'linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 100%)', text: '#581c87' },
  '锦鲤': { bg: 'linear-gradient(135deg, #e9d5ff 0%, #c4b5fd 100%)', text: '#581c87' },

  // 默认兜底
  'default': { bg: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)', text: '#1f2937' }
};

// ==========================================
// 类型定义
// ==========================================

type DimensionType = 'career' | 'wealth' | 'romance' | 'health' | 'academic' | 'travel';

interface DimensionAnalysis {
  score: number;
  level: '吉' | '平' | '凶' | '大吉';
  tag: string;
  inference: string;
}

interface BaziDetail {
  year: string;
  month: string;
  day: string;
  hour: string;
  dayMaster: string;
}

interface YongShen {
  strength: string;
  yongShen: string[];
  xiShen: string[];
  jiShen: string[];
  tenGods?: string[];
  isCustom?: boolean; // 标记是否为自定义用神
}

interface DaYun {
  index: number;
  start_year: number;
  end_year: number;
  gan_zhi: string;
  gan: string;
  zhi: string;
  age: number;
}

interface LiuNian {
  year: string;
  month: string;
  day: string;
  yearGan: string;
  yearZhi: string;
  monthGan: string;
  monthZhi: string;
  dayGan: string;
  dayZhi: string;
}

interface DailyFortune {
  dateObj: Date;
  dateStr: string;
  lunarStr: string;
  weekDay: string;
  totalScore: number;
  pillars: { year: string; month: string; day: string; };
  mainTheme: {
    keyword: string;
    subKeyword: string;
    emoji: string;
    description: string;
  };
  dimensions: { [key in DimensionType]: DimensionAnalysis; };
  todo: { label: string; content: string; type: 'up' | 'down'; }[];
  baziDetail?: BaziDetail;
  yongShen?: YongShen;
  daYun?: DaYun;
  shenSha?: string[];
  liuNian?: LiuNian;
  todayTenGod?: string;
}

// ==========================================
// 主组件
// ==========================================

export default function App() {
  const { showToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [showBazi, setShowBazi] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    const completed = localStorage.getItem('onboarding_completed');
    return !completed;
  });

  // UI 状态
  const [currentThemeStyle, setCurrentThemeStyle] = useState(SAFE_THEMES['default']);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // 历史记录抽屉
  const [showTrends, setShowTrends] = useState(false); // 趋势视图
  const [showCalendar, setShowCalendar] = useState(false); // 日历视图
  const [showCheckin, setShowCheckin] = useState(false); // 签到弹窗
  const [showAchievements, setShowAchievements] = useState(false); // 成就展示
  const [showCompare, setShowCompare] = useState(false); // 运势对比
  const [showKnowledge, setShowKnowledge] = useState(false); // 知识库
  const [showFeedback, setShowFeedback] = useState(false); // 反馈弹窗
  const [showAIDeduction, setShowAIDeduction] = useState(false); // AI 推演
  const [aiInitialQuestion, setAiInitialQuestion] = useState<string | undefined>(undefined); // AI 预设问题
  const [currentTab, setCurrentTab] = useState<TabType>('today'); // 当前 Tab

  // 用户数据状态
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    // 初始化默认值，增加北京作为默认地点
    return saved ? JSON.parse(saved) : {
      name: '张三',
      birthDate: '1995-08-15',
      birthTime: '09:30',
      city: '北京',
      longitude: '116.40',
      gender: 'male' // 新增：默认性别为男
    };
  });

  // 截图相关
  const contentRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dailySignTheme, setDailySignTheme] = useState<DailySignTheme>('minimal');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [customYongShen, setCustomYongShen] = useState<string | null>(null); // 用户自定义用神

  // --- 核心：调用后端接口 ---
  useEffect(() => {
    const fetchFortune = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // 相对路径请求，Vercel 会处理
        const res = await fetch('/api/fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: dateStr,
            birthDate: userProfile.birthDate,
            birthTime: userProfile.birthTime,
            longitude: userProfile.longitude, // 传递经度给后端计算真太阳时
            gender: userProfile.gender, // 新增：传递性别给后端
            customYongShen: customYongShen // 新增：传递用户自定义用神
          }),
        });

        if (res.ok) {
          const backendData = await res.json();
          setFortune({ ...backendData, dateObj: currentDate });

          // 更新成就进度（查询运势）
          try {
            const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
            const queryCount = history.length + 1;
            updateAchievements({
              query_10: queryCount,
              query_50: queryCount,
              query_100: queryCount,
            });
            
            // 检查是否有新解锁的成就
            const newUnlocks = checkNewUnlocks();
            if (newUnlocks.length > 0) {
              // 可以显示成就解锁通知
              console.log('新解锁成就:', newUnlocks);
            }
          } catch (error) {
            console.error('更新成就失败:', error);
          }

          // 保存到历史记录
          const historyRecord: HistoryRecord = {
            date: dateStr, // YYYY-MM-DD
            timestamp: Date.now(),
            fortune: {
              totalScore: backendData.totalScore,
              mainTheme: {
                keyword: backendData.mainTheme.keyword,
                emoji: backendData.mainTheme.emoji,
              },
              dimensions: {
                career: { score: backendData.dimensions.career.score },
                wealth: { score: backendData.dimensions.wealth.score },
                romance: { score: backendData.dimensions.romance.score },
                health: { score: backendData.dimensions.health.score },
                academic: { score: backendData.dimensions.academic.score },
                travel: { score: backendData.dimensions.travel.score },
              },
            },
          };
          saveHistory(historyRecord);

          // 颜色映射逻辑
          const keyword = backendData.mainTheme.keyword;
          let themeKey = 'default';
          // 关键词模糊匹配
          if (['松弛', '食神', '叛逆', '伤官'].some(k => keyword.includes(k))) themeKey = '食神';
          else if (['吸金', '偏财', '搬砖', '正财', '破财'].some(k => keyword.includes(k))) themeKey = '偏财';
          else if (['气场', '七杀', '硬刚', '比肩'].some(k => keyword.includes(k))) themeKey = '七杀';
          else if (['万人迷', '桃花', '上岸', '正官'].some(k => keyword.includes(k))) themeKey = '桃花';
          else if (['锦鲤', '正印', '脑洞', '偏印'].some(k => keyword.includes(k))) themeKey = '正印';

          setCurrentThemeStyle(SAFE_THEMES[themeKey] || SAFE_THEMES['default']);

        } else {
          console.error("后端返回错误");
        }
      } catch (error) {
        console.error("连接后端失败", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFortune();
  }, [currentDate, userProfile, customYongShen]); // 添加 customYongShen 依赖，当用神改变时重新获取数据

  // --- 截图逻辑（使用html-to-image，完美支持lab颜色）---
  const handleGenerateImage = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      const originalShowBazi = showBazi;
      if (!showBazi) setShowBazi(true);
      
      // 应用主题样式
      const themeClass = `daily-sign-theme-${dailySignTheme}`;
      contentRef.current.classList.add(themeClass);
      
      // 等待DOM更新
      await new Promise(resolve => setTimeout(resolve, 300));

      // 根据主题设置背景色
      let backgroundColor = '#F5F5F7';
      if (dailySignTheme === 'zen') {
        backgroundColor = '#faf8f3'; // 米白色，类似宣纸
      } else if (dailySignTheme === 'minimal') {
        backgroundColor = '#ffffff'; // 纯白
      } else if (dailySignTheme === 'oracle') {
        backgroundColor = '#1a1a2e'; // 深色神秘
      }

      // 使用 html-to-image（原生支持所有现代CSS颜色）
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor,
        filter: (node) => {
          // 过滤不需要截图的元素
          if (node.classList) {
            return !node.classList.contains('no-screenshot');
          }
          return true;
        },
      });

      // 移除主题样式
      contentRef.current.classList.remove(themeClass);
      
      setGeneratedImage(dataUrl);
      setShowBazi(originalShowBazi);
      showToast('日签生成成功！', 'success');
      console.log('✅ 截图成功！');

    } catch (error: any) {
      console.error('截图失败:', error);
      showToast('截图功能暂时不可用，请稍后再试', 'error');
      setIsGenerating(false);
    }
  };


  // --- 保存设置 ---
  const handleSaveSettings = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('user_profile', JSON.stringify(profile));
  };

  // --- 日期切换 ---
  const changeDate = (days: number) => {
    setSlideDirection(days > 0 ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + days);
      setCurrentDate(newDate);
      setIsAnimating(false);
      setTimeout(() => setSlideDirection(null), 300);
    }, 200);
  };


  // 格式化日期为 YYYY-MM-DD 供 input 使用
  const formattedDateValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  // 完成引导
  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  // 跳过引导
  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800 select-none overflow-hidden">
      {/* 首次使用引导 */}
      {showOnboarding && (
        <Onboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* 响应式布局容器：移动端单列，PC端三栏 */}
      <div className="w-full max-w-[448px] lg:max-w-7xl mx-auto bg-[#F5F5F7] dark:bg-slate-900 min-h-screen flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6 relative lg:shadow-2xl">
        
        {/* ========== 移动端：单列布局 ========== */}
        <div className="flex flex-col lg:hidden min-h-screen">
          {/* --- 顶部导航（仅在今日Tab显示） --- */}
          {currentTab === 'today' && (
            <>
              <Header
                userName={userProfile.name}
                onSettingsClick={() => {
                  setIsSettingsOpen(true);
                  setCurrentTab('my');
                }}
                onHistoryClick={() => setCurrentTab('calendar')}
                onTrendsClick={() => setCurrentTab('calendar')}
                onCalendarClick={() => setCurrentTab('calendar')}
                onCheckinClick={() => {
                  setShowCheckin(true);
                  setCurrentTab('my');
                }}
                onAchievementClick={() => {
                  setShowAchievements(true);
                  setCurrentTab('my');
                }}
                onKnowledgeClick={() => {
                  setShowKnowledge(true);
                  setCurrentTab('my');
                }}
                onAIClick={() => {
                  setAiInitialQuestion(undefined);
                  setShowAIDeduction(true);
                }}
              />

              {/* --- 日期选择 --- */}
              <DateSelector
                currentDate={currentDate}
                weekDay={fortune?.weekDay}
                lunarStr={fortune?.lunarStr}
                onPrevDay={() => changeDate(-1)}
                onNextDay={() => changeDate(1)}
                onDateChange={setCurrentDate}
              />
            </>
          )}

          {/* 时辰能量球 */}
          {currentTab === 'today' && fortune && (
            <TimeEnergyBall
              currentTime={new Date()}
              dayMaster={fortune.baziDetail?.dayMaster}
            />
          )}

          {/* --- Tab 内容区 --- */}
          <AnimatePresence mode="wait">
            {currentTab === 'today' && (
              <motion.div
                key="today"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <TodayPage
                  fortune={fortune}
                  isLoading={isLoading}
                  currentDate={currentDate}
                  slideDirection={slideDirection}
                  showBazi={showBazi}
                  onToggleBazi={() => setShowBazi(!showBazi)}
                  currentThemeStyle={currentThemeStyle}
                  onFeedbackClick={() => setShowFeedback(true)}
                  onAIClick={() => {
                  setAiInitialQuestion(undefined);
                  setShowAIDeduction(true);
                }}
                  onGenerateImage={handleGenerateImage}
                  isGenerating={isGenerating}
                  contentRef={contentRef}
                  customYongShen={customYongShen}
                  onCustomYongShenChange={setCustomYongShen}
                  dailySignTheme={dailySignTheme}
                  onThemeChange={setDailySignTheme}
                  showThemeSelector={showThemeSelector}
                  onToggleThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
                  baziContext={fortune ? {
                    baziDetail: fortune.baziDetail,
                    yongShen: fortune.yongShen,
                    dimensions: fortune.dimensions,
                    mainTheme: fortune.mainTheme,
                    totalScore: fortune.totalScore,
                    liuNian: fortune.liuNian,
                  } : undefined}
                />
              </motion.div>
            )}

            {currentTab === 'calendar' && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <CalendarPage
                  currentDate={currentDate}
                  onDateChange={(date) => {
                    setCurrentDate(date);
                    setCurrentTab('today');
                  }}
                />
              </motion.div>
            )}

            {currentTab === 'my' && (
              <motion.div
                key="my"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <MyPage
                  userProfile={userProfile}
                  onSettingsClick={() => setIsSettingsOpen(true)}
                  onCheckinClick={() => setShowCheckin(true)}
                  onAchievementClick={() => setShowAchievements(true)}
                  onKnowledgeClick={() => setShowKnowledge(true)}
                  onFeedbackClick={() => setShowFeedback(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 底部导航栏 */}
          <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
        </div>
        {/* ========== 移动端布局结束 ========== */}

        {/* ========== PC端：三栏布局 ========== */}
        <div className="hidden lg:contents">
          {/* 左侧栏：个人信息与日历 (col-span-3) */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            {/* 个人信息卡片 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 mb-3">个人档案</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-400">姓名</div>
                  <div className="text-sm font-bold text-gray-800">{userProfile.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">出生日期</div>
                  <div className="text-sm font-bold text-gray-800">{userProfile.birthDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">出生地</div>
                  <div className="text-sm font-bold text-gray-800">{userProfile.city}</div>
                </div>
                <motion.button
                  onClick={() => setIsSettingsOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  编辑档案
                </motion.button>
              </div>
            </div>

            {/* 日历视图（常驻） */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <CalendarWidget
                currentDate={currentDate}
                onDateSelect={(date) => setCurrentDate(date)}
                getHistoryScore={(dateStr) => {
                  try {
                    const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
                    const record = history.find((h: HistoryRecord) => h.date === dateStr);
                    return record ? record.fortune.totalScore : null;
                  } catch {
                    return null;
                  }
                }}
              />
            </div>
          </div>

          {/* 中间栏：核心运势内容 (col-span-6) */}
          <div className="lg:col-span-6 space-y-4">
            {/* 顶部导航 */}
            <Header
              userName={userProfile.name}
              onSettingsClick={() => setIsSettingsOpen(true)}
              onHistoryClick={() => setShowHistory(true)}
              onTrendsClick={() => setShowTrends(true)}
              onCalendarClick={() => setShowCalendar(true)}
              onCheckinClick={() => setShowCheckin(true)}
              onAchievementClick={() => setShowAchievements(true)}
              onKnowledgeClick={() => setShowKnowledge(true)}
              onAIClick={() => {
                setAiInitialQuestion(undefined);
                setShowAIDeduction(true);
              }}
            />

            {/* 日期选择 */}
            <DateSelector
              currentDate={currentDate}
              weekDay={fortune?.weekDay}
              lunarStr={fortune?.lunarStr}
              onPrevDay={() => changeDate(-1)}
              onNextDay={() => changeDate(1)}
              onDateChange={setCurrentDate}
            />

            {/* 核心内容区 */}
            <div className="overflow-y-auto lg:max-h-[calc(100vh-12rem)]">
              <AnimatePresence mode="wait">
                {isLoading || !fortune ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <SkeletonFortuneCard />
                    <SkeletonDimensionCard />
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentDate.toISOString()}
                    initial={{ 
                      opacity: 0,
                      x: slideDirection === 'right' ? 50 : slideDirection === 'left' ? -50 : 0
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ 
                      opacity: 0,
                      x: slideDirection === 'right' ? -50 : slideDirection === 'left' ? 50 : 0
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    ref={contentRef}
                    className="space-y-4"
                  >
                    {/* 主运势卡片 */}
                    <FortuneCard
                      mainTheme={fortune.mainTheme}
                      totalScore={fortune.totalScore}
                      pillars={fortune.pillars}
                      themeStyle={currentThemeStyle}
                      showBazi={showBazi}
                      onToggleBazi={() => setShowBazi(!showBazi)}
                      yongShen={fortune.yongShen}
                      liuNian={fortune.liuNian}
                      todayTenGod={fortune.todayTenGod}
                    />

                    {/* 反馈按钮 */}
                    {fortune && (
                      <motion.button
                        onClick={() => setShowFeedback(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
                      >
                        <TrendingUp size={16} />
                        反馈今日运势准确度
                      </motion.button>
                    )}

                    {/* Todo List */}
                    <div className="grid grid-cols-2 gap-3">
                      {fortune.todo.map((item, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl ${item.type === 'up' ? 'bg-white' : 'bg-gray-200/50'} flex flex-col justify-between shadow-sm border border-transparent`}
                             style={{ backgroundColor: item.type === 'up' ? '#ffffff' : 'rgba(229, 231, 235, 0.5)' }}>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-wide`}
                                style={{ backgroundColor: item.type === 'up' ? '#d1fae5' : '#ffe4e6', color: item.type === 'up' ? '#047857' : '#be123c' }}>
                            {item.label}
                          </span>
                          <span className="font-bold text-gray-700 leading-tight text-sm">{item.content}</span>
                        </div>
                      ))}
                    </div>

                    {/* 八字详情和用神喜忌 */}
                    {(showBazi || fortune.baziDetail) && (
                      <div className="space-y-4">
                        {/* 八字详情 */}
                        {fortune.baziDetail && (
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles size={14} /> 八字详情
                            </h3>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">年柱</div>
                                <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.year}</div>
                              </div>
                              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">月柱</div>
                                <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.month}</div>
                              </div>
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">日柱</div>
                                <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.day}</div>
                              </div>
                              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">时柱</div>
                                <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.hour}</div>
                              </div>
                            </div>
                            <div className="mt-3 text-center">
                              <span className="text-xs text-gray-400">日主：</span>
                              <span className="text-sm font-bold text-indigo-600 ml-1">{fortune.baziDetail.dayMaster}</span>
                            </div>
                          </div>
                        )}

                        {/* 用神喜忌 */}
                        {fortune.yongShen && (
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider flex items-center gap-1">
                              <TrendingUp size={14} /> 用神喜忌
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <div className="text-[10px] text-gray-400 mb-2">日主旺衰</div>
                                <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                  fortune.yongShen.strength === '身旺' ? 'bg-red-100 text-red-700' :
                                  fortune.yongShen.strength === '身弱' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {fortune.yongShen.strength}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-400 mb-2">用神</div>
                                <div className="flex flex-wrap gap-1">
                                  {fortune.yongShen.yongShen.map((elem, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                      {elem}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-400 mb-2">喜神</div>
                                <div className="flex flex-wrap gap-1">
                                  {fortune.yongShen.xiShen.map((elem, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                      {elem}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <div className="text-[10px] text-gray-400 mb-2">忌神</div>
                                <div className="flex flex-wrap gap-1">
                                  {fortune.yongShen.jiShen.map((elem, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                                      {elem}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 大运信息 */}
                        {fortune.daYun && (
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider flex items-center gap-1">
                              <Crown size={14} /> 当前大运
                            </h3>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl">
                                  <div className="text-2xl font-black">{fortune.daYun.gan_zhi}</div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-400">起运年龄</div>
                                  <div className="text-sm font-bold text-gray-800">{fortune.daYun.age}岁</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-400">大运周期</div>
                                <div className="text-sm font-bold text-gray-800">
                                  {fortune.daYun.start_year} - {fortune.daYun.end_year}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 神煞信息 */}
                        {fortune.shenSha && fortune.shenSha.length > 0 && (
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider flex items-center gap-1">
                              <Sparkles size={14} /> 今日神煞
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {fortune.shenSha.map((ss, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                                  {ss}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 六维度运势 */}
                    <DimensionCard dimensions={fortune.dimensions} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 右侧栏：成就与快捷操作 (col-span-3) */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            {/* 成就统计卡片 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 mb-3">成就进度</h3>
              <motion.button
                onClick={() => setShowAchievements(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium mb-3"
              >
                查看全部成就
              </motion.button>
              {/* 这里可以显示简化的成就列表 */}
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 mb-3">快捷操作</h3>
              <div className="space-y-2">
                <motion.button
                  onClick={() => setShowCheckin(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  每日签到
                </motion.button>
                <motion.button
                  onClick={() => setShowTrends(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-purple-50 text-purple-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  趋势分析
                </motion.button>
                <motion.button
                  onClick={() => setShowHistory(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-pink-50 text-pink-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  历史记录
                </motion.button>
                <motion.button
                  onClick={() => setShowKnowledge(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-yellow-50 text-yellow-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  八字学堂
                </motion.button>
                <motion.button
                  onClick={() => setShowAIDeduction(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg"
                >
                  <Sparkles size={16} />
                  AI 命理咨询
                </motion.button>
              </div>
            </div>

            {/* 生成日签按钮（PC端） */}
            <motion.button
              onClick={handleGenerateImage}
              disabled={isGenerating || !fortune}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg font-bold transition hover:bg-black disabled:opacity-70"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Share2 size={18} />}
              {isGenerating ? '生成中...' : '生成日签'}
            </motion.button>
          </div>
        </div>
        {/* ========== PC端布局结束 ========== */}

        {/* --- 图片预览/下载弹窗 --- */}
        {generatedImage && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="bg-white p-2 rounded-2xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
               <img src={generatedImage} alt="今日运势" className="rounded-xl object-contain max-h-full" />
             </div>
             <div className="mt-6 flex flex-col items-center gap-3">
               <p className="text-white/80 text-sm font-medium">长按图片保存，或点击下方按钮</p>
               <div className="flex gap-4">
                 <motion.button
                   onClick={() => setGeneratedImage(null)}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-white/10 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md border border-white/20"
                 >
                   关闭
                 </motion.button>
                 <motion.a
                   href={generatedImage}
                   download={`运势日签-${fortune?.dateStr}.png`}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                 >
                   <Download size={18} /> 保存图片
                 </motion.a>
               </div>
             </div>
          </div>
        )}

        {/* --- 设置组件 --- */}
        <ProfileSettings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          profile={userProfile}
          onSave={handleSaveSettings}
        />

        {/* 历史记录抽屉 */}
        <HistoryDrawer
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onSelectDate={(date) => {
            setCurrentDate(date);
            setShowHistory(false);
          }}
          onCompareClick={() => setShowCompare(true)}
        />

        {/* 趋势视图 */}
        <TrendsView
          isOpen={showTrends}
          onClose={() => setShowTrends(false)}
          onSelectDate={(date) => {
            setCurrentDate(date);
            setShowTrends(false);
          }}
        />

        {/* 日历视图 */}
        {showCalendar && (
          <CalendarView
            currentDate={currentDate}
            onDateSelect={(date) => {
              setCurrentDate(date);
              setShowCalendar(false);
            }}
            onClose={() => setShowCalendar(false)}
            getHistoryScore={(dateStr) => {
              try {
                const history = JSON.parse(localStorage.getItem('fortune_history') || '[]');
                const record = history.find((h: HistoryRecord) => h.date === dateStr);
                return record ? record.fortune.totalScore : null; // ← 修复：添加 .fortune
              } catch {
                return null;
              }
            }}
          />
        )}

        {/* 签到弹窗 */}
        <CheckinModal
          isOpen={showCheckin}
          onClose={() => setShowCheckin(false)}
          onCheckinSuccess={(record) => {
            // 更新签到相关成就
            updateAchievements({
              checkin_3: record.consecutiveDays,
              checkin_7: record.consecutiveDays,
              checkin_30: record.consecutiveDays,
              checkin_100: record.consecutiveDays,
            });
          }}
        />

        {/* 成就展示 */}
        <AchievementView
          isOpen={showAchievements}
          onClose={() => setShowAchievements(false)}
        />

        {/* 运势对比 */}
        <FortuneCompare
          isOpen={showCompare}
          onClose={() => setShowCompare(false)}
          onSelectDate={(date) => {
            setCurrentDate(date);
            setShowCompare(false);
          }}
        />

        {/* 知识库 */}
        <KnowledgeBase
          isOpen={showKnowledge}
          onClose={() => setShowKnowledge(false)}
        />

        {/* 反馈弹窗 */}
        {fortune && (
          <FeedbackModal
            isOpen={showFeedback}
            onClose={() => setShowFeedback(false)}
            date={fortune.dateStr}
            onFeedbackSubmit={() => {
              // 反馈提交后的操作
            }}
          />
        )}

        {/* AI 命理深度推演 */}
        {fortune && (
          <AIDeduction
            isOpen={showAIDeduction}
            onClose={() => {
              setShowAIDeduction(false);
              setAiInitialQuestion(undefined); // 关闭时清除预设问题
            }}
            baziContext={{
              baziDetail: fortune.baziDetail,
              yongShen: fortune.yongShen,
              dimensions: fortune.dimensions,
              mainTheme: fortune.mainTheme,
              totalScore: fortune.totalScore,
              liuNian: fortune.liuNian,
            }}
            initialQuestion={aiInitialQuestion}
          />
        )}

      </div>
    </div>
  );
}