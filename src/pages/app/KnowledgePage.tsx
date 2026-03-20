// ==========================================
// 八字学堂 - 功能页
// ==========================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Info, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AppSubPageShell } from '../../components/layout/AppSubPageShell';
import { appLightPanelClass } from '../../constants/appUiClasses';

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

  const categoryToolbar = (
    <div className="flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {CATEGORIES.map((category) => {
        const Icon = category.icon;
        return (
          <motion.button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategory(category.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium ${
              selectedCategory === category.id
                ? 'bg-white text-indigo-600'
                : 'bg-white/20 text-white hover:bg-white/25'
            }`}
          >
            <Icon size={16} />
            {category.name}
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <AppSubPageShell
      variant="light"
      lightTone="spectrum"
      title={t('ui:menu.knowledge')}
      icon={BookOpen}
      headerBottom={categoryToolbar}
    >
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
            <div className={appLightPanelClass}>
              <p className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300">
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
                type="button"
                onClick={() => setSelectedItemId(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`${appLightPanelClass} w-full text-left ring-2 ring-transparent transition hover:shadow-card-hover hover:ring-indigo-200 dark:hover:ring-indigo-600`}
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
    </AppSubPageShell>
  );
}
