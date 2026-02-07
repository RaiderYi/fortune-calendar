// ==========================================
// 定价 - 免费版说明、未来会员权益预告
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb } from '../components/ui';

interface PricingPageProps {
  onLoginClick?: () => void;
}

export default function PricingPage({ onLoginClick }: PricingPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  const freeFeatures = [
    isEnglish ? 'Daily fortune prediction' : '每日运势预测',
    isEnglish ? 'Six dimensions analysis' : '六大维度分析',
    isEnglish ? '10-year annual fortune trend' : '十年流年运势',
    isEnglish ? '330+ cities, true solar time' : '330+ 城市真太阳时',
    isEnglish ? 'History & calendar view' : '历史记录与日历',
    isEnglish ? 'Check-in & achievements' : '签到与成就',
    isEnglish ? 'Basic AI fortune analysis' : '基础 AI 命理解读',
  ];

  const futureFeatures = [
    isEnglish ? 'Premium AI deep analysis' : '高级 AI 深度解读',
    isEnglish ? 'Cloud sync across devices' : '多设备云端同步',
    isEnglish ? 'Extended annual fortune (20 years)' : '延长流年（20 年）',
    isEnglish ? 'Personalized reports export' : '个性化报告导出',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-slate-900">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1">
        <PageSection>
          <Breadcrumb
            items={[
              { label: isEnglish ? 'Home' : '首页', to: '/' },
              { label: isEnglish ? 'Pricing' : '定价' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'Pricing' : '定价'}
            description={
              isEnglish
                ? 'Core features are free. We may offer premium plans in the future.'
                : '核心功能免费。未来可能推出会员计划。'
            }
          />
        </PageSection>

        {/* Free Tier */}
        <PageSection variant="alt">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Sparkles size={28} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEnglish ? 'Free' : '免费版'}
                  </h2>
                  <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                    ¥0 <span className="text-lg font-normal text-gray-500 dark:text-gray-400">/ {isEnglish ? 'forever' : '永久'}</span>
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {freeFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check size={20} className="text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/app/today">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg transition"
                >
                  {isEnglish ? 'Get Started Free' : '免费开始使用'}
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </PageSection>

        {/* Future Premium */}
        <PageSection>
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30 opacity-90"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Crown size={28} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEnglish ? 'Premium' : '会员版'}
                  </h2>
                  <p className="text-lg text-gray-500 dark:text-gray-400">
                    {isEnglish ? 'Coming soon' : '即将推出'}
                  </p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                {futureFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                    <Zap size={18} className="text-amber-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isEnglish ? 'Stay tuned for updates. Follow us for the latest news.' : '敬请期待。关注我们获取最新动态。'}
              </p>
            </motion.div>
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
