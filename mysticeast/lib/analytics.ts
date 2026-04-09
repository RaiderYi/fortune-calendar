// ==========================================
// MysticEast Analytics: GA4 + CustomEvent
// ==========================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string | undefined;

export type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

/**
 * Track custom event (snake_case naming convention)
 */
export function trackEvent(eventName: string, params?: AnalyticsEventParams): void {
  const clean = Object.fromEntries(
    Object.entries(params || {}).filter(([, v]) => v !== undefined)
  ) as Record<string, string | number | boolean>;

  if (GA_ID && typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, clean);
  }
  dispatchAnalytics({ type: 'event', name: eventName, params: clean });
  if (process.env.NODE_ENV === 'development') {
    console.debug('[mysticeast-analytics] event', eventName, clean);
  }
}

/**
 * Track page view
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
  if (process.env.NODE_ENV === 'development') {
    console.debug('[mysticeast-analytics] page_view', pagePath, title);
  }
}

function dispatchAnalytics(detail: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent('mysticeast_analytics', { detail }));
  } catch {
    /* ignore */
  }
}