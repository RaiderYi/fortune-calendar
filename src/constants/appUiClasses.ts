// ==========================================
// App 内子页面 — 统一 Tailwind 片段（深色/浅色表单与卡片）
// 与 AppSubPageShell 配合，避免各页复制粘贴不一致
// ==========================================

/** 深色沉浸式页 — 多行文本框 */
export const appDarkTextareaClass =
  'w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-violet-500/40 resize-none';

/** 深色页 — 主操作按钮（渐变，与浅色顶栏 brand 一致） */
export const appDarkPrimaryButtonClass =
  'w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition hover:from-violet-500 hover:to-indigo-500';

/** 深色页 — 次要实心按钮（靛蓝，适合解梦等） */
export const appDarkSecondaryButtonClass =
  'w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition';

/** 深色页 — 紫色主按钮（塔罗） */
export const appDarkPurpleButtonClass =
  'w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition';

/** 深色页 — 信息/结果卡片 */
export const appDarkResultCardClass =
  'rounded-2xl bg-white/5 border border-white/10 p-4 text-sm leading-relaxed';

/** 浅色内容区 — 统计/信息卡片 */
export const appLightPanelClass =
  'rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-card border border-gray-100 dark:border-slate-700';

/** 浅色页内容区外层 */
export const appLightContentBgClass = 'bg-[var(--bg-primary)] dark:bg-slate-900';

/** 主行动：靛紫渐变按钮（与顶栏 spectrum 一致） */
export const appSpectrumCtaButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 font-bold text-white shadow-md transition hover:from-indigo-500 hover:to-purple-500';
