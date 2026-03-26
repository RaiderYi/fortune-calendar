/* ============================================
   塔罗牌沉浸式体验主组件
   Tarot Immersive Experience
   ============================================ */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Save, Share2, ChevronLeft } from 'lucide-react';
import { Card3D, CardSelector } from './Card3D';
import { InkSpread, GoldenParticles, BreathingGlow } from './InkSpread';
import { FullScreenLoader } from '../animations';

// 塔罗阶段
type TarotPhase = 'prepare' | 'draw' | 'reveal' | 'interpret';

// 塔罗牌数据
interface TarotCard {
  id: string;
  name: string;
  nameEn: string;
  image: string;
  meaning: {
    upright: string;
    reversed: string;
  };
  interpretation: string;
}

// 模拟塔罗牌数据
const tarotCards: TarotCard[] = [
  {
    id: 'fool',
    name: '愚人',
    nameEn: 'The Fool',
    image: '',
    meaning: {
      upright: '新的开始、冒险、纯真、自由',
      reversed: '鲁莽、冒失、缺乏计划、盲目'
    },
    interpretation: '愚人代表着全新的开始，鼓励你勇敢地踏出舒适区，拥抱未知的旅程。相信你的直觉，保持开放的心态。'
  },
  {
    id: 'magician',
    name: '魔术师',
    nameEn: 'The Magician',
    image: '',
    meaning: {
      upright: '创造力、意志力、技能、行动力',
      reversed: '欺骗、操控、缺乏自信、技能不足'
    },
    interpretation: '魔术师象征着你拥有实现目标所需的所有资源和能力。现在是采取行动、发挥创造力的最佳时机。'
  },
  {
    id: 'priestess',
    name: '女祭司',
    nameEn: 'The High Priestess',
    image: '',
    meaning: {
      upright: '直觉、潜意识、神秘、内在智慧',
      reversed: '忽视直觉、表面化、缺乏洞察力'
    },
    interpretation: '女祭司提醒你倾听内心的声音，相信你的直觉。答案往往隐藏在你内心深处，需要静心去发现。'
  },
  {
    id: 'empress',
    name: '女皇',
    nameEn: 'The Empress',
    image: '',
    meaning: {
      upright: '丰饶、母性、创造力、感官享受',
      reversed: '缺乏创造力、不孕、过度依赖'
    },
    interpretation: '女皇代表着丰盛和创造力。关注生活中的美好事物，培养你的创造力，享受当下的丰盛。'
  },
  {
    id: 'emperor',
    name: '皇帝',
    nameEn: 'The Emperor',
    image: '',
    meaning: {
      upright: '权威、结构、控制、父性能量',
      reversed: '专制、僵化、缺乏自律、软弱'
    },
    interpretation: '皇帝象征着秩序和结构。是时候建立规则，掌控局面，展现你的领导力和决断力。'
  }
];

interface TarotExperienceProps {
  question?: string;
  onComplete?: (result: { card: TarotCard; isReversed: boolean }) => void;
  onBack?: () => void;
  className?: string;
}

