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
  CalendarCheck,
  Target,
  Lightbulb,
  ChevronRight,
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
      desc: isEnglish
        ? 'Personalized daily prediction with actionable advice for career, wealth, romance, health, and more.'
        : '个性化每日预测，事业、财运、桃花、健康等可执行建议',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Annual Fortune' : '流年运势',
      desc: isEnglish
        ? 'Explore your fortune trend for the next 10 years. Understand major life cycles and plan ahead.'
        : '未来十年运势走向，人生大运周期，提前规划',
    },
    {
      icon: CalendarCheck,
      title: isEnglish ? 'Auspicious Date Picker' : '择日推荐',
      desc: isEnglish
        ? 'Moving, opening, travel? We recommend auspicious dates based on your Bazi.'
        : '搬家、开业、出行等，根据八字推荐吉日',
    },
    {
      icon: Sparkles,
      title: isEnglish ? 'AI Fortune Analysis' : 'AI 命理解读',
      desc: isEnglish
        ? 'Ask questions and get personalized Bazi insights powered by AI.'
        : '提问获取个性化八字分析，深度解读',
    },
    {
      icon: BarChart3,
      title: isEnglish ? 'Life Map' : '人生大图景',
      desc: isEnglish
        ? '10-year fortune curve, key years highlighted, personalized advice.'
        : '十年运势曲线，重要年份标记，个性化建议',
    },
    {
      icon: MapPin,
      title: isEnglish ? 'True Solar Time · 330+ Cities' : '真太阳时 · 330+ 城市',
      desc: isEnglish
        ? 'Accurate solar time calibration for your birth location. Essential for precise Bazi.'
        : '出生地精准校准，确保八字排盘准确',
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
        ? 'Daily predictions help me prioritize: when to push for a deal, when to avoid major decisions. Very practical.'
        : '每日运势帮我分清什么时候该冲、什么时候该稳，决策更有把握。',
      author: isEnglish ? 'User A' : '用户 A',
    },
    {
      quote: isEnglish
        ? 'The 10-year fortune trend helped me plan my career switch. The auspicious date picker was great for moving.'
        : '流年趋势帮我规划了跳槽时机，择日功能搬家时用了，很顺手。',
      author: isEnglish ? 'User B' : '用户 B',
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: isEnglish ? 'Set Birth Info' : '设置出生信息',
      desc: isEnglish
        ? 'Birth date, time, and location. True solar time calibration for precise Bazi.'
        : '出生日期、时辰、出生地。真太阳时校准，确保八字精准。',
    },
    {
      step: 2,
      title: isEnglish ? 'View Daily Fortune' : '每日查看运势',
      desc: isEnglish
        ? 'Six dimensions scored, favorable/unfavorable advice, daily theme.'
        : '六大维度评分、宜忌建议、当日主题。',
    },
    {
      step: 3,
      title: isEnglish ? 'Deep Explore' : '深度探索',
      desc: isEnglish
        ? 'Annual trends, AI consultation, auspicious dates, life map.'
        : '流年趋势、AI 咨询、择日、人生大图景。',
    },
  ];

  const useCases = [
    {
      icon: Target,
      title: isEnglish ? 'Important Decisions' : '重要决策',
      desc: isEnglish
        ? 'Before moving, opening, or signing, check daily fortune and auspicious dates.'
        : '搬家、开业、签约前，查看当日运势与择日推荐。',
    },
    {
      icon: Calendar,
      title: isEnglish ? 'Daily Planning' : '日常规划',
      desc: isEnglish ? 'Know today\'s favorable/unfavorable actions, plan work and travel.' : '了解今日宜忌，合理安排工作与出行。',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Long-term Planning' : '长期规划',
      desc: isEnglish
        ? 'Annual trends and life cycles help plan career and investment ahead.'
        : '流年趋势与人生大运，提前规划事业与投资。',
    },
    {
      icon: Lightbulb,
      title: isEnglish ? 'Learn & Explore' : '学习提升',
      desc: isEnglish
        ? 'Bazi academy for basics, AI for personalized deep analysis.'
        : '八字学堂入门，AI 深度解读个性化问题。',
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
                {isEnglish ? 'Bazi + Time = Personalized Life Guide' : '八字 + 时辰 = 个性化生活决策指南'}
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                {isEnglish ? 'Fortune Calendar' : '运势日历'}
              </h1>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-2 leading-relaxed">
                {isEnglish ? 'Get personalized fortune insights in one minute.' : '每天花一分钟，获取个性化运势建议。'}
              </p>
              <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-500 max-w-3xl mx-auto mb-4 leading-relaxed">
                {isEnglish ? 'Seize opportunities, avoid pitfalls, make better decisions.' : '助您把握时机、规避风险，做出更明智的决策。'}
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-10">
                {isEnglish ? 'True solar time · Six dimensions · AI analysis · Auspicious date picker' : '真太阳时 · 六大维度 · AI 解读 · 择日推荐'}
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
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
              {isEnglish ? 'Based on real user feedback. Data stored locally, exportable, privacy-first.' : '基于真实用户反馈。本地存储，可导出，隐私可控。'}
            </p>
          </div>
        </section>

        {/* How it works */}
        <PageSection>
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'How It Works' : '如何运作'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {isEnglish ? 'Three simple steps to personalized fortune insights.' : '三步获取个性化运势洞察。'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4 font-black text-indigo-600 dark:text-indigo-400 text-xl">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                    <ChevronRight size={24} className="text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* Use cases */}
        <PageSection variant="alt">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Use Cases' : '典型使用场景'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {isEnglish ? 'What problems we solve for you.' : '产品解决的具体问题。'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{uc.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{uc.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </PageSection>

        {/* Features */}
        <PageSection variant="alt">
          <h2 className="text-2xl lg:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Core Features' : '核心功能'}
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            {isEnglish ? 'Everything you need for personalized fortune insights.' : '为您提供个性化运势洞察所需的一切。'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
            {isEnglish ? 'Join thousands of satisfied users. Real scenarios, real value.' : '加入数千位满意用户。真实场景，真实价值。'}
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

        {/* Donate */}
        <PageSection>
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isEnglish ? 'Buy the creator a coffee' : '请创作者喝杯咖啡'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isEnglish ? 'Thank you for your support.' : '感谢您的支持。'}
            </p>
            <img
              src="/donate-qr.png"
              alt={isEnglish ? 'Donation QR code' : '打赏收款码'}
              className="w-[160px] h-[160px] mx-auto rounded-lg object-contain bg-white dark:bg-slate-800 p-2 border border-gray-200 dark:border-slate-600"
              loading="lazy"
            />
          </div>
        </PageSection>

        {/* Final CTA */}
        <PageSection variant="alt">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {isEnglish ? 'Explore your fortune now' : '立即探索您的运势'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              {isEnglish
                ? 'Enter your birth info and get today\'s fortune with six dimensions in one minute.'
                : '输入出生信息，一分钟获取今日运势与六大维度分析。'}
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
