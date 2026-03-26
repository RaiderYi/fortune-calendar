/* ============================================
   易经卦象沉浸式体验主组件
   Yijing (I Ching) Immersive Experience
   ============================================ */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BookOpen, RotateCcw, Save, Sparkles } from 'lucide-react';
import { ThreeCoins, TossButton, CoinFace } from './CoinToss';
import { Hexagram, YaoType, coinsToYao, getHexagramName, generateHexagram } from './Hexagram';
import { InkSpread, BreathingGlow } from '../Tarot/InkSpread';

// 易经阶段
type YijingPhase = 'prepare' | 'toss' | 'building' | 'complete';

// 卦象解读数据
const hexagramInterpretations: Record<string, { meaning: string; advice: string }> = {
  '坤为地': {
    meaning: '坤卦代表大地，象征柔顺、包容、承载。地势坤，君子以厚德载物。',
    advice: '当前宜守不宜攻，以柔克刚，静待时机。多听取他人意见，保持谦逊态度。'
  },
  '乾为天': {
    meaning: '乾卦代表天，象征刚健、创造、进取。天行健，君子以自强不息。',
    advice: '时机有利，宜积极进取。但要谨记物极必反，不可过于刚强。'
  },
  '水雷屯': {
    meaning: '屯卦象征初生、艰难。万物始生，充满艰难，但蕴含希望。',
    advice: '万事开头难，不要急于求成。稳扎稳打，积蓄力量，等待时机。'
  },
  '山水蒙': {
    meaning: '蒙卦象征蒙昧、启蒙。需要学习和引导，开启智慧。',
    advice: '虚心求教，多向有经验的人请教。保持学习的心态，接受新知。'
  },
  '水天需': {
    meaning: '需卦象征等待、需求。云在天上，需要等待时机成熟。',
    advice: '当前需要耐心等待，不可急躁。做好准备，时机到来自然水到渠成。'
  },
  '天水讼': {
    meaning: '讼卦象征争讼、矛盾。天与水相违，容易产生争执。',
    advice: '尽量避免冲突和争执。如无法避免，也要以和为贵，寻求和解之道。'
  },
  '地水师': {
    meaning: '师卦象征军队、纪律。地中有水，需要领导和组织。',
    advice: '需要团队精神和纪律性。找好领导者，统一步调，共同前进。'
  },
  '水地比': {
    meaning: '比卦象征亲近、团结。水在地上，相亲相辅。',
    advice: '宜与人合作，建立良好关系。团结身边的人，共同发展。'
  },
  'default': {
    meaning: '卦象显示当前处于变化的节点，阴阳交替，吉凶相依。',
    advice: '保持平常心，顺应变化。好事多磨，坚持不懈终将有所成。'
  }
};

interface YijingExperienceProps {
  question?: string;
  onComplete?: (result: { yaos: YaoType[]; name: string }) => void;
  onBack?: () => void;
  className?: string;
}

