// ==========================================
// 维度详情组件
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Coins, Heart, Zap, BookOpen, Map, TrendingUp, AlertCircle, CheckCircle2, Info, Sparkles } from 'lucide-react';

export type DimensionType = 'career' | 'wealth' | 'romance' | 'health' | 'academic' | 'travel';

export interface DimensionAnalysis {
  score: number;
  level: '吉' | '平' | '凶' | '大吉';
  tag: string;
  inference: string;
}

interface DimensionDetailProps {
  isOpen: boolean;
  onClose: () => void;
  dimensionType: DimensionType;
  dimension: DimensionAnalysis;
  onAIClick?: (question: string) => void; // AI咨询回调
}

// 维度配置
const DIMENSION_CONFIG = {
  career: {
    label: '事业',
    icon: Briefcase,
    emoji: '💼',
    color: {
      good: { bg: '#ffedd5', text: '#ea580c', border: '#f97316' },
      bad: { bg: '#f3f4f6', text: '#9ca3af', border: '#6b7280' },
      normal: { bg: '#dbeafe', text: '#2563eb', border: '#3b82f6' }
    },
    descriptions: {
      good: '今日事业运势强劲，是推进重要项目、展现能力的好时机。适合主动争取机会，与上级沟通，或处理关键业务。',
      normal: '事业运势平稳，适合按部就班完成日常工作。保持专注，避免过度激进，稳步推进即可。',
      bad: '今日事业运势较弱，建议谨慎决策，避免重大变动。多听取他人意见，保持低调，等待更好的时机。'
    },
    suggestions: {
      good: ['主动争取项目机会', '与重要客户沟通', '展现个人能力', '推进关键决策'],
      normal: ['完成日常任务', '维护团队关系', '学习新技能', '规划未来方向'],
      bad: ['避免重大决策', '谨慎处理合同', '多听取意见', '保持低调务实']
    },
    warnings: {
      good: ['避免过度自信', '注意团队协作', '不要忽视细节'],
      normal: ['不要拖延任务', '保持工作节奏', '注意沟通方式'],
      bad: ['避免冲动决策', '不要过度焦虑', '谨慎处理冲突']
    }
  },
  wealth: {
    label: '财运',
    icon: Coins,
    emoji: '💰',
    color: {
      good: { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' },
      bad: { bg: '#fee2e2', text: '#991b1b', border: '#dc2626' },
      normal: { bg: '#e0e7ff', text: '#4338ca', border: '#6366f1' }
    },
    descriptions: {
      good: '今日财运亨通，是投资理财、签订合同的好时机。正财稳定，偏财有机会，但需理性分析，避免盲目跟风。',
      normal: '财运平稳，正财收入稳定。适合稳健理财，避免高风险投资。保持收支平衡，为未来做好规划。',
      bad: '今日财运较弱，需谨慎处理财务事务。避免大额投资或冲动消费，保持理性，等待更好的时机。'
    },
    suggestions: {
      good: ['关注投资机会', '签订重要合同', '处理财务事务', '规划理财方案'],
      normal: ['保持收支平衡', '稳健理财', '记录财务明细', '规划未来支出'],
      bad: ['避免大额支出', '谨慎投资决策', '控制消费欲望', '保持财务稳定']
    },
    warnings: {
      good: ['避免过度投资', '理性分析风险', '不要贪心'],
      normal: ['不要冲动消费', '保持财务纪律', '注意收支平衡'],
      bad: ['避免高风险投资', '不要借贷消费', '谨慎处理债务']
    }
  },
  romance: {
    label: '情感',
    icon: Heart,
    emoji: '❤️',
    color: {
      good: { bg: '#fce7f3', text: '#be185d', border: '#ec4899' },
      bad: { bg: '#f3f4f6', text: '#6b7280', border: '#9ca3af' },
      normal: { bg: '#e0e7ff', text: '#4338ca', border: '#6366f1' }
    },
    descriptions: {
      good: '今日感情运势旺盛，桃花运佳。单身者有机会遇到心仪对象，有伴者感情升温，适合表达爱意，增进感情。',
      normal: '感情运势平稳，适合与伴侣沟通交流，增进了解。保持真诚，用心经营，感情会稳步发展。',
      bad: '今日感情运势较弱，容易产生误会或矛盾。建议多沟通，换位思考，避免情绪化，保持理性。'
    },
    suggestions: {
      good: ['主动表达爱意', '安排浪漫约会', '增进感情交流', '展现个人魅力'],
      normal: ['保持真诚沟通', '关心对方感受', '共同规划未来', '维护感情稳定'],
      bad: ['多沟通理解', '避免情绪化', '换位思考', '保持耐心']
    },
    warnings: {
      good: ['避免过度热情', '注意对方感受', '不要急于求成'],
      normal: ['不要忽视沟通', '保持感情投入', '注意细节'],
      bad: ['避免争吵冲突', '不要冷战', '谨慎处理分歧']
    }
  },
  health: {
    label: '健康',
    icon: Zap,
    emoji: '💪',
    color: {
      good: { bg: '#d1fae5', text: '#047857', border: '#10b981' },
      bad: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
      normal: { bg: '#e0f2fe', text: '#0369a1', border: '#0ea5e9' }
    },
    descriptions: {
      good: '今日健康运势良好，精力充沛，适合运动锻炼、调理身体。保持良好的作息和饮食习惯，为健康打下基础。',
      normal: '健康运势平稳，注意劳逸结合，保持规律作息。适当运动，合理饮食，预防小病小痛。',
      bad: '今日健康运势较弱，需特别注意身体。避免过度劳累，注意休息，如有不适及时就医，不要拖延。'
    },
    suggestions: {
      good: ['适当运动锻炼', '调理身体', '保持良好作息', '补充营养'],
      normal: ['劳逸结合', '规律作息', '合理饮食', '预防疾病'],
      bad: ['注意休息', '避免劳累', '及时就医', '保持心情愉悦']
    },
    warnings: {
      good: ['避免过度运动', '注意运动安全', '不要忽视身体信号'],
      normal: ['不要熬夜', '保持规律作息', '注意饮食卫生'],
      bad: ['避免过度劳累', '不要忽视症状', '及时就医检查']
    }
  },
  academic: {
    label: '学业',
    icon: BookOpen,
    emoji: '📚',
    color: {
      good: { bg: '#fef3c7', text: '#d97706', border: '#f59e0b' },
      bad: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
      normal: { bg: '#e0e7ff', text: '#4338ca', border: '#6366f1' }
    },
    descriptions: {
      good: '今日学业运势强劲，思维敏捷，学习效率高。适合攻克难题、复习重点、参加考试，容易取得好成绩。',
      normal: '学业运势平稳，适合按计划学习，巩固基础知识。保持专注，循序渐进，稳步提升。',
      bad: '今日学业运势较弱，学习效率可能下降。建议调整学习方法，多休息，保持耐心，不要急躁。'
    },
    suggestions: {
      good: ['攻克难题', '复习重点', '参加考试', '深入学习'],
      normal: ['按计划学习', '巩固基础', '保持专注', '稳步提升'],
      bad: ['调整学习方法', '多休息', '保持耐心', '寻求帮助']
    },
    warnings: {
      good: ['避免过度学习', '注意劳逸结合', '不要忽视基础'],
      normal: ['不要拖延', '保持学习节奏', '注意理解深度'],
      bad: ['避免急躁', '不要放弃', '寻求适当帮助']
    }
  },
  travel: {
    label: '出行',
    icon: Map,
    emoji: '✈️',
    color: {
      good: { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
      bad: { bg: '#fee2e2', text: '#991b1b', border: '#ef4444' },
      normal: { bg: '#e0f2fe', text: '#0369a1', border: '#0ea5e9' }
    },
    descriptions: {
      good: '今日出行运势顺畅，适合远行、出差、旅游。行程顺利，少有阻碍，是出行的好时机。',
      normal: '出行运势平稳，适合日常出行。注意交通安全，提前规划路线，避免匆忙，可顺利到达。',
      bad: '今日出行运势较弱，建议谨慎出行，避免长途旅行。注意交通安全，提前准备，预留充足时间。'
    },
    suggestions: {
      good: ['安排远行', '出差旅行', '探索新地', '享受旅程'],
      normal: ['日常出行', '提前规划', '注意安全', '预留时间'],
      bad: ['谨慎出行', '避免长途', '注意安全', '提前准备']
    },
    warnings: {
      good: ['注意交通安全', '提前规划路线', '不要大意'],
      normal: ['不要匆忙', '注意路况', '预留时间'],
      bad: ['避免长途旅行', '注意交通安全', '提前准备']
    }
  }
};

export default function DimensionDetail({
  isOpen,
  onClose,
  dimensionType,
  dimension,
  onAIClick
}: DimensionDetailProps) {
  const config = DIMENSION_CONFIG[dimensionType];
  const Icon = config.icon;
  const isGood = dimension.level === '吉' || dimension.level === '大吉';
  const isBad = dimension.level === '凶';
  const color = isGood ? config.color.good : isBad ? config.color.bad : config.color.normal;
  const description = isGood ? config.descriptions.good : isBad ? config.descriptions.bad : config.descriptions.normal;
  const suggestions = isGood ? config.suggestions.good : isBad ? config.suggestions.bad : config.suggestions.normal;
  const warnings = isGood ? config.warnings.good : isBad ? config.warnings.bad : config.warnings.normal;

  // 根据维度类型生成默认问题
  const getDefaultQuestion = (type: DimensionType): string => {
    const questions: Record<DimensionType, string> = {
      career: '请详细分析我的事业发展，包括今日运势对事业的影响、适合的行动方向以及需要注意的事项。',
      wealth: '请详细分析我的财运状况，包括今日财运走势、投资理财建议以及需要注意的财务风险。',
      romance: '请详细分析我的感情运势，包括今日感情状态、人际关系建议以及需要注意的情感问题。',
      health: '请详细分析我的健康注意事项，包括今日健康运势、养生建议以及需要预防的健康问题。',
      academic: '请详细分析我的学业运势，包括今日学习状态、考试运程以及提升学业的方法建议。',
      travel: '请详细分析我的出行运势，包括今日出行适宜性、注意事项以及出行建议。',
    };
    return questions[type];
  };

  const handleAIClick = () => {
    if (onAIClick) {
      onAIClick(getDefaultQuestion(dimensionType));
      onClose(); // 关闭维度详情，打开AI咨询
    }
  };

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
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 详情抽屉 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* 头部 */}
            <div
              className="p-6 pb-8 text-white relative"
              style={{
                background: `linear-gradient(135deg, ${color.bg} 0%, ${color.text} 100%)`
              }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition z-10"
              >
                <X size={20} className="text-white" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                  <Icon size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{config.label}运势</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-4xl">{config.emoji}</span>
                    <div>
                      <div className="text-sm opacity-90">综合评分</div>
                      <div className="text-3xl font-black">{dimension.score}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 等级标签 */}
              <div className="flex items-center gap-2">
                <span
                  className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-md"
                  style={{ border: `2px solid ${color.border}` }}
                >
                  {dimension.level}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-md">
                  {dimension.tag}
                </span>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* 基础推演 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Info size={16} />
                  运势分析
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {dimension.inference}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              {/* 建议事项 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  建议事项
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-green-50 rounded-xl p-3 border border-green-200"
                    >
                      <CheckCircle2 size={18} className="text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 注意事项 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                  <AlertCircle size={16} />
                  注意事项
                </h3>
                <div className="space-y-2">
                  {warnings.map((warning, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-amber-50 rounded-xl p-3 border border-amber-200"
                    >
                      <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-700 flex-1">{warning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 评分说明 */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-indigo-600" />
                  <h4 className="text-sm font-bold text-indigo-900">评分说明</h4>
                </div>
                <div className="text-xs text-indigo-700 space-y-1">
                  <p>• 90-100分：大吉 - 运势极佳，把握机会</p>
                  <p>• 70-89分：吉 - 运势良好，积极行动</p>
                  <p>• 50-69分：平 - 运势平稳，稳步前进</p>
                  <p>• 0-49分：凶 - 运势较弱，谨慎行事</p>
                </div>
              </div>

              {/* AI 深度分析按钮 */}
              {onAIClick && (
                <motion.button
                  onClick={handleAIClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition shadow-lg mt-4"
                >
                  <Sparkles size={18} />
                  AI 深度分析
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
