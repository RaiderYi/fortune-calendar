import { useState, useEffect, useRef, lazy, Suspense, useCallback } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { updateSEOMeta } from './utils/seo';
import { useHaptics } from './utils/haptics';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { fetchWithRetryAndCache } from './utils/apiRetry';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import FortuneCard from './components/FortuneCard';
import DimensionCard from './components/DimensionCard';
import CalendarWidget from './components/CalendarWidget';
import Onboarding from './components/Onboarding';
import ProfileSettings from './components/ProfileSettings';
import type { UserProfile } from './components/ProfileSettings';
import BottomNav, { type TabType } from './components/BottomNav';
import TodayPage from './components/TodayPage';
import CalendarPage from './components/CalendarPage';
import MyPage from './components/MyPage';
import DailySignThemeSelector, { type DailySignTheme } from './components/DailySignThemeSelector';
import TimeEnergyBall from './components/TimeEnergyBall';
import CollapsibleSection from './components/CollapsibleSection';
import YongShenEditor from './components/YongShenEditor';
import { updateAchievements, checkNewUnlocks } from './utils/achievementStorage';
import { saveHistory } from './utils/historyStorage';
import type { HistoryRecord } from './utils/historyStorage';
import { updateTaskProgress } from './utils/taskStorage';
import { getCustomYongShen, setCustomYongShen as persistCustomYongShen } from './utils/yongShenStorage';
import { useNotification } from './hooks/useNotification';
import { useToast } from './contexts/ToastContext';
import { useAuth } from './contexts/AuthContext';
import LoginModal from './components/LoginModal';
import SiteHeader from './components/layout/SiteHeader';
import LandingPage from './pages/LandingPage';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import BlogPage from './pages/BlogPage';
import PricingPage from './pages/PricingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import { SkeletonFortuneCard, SkeletonDimensionCard } from './components/SkeletonLoader';
import QuickActionsSidebar from './components/QuickActionsSidebar';
import { AppContextProvider } from './contexts/AppContext';
import HistoryPage from './pages/app/HistoryPage';
import TrendsPage from './pages/app/TrendsPage';
import CheckinPage from './pages/app/CheckinPage';
import AchievementPage from './pages/app/AchievementPage';
import KnowledgePage from './pages/app/KnowledgePage';
import AIPage from './pages/app/AIPage';
import LifeMapPage from './pages/app/LifeMapPage';
import DatePickerPage from './pages/app/DatePickerPage';
import FortuneStickPage from './pages/app/FortuneStickPage';
import DisclaimerModal, { hasAcknowledgedDisclaimer } from './components/DisclaimerModal';

