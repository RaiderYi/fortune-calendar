// ==========================================
// 站点页脚 - 关于、联系、版权
// ==========================================

import { Link } from 'react-router-dom';
import { Sparkles, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SiteFooter() {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  const productLinks = [
    { to: '/app/today', label: isEnglish ? 'Today' : '今日运势' },
    { to: '/app/calendar', label: isEnglish ? 'Calendar' : '日历' },
    { to: '/app/me', label: isEnglish ? 'Me' : '我的' },
    { to: '/features', label: isEnglish ? 'Features' : '功能详解' },
    { to: '/pricing', label: isEnglish ? 'Pricing' : '定价' },
  ];
  const supportLinks = [
    { to: '/help', label: isEnglish ? 'Help Center' : '帮助中心' },
    { to: '/help#faq', label: 'FAQ' },
    { to: '/app/me', label: isEnglish ? 'Feedback' : '反馈' },
  ];
  const companyLinks = [
    { to: '/about', label: isEnglish ? 'About' : '关于我们' },
    { to: '/blog', label: isEnglish ? 'Blog' : '博客' },
    { to: '/help#privacy', label: isEnglish ? 'Privacy' : '隐私政策' },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 flex flex-col gap-3">
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

          {/* Product */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {isEnglish ? 'Product' : '产品'}
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {isEnglish ? 'Support' : '支持'}
            </h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {isEnglish ? 'Company' : '公司'}
            </h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {isEnglish ? 'Contact' : '联系'}
            </h3>
            <a
              href="mailto:bazirili@foxmail.com"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Mail size={16} />
              bazirili@foxmail.com
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
