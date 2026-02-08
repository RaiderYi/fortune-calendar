// ==========================================
// 帮助中心 - FAQ、使用指南、八字入门
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Sparkles, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb } from '../components/ui';

interface HelpPageProps {
  onLoginClick?: () => void;
}

interface FAQItem {
  q: string;
  a: string;
}

export default function HelpPage({ onLoginClick }: HelpPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: isEnglish ? 'How do I get my daily fortune?' : '如何获取每日运势？',
      a: isEnglish
        ? 'Enter your birth date, time, and location in Profile Settings. The app will calculate your Bazi and display personalized daily fortune.'
        : '在「我的」-「个人资料」中输入出生日期、时间和地点。应用将计算您的八字并显示个性化每日运势。',
    },
    {
      q: isEnglish ? 'What is True Solar Time? Why does it matter?' : '什么是真太阳时？为什么重要？',
      a: isEnglish
        ? 'True solar time is the actual local time based on the sun\'s position. Bazi calculation requires precise birth time. We support 330+ cities for accurate calibration.'
        : '真太阳时是指基于太阳位置的实际地方时。八字排盘需要精确的出生时间。我们支持 330+ 城市进行精准校准。',
    },
    {
      q: isEnglish ? 'What are the six dimensions?' : '六大维度是什么？',
      a: isEnglish
        ? 'We analyze six life dimensions: Career, Wealth, Romance, Health, Academic, and Travel. Each gets a score and actionable suggestions.'
        : '我们分析六大生活维度：事业、财运、桃花、健康、学业、出行。每个维度都有评分和可执行建议。',
    },
    {
      q: isEnglish ? 'Can I use the app without logging in?' : '不登录可以使用吗？',
      a: isEnglish
        ? 'Yes. Core features like daily fortune are free and work without an account. Sign in to sync data across devices.'
        : '可以。每日运势等核心功能免费且无需登录。登录后可同步数据到多设备。',
    },
    {
      q: isEnglish ? 'How do I get my annual fortune trend?' : '如何查看流年运势？',
      a: isEnglish
        ? 'Go to Calendar tab and tap "Trend Analysis." You can view your fortune trend for the next 10 years.'
        : '进入「日历」页签，点击「趋势分析」即可查看未来十年的运势走向。',
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
              { label: isEnglish ? 'Help' : '帮助中心' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'Help Center' : '帮助中心'}
            description={
              isEnglish
                ? 'FAQs and usage guides. Find answers to common questions.'
                : '常见问题与使用指南。找到您需要的信息。'
            }
          />
        </PageSection>

        {/* FAQ */}
        <PageSection variant="alt">
          <div className="flex items-center gap-2 mb-8">
            <HelpCircle size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEnglish ? 'Frequently Asked Questions' : '常见问题'}
            </h2>
          </div>
          <div className="space-y-2 max-w-3xl">
            {faqs.map((item, i) => (
              <motion.div
                key={i}
                initial={false}
                className="rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800/50"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-800/80 transition"
                  aria-expanded={openIndex === i}
                >
                  <span className="font-medium text-gray-900 dark:text-white">{item.q}</span>
                  {openIndex === i ? (
                    <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* Disclaimer - id for deep link */}
        <PageSection>
          <div id="disclaimer" className="scroll-mt-20">
          <div className="flex items-center gap-2 mb-6">
            <Info size={24} className="text-amber-600 dark:text-amber-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEnglish ? 'Disclaimer' : '免责声明'}
            </h2>
          </div>
          <div className="space-y-4 max-w-3xl prose prose-gray dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isEnglish
                ? 'Fortune predictions provided by this platform are for entertainment and reference only. They do not constitute life decision-making advice or professional consulting.'
                : '本平台提供的运势预测仅供娱乐与参考，不构成人生决策依据或专业咨询建议。'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isEnglish
                ? 'We recommend using them as a reference for self-awareness and planning, not as a substitute for professional advice in career, health, finance, or legal matters.'
                : '建议作为自我认知与规划时的参考，不替代专业人士在事业、健康、财务或法律等领域的建议。'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isEnglish
                ? 'By using this service, you acknowledge that you have read and understood this disclaimer.'
                : '使用本服务即表示您已阅读并理解本免责声明。'}
            </p>
          </div>
          </div>
        </PageSection>

        {/* Bazi Intro */}
        <PageSection>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEnglish ? 'Bazi basics' : '八字入门'}
            </h2>
          </div>
          <div className="prose prose-gray dark:prose-invert max-w-3xl">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {isEnglish
                ? 'Bazi (Eight Characters) is a traditional Chinese system that uses your birth year, month, day, and hour to analyze your life trends. Each character is a Heavenly Stem (Gan) and Earthly Branch (Zhi). Combined with Five Elements theory, your Bazi can reveal insights about career, relationships, health, and fortune.'
                : '八字（四柱）是中国传统命理体系，由出生年、月、日、时的天干地支组成。结合五行理论，八字可揭示事业、感情、健康与运势的走向。'}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
              {isEnglish
                ? 'Our platform uses astronomical algorithms for precise solar terms and lunar calendar conversion. We apply modern AI to interpret traditional wisdom for your daily life.'
                : '我们使用天文算法进行精准的节气与农历转换，并将现代 AI 应用于传统智慧的解读，为您的日常生活提供参考。'}
            </p>
          </div>
        </PageSection>

        {/* CTA */}
        <PageSection variant="alt">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {isEnglish ? 'Still have questions?' : '还有疑问？'}
            </p>
            <Link
              to="/app/me"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              <Sparkles size={18} />
              {isEnglish ? 'Contact us for feedback' : '联系我们反馈'}
            </Link>
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
