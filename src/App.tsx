import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Settings, Share2, Eye, EyeOff,
  Briefcase, Coins, Heart, Zap, BookOpen, Map, Sparkles, TrendingUp,
  Crown, Loader2, X, Download
} from 'lucide-react';

// @ts-ignore
import html2canvas from 'html2canvas';

type DimensionType = 'career' | 'wealth' | 'romance' | 'health' | 'academic' | 'travel';

interface DimensionAnalysis {
  score: number;
  level: '吉' | '平' | '凶';
  tag: string;
  inference: string;
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
}

interface UserProfile {
  name: string;
  birthDate: string;
  birthTime: string;
}

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
  'default': { bg: 'linear-gradient(135deg, #e5e7eb 0%, #9ca3af 100%)', text: '#1f2937' }
};

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [fortune, setFortune] = useState<DailyFortune | null>(null);
  const [showBazi, setShowBazi] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentThemeStyle, setCurrentThemeStyle] = useState(SAFE_THEMES['default']);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : { name: '张三', birthDate: '1995-08-15', birthTime: '09:30' };
  });
  const [editProfile, setEditProfile] = useState<UserProfile>(userProfile);
  const contentRef = useRef<HTMLDivElement>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchFortune = async () => {
      setIsLoading(true);
      try {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const res = await fetch('/api/fortune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date: dateStr,
            birthDate: userProfile.birthDate,
            birthTime: userProfile.birthTime
          }),
        });

        if (res.ok) {
          const backendData = await res.json();
          setFortune({ ...backendData, dateObj: currentDate });

          const keyword = backendData.mainTheme.keyword;
          let themeKey = 'default';
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

  const handleGenerateImage = async () => {
    if (!contentRef.current) return;
    setIsGenerating(true);

    try {
      const originalShowBazi = showBazi;
      if (!showBazi) setShowBazi(true);

      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#F5F5F7',
        logging: false,
        ignoreElements: (element) => {
          return element.classList.contains('no-screenshot');
        }
      });
      const imgData = canvas.toDataURL('image/png');
      setGeneratedImage(imgData);

      setShowBazi(originalShowBazi);
    } catch (error: any) {
      console.error("截图失败:", error);
      alert(`截图失败: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSettings = () => {
    setUserProfile(editProfile);
    localStorage.setItem('user_profile', JSON.stringify(editProfile));
    setIsSettingsOpen(false);
  };

  const changeDate = (days: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + days);
      setCurrentDate(newDate);
      setIsAnimating(false);
    }, 200);
  };

  const getIcon = (type: DimensionType, className: string) => {
    switch (type) {
      case 'career': return <Briefcase className={className} />;
      case 'wealth': return <Coins className={className} />;
      case 'romance': return <Heart className={className} />;
      case 'health': return <Zap className={className} />;
      case 'academic': return <BookOpen className={className} />;
      case 'travel': return <Map className={className} />;
    }
  };

  const getLabel = (type: DimensionType) => {
    switch (type) {
      case 'career': return '事业';
      case 'wealth': return '财运';
      case 'romance': return '情感';
      case 'health': return '健康';
      case 'academic': return '学业';
      case 'travel': return '出行';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', justifyContent: 'center', fontFamily: 'system-ui', color: '#1e293b', userSelect: 'none', overflow: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '448px', background: '#F5F5F7', height: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>

        {/* Top Nav */}
        <div className="px-6 pt-12 pb-4 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">你好，<span className="text-indigo-600">{userProfile.name}</span></h1>
            <div className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles size={10} /> 这里的每一天都为你定制
            </div>
          </div>
          <button
            onClick={() => { setEditProfile(userProfile); setIsSettingsOpen(true); }}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition active:scale-90"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center justify-between px-6 py-2">
          <button onClick={() => changeDate(-1)} className="text-gray-400 hover:text-gray-800 p-2"><ChevronLeft /></button>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black font-mono tracking-tighter">
              {currentDate.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }).replace('/', '.')}
            </span>
            {fortune && (
              <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full mt-1">
                {fortune.weekDay} · {fortune.lunarStr}
              </span>
            )}
          </div>
          <button onClick={() => changeDate(1)} className="text-gray-400 hover:text-gray-800 p-2"><ChevronRight /></button>
        </div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto px-5 pb-24 transition-opacity duration-200 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
          {isLoading || !fortune ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
              <Loader2 className="animate-spin" size={32} />
              <span className="text-sm">大师正在排盘...</span>
            </div>
          ) : (
            <div ref={contentRef} style={{ paddingBottom: '24px', background: '#F5F5F7', paddingLeft: '4px', paddingRight: '4px' }}>
              {/* Hero Card - 完全使用内联样式 */}
              <div
                style={{
                  marginTop: '16px',
                  borderRadius: '32px',
                  padding: '24px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: currentThemeStyle.bg
                }}
              >
                 <div style={{ position: 'absolute', right: '-24px', top: '-24px', fontSize: '10rem', opacity: 0.1, userSelect: 'none', pointerEvents: 'none', transform: 'rotate(12deg)' }}>
                   {fortune.mainTheme.emoji}
                 </div>
                 <div style={{ position: 'relative', zIndex: 10, color: currentThemeStyle.text }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                     <div style={{
                       display: 'inline-flex',
                       alignItems: 'center',
                       gap: '4px',
                       padding: '4px 12px',
                       borderRadius: '9999px',
                       border: '1px solid rgba(255, 255, 255, 0.2)',
                       backgroundColor: 'rgba(255, 255, 255, 0.3)',
                       backdropFilter: 'blur(12px)',
                       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                     }}>
                       <Crown size={12} style={{ opacity: 0.8 }} />
                       <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>Today's Vibe</span>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                       <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1 }}>{fortune.totalScore}</span>
                          <span style={{ fontSize: '12px', fontWeight: 500, opacity: 0.6 }}>分</span>
                       </div>
                     </div>
                   </div>

                   <div style={{ marginBottom: '20px' }}>
                     <h2 style={{ fontSize: '60px', fontWeight: 900, letterSpacing: '-0.05em', marginBottom: '8px', filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}>
                       {fortune.mainTheme.keyword}
                     </h2>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                       <span style={{
                         backgroundColor: 'rgba(255, 255, 255, 0.4)',
                         backdropFilter: 'blur(12px)',
                         padding: '4px 12px',
                         borderRadius: '9999px',
                         fontSize: '14px',
                         fontWeight: 700,
                         border: '1px solid rgba(255, 255, 255, 0.2)',
                         boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                         display: 'flex',
                         alignItems: 'center',
                         gap: '6px'
                       }}>
                          <span style={{ fontSize: '18px' }}>{fortune.mainTheme.emoji}</span>
                          {fortune.mainTheme.subKeyword}
                       </span>
                     </div>
                   </div>

                   <div style={{ marginBottom: '12px' }}>
                     <button
                       onClick={() => setShowBazi(!showBazi)}
                       style={{
                         fontSize: '10px',
                         opacity: 0.5,
                         display: 'flex',
                         alignItems: 'center',
                         gap: '6px',
                         backgroundColor: 'rgba(0, 0, 0, 0.05)',
                         padding: '4px 8px',
                         borderRadius: '4px',
                         border: 'none',
                         cursor: 'pointer',
                         width: 'fit-content'
                       }}
                       onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                       onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
                     >
                         {showBazi ? <EyeOff size={10} /> : <Eye size={10} />}
                         <span>{showBazi ? `${fortune.pillars.year} / ${fortune.pillars.month} / ${fortune.pillars.day}` : '查看今日天机密码'}</span>
                     </button>
                   </div>

                   <p style={{
                     fontSize: '14px',
                     fontWeight: 500,
                     opacity: 0.9,
                     lineHeight: 1.625,
                     backgroundColor: 'rgba(255, 255, 255, 0.2)',
                     padding: '16px',
                     borderRadius: '16px',
                     backdropFilter: 'blur(12px)',
                     border: '1px solid rgba(255, 255, 255, 0.1)',
                     boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
                   }}>
                     "{fortune.mainTheme.description}"
                   </p>
                 </div>
              </div>

              {/* Todo List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginTop: '16px' }}>
                 {fortune.todo.map((item, idx) => (
                   <div
                     key={idx}
                     style={{
                       padding: '16px',
                       borderRadius: '16px',
                       display: 'flex',
                       flexDirection: 'column',
                       justifyContent: 'space-between',
                       boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                       border: '1px solid transparent',
                       backgroundColor: item.type === 'up' ? '#ffffff' : 'rgba(229, 231, 235, 0.5)'
                     }}
                   >
                     <span
                       style={{
                         fontSize: '10px',
                         fontWeight: 900,
                         padding: '2px 8px',
                         borderRadius: '4px',
                         width: 'fit-content',
                         marginBottom: '8px',
                         textTransform: 'uppercase',
                         letterSpacing: '0.05em',
                         backgroundColor: item.type === 'up' ? '#d1fae5' : '#ffe4e6',
                         color: item.type === 'up' ? '#047857' : '#be123c'
                       }}
                     >
                       {item.label}
                     </span>
                     <span style={{ fontWeight: 700, color: '#374151', lineHeight: 1.25, fontSize: '14px' }}>{item.content}</span>
                   </div>
                 ))}
              </div>

              {/* Stats Grid */}
              <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#9ca3af', marginBottom: '12px', paddingLeft: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> <span>深度推演</span>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  {(Object.keys(fortune.dimensions) as DimensionType[]).map((key) => {
                    const item = fortune.dimensions[key];
                    const isGood = item.level === '吉';
                    const isBad = item.level === '凶';

                    return (
                      <div
                        key={key}
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '16px',
                          borderRadius: '16px',
                          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                          border: '1px solid #f3f4f6',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                            backgroundColor: isGood ? '#ffedd5' : isBad ? '#f3f4f6' : '#dbeafe',
                            color: isGood ? '#ea580c' : isBad ? '#9ca3af' : '#2563eb'
                          }}
                        >
                          {getIcon(key, "")}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 700, color: '#1e293b' }}>{getLabel(key)}</span>
                            <span
                              style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid',
                                fontWeight: 500,
                                backgroundColor: isGood ? '#fff7ed' : isBad ? '#f9fafb' : '#eff6ff',
                                borderColor: isGood ? '#ffedd5' : isBad ? '#f3f4f6' : '#dbeafe',
                                color: isGood ? '#ea580c' : isBad ? '#9ca3af' : '#2563eb'
                              }}
                            >
                              {item.tag}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.625, textAlign: 'justify' }}>{item.inference}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', height: '100%', minWidth: '32px' }}>
                           <span
                             style={{
                               fontSize: '14px',
                               fontWeight: 700,
                               fontFamily: 'monospace',
                               color: isGood ? '#ea580c' : isBad ? '#9ca3af' : '#2563eb'
                             }}
                           >
                            {item.score}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Button */}
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

        {/* Image Modal */}
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

        {/* Settings Modal */}
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
                </div>
                <div className="mt-8">
                  <button onClick={handleSaveSettings} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 active:scale-95 transition">保存并重排运势</button>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}