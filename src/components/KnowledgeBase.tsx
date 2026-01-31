// ==========================================
// 八字知识科普模块
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Info, ChevronRight, Sparkles } from 'lucide-react';

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

const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'bazi_basic',
    title: '什么是八字？',
    category: 'basic',
    content: '八字，又称四柱，是中国传统命理学的基础。它由出生年、月、日、时的天干地支组成，共八个字，故称"八字"。',
    examples: ['例如：1995年8月15日9时30分出生，对应的八字可能是：乙亥 甲申 戊午 丁巳'],
  },
  {
    id: 'tiangan_dizhi',
    title: '天干地支',
    category: 'basic',
    content: '天干有十个：甲、乙、丙、丁、戊、己、庚、辛、壬、癸。地支有十二个：子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥。天干地支按顺序两两组合，形成六十个干支组合，称为"六十甲子"。',
  },
  {
    id: 'wuxing',
    title: '五行',
    category: 'basic',
    content: '五行包括：金、木、水、火、土。每个天干地支都对应一个五行属性。五行之间存在相生相克的关系：相生（木生火、火生土、土生金、金生水、水生木），相克（木克土、土克水、水克火、火克金、金克木）。',
  },
  {
    id: 'shishen',
    title: '十神',
    category: 'terms',
    content: '十神是根据日主（日柱天干）与其他天干的关系来定义的：比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印。十神反映了日主与其他干支的相互作用关系。',
  },
  {
    id: 'yongshen',
    title: '用神',
    category: 'terms',
    content: '用神是八字分析中的核心概念，指对日主最有利的五行。通过分析日主的旺衰和五行平衡，找出能够平衡八字、增强运势的五行元素。',
  },
  {
    id: 'dayun',
    title: '大运',
    category: 'advanced',
    content: '大运是人生中每十年一个阶段的运势变化。根据出生时间和性别，从月柱开始顺排或逆排，每十年换一次大运。大运对人生各个阶段的影响非常重要。',
  },
  {
    id: 'liunian',
    title: '流年',
    category: 'advanced',
    content: '流年是指当前年份的天干地支。流年与八字、大运相互作用，形成当年的运势。流年对短期运势的影响最为直接。',
  },
  {
    id: 'shensha',
    title: '神煞',
    category: 'terms',
    content: '神煞是八字中的特殊组合，包括吉神和凶煞。常见的神煞有：天乙贵人、桃花、驿马、华盖等。神煞可以补充说明运势的某些特征。',
  },
  {
    id: 'zhengtaiyangshi',
    title: '真太阳时',
    category: 'basic',
    content: '真太阳时是根据当地经度计算出的真实太阳时间，与标准时间（北京时间）不同。由于中国幅员辽阔，不同地区的真太阳时差异较大，因此需要根据出生地经度进行校准，才能准确计算八字。',
  },
  {
    id: 'jiezhi',
    title: '节气',
    category: 'basic',
    content: '节气是农历中的重要概念，一年有24个节气。在八字计算中，立春是划分年份的重要节点。立春之前属于上一年，立春之后才属于新年。',
  },
];

const CATEGORIES = [
  { id: 'all', name: '全部', icon: BookOpen },
  { id: 'basic', name: '基础', icon: Info },
  { id: 'terms', name: '术语', icon: Sparkles },
  { id: 'advanced', name: '进阶', icon: ChevronRight },
];

export default function KnowledgeBase({ isOpen, onClose }: KnowledgeBaseProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? KNOWLEDGE_ITEMS
    : KNOWLEDGE_ITEMS.filter(item => item.category === selectedCategory);

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

          {/* 知识库抽屉 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[90] max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* 头部 */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">八字学堂</h2>
                    <p className="text-white/90 text-sm">了解传统命理知识</p>
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
                    onClick={() => setSelectedItem(null)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                    返回列表
                  </button>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedItem.title}</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedItem.content}
                    </p>
                  </div>
                  {selectedItem.examples && selectedItem.examples.length > 0 && (
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                      <h4 className="font-bold text-indigo-800 mb-2">示例</h4>
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
                      onClick={() => setSelectedItem(item)}
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
        </>
      )}
    </AnimatePresence>
  );
}
