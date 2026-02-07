// ==========================================
// 功能详解页 - 六大维度、流年、AI 解读等核心能力展示
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  BarChart3,
  MapPin,
  Sparkles,
  Briefcase,
  Coins,
  Heart,
  Zap,
  BookOpen,
  Map,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb, FeatureCard } from '../components/ui';

interface FeaturesPageProps {
  onLoginClick?: () => void;
}

export default function FeaturesPage({ onLoginClick }: FeaturesPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  const coreFeatures = [
    {
      icon: Calendar,
      title: isEnglish ? 'Daily Fortune' : '每日运势',
      desc: isEnglish
        ? 'Personalized daily prediction based on your Bazi. Get actionable advice for career, wealth, romance, health, and more.'
        : '基于您的八字，个性化每日运势预测。获取事业、财运、桃花、健康等方面的可执行建议。',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Annual Fortune' : '流年运势',
      desc: isEnglish
        ? 'Explore your fortune trend for the next 10 years. Understand major life cycles and plan ahead.'
        : '探索未来十年的运势走向。了解人生大运周期，提前规划。',
    },
    {
      icon: Sparkles,
      title: isEnglish ? 'AI Fortune Analysis' : 'AI 命理解读',
      desc: isEnglish
        ? 'Deep dive with AI-powered Bazi analysis. Ask questions and get personalized insights.'
        : 'AI 驱动的八字深度分析。提问获取个性化洞察。',
    },
    {
      icon: MapPin,
      title: isEnglish ? '330+ Cities, True Solar Time' : '330+ 城市，真太阳时',
      desc: isEnglish
        ? 'Accurate solar time calibration for your birth location. Essential for precise Bazi calculation.'
        : '基于出生地的真太阳时校准，确保八字排盘精准。',
    },
  ];

  const dimensions = [
    { icon: Briefcase, key: 'career', label: isEnglish ? 'Career' : '事业' },
    { icon: Coins, key: 'wealth', label: isEnglish ? 'Wealth' : '财运' },
    { icon: Heart, key: 'romance', label: isEnglish ? 'Romance' : '桃花' },
    { icon: Zap, key: 'health', label: isEnglish ? 'Health' : '健康' },
    { icon: BookOpen, key: 'academic', label: isEnglish ? 'Academic' : '学业' },
    { icon: Map, key: 'travel', label: isEnglish ? 'Travel' : '出行' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-slate-900">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1">
        <PageSection>
          <Breadcrumb
            items={[
              { label: isEnglish ? 'Home' : '首页', to: '/' },
              { label: isEnglish ? 'Features' : '功能详解' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'Features' : '功能详解'}
            description={
              isEnglish
                ? 'Explore our core capabilities: daily fortune, annual trends, AI analysis, and precision solar time.'
                : '探索我们的核心能力：每日运势、流年趋势、AI 解读与精准真太阳时。'
            }
          />
        </PageSection>

        {/* Core Features */}
        <PageSection variant="alt">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {isEnglish ? 'Core Capabilities' : '核心能力'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreFeatures.map((f, i) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                description={f.desc}
                index={i}
              />
            ))}
          </div>
        </PageSection>

        {/* Six Dimensions */}
        <PageSection>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Six Dimensions' : '六大维度'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
            {isEnglish
              ? 'Each day we analyze six key life dimensions with scores and actionable suggestions.'
              : '每日从六大维度分析运势，提供评分与可执行建议。'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {dimensions.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div
                  key={d.key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 flex flex-col items-center gap-2 text-center"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Icon size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white text-sm">{d.label}</span>
                </motion.div>
              );
            })}
          </div>
        </PageSection>

        {/* CTA */}
        <PageSection variant="alt">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isEnglish ? 'Ready to start?' : '准备好开始了吗？'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isEnglish ? 'Enter your birth info and get your first fortune.' : '输入出生信息，获取您的第一份运势。'}
            </p>
            <Link to="/app/today">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg transition"
              >
                {isEnglish ? 'Get Started' : '开始查看运势'}
              </motion.button>
            </Link>
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
