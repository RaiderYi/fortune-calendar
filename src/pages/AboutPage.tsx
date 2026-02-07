// ==========================================
// 关于我们 - 品牌故事、团队、愿景、联系我们
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, Heart, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb } from '../components/ui';

interface AboutPageProps {
  onLoginClick?: () => void;
}

export default function AboutPage({ onLoginClick }: AboutPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  const values = [
    {
      icon: Sparkles,
      title: isEnglish ? 'Science & Tradition' : '科学祛魅',
      desc: isEnglish
        ? 'We combine rigorous algorithms with traditional Bazi wisdom for modern life guidance.'
        : '严谨的天文算法与传统八字智慧结合，为现代生活提供指南。',
    },
    {
      icon: Target,
      title: isEnglish ? 'User First' : '用户为先',
      desc: isEnglish
        ? 'Every feature is designed to help you make better daily decisions.'
        : '每项功能都旨在帮助您做出更好的每日决策。',
    },
    {
      icon: Heart,
      title: isEnglish ? 'Accessible to All' : '普惠大众',
      desc: isEnglish
        ? 'Free daily fortune, no paywall. We believe everyone deserves personalized insights.'
        : '免费每日运势，无付费墙。我们相信每个人都值得个性化洞察。',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7] dark:bg-slate-900">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1">
        <PageSection>
          <Breadcrumb
            items={[
              { label: isEnglish ? 'Home' : '首页', to: '/' },
              { label: isEnglish ? 'About' : '关于我们' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'About Us' : '关于我们'}
            description={
              isEnglish
                ? 'Our story, vision, and mission. We are building a world-class fortune platform.'
                : '我们的故事、愿景与使命。打造世界级智慧运势平台。'
            }
          />
        </PageSection>

        {/* Story */}
        <PageSection variant="alt">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {isEnglish ? 'Our Story' : '品牌故事'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed mb-6">
            {isEnglish
              ? 'Fortune Calendar was born from the belief that traditional Bazi wisdom can be made accessible and actionable for modern life. We combine precise astronomical algorithms with AI-powered analysis to deliver daily fortune insights that help you plan your day, week, and year.'
              : '运势日历源于一个信念：传统八字智慧可以为现代生活所用。我们结合精准的天文算法与 AI 分析，为您提供每日运势洞察，助您规划每一天、每一周、每一年。'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            {isEnglish
              ? 'Our platform serves users across 330+ cities with true solar time calibration. We are committed to keeping core features free and continuously improving the experience.'
              : '我们的平台覆盖 330+ 城市，真太阳时精准校准。我们致力于保持核心功能免费，并持续优化体验。'}
          </p>
        </PageSection>

        {/* Values */}
        <PageSection>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            {isEnglish ? 'Our Values' : '我们的价值观'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </PageSection>

        {/* Contact */}
        <PageSection variant="alt">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {isEnglish ? 'Contact Us' : '联系我们'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isEnglish ? 'Have questions or feedback? We would love to hear from you.' : '有问题或建议？欢迎与我们联系。'}
          </p>
          <a
            href="mailto:bazirili@foxmail.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition"
          >
            <Mail size={20} />
            bazirili@foxmail.com
          </a>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
