// ==========================================
// 首次使用引导组件
// ==========================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Settings, ArrowRight, X, Check } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const STEPS = [
  {
    id: 1,
    title: '欢迎使用运势日历',
    description: '基于传统八字命理，为您提供每日运势分析和建议',
    icon: Sparkles,
    color: 'from-purple-500 to-indigo-600',
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">📅</div>
        <p className="text-gray-600">
          结合现代算法与传统智慧，为您呈现个性化的每日运势
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: '六大维度分析',
    description: '全面了解您的运势状况',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-600',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {['事业', '财运', '情感', '健康', '学业', '出行'].map((dim, idx) => (
            <div key={idx} className="bg-white/20 backdrop-blur-md rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{['💼', '💰', '❤️', '💪', '📚', '✈️'][idx]}</div>
              <div className="text-xs font-bold text-white">{dim}</div>
            </div>
          ))}
        </div>
        <p className="text-white/90 text-sm text-center">
          从多个维度分析您的运势，帮助您做出更好的决策
        </p>
      </div>
    )
  },
  {
    id: 3,
    title: '设置个人档案',
    description: '完善信息以获得更准确的运势分析',
    icon: Settings,
    color: 'from-green-500 to-emerald-600',
    content: (
      <div className="space-y-4">
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-white">
            <Check size={16} />
            <span className="text-sm">出生日期和时间</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Check size={16} />
            <span className="text-sm">出生地点（真太阳时校准）</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Check size={16} />
            <span className="text-sm">性别（影响大运排序）</span>
          </div>
        </div>
        <p className="text-white/90 text-sm text-center">
          点击右上角设置按钮，完善您的个人信息
        </p>
      </div>
    )
  },
  {
    id: 4,
    title: '开始使用',
    description: '一切准备就绪，开始探索您的运势吧！',
    icon: ArrowRight,
    color: 'from-orange-500 to-red-600',
    content: (
      <div className="space-y-4 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-white/90 text-sm">
          每日查看运势，了解宜忌事项，做出更好的决策
        </p>
        <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mt-4">
          <p className="text-white text-sm font-bold mb-2">小贴士</p>
          <p className="text-white/80 text-xs">
            历史记录会自动保存，您可以随时查看趋势分析
          </p>
        </div>
      </div>
    )
  }
];

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const step = STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* 头部 */}
        <div className={`bg-gradient-to-r ${step.color} text-white p-6 relative`}>
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition"
          >
            <X size={20} className="text-white" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3">
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{step.title}</h2>
              <p className="text-white/90 text-sm mt-1">{step.description}</p>
            </div>
          </div>

          {/* 步骤指示器 */}
          <div className="flex gap-2">
            {STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 内容区 */}
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {step.content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between gap-3">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 transition"
          >
            跳过
          </button>
          
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`bg-gradient-to-r ${step.color} text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2`}
          >
            {isLastStep ? '开始使用' : '下一步'}
            {!isLastStep && <ArrowRight size={18} />}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
