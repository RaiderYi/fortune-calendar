// ==========================================
// SEO 工具函数
// ==========================================

export function updateSEOMeta(language: string) {
  // 动态导入 SEO 翻译
  const seoData = language === 'en' 
    ? require('../locales/en/seo.json')
    : require('../locales/zh/seo.json');

  // 更新 title
  if (document.title !== seoData.title) {
    document.title = seoData.title;
  }

  // 更新 meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', seoData.description);

  // 更新 meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', seoData.keywords);

  // 更新 Open Graph
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

  // 更新 html lang 属性
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';

  // 更新 hreflang 标签
  updateHreflangTags();
}

function updateHreflangTags() {
  // 移除现有的 hreflang 标签
  const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
  existingHreflangs.forEach(tag => tag.remove());

  // 添加新的 hreflang 标签
  const baseUrl = window.location.origin + window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  
  ['zh', 'en'].forEach(lang => {
    urlParams.set('lang', lang);
    const url = `${baseUrl}?${urlParams.toString()}`;
    
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', lang === 'zh' ? 'zh-CN' : 'en');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  });

  // 添加 x-default
  urlParams.delete('lang');
  const defaultUrl = `${baseUrl}?${urlParams.toString()}`;
  const defaultLink = document.createElement('link');
  defaultLink.setAttribute('rel', 'alternate');
  defaultLink.setAttribute('hreflang', 'x-default');
  defaultLink.setAttribute('href', defaultUrl);
  document.head.appendChild(defaultLink);
}
