// ==========================================
// 站点导航栏 - Logo、导航链接、登录
// ==========================================

import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, LogIn, User } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import LanguageSwitcher from '../LanguageSwitcher';

interface SiteHeaderProps {
  onLoginClick?: () => void;
}

export default function SiteHeader({ onLoginClick }: SiteHeaderProps) {
  const { t, i18n } = useTranslation('ui');
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isEnglish = i18n.language === 'en';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: isEnglish ? 'Home' : '首页' },
    { to: '/features', label: isEnglish ? 'Features' : '功能' },
    { to: '/about', label: isEnglish ? 'About' : '关于' },
    { to: '/help', label: isEnglish ? 'Help' : '帮助' },
    { to: '/blog', label: isEnglish ? 'Blog' : '博客' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-700">
      <div className="mx-auto max-w-7xl xl:max-w-none xl:px-12 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-900 dark:text-white hover:opacity-80 transition"
          >
            <Sparkles size={24} className="text-indigo-500" />
            <span className="text-lg font-bold">{t('header.title', { defaultValue: '命运日历' })}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label={isEnglish ? 'Main navigation' : '主导航'}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium transition ${
                  location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA + Login + Language */}
          <div className="flex items-center gap-3">
            <Link
              to="/app/today"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium transition focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            >
              {isEnglish ? 'Get Started' : '进入应用'}
            </Link>
            {!isAuthenticated && onLoginClick && (
              <button
                onClick={onLoginClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium transition"
              >
                <LogIn size={18} />
                {isEnglish ? 'Login' : '登录'}
              </button>
            )}
            {isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <User size={18} />
                <span className="text-sm">{isEnglish ? 'Account' : '已登录'}</span>
              </div>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            aria-label={mobileMenuOpen ? (isEnglish ? 'Close menu' : '关闭菜单') : (isEnglish ? 'Open menu' : '打开菜单')}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium ${
                    location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to))
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/app/today"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 mt-2 rounded-lg bg-indigo-500 text-white font-medium text-center"
              >
                {isEnglish ? 'Get Started' : '进入应用'}
              </Link>
              {!isAuthenticated && onLoginClick && (
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium"
                >
                  <LogIn size={18} />
                  {isEnglish ? 'Login' : '登录'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