// ==========================================
// 懒加载非核心组件（性能优化）
// ==========================================
const CalendarView = lazy(() => import('./components/CalendarView'));
const FortuneCompare = lazy(() => import('./components/FortuneCompare'));
const FeedbackModal = lazy(() => import('./components/FeedbackModal'));
const ContactModal = lazy(() => import('./components/ContactModal'));
const NotificationSettings = lazy(() => import('./components/NotificationSettings'));
const TaskPanel = lazy(() => import('./components/TaskPanel'));
const ReportModal = lazy(() => import('./components/ReportModal'));
const DiaryModal = lazy(() => import('./components/DiaryModal'));
const DiaryReview = lazy(() => import('./components/DiaryReview'));
const DeveloperDashboard = lazy(() => import('./components/DeveloperDashboard'));
import {
  Share2, Eye, EyeOff, Sparkles,  // ← Sparkles 必须保留
  Briefcase, Coins, Heart, Zap, BookOpen, Map, TrendingUp,
  Crown, Loader2, X, Download, MapPin, Mail
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
  const haptics = useHaptics(); // 震动反馈
  const notification = useNotification(); // 通知功能
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
  const [showCalendar, setShowCalendar] = useState(false); // 日历视图
  const [showCompare, setShowCompare] = useState(false); // 运势对比
  const [showFeedback, setShowFeedback] = useState(false); // 反馈弹窗
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const FEATURE_PATHS = ['/app/history', '/app/trends', '/app/checkin', '/app/achievements', '/app/knowledge', '/app/ai', '/app/lifemap', '/app/datepicker', '/app/fortune-stick'];
  const isFeaturePage = FEATURE_PATHS.some((p) => pathname.startsWith(p));
  const currentTab: TabType = pathname.includes('/app/calendar') ? 'calendar' : pathname.includes('/app/me') ? 'my' : 'today';
  const [showContact, setShowContact] = useState(false); // 联系我们
  const [showNotificationSettings, setShowNotificationSettings] = useState(false); // 通知设置
  const [showTaskPanel, setShowTaskPanel] = useState(false); // 任务面板
  const [showReport, setShowReport] = useState(false); // 运势报告
  const [showDiary, setShowDiary] = useState(false); // 日记编辑
  const [showDiaryReview, setShowDiaryReview] = useState(false); // 日记回顾
  const [showDeveloperDashboard, setShowDeveloperDashboard] = useState(false); // 开发者仪表板
  const [showLogin, setShowLogin] = useState(false); // 登录/注册弹窗
  const [showDisclaimer, setShowDisclaimer] = useState(false); // 免责声明（首次查看运势）
  const { isAuthenticated } = useAuth();

  // 首次查看运势时显示免责声明（不含 onboarding 场景）
  useEffect(() => {
    if (
      !showOnboarding &&
      fortune &&
      currentTab === 'today' &&
      !isFeaturePage &&
      !hasAcknowledgedDisclaimer()
    ) {
      setShowDisclaimer(true);
    }
  }, [showOnboarding, fortune, currentTab, isFeaturePage]);

  // 手势支持：左右滑动切换日期
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (currentTab === 'today' && !isAnimating) {
        haptics.light();
        changeDate(1); // 下一天
      }
    },
    onSwipeRight: () => {
      if (currentTab === 'today' && !isAnimating) {
        haptics.light();
        changeDate(-1); // 前一天
      }
    },
    minDistance: 80,
    maxTime: 400,
  });

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
  const [customYongShen, setCustomYongShenState] = useState<string | string[] | null>(null); // 用户自定义用神

  // 从 storage 加载自定义用神（随 profile 变化）
  useEffect(() => {
    const stored = getCustomYongShen(userProfile.birthDate, userProfile.birthTime);
    setCustomYongShenState(stored);
  }, [userProfile.birthDate, userProfile.birthTime]);

  // 统一 setter：更新 state 并持久化
  const setCustomYongShen = useCallback((value: string | string[] | null) => {
    setCustomYongShenState(value);
    persistCustomYongShen(userProfile.birthDate, userProfile.birthTime, value);
  }, [userProfile.birthDate, userProfile.birthTime]);

  // i18n 相关
  const { t, i18n } = useTranslation(['common', 'ui', 'fortune', 'bazi']);

  // 懒加载 Fallback 组件（内联定义，避免导入问题）
  const LazyLoadFallback = ({ fullScreen = false }: { fullScreen?: boolean }) => (
    <div className={fullScreen ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center' : 'flex flex-col items-center justify-center gap-3 p-8'}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <Loader2 size={32} className="text-indigo-500" />
      </motion.div>
      <span className="text-sm text-gray-500 dark:text-gray-400">加载中...</span>
    </div>
  );

  // 语言变化时更新 SEO
  useEffect(() => {
    updateSEOMeta(i18n.language);
    
    // 监听语言变化
    const handleLanguageChange = (lng: string) => {
      updateSEOMeta(lng);
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // --- 核心：调用后端接口（带重试和缓存） ---
  const fetchFortuneData = useCallback(async (date: Date, profile: UserProfile, yongShen: string | string[] | null) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    // 缓存键
    const yongShenKey = yongShen
      ? (Array.isArray(yongShen) ? yongShen.join(',') : yongShen)
      : 'auto';
    const cacheKey = `fortune:${dateStr}:${profile.birthDate}:${profile.birthTime}:${yongShenKey}`;
    
    // 注：不直接使用 getCachedData 提前返回，因为 fetchWithRetryAndCache 缓存的是原始 API 响应，
    // 若直接返回会导致 dateStr 等字段缺失。统一走 fetchWithRetryAndCache + transform 流程。
    const requestBody = {
      date: dateStr,
      birthDate: profile.birthDate,
      birthTime: profile.birthTime,
      longitude: profile.longitude,
      gender: profile.gender,
      customYongShen: yongShen
    };

    const response = await fetchWithRetryAndCache<any>(
      '/api/fortune',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      },
      {
        maxRetries: 3,
        delay: 1000,
        backoff: 1.5,
        ttl: 5 * 60 * 1000, // 5分钟缓存
        key: cacheKey,
        onRetry: (attempt, error) => {
          console.warn(`运势数据请求第 ${attempt} 次重试:`, error.message);
        },
      }
    );

    // 转换 API 响应格式：从嵌套结构转换为扁平结构
    if (response && response.success && response.data) {
      const { data } = response;
      const fortune = data.fortune || {};
      const bazi = data.bazi || {};
      const analysis = data.analysis || {};
      
      // 计算星期几
      const dateObj = new Date(dateStr);
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const weekDay = weekDays[dateObj.getDay()];
      
      // 构建扁平化的数据结构
      const transformedData: DailyFortune = {
        dateStr,
        lunarStr: bazi.solar_term || '', // 使用节气作为农历信息
        weekDay,
        totalScore: fortune.totalScore || 0,
        pillars: {
          year: bazi.year || '',
          month: bazi.month || '',
          day: bazi.day || ''
        },
        mainTheme: fortune.mainTheme || {
          keyword: '',
          subKeyword: '',
          emoji: '',
          description: ''
        },
        dimensions: (() => {
          // 确保 dimensions 有正确的结构
          const dims = fortune.dimensions || {};
          const result: { [key: string]: any } = {};
          
          // 维度键名映射（后端可能使用不同的键名）
          const dimensionKeys = ['career', 'wealth', 'romance', 'health', 'academic', 'travel'];
          
          dimensionKeys.forEach(key => {
            const dim = dims[key];
            if (dim && typeof dim === 'object' && 'score' in dim) {
              // 已经是完整对象
              result[key] = dim;
            } else if (typeof dim === 'number') {
              // 只是数字，需要转换为对象
              const score = dim;
              result[key] = {
                score,
                level: score >= 80 ? '大吉' : score >= 70 ? '吉' : score >= 60 ? '平' : '凶',
                tag: score >= 80 ? '吉' : score >= 60 ? '平' : '凶',
                inference: score >= 80 ? '运势较好' : score >= 60 ? '运势平稳' : '运势欠佳'
              };
            } else {
              // 默认值
              result[key] = {
                score: 50,
                level: '平',
                tag: '平',
                inference: '运势平稳'
              };
            }
          });
          
          return result;
        })(),
        todo: (fortune.todoList || []).map((item: any) => ({
          label: item.type === '宜' ? '宜' : '忌',
          content: item.content || '',
          type: item.type === '宜' ? 'up' : 'down'
        })),
        baziDetail: bazi,
        yongShen: (() => {
          // 转换后端返回的 yong_shen_result 格式为前端期望的格式
          const yongShenData = analysis.yong_shen_result || {};
          const strengthResult = analysis.strength_result || {};
          
          // 从 strength_result.level 提取 strength 字段
          const strength = strengthResult.level || yongShenData.strength || '未知';
          
          // 确保所有数组字段都是数组类型
          const getArray = (value: any): string[] => {
            if (Array.isArray(value)) return value;
            if (typeof value === 'string') return [value];
            return [];
          };
          
          return {
            strength,
            yongShen: getArray(yongShenData.favorable).length > 0 
              ? getArray(yongShenData.favorable)
              : (yongShenData.primary ? [yongShenData.primary] : []),
            xiShen: getArray(yongShenData.xi_shen),
            jiShen: getArray(yongShenData.ji_shen)
          };
        })(),
        liuNian: {
          ...(fortune.liuNian || {}),
          yearGan: fortune.liuNian?.gan,
          yearZhi: fortune.liuNian?.zhi,
          dayGan: fortune.liuRi?.gan,
          dayZhi: fortune.liuRi?.zhi,
        },
        todayTenGod: fortune.liuRi?.gan || ''
      };
      
      // 运行时数据验证
      const validateFortuneData = (data: DailyFortune): boolean => {
        try {
          // 验证必需字段
          if (typeof data.totalScore !== 'number' || isNaN(data.totalScore)) {
            console.error('[VALIDATION] totalScore 无效:', data.totalScore);
            return false;
          }
          
          if (!data.mainTheme || typeof data.mainTheme !== 'object') {
            console.error('[VALIDATION] mainTheme 无效:', data.mainTheme);
            return false;
          }
          
          if (!data.dimensions || typeof data.dimensions !== 'object') {
            console.error('[VALIDATION] dimensions 无效:', data.dimensions);
            return false;
          }
          
          // 验证 dimensions 结构
          const requiredDimensions = ['career', 'wealth', 'romance', 'health', 'academic', 'travel'];
          for (const key of requiredDimensions) {
            const dim = data.dimensions[key];
            if (!dim || typeof dim !== 'object') {
              console.warn(`[VALIDATION] dimension ${key} 缺失，使用默认值`);
              data.dimensions[key] = {
                score: 50,
                level: '平',
                tag: '平',
                inference: '运势平稳'
              };
            } else if (typeof dim.score !== 'number') {
              console.warn(`[VALIDATION] dimension ${key}.score 无效，使用默认值`);
              dim.score = 50;
            }
          }
          
          // 验证 yongShen 结构
          if (data.yongShen) {
            if (!Array.isArray(data.yongShen.yongShen)) {
              console.warn('[VALIDATION] yongShen.yongShen 不是数组，转换为数组');
              data.yongShen.yongShen = [];
            }
            if (!Array.isArray(data.yongShen.xiShen)) {
              console.warn('[VALIDATION] yongShen.xiShen 不是数组，转换为数组');
              data.yongShen.xiShen = [];
            }
            if (!Array.isArray(data.yongShen.jiShen)) {
              console.warn('[VALIDATION] yongShen.jiShen 不是数组，转换为数组');
              data.yongShen.jiShen = [];
            }
          }
          
          return true;
        } catch (error) {
          console.error('[VALIDATION] 数据验证失败:', error);
          return false;
        }
      };
      
      // 执行验证
      if (!validateFortuneData(transformedData)) {
        console.error('[ERROR] 数据验证失败，但继续使用数据');
      }
      
      return transformedData;
    }
    
    // 如果响应格式不符合预期，返回空数据
    throw new Error('API 响应格式错误');
  }, []);

  useEffect(() => {
    const fetchFortune = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const backendData = await fetchFortuneData(currentDate, userProfile, customYongShen);
        
        // 验证数据格式
        if (!backendData || typeof backendData !== 'object') {
          throw new Error('返回数据格式错误');
        }
        
        // 验证必需字段
        if (typeof backendData.totalScore !== 'number') {
          throw new Error('缺少总分数据');
        }
        if (!backendData.mainTheme || !backendData.mainTheme.keyword) {
          throw new Error('缺少主题数据');
        }
        if (!backendData.dimensions || typeof backendData.dimensions !== 'object') {
          throw new Error('缺少维度数据');
        }
        
        console.log('[DEBUG] 运势数据加载成功:', {
          totalScore: backendData.totalScore,
          keyword: backendData.mainTheme?.keyword,
          dimensionsCount: Object.keys(backendData.dimensions || {}).length
        });
        
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
            console.log('新解锁成就:', newUnlocks);
          }
        } catch (error) {
          console.error('更新成就失败:', error);
        }

          // 保存到历史记录
          const historyRecord: HistoryRecord = {
          date: dateStr,
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

        // 更新任务进度：查看今日运势
        updateTaskProgress('daily_view');

          // 颜色映射逻辑
          const keyword = backendData.mainTheme.keyword;
          let themeKey = 'default';
          if (['松弛', '食神', '叛逆', '伤官'].some(k => keyword.includes(k))) themeKey = '食神';
          else if (['吸金', '偏财', '搬砖', '正财', '破财'].some(k => keyword.includes(k))) themeKey = '偏财';
          else if (['气场', '七杀', '硬刚', '比肩'].some(k => keyword.includes(k))) themeKey = '七杀';
          else if (['万人迷', '桃花', '上岸', '正官'].some(k => keyword.includes(k))) themeKey = '桃花';
          else if (['锦鲤', '正印', '脑洞', '偏印'].some(k => keyword.includes(k))) themeKey = '正印';

          setCurrentThemeStyle(SAFE_THEMES[themeKey] || SAFE_THEMES['default']);

      } catch (error) {
        console.error("获取运势数据失败", error);
        
        // 提取错误信息
        let errorMessage = '运势数据加载失败，请稍后重试';
        if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
          // 如果是网络错误，显示更友好的提示
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = '网络连接失败，请检查网络后重试';
          } else if (error.message.includes('HTTP 500')) {
            errorMessage = '服务器错误，请稍后重试';
          } else if (error.message.includes('HTTP 404')) {
            errorMessage = 'API 接口不存在，请联系管理员';
          }
        }
        
        // 显示错误提示
        showToast(errorMessage, 'error');
        
        // 如果用户档案不完整，提示用户
        if (!userProfile.birthDate || !userProfile.birthTime) {
          setTimeout(() => {
            showToast('请先完善个人档案信息', 'warning');
          }, 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchFortune();
  }, [currentDate, userProfile, customYongShen, fetchFortuneData, showToast]);

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
      haptics.success(); // 震动反馈
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
    <>
      <a href="#main" className="skip-link">
        {t('ui:skipToContent', { defaultValue: 'Skip to content' })}
      </a>
      <Routes>
        <Route path="/" element={<LandingPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/features" element={<FeaturesPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/about" element={<AboutPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/help" element={<HelpPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/privacy" element={<PrivacyPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/terms" element={<TermsPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/blog" element={<BlogPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/pricing" element={<PricingPage onLoginClick={() => setShowLogin(true)} />} />
        <Route path="/app" element={<Navigate to="/app/today" replace />} />
        <Route path="/app/:tab" element={
          <AppContextProvider
            value={{
              currentDate,
              setCurrentDate,
              fortune,
              userProfile,
              changeDate,
              onCompareClick: () => setShowCompare(true),
              fetchFortuneForDate: async (date: Date) => {
                const yongShen = getCustomYongShen(userProfile.birthDate, userProfile.birthTime);
                const data = await fetchFortuneData(date, userProfile, yongShen);
                return data ? { dateStr: data.dateStr, totalScore: data.totalScore, mainTheme: data.mainTheme, dimensions: data.dimensions } : null;
              },
              onCheckinSuccess: (record) => {
                haptics.success();
                updateAchievements({
                  checkin_3: record.consecutiveDays,
                  checkin_7: record.consecutiveDays,
                  checkin_30: record.consecutiveDays,
                  checkin_100: record.consecutiveDays,
                });
                updateTaskProgress('daily_checkin');
              },
            }}
          >
            <SiteHeader onLoginClick={() => setShowLogin(true)} />
            <div id="main" className="min-h-screen bg-gray-50 font-sans text-slate-800 select-none overflow-hidden">
              {/* 首次使用引导 */}
              {showOnboarding && (
                <Onboarding
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingSkip}
                />
              )}

              {/* 免责声明（首次查看运势时） */}
              <DisclaimerModal
                isOpen={showDisclaimer}
                onClose={() => setShowDisclaimer(false)}
              />

              {/* 响应式布局容器：全宽，移动端单列，PC端三栏 */}
              <div className="w-full max-w-7xl xl:max-w-none xl:px-12 mx-auto px-4 sm:px-6 lg:px-8 bg-[#F5F5F7] dark:bg-slate-900 min-h-screen flex flex-col lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6 relative lg:shadow-2xl">
        
        {/* ========== 移动端：单列布局 ========== */}
        <div 
          className="flex flex-col lg:hidden min-h-screen"
          {...swipeHandlers}
        >
          {/* --- 顶部导航（仅在今日Tab显示，非功能页） --- */}
          {!isFeaturePage && currentTab === 'today' && (
            <>
        <Header
          userName={userProfile.name}
                onSettingsClick={() => {
                  setIsSettingsOpen(true);
                  navigate('/app/me');
                }}
                onHistoryClick={() => navigate('/app/history')}
                onTrendsClick={() => navigate('/app/trends')}
                onCalendarClick={() => navigate('/app/calendar')}
                onCheckinClick={() => navigate('/app/checkin')}
                onAchievementClick={() => navigate('/app/achievements')}
                onKnowledgeClick={() => navigate('/app/knowledge')}
                onAIClick={() => navigate('/app/ai')}
                onTaskClick={() => setShowTaskPanel(true)}
                onNotificationSettingsClick={() => setShowNotificationSettings(true)}
                onLoginClick={() => setShowLogin(true)}
                isAuthenticated={isAuthenticated}
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
          {!isFeaturePage && currentTab === 'today' && fortune && (
            <TimeEnergyBall
              currentTime={new Date()}
              dayMaster={fortune.baziDetail?.dayMaster}
            />
          )}

          {/* --- Tab 内容区（含功能页） --- */}
          <AnimatePresence mode="wait">
            {isFeaturePage && (
              <motion.div
                key={pathname}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-h-0"
              >
                {pathname.startsWith('/app/history') && <HistoryPage />}
                {pathname.startsWith('/app/trends') && <TrendsPage />}
                {pathname.startsWith('/app/checkin') && <CheckinPage />}
                {pathname.startsWith('/app/achievements') && <AchievementPage />}
                {pathname.startsWith('/app/knowledge') && <KnowledgePage />}
                {pathname.startsWith('/app/ai') && <AIPage />}
                {pathname.startsWith('/app/lifemap') && <LifeMapPage />}
                {pathname.startsWith('/app/datepicker') && <DatePickerPage />}
                {pathname.startsWith('/app/fortune-stick') && <FortuneStickPage />}
              </motion.div>
            )}
            {!isFeaturePage && currentTab === 'today' && (
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
                  onAIClick={() => navigate('/app/ai')}
                  onGenerateImage={handleGenerateImage}
                  isGenerating={isGenerating}
                  contentRef={contentRef}
                  customYongShen={customYongShen}
                  onCustomYongShenChange={setCustomYongShen}
                  dailySignTheme={dailySignTheme}
                  onThemeChange={setDailySignTheme}
                  showThemeSelector={showThemeSelector}
                  onToggleThemeSelector={() => setShowThemeSelector(!showThemeSelector)}
                  onDiaryClick={() => setShowDiary(true)}
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
                    navigate('/app/today');
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
                  onCheckinClick={() => navigate('/app/checkin')}
                  onAchievementClick={() => navigate('/app/achievements')}
                  onKnowledgeClick={() => navigate('/app/knowledge')}
                  onFeedbackClick={() => setShowFeedback(true)}
                  onDatePickerClick={() => navigate('/app/datepicker')}
                  onFortuneStickClick={() => navigate('/app/fortune-stick')}
                  onReportClick={() => setShowReport(true)}
                  onDiaryReviewClick={() => setShowDiaryReview(true)}
                  onDeveloperDashboardClick={() => setShowDeveloperDashboard(true)}
                  onOpenLogin={() => setShowLogin(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 底部导航栏 */}
          <BottomNav currentTab={currentTab} />
            </div>
        {/* ========== 移动端布局结束 ========== */}

        {/* ========== PC端：三栏布局 ========== */}
        <div className="hidden lg:contents">
          {/* 左侧栏：个人信息与日历 (col-span-3) */}
          <div className="lg:col-span-3 space-y-4 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:overflow-y-auto">
            {/* 个人信息卡片 */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 mb-3">{t('ui:desktop.profile')}</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-400">{t('ui:forms.name')}</div>
                  <div className="text-sm font-bold text-gray-800">{userProfile.name}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">{t('ui:forms.birthDate')}</div>
                  <div className="text-sm font-bold text-gray-800">{userProfile.birthDate}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">{t('ui:forms.city')}</div>
                  <div className="text-sm font-bold text-gray-800">{userProfile.city}</div>
                </div>
                <motion.button
                  onClick={() => setIsSettingsOpen(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-3 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  {t('ui:desktop.editProfile')}
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
            {/* 顶部导航（非功能页显示） */}
            {!isFeaturePage && (
              <>
                <Header
                  userName={userProfile.name}
                  onSettingsClick={() => setIsSettingsOpen(true)}
                  onHistoryClick={() => navigate('/app/history')}
                  onTrendsClick={() => navigate('/app/trends')}
                  onCalendarClick={() => setShowCalendar(true)}
                  onCheckinClick={() => navigate('/app/checkin')}
                  onAchievementClick={() => navigate('/app/achievements')}
                  onKnowledgeClick={() => navigate('/app/knowledge')}
                  onAIClick={() => navigate('/app/ai')}
                  onTaskClick={() => setShowTaskPanel(true)}
                  onNotificationSettingsClick={() => setShowNotificationSettings(true)}
                  onLoginClick={() => setShowLogin(true)}
                  isAuthenticated={isAuthenticated}
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
              </>
            )}

            {/* 核心内容区 */}
            <div className="overflow-y-auto lg:max-h-[calc(100vh-12rem)]">
              {isFeaturePage ? (
                <>
                  {pathname.startsWith('/app/history') && <HistoryPage />}
                  {pathname.startsWith('/app/trends') && <TrendsPage />}
                  {pathname.startsWith('/app/checkin') && <CheckinPage />}
                  {pathname.startsWith('/app/achievements') && <AchievementPage />}
                  {pathname.startsWith('/app/knowledge') && <KnowledgePage />}
                  {pathname.startsWith('/app/ai') && <AIPage />}
                  {pathname.startsWith('/app/lifemap') && <LifeMapPage />}
                  {pathname.startsWith('/app/datepicker') && <DatePickerPage />}
                  {pathname.startsWith('/app/fortune-stick') && <FortuneStickPage />}
                </>
              ) : (
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

                    {/* 反馈与日记按钮 */}
                    {fortune && (
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button
                          onClick={() => setShowFeedback(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
                        >
                          <TrendingUp size={16} />
                          {t('ui:desktop.feedbackAccuracy')}
                        </motion.button>
                        <motion.button
                          onClick={() => setShowDiary(true)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
                        >
                          <BookOpen size={16} />
                          {t('ui:todayPage.diary', { defaultValue: '写日记' })}
                        </motion.button>
                      </div>
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
                              <Sparkles size={14} /> {t('ui:todayPage.baziDetails')}
                      </h3>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">{t('ui:todayPage.yearPillar')}</div>
                          <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.year}</div>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">{t('ui:todayPage.monthPillar')}</div>
                          <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.month}</div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">{t('ui:todayPage.dayPillar')}</div>
                          <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.day}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-3 rounded-xl">
                                <div className="text-[10px] text-gray-400 mb-1">{t('ui:todayPage.hourPillar')}</div>
                          <div className="text-lg font-bold text-gray-800">{fortune.baziDetail.hour}</div>
                        </div>
                      </div>
                      <div className="mt-3 text-center">
                              <span className="text-xs text-gray-400">{t('ui:todayPage.dayMaster')}</span>
                        <span className="text-sm font-bold text-indigo-600 ml-1">{fortune.baziDetail.dayMaster}</span>
                      </div>
                    </div>
                  )}

                  {/* 用神喜忌 */}
                  {fortune.yongShen && (
                          <YongShenEditor
                            yongShen={fortune.yongShen}
                            onChange={setCustomYongShen}
                            darkMode={false}
                          />
                  )}

                  {/* 大运信息 */}
                  {fortune.daYun && (
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-400 mb-3 px-1 uppercase tracking-wider flex items-center gap-1">
                              <Crown size={14} /> {t('ui:todayPage.currentDayun')}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl">
                            <div className="text-2xl font-black">{fortune.daYun.gan_zhi}</div>
                          </div>
                          <div>
                                  <div className="text-xs text-gray-400">{t('ui:todayPage.startAge')}</div>
                                  <div className="text-sm font-bold text-gray-800">{fortune.daYun.age}{t('ui:todayPage.yearsOld')}</div>
                          </div>
                        </div>
                        <div className="text-right">
                                <div className="text-xs text-gray-400">{t('ui:todayPage.dayunCycle')}</div>
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
                              <Sparkles size={14} /> {t('ui:todayPage.todayShenSha')}
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
          )}
            </div>
        </div>

          {/* 右侧栏：成就与快捷操作 */}
          <QuickActionsSidebar
            onCheckin={() => navigate('/app/checkin')}
            onAchievements={() => navigate('/app/achievements')}
            onHistory={() => navigate('/app/history')}
            onTrends={() => navigate('/app/trends')}
            onKnowledge={() => navigate('/app/knowledge')}
            onAIDeduction={() => navigate('/app/ai')}
            onLifeMap={() => navigate('/app/lifemap')}
            onDatePicker={() => navigate('/app/datepicker')}
            onFortuneStick={() => navigate('/app/fortune-stick')}
            onContact={() => setShowContact(true)}
            onGenerateImage={handleGenerateImage}
            isGenerating={isGenerating}
            hasFortune={!!fortune}
          />
        </div>
        {/* ========== PC端布局结束 ========== */}

        {/* --- 图片预览/下载弹窗 --- */}
        {generatedImage && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="bg-white p-2 rounded-2xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
               <img src={generatedImage} alt={t('ui:desktop.fortuneSign')} className="rounded-xl object-contain max-h-full" />
             </div>
             <div className="mt-6 flex flex-col items-center gap-3">
               <p className="text-white/80 text-sm font-medium">{t('ui:desktop.longPressToSave')}</p>
               <div className="flex gap-4">
                 <motion.button
                   onClick={() => setGeneratedImage(null)}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-white/10 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md border border-white/20"
                 >
                   {t('ui:desktop.close')}
                 </motion.button>
                 <motion.a
                   href={generatedImage}
                   download={`${t('ui:desktop.fortuneSign')}-${fortune?.dateStr}.png`}
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                 >
                   <Download size={18} /> {t('ui:desktop.saveImage')}
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

        {/* ========== 懒加载弹窗组件 ========== */}
        <Suspense fallback={<LazyLoadFallback fullScreen />}>
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
                  return record ? record.fortune.totalScore : null;
              } catch {
                return null;
              }
            }}
          />
        )}

          {/* 运势对比 */}
          <FortuneCompare
            isOpen={showCompare}
            onClose={() => setShowCompare(false)}
            onSelectDate={(date) => {
              setCurrentDate(date);
              setShowCompare(false);
            }}
          />

          {/* 反馈弹窗 */}
          {fortune && (
            <FeedbackModal
              isOpen={showFeedback}
              onClose={() => setShowFeedback(false)}
              date={fortune.dateStr}
              onFeedbackSubmit={() => {
                haptics.success(); // 反馈提交成功震动
              }}
            />
          )}

          {/* 联系我们 */}
          <ContactModal
            isOpen={showContact}
            onClose={() => setShowContact(false)}
          />

          {/* 通知设置 */}
          <Suspense fallback={null}>
            <NotificationSettings
              isOpen={showNotificationSettings}
              onClose={() => setShowNotificationSettings(false)}
            />
          </Suspense>

          {/* 任务面板 */}
          <Suspense fallback={null}>
            <TaskPanel
              isOpen={showTaskPanel}
              onClose={() => setShowTaskPanel(false)}
            />
          </Suspense>

          {/* 运势报告 */}
          <Suspense fallback={null}>
            <ReportModal
              isOpen={showReport}
              onClose={() => setShowReport(false)}
            />
          </Suspense>

          {/* 日记编辑 */}
          {fortune && (
            <Suspense fallback={null}>
              <DiaryModal
                isOpen={showDiary}
                onClose={() => setShowDiary(false)}
                date={fortune.dateStr || new Date().toISOString().split('T')[0]}
                fortuneScore={fortune.totalScore}
                onSave={() => {
                  updateTaskProgress('daily_diary');
                }}
              />
            </Suspense>
          )}

          {/* 日记回顾 */}
          <Suspense fallback={null}>
            <DiaryReview
              isOpen={showDiaryReview}
              onClose={() => setShowDiaryReview(false)}
            />
          </Suspense>

          {/* 开发者仪表板 */}
          <Suspense fallback={null}>
            <DeveloperDashboard
              isOpen={showDeveloperDashboard}
              onClose={() => setShowDeveloperDashboard(false)}
            />
          </Suspense>
        </Suspense>

      </div>
    </div>
          </AppContextProvider>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}