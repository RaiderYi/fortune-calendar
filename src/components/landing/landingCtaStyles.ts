/** 首页主 CTA：与 designTokens primary（Tailwind primary.*）一致，首屏与底部共用 */
export const LANDING_PRIMARY_CTA_CLASSNAME =
  'group rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold shadow-xl shadow-primary-500/25 transition-all duration-300 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950';

export const landingPrimaryCtaPadding = (size: 'hero' | 'footer') =>
  size === 'footer' ? 'px-10 py-4 text-lg w-full sm:w-auto' : 'px-8 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg w-full sm:w-auto';
