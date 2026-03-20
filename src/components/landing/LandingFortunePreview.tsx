// ==========================================
// 首页 Hero 产品预览（示意 UI，贴近真实今日运势结构）
// ==========================================

import { Sparkles } from 'lucide-react';

interface LandingFortunePreviewProps {
  isEnglish: boolean;
}

const DIMS_ZH = ['事业', '财运', '桃花', '健康', '学业', '出行'];
const DIMS_EN = ['Career', 'Wealth', 'Love', 'Health', 'Study', 'Travel'];
const SCORES = [85, 72, 68, 90, 75, 80];

export default function LandingFortunePreview({ isEnglish }: LandingFortunePreviewProps) {
  const dims = isEnglish ? DIMS_EN : DIMS_ZH;
  const today = new Date();
  const dateStr = today.toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-600/80 bg-white dark:bg-slate-800/95 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-500 via-primary-600 to-violet-600"
        aria-hidden
      />
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-5 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {isEnglish ? 'Today' : '今日运势'}
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{dateStr}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-3xl sm:text-4xl font-black tabular-nums text-slate-900 dark:text-white">
              78
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isEnglish ? 'Overall' : '综合分'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200 dark:to-slate-600" />
          <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">
            {isEnglish ? 'Six dimensions' : '六维概览'}
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200 dark:to-slate-600" />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          {dims.map((dim, i) => (
            <div
              key={dim}
              className="rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/80 py-2 px-1 text-center"
            >
              <div className="text-sm font-bold tabular-nums text-slate-900 dark:text-white">{SCORES[i]}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{dim}</div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-950/40 dark:to-violet-950/30 border border-primary-100/80 dark:border-primary-900/40 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
            <span className="text-xs font-semibold text-primary-800 dark:text-primary-200">
              {isEnglish ? "Today's theme" : '今日主题'}
            </span>
          </div>
          <p className="font-bold text-slate-900 dark:text-white">
            {isEnglish ? 'Steady progress' : '稳扎稳打'}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            {isEnglish
              ? 'Favor planning; pace major decisions.'
              : '利于规划与沉淀，大事不宜冒进。'}
          </p>
        </div>

        <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-4">
          {isEnglish ? 'Preview · actual scores after you add birth data' : '示意界面 · 填写出生信息后可查看真实评分'}
        </p>
      </div>
    </div>
  );
}
