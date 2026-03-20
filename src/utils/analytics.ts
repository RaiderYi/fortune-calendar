// ==========================================
// 增长埋点：可选 GA4 + 站内 CustomEvent（便于接 Plausible / 自建）
// ==========================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

/**
 * 初始化 gtag（无测量 ID 时为空操作，生产需在 Vercel 配置 VITE_GA_MEASUREMENT_ID）
 */
export function initAnalytics(): void {
  if (typeof window === 'undefined' || !GA_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { send_page_view: false });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

/**
 * SPA 页面浏览（path 建议含 query，如 /blog?lang=en）
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  const title = pageTitle ?? (typeof document !== 'undefined' ? document.title : '');
  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_path: pagePath,
      page_title: title,
    });
  }
  dispatchAnalytics({ type: 'page_view', page_path: pagePath, page_title: title });
  if (import.meta.env.DEV) {
    console.debug('[analytics] page_view', pagePath, title);
  }
}

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

/**
 * 自定义事件（GA4 推荐 snake_case 事件名）
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams): void {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined)
  ) as Record<string, string | number | boolean>;

  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, clean);
  }
  dispatchAnalytics({ type: 'event', name: eventName, params: clean });
  if (import.meta.env.DEV) {
    console.debug('[analytics] event', eventName, clean);
  }
}

function dispatchAnalytics(detail: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('fc_analytics', { detail }));
  } catch {
    /* ignore */
  }
}
