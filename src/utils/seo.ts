// ==========================================
// SEO 工具函数（全局默认 + 按路由覆盖）
// ==========================================

import zhSeo from '../locales/zh/seo.json';
import enSeo from '../locales/en/seo.json';
import zhRoutes from '../locales/zh/seo.routes.json';
import enRoutes from '../locales/en/seo.routes.json';

type RouteSeoEntry = {
  title: string;
  description: string;
  keywords?: string;
  og?: { title?: string; description?: string };
};

type BaseSeo = {
  title: string;
  description: string;
  keywords: string;
  og: { title: string; description: string; siteName: string };
};

function matchRouteMeta(
  pathname: string,
  routes: Record<string, RouteSeoEntry>
): RouteSeoEntry | null {
  const raw = pathname.split('?')[0] || '/';
  const path = (raw.replace(/\/+$/, '') || '/') as string;

  if (routes[path]) {
    return routes[path];
  }

  let best: { len: number; meta: RouteSeoEntry } | null = null;
  for (const key of Object.keys(routes)) {
    const k = (key.replace(/\/+$/, '') || '/') as string;
    if (k === '/') continue;
    if (path === k || path.startsWith(`${k}/`)) {
      if (!best || k.length > best.len) {
        best = { len: k.length, meta: routes[key] };
      }
    }
  }
  return best?.meta ?? null;
}

function mergeSeo(base: BaseSeo, route: RouteSeoEntry | null): BaseSeo {
  if (!route) {
    return { ...base };
  }
  const ogTitle = route.og?.title ?? route.title ?? base.og.title;
  const ogDesc = route.og?.description ?? route.description ?? base.og.description;
  return {
    title: route.title || base.title,
    description: route.description || base.description,
    keywords: route.keywords ?? base.keywords,
    og: {
      ...base.og,
      title: ogTitle,
      description: ogDesc,
    },
  };
}

function getMergedSeo(language: string, pathname: string): BaseSeo {
  const baseRaw = language === 'en' ? enSeo : zhSeo;
  const base: BaseSeo = {
    title: baseRaw.title,
    description: baseRaw.description,
    keywords: baseRaw.keywords,
    og: { ...baseRaw.og },
  };
  const routes = (language === 'en' ? enRoutes : zhRoutes) as Record<string, RouteSeoEntry>;
  const routeMeta = matchRouteMeta(pathname, routes);
  return mergeSeo(base, routeMeta);
}

/**
 * 更新页面 SEO；pathname 为当前路由（不含 query），用于按页 title/description。
 */
export function updateSEOMeta(language: string, pathname: string = '/'): void {
  const seoData = getMergedSeo(language, pathname);

  if (document.title !== seoData.title) {
    document.title = seoData.title;
  }

  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', seoData.description);

  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', seoData.keywords);

  const updateOGMeta = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('property', property);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  updateOGMeta('og:title', seoData.og.title);
  updateOGMeta('og:description', seoData.og.description);
  updateOGMeta('og:site_name', seoData.og.siteName);
  updateOGMeta('og:locale', language === 'en' ? 'en_US' : 'zh_CN');

  const updateTwitterMeta = (name: string, content: string) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  updateTwitterMeta('twitter:title', seoData.og.title);
  updateTwitterMeta('twitter:description', seoData.og.description);

  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';

  updateHreflangTags();
  syncSPAUrls();
}

/**
 * SPA 路由或查询串变化时，同步 canonical 与 og:url，便于搜索引擎与分享抓取当前页面。
 */
export function syncSPAUrls(): void {
  if (typeof window === 'undefined') return;
  const clean = window.location.href.split('#')[0];

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', clean);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', clean);
}

function updateHreflangTags(): void {
  const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflangs.forEach((tag) => tag.remove());

  const baseUrl = window.location.origin + window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);

  ['zh', 'en'].forEach((lang) => {
    urlParams.set('lang', lang);
    const url = `${baseUrl}?${urlParams.toString()}`;

    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang === 'zh' ? 'zh-CN' : 'en');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  });

  urlParams.delete('lang');
  const defaultUrl = `${baseUrl}?${urlParams.toString()}`;
  const defaultLink = document.createElement('link');
  defaultLink.setAttribute('rel', 'alternate');
  defaultLink.setAttribute('hreflang', 'x-default');
  defaultLink.setAttribute('href', defaultUrl);
  document.head.appendChild(defaultLink);
}
