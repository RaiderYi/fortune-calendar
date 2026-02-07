// ==========================================
// 站点页脚 - 关于、联系、版权
// ==========================================

import { Link } from 'react-router-dom';
import { Sparkles, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SiteFooter() {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Sparkles size={20} className="text-indigo-500" />
              <span className="font-bold">{t('header.title', { defaultValue: '运势日历' })}</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isEnglish
                ? 'Free Bazi fortune query, daily prediction, annual fortune analysis.'
                : '免费八字运势查询，每日运势预测，流年运势分析。'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {isEnglish ? 'Quick Links' : '快捷链接'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  {isEnglish ? 'Home' : '首页'}
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                  {isEnglish ? 'Fortune App' : '运势应用'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {isEnglish ? 'Contact' : '联系我们'}
            </h3>
            <a
              href="mailto:hello@fortunecalendar.com"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Mail size={16} />
              hello@fortunecalendar.com
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} {t('header.title', { defaultValue: '运势日历' })}.{' '}
          {isEnglish ? 'All rights reserved.' : '保留所有权利。'}
        </div>
      </div>
    </footer>
  );
}
