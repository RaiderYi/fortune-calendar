// ==========================================
// i18n 配置文件
// ==========================================

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import zhCommon from '../locales/zh/common.json';
import zhFortune from '../locales/zh/fortune.json';
import zhBazi from '../locales/zh/bazi.json';
import zhUI from '../locales/zh/ui.json';
import zhSEO from '../locales/zh/seo.json';
import zhKnowledge from '../locales/zh/knowledge.json';

import enCommon from '../locales/en/common.json';
import enFortune from '../locales/en/fortune.json';
import enBazi from '../locales/en/bazi.json';
import enUI from '../locales/en/ui.json';
import enSEO from '../locales/en/seo.json';
import enKnowledge from '../locales/en/knowledge.json';

i18n
  .use(LanguageDetector) // 自动检测浏览器语言
  .use(initReactI18next) // 初始化 react-i18next
  .init({
    resources: {
      zh: {
        common: zhCommon,
        fortune: zhFortune,
        bazi: zhBazi,
        ui: zhUI,
        seo: zhSEO,
        knowledge: zhKnowledge,
      },
      en: {
        common: enCommon,
        fortune: enFortune,
        bazi: enBazi,
        ui: enUI,
        seo: enSEO,
        knowledge: enKnowledge,
      },
    },
    fallbackLng: 'zh', // 默认语言为中文
    defaultNS: 'common', // 默认命名空间
    ns: ['common', 'fortune', 'bazi', 'ui', 'seo', 'knowledge'], // 命名空间列表
    interpolation: {
      escapeValue: false, // React 已经转义了
    },
    detection: {
      // 语言检测配置
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false, // 禁用 Suspense 以避免语言切换时的闪烁
    },
  });

export default i18n;
