// ==========================================
// 八字知识科普模块
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Info, ChevronRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KnowledgeBaseProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KnowledgeItem {
  id: string;
  title: string;
  category: 'basic' | 'advanced' | 'terms';
  content: string;
  examples?: string[];
}

// 知识条目 ID 列表
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

const CATEGORY_IDS = ['all', 'basic', 'terms', 'advanced'];

export default function KnowledgeBase({ isOpen, onClose }: KnowledgeBaseProps) {
  const { t } = useTranslation(['ui', 'knowledge']);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 从翻译文件构建知识条目
  const getKnowledgeItems = (): KnowledgeItem[] => {
    return KNOWLEDGE_ITEM_IDS.map(id => {
      const categoryMap: Record<string, 'basic' | 'advanced' | 'terms'> = {
        'bazi_basic': 'basic',
        'tiangan_dizhi': 'basic',
        'wuxing': 'basic',
        'zhengtaiyangshi': 'basic',
        'jiezhi': 'basic',
        'shishen': 'terms',
        'yongshen': 'terms',
        'shensha': 'terms',
        'dayun': 'advanced',
        'liunian': 'advanced',
      };
      
      const item = t(`knowledge:items.${id}`, { returnObjects: true }) as any;
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
  const filteredItems = selectedCategory === 'all'
    ? knowledgeItems
    : knowledgeItems.filter(item => item.category === selectedCategory);

  const selectedItem = selectedItemId ? knowledgeItems.find(item => item.id === selectedItemId) : null;

  const CATEGORIES = [
    { id: 'all', name: t('ui:knowledgeBase.categories.all'), icon: BookOpen },
    { id: 'basic', name: t('ui:knowledgeBase.categories.basic'), icon: Info },
    { id: 'terms', name: t('ui:knowledgeBase.categories.terms'), icon: Sparkles },
    { id: 'advanced', name: t('ui:knowledgeBase.categories.advanced'), icon: ChevronRight },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 知识库抽屉/Modal - 移动端底部抽屉，PC端居中Modal */}
          <motion.div
            initial={{ y: '100%', scale: 1 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: '100%', scale: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-4 bg-white lg:bg-transparent rounded-t-3xl lg:rounded-3xl shadow-2xl z-[90] max-h-[90vh] lg:max-w-4xl lg:w-full overflow-hidden flex flex-col pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-white lg:rounded-3xl lg:shadow-2xl lg:w-full lg:max-h-[90vh] flex flex-col overflow-hidden"
            >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{t('ui:menu.knowledge')}</h2>
                    <p className="text-white/90 text-sm">{t('ui:menu.knowledge', { defaultValue: 'Learn traditional fortune telling knowledge' })}</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <X size={20} className="text-white" />
                </motion.button>
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
            <div className="flex-1 overflow-y-auto p-6">
              {selectedItem ? (
                /* 详情视图 */
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
                  <h3 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedItem.content}
                    </p>
                  </div>
                  {selectedItem.examples && selectedItem.examples.length > 0 && (
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                      <h4 className="font-bold text-indigo-800 mb-2">{t('common:status.examples', { defaultValue: 'Examples' })}</h4>
                      {selectedItem.examples.map((example, idx) => (
                        <p key={idx} className="text-indigo-700 text-sm mb-1">
                          {example}
                        </p>
                      ))}
                    </div>
                  )}
                </motion.div>
              ) : (
                /* 列表视图 */
                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-50 hover:bg-gray-100 rounded-xl p-4 text-left border-2 border-transparent hover:border-indigo-200 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-1">{item.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
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
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
