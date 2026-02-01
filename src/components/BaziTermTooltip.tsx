// ==========================================
// 八字术语浮窗解释组件
// ==========================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, BookOpen } from 'lucide-react';
import { chatWithAI } from '../services/api';
import type { BaziContext } from '../types';

interface BaziTermTooltipProps {
  term: string;
  isOpen: boolean;
  onClose: () => void;
  baziContext?: BaziContext;
}

// 常见术语列表
const COMMON_TERMS = [
  '劫财', '伤官', '驿马', '用神', '忌神', '喜神', '偏财', '正财',
  '正官', '七杀', '正印', '偏印', '食神', '比肩', '大运', '流年',
  '流月', '流日', '十神', '五行', '天干', '地支', '神煞', '桃花',
  '羊刃', '空亡', '冲', '合', '刑', '害',
];

export default function BaziTermTooltip({
  term,
  isOpen,
  onClose,
  baziContext,
}: BaziTermTooltipProps) {
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && term) {
      fetchExplanation();
    } else {
      setExplanation('');
    }
  }, [isOpen, term]);

  const fetchExplanation = async () => {
    setIsLoading(true);
    try {
      const response = await chatWithAI(
        [
          {
            role: 'user',
            content: `请用现代、通俗易懂的语言解释八字术语"${term}"的含义，以及它在实际生活中的意义。要求：1. 解释要简洁明了（100字以内）；2. 用现代语言，避免过于玄学的表述；3. 可以结合生活实例说明。`,
          },
        ],
        baziContext || {}
      );

      if (response.success && response.message) {
        setExplanation(response.message);
      } else {
        setExplanation(getDefaultExplanation(term));
      }
    } catch (error) {
      console.error('获取术语解释失败:', error);
      setExplanation(getDefaultExplanation(term));
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultExplanation = (t: string): string => {
    const explanations: Record<string, string> = {
      '劫财': '劫财代表竞争、争夺，在命理中表示容易遇到竞争对手，需要主动争取才能获得资源。',
      '伤官': '伤官代表才华、创意，但也可能带来口舌是非。有伤官的人通常聪明有才，但要注意言行。',
      '驿马': '驿马代表变动、出行，有驿马的人容易频繁出差、搬家或换工作，适合流动性强的工作。',
      '用神': '用神是八字中对日主最有利的五行，补足用神可以改善运势，是命理分析的核心。',
      '忌神': '忌神是八字中对日主不利的五行，需要避免或化解，否则可能带来负面影响。',
      '喜神': '喜神是对日主有益的五行，可以增强运势，带来好运。',
      '偏财': '偏财代表意外之财、投资收入，有偏财的人容易通过副业、投资获得收益。',
      '正财': '正财代表稳定收入、工资薪水，是主要的收入来源。',
      '正官': '正官代表事业、地位、责任，有正官的人通常有责任心，适合管理岗位。',
      '七杀': '七杀代表压力、挑战，但也代表魄力和执行力，有七杀的人通常能力强但压力大。',
      '正印': '正印代表学习、智慧、贵人，有正印的人通常学习能力强，容易得到帮助。',
      '偏印': '偏印代表偏门学问、特殊技能，有偏印的人可能在某些特殊领域有天赋。',
      '食神': '食神代表享受、才华、口福，有食神的人通常生活品味高，有艺术天赋。',
      '比肩': '比肩代表朋友、同事、竞争，有比肩的人人缘好，但也容易遇到竞争。',
      '大运': '大运是人生中每10年一个阶段的运势变化，影响人生的重要转折点。',
      '流年': '流年是每年的运势变化，是短期运势的重要参考。',
      '流月': '流月是每月的运势变化，影响当月的具体事件。',
      '流日': '流日是每日的运势变化，影响当天的具体事件。',
      '十神': '十神是八字中天干之间的生克关系，包括正官、七杀、正印、偏印、比肩、劫财、食神、伤官、正财、偏财。',
      '五行': '五行是金、木、水、火、土五种基本元素，代表不同的属性和能量。',
      '天干': '天干是甲、乙、丙、丁、戊、己、庚、辛、壬、癸十个符号，代表时间的基本单位。',
      '地支': '地支是子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥十二个符号，代表时间和方位。',
      '神煞': '神煞是八字中的特殊组合，代表吉凶信息，如桃花、驿马、羊刃等。',
      '桃花': '桃花代表异性缘、感情运，有桃花的人容易吸引异性，但也可能带来感情困扰。',
      '羊刃': '羊刃代表刚强、冲动，有羊刃的人性格刚烈，容易冲动，需要控制情绪。',
      '空亡': '空亡代表虚无、不实，有空亡的干支可能代表该方面的事情容易落空。',
      '冲': '冲是地支之间的相冲关系，代表冲突、变动，有冲的年份容易有变化。',
      '合': '合是地支之间的相合关系，代表合作、和谐，有合的年份容易有合作机会。',
      '刑': '刑是地支之间的相刑关系，代表矛盾、纠纷，有刑的年份容易有是非。',
      '害': '害是地支之间的相害关系，代表伤害、不利，有害的年份需要谨慎。',
    };

    return explanations[t] || `"${t}"是八字命理中的术语，具体含义需要结合完整的八字分析。`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-50 backdrop-blur-sm"
          />

          {/* 浮窗 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-gray-700"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <BookOpen size={20} />
                <h3 className="font-bold text-lg">术语解释</h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* 内容 */}
            <div className="p-6">
              <div className="mb-4">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
                  {term}
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 size={24} className="animate-spin text-indigo-500" />
                  </div>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {explanation}
                  </div>
                )}
              </div>

              {/* 相关术语 */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">相关术语</div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_TERMS.filter(t => t !== term).slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
