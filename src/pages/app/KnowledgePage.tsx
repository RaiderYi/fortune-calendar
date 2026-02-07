// ==========================================
// 八字学堂 - 功能页
// ==========================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Info, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KnowledgeItem {
  id: string;
  title: string;
  category: 'basic' | 'advanced' | 'terms';
  content: string;
  examples?: string[];
}

const KNOWLEDGE_ITEM_IDS = [
  'bazi_basic',
  'tiangan_dizhi',
  'wuxing',
  'shishen',
  'yongshen',
  'dayun',
  'liunian',
  'shensha',
  'zhengtaiyangshi',
  'jiezhi',
];

export default function KnowledgePage() {
  const { t } = useTranslation(['ui', 'knowledge']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const getKnowledgeItems = (): KnowledgeItem[] => {
    const categoryMap: Record<string, 'basic' | 'advanced' | 'terms'> = {
      bazi_basic: 'basic',
      tiangan_dizhi: 'basic',
      wuxing: 'basic',
      zhengtaiyangshi: 'basic',
      jiezhi: 'basic',
      shishen: 'terms',
      yongshen: 'terms',
      shensha: 'terms',
      dayun: 'advanced',
      liunian: 'advanced',
    };

    return KNOWLEDGE_ITEM_IDS.map((id) => {
      const item = t(`knowledge:items.${id}`, { returnObjects: true }) as {
        title?: string;
        content?: string;
        examples?: string[];
      } | string;

      if (typeof item === 'string') {
        return {
          id,
          title: id,
          category: categoryMap[id] || 'basic',
          content: '',
          examples: [],
        };
      }

      return {
        id,
        title: item?.title || id,
        category: categoryMap[id] || 'basic',
        content: item?.content || '',
        examples: item?.examples || [],
      };
    });
  };

  const knowledgeItems = getKnowledgeItems();
  const filteredItems =
    selectedCategory === 'all'
      ? knowledgeItems
      : knowledgeItems.filter((item) => item.category === selectedCategory);

  const selectedItem = selectedItemId
    ? knowledgeItems.find((item) => item.id === selectedItemId)
    : null;

  const CATEGORIES = [
    { id: 'all', name: t('ui:knowledgeBase.categories.all'), icon: BookOpen },
    { id: 'basic', name: t('ui:knowledgeBase.categories.basic'), icon: Info },
    { id: 'terms', name: t('ui:knowledgeBase.categories.terms'), icon: Sparkles },
    { id: 'advanced', name: t('ui:knowledgeBase.categories.advanced'), icon: ChevronRight },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#F5F5F7] dark:bg-slate-900">
      {/* 头部 */}
      <div className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 lg:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Link
            to="/app/today"
            className="p-2 hover:bg-white/20 rounded-full transition"
            aria-label={t('common:buttons.back', { defaultValue: 'Back' })}
          >
            <ChevronRight size={24} className="rotate-180" />
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen size={24} />
            <h2 className="text-xl font-bold">{t('ui:menu.knowledge')}</h2>
          </div>
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-white text-indigo-600'
                    : 'bg-white/20 text-white'
                }`}
              >
                <Icon size={16} />
                {category.name}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        {selectedItem ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <button
              onClick={() => setSelectedItemId(null)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
            >
              <ChevronRight size={16} className="rotate-180" />
              {t('common:buttons.back', { defaultValue: 'Back to List' })}
            </button>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {selectedItem.title}
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {selectedItem.content}
              </p>
            </div>
            {selectedItem.examples && selectedItem.examples.length > 0 && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                  {t('common:status.examples', { defaultValue: 'Examples' })}
                </h4>
                {selectedItem.examples.map((example, idx) => (
                  <p
                    key={idx}
                    className="text-indigo-700 dark:text-indigo-200 text-sm mb-1"
                  >
                    {example}
                  </p>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl p-4 text-left border-2 border-transparent hover:border-indigo-200 dark:hover:border-indigo-800 transition-all shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 shrink-0" />
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
