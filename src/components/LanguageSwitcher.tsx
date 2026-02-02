// ==========================================
// 语言切换器组件
// ==========================================

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check } from 'lucide-react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'zh', name: '中文', nativeName: '中文' },
    { code: 'en', name: 'English', nativeName: 'English' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
    
    // 更新 URL 查询参数
    const url = new URL(window.location.href);
    url.searchParams.set('lang', langCode);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors"
      >
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50 min-w-[140px]"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full px-4 py-2 text-left flex items-center justify-between gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    i18n.language === lang.code
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                  {i18n.language === lang.code && (
                    <Check size={16} className="flex-shrink-0" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
