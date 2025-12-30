import { Crown, Eye, EyeOff } from 'lucide-react';

interface FortuneCardProps {
  mainTheme: {
    keyword: string;
    subKeyword: string;
    emoji: string;
    description: string;
  };
  totalScore: number;
  pillars: {
    year: string;
    month: string;
    day: string;
  };
  themeStyle: {
    bg: string;
    text: string;
  };
  showBazi: boolean;
  onToggleBazi: () => void;
}

export default function FortuneCard({
  mainTheme,
  totalScore,
  pillars,
  themeStyle,
  showBazi,
  onToggleBazi
}: FortuneCardProps) {
  return (
    <div
      className="mt-4 rounded-[2rem] p-6 shadow-lg relative overflow-hidden group"
      style={{ background: themeStyle.bg }}
    >
      {/* 背景装饰 Emoji */}
      <div className="absolute -right-6 -top-6 text-[10rem] opacity-10 select-none pointer-events-none rotate-12">
        {mainTheme.emoji}
      </div>

      {/* 主内容 */}
      <div className="relative z-10" style={{ color: themeStyle.text }}>
        {/* 顶部：标签 + 分数 */}
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-1 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
            <Crown size={12} className="opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
              Today's Vibe
            </span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter leading-none">
                {totalScore}
              </span>
              <span className="text-xs font-medium opacity-60">分</span>
            </div>
          </div>
        </div>

        {/* 主题关键词 */}
        <div className="mb-5">
          <h2 className="text-6xl font-black tracking-tighter mb-2 drop-shadow-sm">
            {mainTheme.keyword}
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
              <span className="text-lg">{mainTheme.emoji}</span>
              {mainTheme.subKeyword}
            </span>
          </div>
        </div>

        {/* 八字显示开关 */}
        <div className="mb-3">
          <button
            onClick={onToggleBazi}
            className="text-[10px] opacity-50 hover:opacity-100 transition flex items-center gap-1.5 bg-black/5 px-2 py-1 rounded hover:bg-black/10 w-fit"
          >
            {showBazi ? <EyeOff size={10} /> : <Eye size={10} />}
            {showBazi
              ? `${pillars.year} / ${pillars.month} / ${pillars.day}`
              : '查看今日天机密码'}
          </button>
        </div>

        {/* 主题描述 */}
        <p className="text-sm font-medium opacity-90 leading-relaxed bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
          "{mainTheme.description}"
        </p>
      </div>
    </div>
  );
}