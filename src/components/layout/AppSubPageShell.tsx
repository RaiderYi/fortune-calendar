// ==========================================
// App 子页面统一外壳 — 顶栏 / 返回 / 留白 / 深浅主题
// ==========================================

import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ReactNode } from 'react';

const LIGHT_HEADER: Record<'brand' | 'spectrum' | 'rose', string> = {
  brand: 'bg-gradient-to-r from-violet-600 to-indigo-600',
  spectrum: 'bg-gradient-to-r from-indigo-600 to-purple-600',
  rose: 'bg-gradient-to-r from-rose-600 to-pink-600',
};

const DARK_PAGE: Record<'slate' | 'amber' | 'red' | 'purple', string> = {
  slate: 'bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950',
  amber: 'bg-gradient-to-b from-amber-950 via-slate-950 to-slate-950',
  red: 'bg-gradient-to-b from-red-950 via-slate-950 to-slate-950',
  purple: 'bg-gradient-to-b from-purple-950 via-slate-950 to-slate-950',
};

export type AppSubPageLightTone = keyof typeof LIGHT_HEADER;
export type AppSubPageDarkTone = keyof typeof DARK_PAGE;

type BaseProps = {
  title: string;
  icon?: LucideIcon;
  /** 图标颜色（深色顶栏内） */
  iconClassName?: string;
  backTo?: string;
  /** 顶栏标题下说明文案 */
  subtitle?: ReactNode;
  /** 顶栏第一行右侧 */
  headerEnd?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  rootClassName?: string;
  /** 是否显示「返回」文案（移动端可关，仅图标） */
  showBackText?: boolean;
};

type LightProps = BaseProps & {
  variant: 'light';
  lightTone?: AppSubPageLightTone;
  /** 顶栏第二行：筛选器、Tab 等 */
  headerBottom?: ReactNode;
  /** 外层是否可滚动（默认 true） */
  scrollable?: boolean;
};

type DarkProps = BaseProps & {
  variant: 'dark';
  darkTone?: AppSubPageDarkTone;
};

export type AppSubPageShellProps = LightProps | DarkProps;

export function AppSubPageShell(props: AppSubPageShellProps) {
  const { t } = useTranslation('common');
  const {
    title,
    icon: Icon,
    iconClassName = '',
    backTo = '/app/fortune/today',
    subtitle,
    headerEnd,
    children,
    contentClassName = '',
    rootClassName = '',
    showBackText = false,
  } = props;

  const backLabel = t('buttons.back', { defaultValue: '返回' });

  const backButtonClass =
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1 rounded-xl p-2 text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50';

  if (props.variant === 'light') {
    const tone = props.lightTone ?? 'brand';
    const headerBottom = props.headerBottom;
    const scrollable = props.scrollable !== false;
    const contentFlex =
      scrollable === false
        ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
        : '';

    return (
      <div
        className={`flex min-h-full flex-col bg-[var(--bg-primary)] dark:bg-slate-900 pb-24 ${scrollable ? 'overflow-y-auto' : 'min-h-0'} ${rootClassName}`}
      >
        <header
          className={`sticky top-0 z-[11] shrink-0 rounded-b-2xl p-4 text-white shadow-lg shadow-black/15 lg:p-6 ${LIGHT_HEADER[tone]}`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Link to={backTo} className={backButtonClass} aria-label={backLabel}>
                <ChevronLeft size={24} strokeWidth={2.25} />
                {showBackText ? <span className="text-sm font-medium">{backLabel}</span> : null}
              </Link>
              {Icon ? (
                <Icon size={24} className="shrink-0 opacity-95" aria-hidden />
              ) : null}
              <h1 className="truncate text-lg font-bold tracking-tight lg:text-xl">{title}</h1>
            </div>
            {headerEnd ? <div className="shrink-0">{headerEnd}</div> : null}
          </div>
          {subtitle ? <p className="mt-3 text-sm leading-relaxed text-white/90">{subtitle}</p> : null}
          {headerBottom ? <div className="mt-4">{headerBottom}</div> : null}
        </header>
        <div className={`flex-1 p-4 lg:p-6 ${contentFlex} ${contentClassName}`}>{children}</div>
      </div>
    );
  }

  const darkTone = props.darkTone ?? 'slate';
  return (
    <div className={`min-h-full pb-24 text-white ${DARK_PAGE[darkTone]} ${rootClassName}`}>
      <header className="sticky top-0 z-[11] flex items-center gap-3 border-b border-white/10 bg-slate-950/80 px-4 py-3.5 backdrop-blur-md supports-[backdrop-filter]:bg-slate-950/70">
        <Link to={backTo} className={backButtonClass} aria-label={backLabel}>
          <ChevronLeft size={22} strokeWidth={2.25} />
          {showBackText ? <span className="text-sm font-medium">{backLabel}</span> : null}
        </Link>
        {Icon ? <Icon size={22} className={`shrink-0 ${iconClassName}`} aria-hidden /> : null}
        <h1 className="text-lg font-bold tracking-tight">{title}</h1>
        {headerEnd ? <div className="ml-auto shrink-0">{headerEnd}</div> : null}
      </header>
      {subtitle ? <div className="border-b border-white/10 px-4 py-2 text-sm text-white/75">{subtitle}</div> : null}
      <div className={`mx-auto w-full max-w-lg px-4 py-6 ${contentClassName}`}>{children}</div>
    </div>
  );
}

export default AppSubPageShell;
