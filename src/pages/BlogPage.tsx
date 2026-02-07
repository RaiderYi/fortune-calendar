// ==========================================
// 博客 - 运势解读、传统文化、产品更新
// ==========================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import { PageSection, PageHeader, Breadcrumb } from '../components/ui';

interface BlogPageProps {
  onLoginClick?: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
}

export default function BlogPage({ onLoginClick }: BlogPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';

  const posts: BlogPost[] = [
    {
      id: '1',
      title: isEnglish ? 'Introduction to Bazi and Daily Fortune' : '八字与每日运势入门',
      excerpt: isEnglish
        ? 'Learn how Bazi (Eight Characters) forms the foundation of our daily fortune predictions.'
        : '了解八字如何构成我们每日运势预测的基础。',
      date: '2025-01-15',
      category: isEnglish ? 'Basics' : '入门',
    },
    {
      id: '2',
      title: isEnglish ? 'Understanding True Solar Time' : '理解真太阳时',
      excerpt: isEnglish
        ? 'Why birth time accuracy matters for Bazi calculation. We explain solar time calibration.'
        : '为什么出生时间精度对八字计算至关重要。我们解释真太阳时校准。',
      date: '2025-01-10',
      category: isEnglish ? 'Accuracy' : '精准',
    },
    {
      id: '3',
      title: isEnglish ? 'Product Update: New Features in 2025' : '产品更新：2025 新功能',
      excerpt: isEnglish
        ? 'AI analysis, diary, and more. A overview of our latest improvements.'
        : 'AI 解读、日记等功能。我们最新改进概览。',
      date: '2025-01-05',
      category: isEnglish ? 'Updates' : '更新',
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
              { label: isEnglish ? 'Blog' : '博客' },
            ]}
          />
          <PageHeader
            title={isEnglish ? 'Blog' : '博客'}
            description={
              isEnglish
                ? 'Fortune insights, traditional culture, and product updates.'
                : '运势解读、传统文化与产品更新。'
            }
          />
        </PageSection>

        {/* Post List */}
        <PageSection variant="alt">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {post.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <span className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  {isEnglish ? 'Read more →' : '阅读更多 →'}
                </span>
              </motion.article>
            ))}
          </div>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8 text-sm">
            {isEnglish ? 'More articles coming soon.' : '更多文章即将推出。'}
          </p>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
