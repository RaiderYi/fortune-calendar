import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import FortuneCard from './components/FortuneCard';
import DimensionCard from './components/DimensionCard';
import HistoryDrawer from './components/HistoryDrawer';
import TrendsView from './components/TrendsView';
import CalendarView from './components/CalendarView';
import { saveHistory } from './utils/historyStorage';
import type { HistoryRecord } from './utils/historyStorage';
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
  level: '吉' | '平' | '凶';
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
  tenGods: string[];
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

interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
  city: string;      // 新增：城市
  longitude: string; // 新增：经度 (用string方便输入框处理)
  gender: 'male' | 'female'; // 新增：性别
}

// ==========================================
// 主组件
// ==========================================

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [showBazi, setShowBazi] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // UI 状态
  const [currentThemeStyle, setCurrentThemeStyle] = useState(SAFE_THEMES['default']);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // 历史记录抽屉
  const [showTrends, setShowTrends] = useState(false); // 趋势视图
  const [showCalendar, setShowCalendar] = useState(false); // 日历视图

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
  const [editProfile, setEditProfile] = useState<UserProfile>(userProfile);

  // 截图相关
  const contentRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
            gender: userProfile.gender // 新增：传递性别给后端
          }),
        });

        if (res.ok) {
          const backendData = await res.json();
          setFortune({ ...backendData, dateObj: currentDate });

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
  }, [currentDate, userProfile]);

  // --- 截图逻辑（使用html-to-image，完美支持lab颜色）---
  const handleGenerateImage = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      const originalShowBazi = showBazi;
      if (!showBazi) setShowBazi(true);
      
      // 等待DOM更新
      await new Promise(resolve => setTimeout(resolve, 300));

      // 使用 html-to-image（原生支持所有现代CSS颜色）
      const dataUrl = await toPng(contentRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#F5F5F7',
        filter: (node) => {
          // 过滤不需要截图的元素
          if (node.classList) {
            return !node.classList.contains('no-screenshot');
          }
          return true;
        },
      });

      setGeneratedImage(dataUrl);
      setShowBazi(originalShowBazi);

      console.log('✅ 截图成功！');

    } catch (error: any) {
      console.error('截图失败:', error);
      alert('截图功能暂时不可用，请稍后再试');
    } finally {
      setIsGenerating(false);
    }
  };


  // --- 保存设置 ---
  const handleSaveSettings = () => {
    setUserProfile(editProfile);
    localStorage.setItem('user_profile', JSON.stringify(editProfile));
    setIsSettingsOpen(false);
  };

  // --- 城市选择处理 ---
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    const lng = CHINA_CITIES[city];
    setEditProfile({
      ...editProfile,
      city: city,
      longitude: lng ? lng.toString() : editProfile.longitude
    });
  };

  // --- 日期切换 ---
  const changeDate = (days: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + days);
      setCurrentDate(newDate);
      setIsAnimating(false);
    }, 200);
  };


  // 格式化日期为 YYYY-MM-DD 供 input 使用
  const formattedDateValue = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', justifyContent: 'center', fontFamily: 'system-ui', color: '#1e293b', userSelect: 'none', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '448px', background: '#F5F5F7', height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

        {/* --- 顶部导航 --- */}
        <Header
          userName={userProfile.name}
          onSettingsClick={() => { setEditProfile(userProfile); setIsSettingsOpen(true); }}
          onHistoryClick={() => setShowHistory(true)}
          onTrendsClick={() => setShowTrends(true)}
          onCalendarClick={() => setShowCalendar(true)}
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

        {/* --- 核心内容区 --- */}
        <div className={`flex-1 overflow-y-auto px-5 pb-24 transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          {isLoading || !fortune ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">大师正在排盘...</span>
            </div>
          ) : (
            // 截图区域容器
            <div ref={contentRef} style={{ paddingBottom: '24px', background: '#F5F5F7', paddingLeft: '4px', paddingRight: '4px' }}>
              {/* 主运势卡片 */}
              <FortuneCard
                mainTheme={fortune.mainTheme}
                totalScore={fortune.totalScore}
                pillars={fortune.pillars}
                themeStyle={currentThemeStyle}
                showBazi={showBazi}
                onToggleBazi={() => setShowBazi(!showBazi)}
              />

              {/* Todo List */}
              <div className="grid grid-cols-2 gap-3 mt-4">
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
                <div className="mt-6 space-y-4">
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
            </div>
          )}
        </div>



        {/* --- 底部悬浮按钮 --- */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20 no-screenshot">
           <button
             onClick={handleGenerateImage}
             disabled={isGenerating || !fortune}
             className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl shadow-slate-300 font-bold active:scale-95 transition hover:bg-black hover:scale-105 disabled:opacity-70"
           >
             {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Share2 size={18} />}
             {isGenerating ? '生成中...' : '生成日签'}
           </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F5F5F7] to-transparent pointer-events-none z-10"></div>

        {/* --- 图片预览/下载弹窗 --- */}
        {generatedImage && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="bg-white p-2 rounded-2xl shadow-2xl max-h-[70vh] overflow-hidden flex flex-col">
               <img src={generatedImage} alt="今日运势" className="rounded-xl object-contain max-h-full" />
             </div>
             <div className="mt-6 flex flex-col items-center gap-3">
               <p className="text-white/80 text-sm font-medium">长按图片保存，或点击下方按钮</p>
               <div className="flex gap-4">
                 <button
                   onClick={() => setGeneratedImage(null)}
                   className="bg-white/10 text-white px-6 py-3 rounded-full font-bold backdrop-blur-md border border-white/20"
                 >
                   关闭
                 </button>
                 <a
                   href={generatedImage}
                   download={`运势日签-${fortune?.dateStr}.png`}
                   className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                 >
                   <Download size={18} /> 保存图片
                 </a>
               </div>
             </div>
          </div>
        )}

        {/* --- 设置弹窗 --- */}
        {isSettingsOpen && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
             <div className="bg-white w-full rounded-3xl p-6 shadow-2xl scale-in-center">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">个人档案</h3>
                  <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                    <X size={24} className="text-gray-500"/>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">昵称</label>
                    <input type="text" value={editProfile.name} onChange={e => setEditProfile({...editProfile, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">出生日期</label>
                    <input type="date" value={editProfile.birthDate} onChange={e => setEditProfile({...editProfile, birthDate: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">出生时间</label>
                    <input type="time" value={editProfile.birthTime} onChange={e => setEditProfile({...editProfile, birthTime: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  {/* 新增：性别选择 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">性别 (影响大运排序)</label>
                    <select
                      value={editProfile.gender}
                      onChange={e => setEditProfile({...editProfile, gender: e.target.value as 'male' | 'female'})}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                    >
                      <option value="male">男</option>
                      <option value="female">女</option>
                    </select>
                  </div>
                  {/* 新增：出生城市/经度 */}
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">出生城市 (真太阳时校准)</label>
                    <div className="flex gap-2">
                      <select
                        value={editProfile.city}
                        onChange={handleCityChange}
                        className="w-2/3 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                      >
                        <option value="">选择城市</option>
                        {Object.keys(CHINA_CITIES)
                          .sort((a, b) => a.localeCompare(b, 'zh-CN'))
                          .map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                      </select>
                      <div className="w-1/3 relative">
                         <input
                           type="text"
                           value={editProfile.longitude}
                           onChange={e => setEditProfile({...editProfile, longitude: e.target.value})}
                           placeholder="经度"
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                         />
                         <span className="absolute right-3 top-3 text-xs text-gray-400">°E</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button onClick={handleSaveSettings} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition">保存并重排运势</button>
                  <p className="text-center text-[10px] text-gray-400 mt-3">已支持 {Object.keys(CHINA_CITIES).length} 个城市，真太阳时校准</p>
                </div>
             </div>
          </div>
        )}

        {/* 历史记录抽屉 */}
        <HistoryDrawer
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          onSelectDate={(date) => {
            setCurrentDate(date);
            setShowHistory(false);
          }}
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

      </div>
    </div>
  );
}