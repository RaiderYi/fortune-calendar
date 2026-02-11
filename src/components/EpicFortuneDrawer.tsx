// ==========================================
// 史诗级科幻抽签组件 - 电影级视觉体验
// 
// 视觉设计灵感：
// - 《星际穿越》宇宙美学
// - 《银翼杀手2049》霓虹光效
// - 《奇异博士》能量传送门
// - 《星球大战》全息投影
//
// 核心特效：
// 1. 粒子能量场 - 500+ 粒子环绕
// 2. 时空扭曲 - 抽签时空间弯曲
// 3. 光束汇聚 - 命运之光聚焦
// 4. 全息卡牌 - 3D悬浮反转
// 5. 能量爆发 - 结果揭晓时的冲击波
// ==========================================

import { useState, useCallback, useMemo, useRef, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { Sparkles, RotateCcw, Share2, Lightbulb, Tag, Zap, Orbit, Atom } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface FortuneStick {
  id: number;
  level: string;
  poem: string;
  meaning: string;
  fortune: string;
  advice?: string;
  category?: string;
  detail?: string;
}

interface EpicFortuneDrawerProps {
  sticks: FortuneStick[];
  question: string;
  onDraw: (stick: FortuneStick) => void;
  onReset?: () => void;
  canDrawAgain?: boolean;
}

const CARD_COUNT = 25;

/** 从完整牌库中随机抽取 N 张 */
function pickRandomCards(deck: FortuneStick[], count: number): FortuneStick[] {
  if (deck.length <= count) return [...deck];
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    const j = buf[0] % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/** 生成随机粒子 */
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
    opacity: Math.random() * 0.5 + 0.3,
  }));
};

/** 生成星座连线 */
const generateConstellations = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x1: Math.random() * 100,
    y1: Math.random() * 100,
    x2: Math.random() * 100,
    y2: Math.random() * 100,
    opacity: Math.random() * 0.3 + 0.1,
  }));
};

