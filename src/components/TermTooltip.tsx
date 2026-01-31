// ==========================================
// 术语解释工具提示组件
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info } from 'lucide-react';

interface TermTooltipProps {
  term: string;
  explanation: string;
  children: React.ReactNode;
}

const TERM_EXPLANATIONS: Record<string, string> = {
  '八字': '由出生年、月、日、时的天干地支组成，共八个字，是命理分析的基础。',
  '天干': '甲、乙、丙、丁、戊、己、庚、辛、壬、癸，共十个。',
  '地支': '子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥，共十二个。',
  '日主': '日柱的天干，代表命主本人，是八字分析的核心。',
  '用神': '对日主最有利的五行，能够平衡八字、增强运势。',
  '喜神': '辅助用神的五行，也对日主有利。',
  '忌神': '对日主不利的五行，需要避免或化解。',
  '大运': '人生中每十年一个阶段的运势变化，对人生影响重大。',
  '流年': '当前年份的天干地支，影响短期运势。',
  '流月': '当前月份的天干地支。',
  '流日': '当前日期的天干地支，影响当日运势。',
  '十神': '根据日主与其他天干的关系定义的十种关系：比肩、劫财、食神、伤官、偏财、正财、七杀、正官、偏印、正印。',
  '神煞': '八字中的特殊组合，包括吉神和凶煞，如天乙贵人、桃花、驿马等。',
  '真太阳时': '根据当地经度计算出的真实太阳时间，用于准确计算八字。',
  '身旺': '日主在八字中力量较强，需要克泄耗来平衡。',
  '身弱': '日主在八字中力量较弱，需要生扶来增强。',
  '五行': '金、木、水、火、土，是八字分析的基础元素。',
  '相生': '五行之间的生助关系：木生火、火生土、土生金、金生水、水生木。',
  '相克': '五行之间的克制关系：木克土、土克水、水克火、火克金、金克木。',
};

export default function TermTooltip({ term, explanation, children }: TermTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const finalExplanation = explanation || TERM_EXPLANATIONS[term] || '暂无解释';

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
          >
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl max-w-xs whitespace-normal">
              <div className="font-bold mb-1 text-indigo-300">{term}</div>
              <div className="text-gray-200">{finalExplanation}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * 高亮文本中的术语并添加解释
 */
export function highlightTerms(text: string): React.ReactNode[] {
  const terms = Object.keys(TERM_EXPLANATIONS);
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // 创建正则表达式匹配所有术语
  const pattern = new RegExp(`(${terms.join('|')})`, 'g');
  const matches = Array.from(text.matchAll(pattern));

  matches.forEach((match) => {
    const matchIndex = match.index!;
    const matchTerm = match[0];

    // 添加匹配前的文本
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // 添加高亮的术语
    parts.push(
      <TermTooltip key={key++} term={matchTerm} explanation={TERM_EXPLANATIONS[matchTerm] || ''}>
        <span className="text-indigo-600 font-medium underline decoration-dotted cursor-help">
          {matchTerm}
        </span>
      </TermTooltip>
    );

    lastIndex = matchIndex + matchTerm.length;
  });

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
