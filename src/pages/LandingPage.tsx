// ==========================================
// 落地页 - 品牌介绍、核心功能入口
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, TrendingUp, Zap, MapPin, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';

interface LandingPageProps {
  onLoginClick?: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  const features = [
    {
      icon: Calendar,
      title: isEnglish ? 'Daily Fortune' : '每日运势',
      desc: isEnglish ? 'Personalized daily prediction based on your Bazi' : '基于您的八字，个性化每日运势预测',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Annual Fortune' : '流年运势',
      desc: isEnglish ? 'Explore your fortune trend for the next 10 years' : '探索未来十年的运势走向',
    },
    {
      icon: BarChart3,
      title: isEnglish ? 'Six Dimensions' : '六大维度',
      desc: isEnglish ? 'Career, wealth, romance, health, academic, travel' : '事业、财运、桃花、健康、学业、出行',
    },
    {
      icon: MapPin,
      title: isEnglish ? '330+ Cities' : '330+ 城市',
      desc: isEnglish ? 'Accurate solar time calibration for your location' : '真太阳时校准，精准定位',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-slate-900">
      <SiteHeader onLoginClick={onLoginClick} />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                <Sparkles size={18} />
                {isEnglish ? 'Free Bazi Fortune Query' : '免费八字运势查询'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-6">
                {isEnglish ? 'Fortune Calendar' : '运势日历'}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                {isEnglish
                  ? 'Discover your daily fortune, annual trends, and personalized suggestions based on traditional Bazi.'
                  : '探索您的每日运势、流年走向，基于传统八字为您提供个性化建议。'}
              </p>
              <Link to="/app/today">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition"
                >
                  {isEnglish ? 'Get Started' : '开始查看运势'}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-24 bg-white dark:bg-slate-800/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-12">
              {isEnglish ? 'Core Features' : '核心功能'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                      <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isEnglish ? 'Ready to explore your fortune?' : '准备好探索您的运势了吗？'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {isEnglish ? 'Enter your birth info and get personalized daily insights.' : '输入您的出生信息，获取个性化每日运势。'}
            </p>
            <Link to="/app/today">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg transition"
              >
                {isEnglish ? 'Go to Fortune App' : '进入运势应用'}
              </motion.button>
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