export function YijingExperience({
  question,
  onComplete,
  onBack,
  className = ''
}: YijingExperienceProps) {
  const [phase, setPhase] = useState<YijingPhase>('prepare');
  const [currentToss, setCurrentToss] = useState(0);
  const [isTossing, setIsTossing] = useState(false);
  const [coinResults, setCoinResults] = useState<[CoinFace, CoinFace, CoinFace][]>([]);
  const [yaos, setYaos] = useState<YaoType[]>([]);
  const [hexagramName, setHexagramName] = useState('');
  const [showInkSpread, setShowInkSpread] = useState(false);

  // 开始摇卦
  const handleStartToss = () => {
    setPhase('toss');
    setCurrentToss(1);
  };

  // 执行一次摇卦
  const handleToss = useCallback(() => {
    if (isTossing || currentToss > 6) return;
    
    setIsTossing(true);
    
    // 延迟获取结果
    setTimeout(() => {
      const newResult: [CoinFace, CoinFace, CoinFace] = [
        Math.random() > 0.5 ? 'head' : 'tail',
        Math.random() > 0.5 ? 'head' : 'tail',
        Math.random() > 0.5 ? 'head' : 'tail'
      ];
      
      const newResults = [...coinResults, newResult];
      setCoinResults(newResults);
      
      // 生成当前卦象
      const currentYaos = newResults.map(r => coinsToYao([
        r[0] === 'head',
        r[1] === 'head',
        r[2] === 'head'
      ]));
      setYaos(currentYaos);
      
      setIsTossing(false);
      
      if (currentToss < 6) {
        setCurrentToss(currentToss + 1);
      } else {
        // 完成所有摇卦
        const name = getHexagramName(currentYaos);
        setHexagramName(name);
        setPhase('building');
        setShowInkSpread(true);
        
        setTimeout(() => {
          setPhase('complete');
          setShowInkSpread(false);
          onComplete?.({ yaos: currentYaos, name });
        }, 2000);
      }
    }, 1500);
  }, [currentToss, isTossing, coinResults, onComplete]);

  // 重置
  const handleReset = () => {
    setPhase('prepare');
    setCurrentToss(0);
    setCoinResults([]);
    setYaos([]);
    setHexagramName('');
    setShowInkSpread(false);
  };

  // 获取解读
  const interpretation = hexagramInterpretations[hexagramName] || hexagramInterpretations.default;

  // 当前要显示的三枚铜钱结果
  const currentCoinResult = coinResults.length > 0 
    ? coinResults[coinResults.length - 1] 
    : undefined;

  return (
    <div className={`min-h-screen bg-paper relative overflow-hidden ${className}`}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-qingdai/5 blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-vermilion/5 blur-3xl" />
      </div>

      {/* 返回按钮 */}
      {phase !== 'building' && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onBack}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 text-ink/60 hover:text-ink transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="font-serif text-sm">返回</span>
        </motion.button>
      )}

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
              className="text-center max-w-md"
            >
              {/* 八卦符号 */}
              <div className="relative w-28 h-28 mx-auto mb-8">
                <BreathingGlow isActive={true} color="#2D5A4A" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full opacity-30">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#2D5A4A" strokeWidth="1" />
                    <path d="M50 5 L50 95 M5 50 L95 50" stroke="#2D5A4A" strokeWidth="1" />
                  </svg>
                </motion.div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-serif text-qingdai">易</span>
                </div>
              </div>

              <h2 className="text-2xl font-serif text-ink mb-4">诚心问卦</h2>
              <p className="text-light-ink font-serif mb-2">
                在心中默想你的问题，双手合十
              </p>
              <p className="text-sm text-muted font-serif mb-8">
                通过六次摇卦，得到你的卦象
              </p>

              {question && (
                <div className="bg-paper-dark rounded-xl p-4 mb-8">
                  <p className="text-sm text-light-ink font-serif mb-1">你的问题：</p>
                  <p className="text-ink font-serif">「{question}」</p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartToss}
                className="px-8 py-3 bg-qingdai/10 border border-qingdai/40 text-qingdai rounded-full font-serif hover:bg-qingdai/20 transition-colors"
              >
                开始摇卦
              </motion.button>
            </motion.div>
          )}

          {/* 阶段二：摇卦 */}
          {phase === 'toss' && (
            <motion.div
              key="toss"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center w-full max-w-md"
            >
              <h2 className="text-xl font-serif text-ink mb-2">第 {currentToss}/6 次摇卦</h2>
              <p className="text-sm text-light-ink font-serif mb-8">
                点击下方按钮摇卦
              </p>

              {/* 铜钱动画区 */}
              <div className="h-32 flex items-center justify-center mb-8">
                <ThreeCoins
                  results={currentCoinResult}
                  isTossing={isTossing}
                />
              </div>

              <TossButton
                onClick={handleToss}
                disabled={isTossing}
                isTossing={isTossing}
                remaining={6 - currentToss + 1}
              />

              {/* 已生成的爻 */}
              {yaos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12"
                >
                  <p className="text-sm text-light-ink font-serif mb-4">已生成的卦象</p>
                  <div className="bg-white rounded-2xl p-6 shadow-card inline-block">
                    <Hexagram yaos={yaos} showNumbers={false} isAnimated={false} />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* 阶段三：生成中 */}
          {phase === 'building' && (
            <motion.div
              key="building"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative flex flex-col items-center"
            >
              <InkSpread isActive={showInkSpread} size="lg" color="#2D5A4A" />
              
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-qingdai/10 flex items-center justify-center">
                  <BookOpen size={32} className="text-qingdai" />
                </div>
                <p className="text-ink font-serif">正在解读卦象...</p>
              </motion.div>
            </motion.div>
          )}

          {/* 阶段四：完成 */}
          {phase === 'complete' && yaos.length === 6 && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              {/* 卦象展示 */}
              <div className="bg-white rounded-2xl p-8 shadow-card mb-6 text-center">
                <Hexagram yaos={yaos} name={hexagramName} />
              </div>

              {/* 卦辞解读 */}
              <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen size={16} className="text-qingdai" />
                  <h3 className="font-serif text-ink">卦辞</h3>
                </div>
                <p className="text-light-ink font-serif text-sm leading-relaxed">
                  {interpretation.meaning}
                </p>
              </div>

              {/* 建议 */}
              <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-vermilion" />
                  <h3 className="font-serif text-ink">建议</h3>
                </div>
                <p className="text-light-ink font-serif text-sm leading-relaxed">
                  {interpretation.advice}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-qingdai/10 border border-qingdai/40 text-qingdai rounded-xl font-serif text-sm flex items-center justify-center gap-2 hover:bg-qingdai/20 transition-colors"
                >
                  <Save size={16} />
                  保存
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReset}
                  className="flex-1 py-3 bg-paper-dark text-ink rounded-xl font-serif text-sm flex items-center justify-center gap-2 hover:bg-paper-dark/80 transition-colors"
                >
                  <RotateCcw size={16} />
                  重摇
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default YijingExperience;
export type { YijingPhase };
