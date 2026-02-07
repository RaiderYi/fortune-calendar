// ==========================================
// 首页 - Hero、信任区、功能预览、社交证明、CTA
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Calendar,
  TrendingUp,
  MapPin,
  BarChart3,
  Users,
  MapPinned,
  Star,
  Quote,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, FeatureCard } from '../components/ui';

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

  const trustStats = [
    { value: '10K+', label: isEnglish ? 'Users' : '用户', icon: Users },
    { value: '330+', label: isEnglish ? 'Cities' : '城市', icon: MapPinned },
    { value: '4.8', label: isEnglish ? 'Rating' : '评分', icon: Star },
  ];

  const testimonials = [
    {
      quote: isEnglish
        ? 'Accurate daily predictions help me plan my day better.'
        : '预测很准，帮我更好地规划每一天。',
      author: isEnglish ? 'User A' : '用户 A',
    },
    {
      quote: isEnglish
        ? 'The annual fortune trend is very insightful.'
        : '流年运势分析很有参考价值。',
      author: isEnglish ? 'User B' : '用户 B',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-slate-900">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-8">
                <Sparkles size={18} />
                {isEnglish ? 'Free Bazi Fortune Query' : '免费八字运势查询'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                {isEnglish ? 'Fortune Calendar' : '运势日历'}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                {isEnglish
                  ? 'Discover your daily fortune, annual trends, and personalized suggestions based on traditional Bazi.'
                  : '探索您的每日运势、流年走向，基于传统八字为您提供个性化建议。'}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/app/today">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/30 transition focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
                  >
                    {isEnglish ? 'Get Started' : '开始查看运势'}
                  </motion.button>
                </Link>
                <Link to="/features">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold text-lg transition"
                  >
                    {isEnglish ? 'Learn More' : '了解更多'}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Stats */}
        <section className="py-12 border-y border-gray-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap justify-center gap-12 lg:gap-24"
            >
              {trustStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <PageSection variant="alt">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Core Features' : '核心功能'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {isEnglish ? 'Everything you need for personalized fortune insights.' : '为您提供个性化运势洞察所需的一切。'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.desc}
                to="/features"
                index={i}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/features"
              className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              {isEnglish ? 'View all features →' : '查看全部功能 →'}
            </Link>
          </div>
        </PageSection>

        {/* Social Proof / Testimonials */}
        <PageSection>
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'What Users Say' : '用户评价'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {isEnglish ? 'Join thousands of satisfied users.' : '加入数千位满意用户。'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700"
              >
                <Quote size={24} className="text-indigo-200 dark:text-indigo-800 mb-3" />
                <p className="text-gray-700 dark:text-gray-300 mb-4">{item.quote}</p>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">— {item.author}</p>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection variant="alt">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {isEnglish ? 'Ready to explore your fortune?' : '准备好探索您的运势了吗？'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              {isEnglish ? 'Enter your birth info and get personalized daily insights.' : '输入您的出生信息，获取个性化每日运势。'}
            </p>
            <Link to="/app/today">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg shadow-lg transition"
              >
                {isEnglish ? 'Go to Fortune App' : '进入运势应用'}
              </motion.button>
            </Link>
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
