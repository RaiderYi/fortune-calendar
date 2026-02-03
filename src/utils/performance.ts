// ==========================================
// 性能监控与优化工具
// ==========================================

/**
 * 性能指标类型
 */
export interface PerformanceMetrics {
  FCP: number | null; // First Contentful Paint
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  TTFB: number | null; // Time to First Byte
}

/**
 * 收集 Web Vitals 性能指标
 */
export function collectWebVitals(callback: (metrics: Partial<PerformanceMetrics>) => void) {
  // First Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      // FCP
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
        if (fcpEntry) {
          callback({ FCP: fcpEntry.startTime });
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      // LCP
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          callback({ LCP: lastEntry.startTime });
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // FID
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0] as PerformanceEventTiming;
        if (firstEntry) {
          callback({ FID: firstEntry.processingStart - firstEntry.startTime });
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });

      // CLS
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            callback({ CLS: clsValue });
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

    } catch (e) {
      console.warn('Performance observation failed:', e);
    }
  }

  // TTFB
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navEntry) {
      callback({ TTFB: navEntry.responseStart - navEntry.requestStart });
    }
  }
}

/**
 * 报告性能指标到 Google Analytics
 */
export function reportToAnalytics(metrics: Partial<PerformanceMetrics>) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    Object.entries(metrics).forEach(([name, value]) => {
      if (value !== null && value !== undefined) {
        (window as any).gtag('event', name, {
          event_category: 'Web Vitals',
          value: Math.round(value),
          non_interaction: true,
        });
      }
    });
  }
}

/**
 * 预加载关键资源
 */
export function preloadCriticalResources() {
  const resources = [
    { href: '/api/fortune', as: 'fetch', crossOrigin: 'anonymous' },
  ];

  resources.forEach(({ href, as, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossOrigin) {
      link.crossOrigin = crossOrigin;
    }
    document.head.appendChild(link);
  });
}

/**
 * 延迟加载非关键脚本
 */
export function deferNonCriticalScripts(scripts: string[]) {
  if (typeof window === 'undefined') return;

  // 等待页面空闲时加载
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      scripts.forEach(loadScript);
    });
  } else {
    setTimeout(() => {
      scripts.forEach(loadScript);
    }, 2000);
  }
}

function loadScript(src: string) {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

/**
 * 图片预加载
 */
export function preloadImages(urls: string[]): Promise<void[]> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function (...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 检测网络状况
 */
export function getNetworkInfo(): {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
} | null {
  if ('connection' in navigator) {
    const conn = (navigator as any).connection;
    return {
      effectiveType: conn.effectiveType || 'unknown',
      downlink: conn.downlink || 0,
      rtt: conn.rtt || 0,
      saveData: conn.saveData || false,
    };
  }
  return null;
}

/**
 * 根据网络状况调整资源加载策略
 */
export function shouldLoadHighQuality(): boolean {
  const networkInfo = getNetworkInfo();
  if (!networkInfo) return true;
  
  // 在慢速网络或省流量模式下降低质量
  if (networkInfo.saveData) return false;
  if (networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') return false;
  if (networkInfo.rtt > 500) return false;
  
  return true;
}