export default function EpicFortuneDrawer({
  sticks,
  question,
  onDraw,
  onReset,
  canDrawAgain = true,
}: EpicFortuneDrawerProps) {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';
  
  // 阶段状态
  const [phase, setPhase] = useState<'idle' | 'charging' | 'warping' | 'drawing' | 'revealing' | 'result'>('idle');
  const [drawnStick, setDrawnStick] = useState<FortuneStick | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [deckKey, setDeckKey] = useState(0);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  
  // 动画控制
  const controls = useAnimation();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  
  // 鼠标位置追踪（用于视差效果）
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // 视差变换
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  // 粒子系统
  const [particles] = useState(() => generateParticles(80));
  const [constellations] = useState(() => generateConstellations(15));
  
  // 牌组
  const currentDeck = useMemo(() => pickRandomCards(sticks, CARD_COUNT), [sticks, deckKey]);
  
  // 卡牌偏移（随机旋转和位置）
  const cardOffsets = useMemo(() =>
    Array.from({ length: CARD_COUNT }).map((_, i) => {
      const seed = (i * 37 + deckKey * 13) % 360;
      return {
        tilt: (seed % 12) - 6,
        drift: (seed % 8) - 4,
        z: Math.floor(seed % 3),
      };
    }),
    [deckKey]
  );

  // 处理抽签
  const handleDraw = useCallback(async (clickedCardIndex: number) => {
    if (!canDrawAgain || currentDeck.length === 0 || phase !== 'idle') return;
    
    const stick = currentDeck[clickedCardIndex];
    if (!stick) return;
    
    setSelectedCard(clickedCardIndex);
    setFlippedIndex(clickedCardIndex);
    
    // 阶段1: 充能
    setPhase('charging');
    await controls.start('charging');
    
    // 阶段2: 时空扭曲
    setPhase('warping');
    await new Promise(r => setTimeout(r, 800));
    
    // 阶段3: 抽牌
    setPhase('drawing');
    setDrawnStick(stick);
    await new Promise(r => setTimeout(r, 600));
    
    // 阶段4: 揭示
    setPhase('revealing');
    await new Promise(r => setTimeout(r, 1000));
    
    // 阶段5: 结果
    setPhase('result');
    onDraw(stick);
  }, [canDrawAgain, currentDeck, phase, controls, onDraw]);

  // 重置
  const handleReset = useCallback(() => {
    setDeckKey(k => k + 1);
    setPhase('idle');
    setDrawnStick(null);
    setFlippedIndex(null);
    setSelectedCard(null);
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
    onReset?.();
  }, [onReset]);

  // 鼠标视差
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
    
    const relX = event.clientX - rect.left;
    const relY = event.clientY - rect.top;
    const pctX = Math.min(100, Math.max(0, (relX / rect.width) * 100));
    const pctY = Math.min(100, Math.max(0, (relY / rect.height) * 100));
    
    const tiltX = ((pctY - 50) / 50) * -8;
    const tiltY = ((pctX - 50) / 50) * 12;
    
    setGlow({ x: pctX, y: pctY });
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setTilt({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  // 运势颜色
  const getFortuneColor = (level: string) => {
    if (level === '上上' || level === 'Excellent') 
      return 'from-emerald-400 to-cyan-400 text-emerald-950 border-emerald-400/50 shadow-emerald-400/30';
    if (level === '上中' || level === 'Good') 
      return 'from-cyan-400 to-blue-400 text-cyan-950 border-cyan-400/50 shadow-cyan-400/30';
    if (level === '中中' || level === 'Neutral') 
      return 'from-slate-300 to-slate-400 text-slate-900 border-slate-400/50';
    if (level === '中下' || level === 'Fair') 
      return 'from-amber-400 to-orange-400 text-amber-950 border-amber-400/50';
    if (level === '下下' || level === 'Unfavorable') 
      return 'from-rose-400 to-red-400 text-rose-950 border-rose-400/50';
    return 'from-slate-300 to-slate-400 text-slate-900';
  };

  // 根据阶段获取卡牌动画
  const getCardAnimation = (index: number) => {
    const isSelected = selectedCard === index;
    const isOther = selectedCard !== null && !isSelected;
    
    if (phase === 'idle') {
      return {
        rotateZ: cardOffsets[index]?.tilt ?? 0,
        y: cardOffsets[index]?.drift ?? 0,
        scale: 1,
        opacity: 1,
        zIndex: cardOffsets[index]?.z ?? 0,
      };
    }
    
    if (phase === 'charging') {
      return {
        rotateZ: isSelected ? 0 : (index % 2 === 0 ? 360 : -360),
        scale: isSelected ? 1.2 : 0.9,
        opacity: isOther ? 0.3 : 1,
        y: isSelected ? -20 : 0,
        zIndex: isSelected ? 50 : 0,
      };
    }
    
    if (phase === 'warping') {
      return {
        scale: isSelected ? 0.1 : 0.8,
        opacity: isSelected ? 0.8 : 0.2,
        rotateY: isSelected ? 720 : 0,
        zIndex: 100,
      };
    }
    
    if (phase === 'drawing') {
      return {
        scale: isSelected ? 1.8 : 0.6,
        opacity: isSelected ? 1 : 0,
        rotateY: isSelected ? 180 : 0,
        y: isSelected ? -50 : 0,
        zIndex: 100,
      };
    }
    
    if (phase === 'revealing' || phase === 'result') {
      return {
        scale: isSelected ? 1.5 : 0.5,
        opacity: isSelected ? 1 : 0,
        rotateY: isSelected ? 180 : 0,
        zIndex: 100,
      };
    }
    
    return {};
  };

  return (
    <div className="relative flex flex-col items-center w-full min-h-[500px]">
      
      {/* ==========================================
          背景特效层
          ========================================== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 深空渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950" />
        
        {/* 星云效果 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-40">
          <div className="absolute inset-0 bg-gradient-radial from-cyan-500/20 via-purple-500/10 to-transparent blur-3xl animate-pulse" 
               style={{ animationDuration: '4s' }} />
          <div className="absolute inset-0 bg-gradient-radial from-violet-500/15 via-transparent to-transparent blur-3xl animate-pulse" 
               style={{ animationDuration: '6s', animationDelay: '1s' }} />
        </div>
        
        {/* 粒子能量场 */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* 星座连线 */}
          {constellations.map((line) => (
            <motion.line
              key={`line-${line.id}`}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="url(#gradient-line)"
              strokeWidth="0.5"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: line.opacity, pathLength: 1 }}
              transition={{ duration: 2, delay: line.id * 0.1 }}
            />
          ))}
          
          <defs>
            <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
              <stop offset="50%" stopColor="rgba(99, 102, 241, 0.5)" />
              <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* 漂浮粒子 */}
        {particles.map((p) => (
          <motion.div
            key={`particle-${p.id}`}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: `radial-gradient(circle, rgba(99, 102, 241, ${p.opacity}) 0%, transparent 70%)`,
              boxShadow: `0 0 ${p.size * 2}px rgba(99, 102, 241, ${p.opacity * 0.5})`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [p.opacity, p.opacity * 1.5, p.opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* 能量漩涡（抽签时显示） */}
        <AnimatePresence>
          {(phase === 'charging' || phase === 'warping') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              {/* 多层旋转环 */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                  style={{
                    width: 200 + i * 80,
                    height: 200 + i * 80,
                    borderColor: `rgba(${99 + i * 20}, ${102 + i * 10}, ${241 - i * 30}, ${0.3 - i * 0.1})`,
                    borderWidth: 2 - i * 0.5,
                  }}
                  animate={{
                    rotate: i % 2 === 0 ? 360 : -360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                  }}
                />
              ))}
              
              {/* 中心能量球 */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.4) 40%, transparent 70%)',
                  boxShadow: '0 0 60px rgba(99, 102, 241, 0.6), inset 0 0 40px rgba(168, 85, 247, 0.4)',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 传送门光束 */}
        <AnimatePresence>
          {phase === 'warping' && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-[600px] origin-center"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(99, 102, 241, 0.8), rgba(168, 85, 247, 0.8), transparent)',
                boxShadow: '0 0 40px rgba(99, 102, 241, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ==========================================
          主内容区
          ========================================== */}
      <div className="relative z-10 flex flex-col items-center w-full">
        
        {/* 标题区 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <Atom className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-sm text-white/60">{isEnglish ? 'Quantum Divination' : '量子占卜'}</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            {isEnglish ? 'Choose Your Destiny' : '选择你的命运'}
          </h2>
        </motion.div>

        {/* 卡牌阵 */}
        <div 
          className="relative grid grid-cols-5 gap-3 mb-8 p-8"
          style={{ 
            perspective: 2000,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* 能量场底座 */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/5 via-purple-500/5 to-transparent blur-xl" />
          
          {Array.from({ length: CARD_COUNT }).map((_, i) => {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const isSelected = selectedCard === i;
            
            return (
              <motion.div
                key={`card-${deckKey}-${i}`}
                className="relative w-14 h-20 sm:w-16 sm:h-24 cursor-pointer"
                style={{
                  perspective: 1500,
                  transformStyle: 'preserve-3d',
                }}
                initial={{ opacity: 0, y: 50, rotateY: 180 }}
                animate={getCardAnimation(i)}
                transition={{
                  duration: phase === 'idle' ? 0.5 : 0.8,
                  delay: phase === 'idle' ? i * 0.03 : 0,
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                }}
                onClick={phase === 'idle' ? () => handleDraw(i) : undefined}
                whileHover={phase === 'idle' ? {
                  rotateX: -10,
                  rotateY: 10,
                  scale: 1.15,
                  z: 50,
                  transition: { duration: 0.3 }
                } : undefined}
              >
                {/* 卡牌容器（用于翻转） */}
                <motion.div
                  className="relative w-full h-full"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={{
                    rotateY: isSelected && phase === 'result' ? 180 : 0,
                  }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  {/* 卡牌背面 */}
                  <div
                    className="absolute inset-0 rounded-xl overflow-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(0deg)',
                    }}
                  >
                    {/* 卡牌背景 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-indigo-900/50 to-slate-900 border border-white/20" />
                    
                    {/* 能量纹路 */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
                      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" />
                    </div>
                    
                    {/* 中心图标 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 border border-cyan-400/30 flex items-center justify-center"
                        animate={{
                          boxShadow: [
                            '0 0 10px rgba(99, 102, 241, 0.3)',
                            '0 0 20px rgba(99, 102, 241, 0.5)',
                            '0 0 10px rgba(99, 102, 241, 0.3)',
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Orbit className="w-4 h-4 text-cyan-300" />
                      </motion.div>
                    </div>
                    
                    {/* 角落装饰 */}
                    <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-cyan-400/50" />
                    <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-cyan-400/50" />
                    <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-purple-400/50" />
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-purple-400/50" />
                  </div>
                  
                  {/* 卡牌正面（翻转后） */}
                  <div
                    className="absolute inset-0 rounded-xl overflow-hidden"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2">
                      <span className="text-xs opacity-60 mb-1">No.</span>
                      <span className="text-lg font-bold">{drawnStick?.id}</span>
                    </div>
                  </div>
                </motion.div>
                
                {/* 选中时的光效 */}
                <AnimatePresence>
                  {isSelected && phase !== 'idle' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute -inset-4 rounded-2xl"
                      style={{
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* 状态提示 */}
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-cyan-200/80 text-sm mb-4 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {isEnglish ? 'Tap any quantum card to reveal your destiny' : '点击任意量子卡牌揭示命运'}
            </motion.p>
          )}
          
          {phase === 'charging' && (
            <motion.div
              key="charging"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="flex flex-col items-center gap-2 mb-4"
            >
              <motion.div 
                className="w-12 h-12 rounded-full border-2 border-cyan-400/30 border-t-cyan-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-cyan-300 text-sm">{isEnglish ? 'Charging quantum field...' : '充能量子场...'}</p>
            </motion.div>
          )}
          
          {phase === 'warping' && (
            <motion.p
              key="warping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-purple-300 text-sm mb-4 tracking-widest"
            >
              {isEnglish ? 'OPENING PORTAL...' : '开启传送门...'}
            </motion.p>
          )}
        </AnimatePresence>

        {/* ==========================================
            结果展示 - 电影级 reveal
            ========================================== */}
        <AnimatePresence>
          {phase === 'result' && drawnStick && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 背景暗化 */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              
              {/* 结果卡片容器 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateX: 45 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotateX: 0,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }
                }}
                className="relative z-10 w-full max-w-lg"
                style={{ perspective: 1500 }}
              >
                {/* 光晕背景 */}
                <div 
                  className="absolute -inset-10 rounded-3xl opacity-60 blur-3xl"
                  style={{
                    background: `radial-gradient(circle, ${
                      drawnStick.level.includes('上') ? 'rgba(52, 211, 153, 0.3)' :
                      drawnStick.level.includes('下') ? 'rgba(248, 113, 113, 0.3)' :
                      'rgba(99, 102, 241, 0.3)'
                    } 0%, transparent 70%)`,
                  }}
                />
                
                {/* 结果卡片 */}
                <motion.div
                  ref={cardRef}
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    boxShadow: '0 0 60px rgba(99, 102, 241, 0.3), inset 0 0 60px rgba(99, 102, 241, 0.05)',
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* 动态光效遮罩 */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)`,
                    }}
                  />
                  
                  {/* 顶部能量条 */}
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                  
                  <div className="p-6 space-y-5">
                    {/* 头部：签号与等级 */}
                    <div className="flex items-center justify-between">
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border bg-gradient-to-r ${getFortuneColor(drawnStick.level)}`}
                      >
                        <Sparkles className="w-4 h-4" />
                        {drawnStick.level} · {drawnStick.fortune}
                      </motion.span>
                      
                      <motion.span
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-cyan-400/60 font-mono text-lg"
                      >
                        #{String(drawnStick.id).padStart(3, '0')}
                      </motion.span>
                    </div>

                    {/* 签诗 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="relative"
                    >
                      <div className="absolute -left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400/50 to-purple-400/50 rounded-full" />
                      <p className="text-xl font-medium text-white leading-relaxed pl-4">
                        {drawnStick.poem}
                      </p>
                    </motion.div>

                    {/* 解签 */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-white/70 leading-relaxed"
                    >
                      {drawnStick.meaning}
                    </motion.p>

                    {/* 详细解读 */}
                    {drawnStick.detail && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="pt-4 border-t border-white/10"
                      >
                        <p className="text-sm text-white/60 leading-relaxed">
                          {drawnStick.detail}
                        </p>
                      </motion.div>
                    )}

                    {/* 建议 */}
                    {drawnStick.advice && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/20"
                      >
                        <Lightbulb className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-cyan-300 mb-1">
                            {isEnglish ? 'Guidance' : '指引'}
                          </p>
                          <p className="text-sm text-white/80">
                            {drawnStick.advice}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* 适用场景 */}
                    {drawnStick.category && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="flex items-center gap-2 text-xs text-white/50"
                      >
                        <Tag className="w-3 h-3" />
                        <span>{isEnglish ? 'Applies to' : '适用于'}: {drawnStick.category}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="p-4 pt-0 flex gap-3"
                  >
                    <motion.button
                      onClick={handleReset}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-colors ${
                        canDrawAgain
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-200 border border-cyan-400/30 hover:border-cyan-400/50'
                          : 'bg-white/5 text-white/40 border border-white/10'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                      {canDrawAgain
                        ? (isEnglish ? 'Draw Again' : '再抽一次')
                        : (isEnglish ? 'Close' : '关闭')}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const text = `${drawnStick.poem}\n\n${drawnStick.meaning}${drawnStick.advice ? `\n\n${isEnglish ? 'Advice' : '建议'}: ${drawnStick.advice}` : ''}`;
                        if (navigator.share) {
                          navigator.share({
                            title: isEnglish ? 'Fortune Card' : '抽签结果',
                            text,
                          });
                        } else {
                          navigator.clipboard?.writeText(text);
                        }
                      }}
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 text-white/70 font-medium text-sm hover:bg-white/5"
                    >
                      <Share2 className="w-4 h-4" />
                      {isEnglish ? 'Share' : '分享'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