export function TarotExperience({
  question,
  onComplete,
  onBack,
  className = ''
}: TarotExperienceProps) {
  const [phase, setPhase] = useState<TarotPhase>('prepare');
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [drawnCard, setDrawnCard] = useState<TarotCard | null>(null);
  const [isReversed, setIsReversed] = useState(false);
  const [showInkSpread, setShowInkSpread] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // 阶段一：准备 → 抽牌
  const handleStartDraw = () => {
    setPhase('draw');
  };

  // 阶段二：抽牌 → 揭晓
  const handleSelectCard = (index: number) => {
    setSelectedCardIndex(index);
    
    // 随机选择一张牌和正逆位
    const randomCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];
    const randomReversed = Math.random() > 0.5;
    
    setDrawnCard(randomCard);
    setIsReversed(randomReversed);
    
    // 延迟进入揭晓阶段
    setTimeout(() => {
      setPhase('reveal');
      setShowInkSpread(true);
      
      // 水墨扩散后翻牌
      setTimeout(() => {
        setIsCardFlipped(true);
        setShowParticles(true);
        
        // 进入解读阶段
        setTimeout(() => {
          setPhase('interpret');
          setShowInkSpread(false);
          onComplete?.({ card: randomCard, isReversed: randomReversed });
        }, 2000);
      }, 1000);
    }, 500);
  };

  // 重置
  const handleReset = () => {
    setPhase('prepare');
    setSelectedCardIndex(null);
    setDrawnCard(null);
    setIsCardFlipped(false);
    setShowInkSpread(false);
    setShowParticles(false);
  };

  return (
    <div className={`min-h-screen bg-ink relative overflow-hidden ${className}`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-vermilion/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* 返回按钮 */}
      {phase !== 'reveal' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-serif text-sm">返回</span>
        </motion.button>
      )}

      {/* 金粉效果 */}
      <GoldenParticles isActive={showParticles} particleCount={40} />

      {/* 主要内容 */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {/* 阶段一：准备 */}
          {phase === 'prepare' && (
            <motion.div
              key="prepare"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              {/* 水晶球/呼吸效果 */}
              <div className="relative w-32 h-32 mx-auto mb-8">
                <BreathingGlow isActive={true} color="#D4A574" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold/30 to-transparent backdrop-blur-sm flex items-center justify-center border border-gold/20">
                    <Sparkles size={32} className="text-gold/60" />
                  </div>
                </motion.div>
              </div>

              <h2 className="text-2xl font-serif text-white mb-4">静心祈愿</h2>
              <p className="text-white/60 font-serif mb-2 max-w-xs mx-auto">
                在心中默想你的问题
              </p>
              {question && (
                <p className="text-gold font-serif mb-8">「{question}」</p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartDraw}
                className="px-8 py-3 bg-vermilion/20 border border-vermilion/40 text-vermilion-light rounded-full font-serif hover:bg-vermilion/30 transition-colors"
              >
                开始抽牌
              </motion.button>
            </motion.div>
          )}

          {/* 阶段二：抽牌 */}
          {phase === 'draw' && (
            <motion.div
              key="draw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-xl font-serif text-white mb-8">选择一张牌</h2>
              <CardSelector
                count={5}
                selectedIndex={selectedCardIndex}
                onSelect={handleSelectCard}
              />
              <p className="text-white/40 font-serif text-sm mt-8">
                点击一张牌翻开
              </p>
            </motion.div>
          )}

          {/* 阶段三：揭晓 */}
          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center"
            >
              {/* 水墨扩散效果 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <InkSpread isActive={showInkSpread} size="lg" />
              </div>

              {drawnCard && (
                <Card3D
                  cardName={drawnCard.name}
                  isFlipped={isCardFlipped}
                  size="lg"
                  isReversed={isReversed}
                />
              )}
            </motion.div>
          )}

          {/* 阶段四：解读 */}
          {phase === 'interpret' && drawnCard && (
            <motion.div
              key="interpret"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              {/* 牌展示 */}
              <div className="flex justify-center mb-6">
                <Card3D
                  cardName={drawnCard.name}
                  isFlipped={true}
                  size="md"
                  isReversed={isReversed}
                />
              </div>

              {/* 牌名 */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-serif text-white mb-1">
                  {drawnCard.name}
                </h2>
                <p className="text-white/40 font-serif text-sm">
                  {drawnCard.nameEn}
                  {isReversed && (
                    <span className="ml-2 text-vermilion">（逆位）</span>
                  )}
                </p>
              </div>

              {/* 含义 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h3 className="text-gold font-serif mb-3">牌意</h3>
                <p className="text-white/70 font-serif text-sm leading-relaxed">
                  {isReversed 
                    ? drawnCard.meaning.reversed 
                    : drawnCard.meaning.upright
                  }
                </p>
              </div>

              {/* 解读 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <h3 className="text-vermilion-light font-serif mb-3">对你问题的启示</h3>
                <p className="text-white/70 font-serif text-sm leading-relaxed">
                  {drawnCard.interpretation}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-vermilion/20 border border-vermilion/40 text-vermilion-light rounded-xl font-serif text-sm flex items-center justify-center gap-2 hover:bg-vermilion/30 transition-colors"
                >
                  <Save size={16} />
                  保存
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gold/20 border border-gold/40 text-gold rounded-xl font-serif text-sm flex items-center justify-center gap-2 hover:bg-gold/30 transition-colors"
                >
                  <Share2 size={16} />
                  分享
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white/70 rounded-xl font-serif text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <RotateCcw size={16} />
                  重抽
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TarotExperience;
export type { TarotPhase, TarotCard, TarotExperienceProps };
