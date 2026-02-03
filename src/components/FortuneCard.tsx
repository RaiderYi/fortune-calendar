import { useState, useEffect, memo } from 'react';
import { Crown, Eye, EyeOff, ChevronDown, ChevronUp, Info, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayWisdom } from '../services/api';
import type { BaziContext } from '../types';
import { useTranslation } from 'react-i18next';

interface FortuneCardProps {
  mainTheme: {
    keyword: string;
    subKeyword: string;
    emoji: string;
    description: string;
  };
  totalScore: number;
  pillars: {
    year: string;
    month: string;
    day: string;
  };
  themeStyle: {
    bg: string;
    text: string;
  };
  showBazi: boolean;
  onToggleBazi: () => void;
  yongShen?: {
    strength: string;
    yongShen: string[];
    xiShen: string[];
    jiShen: string[];
  };
  liuNian?: {
    yearGan: string;
    yearZhi: string;
    dayGan: string;
    dayZhi: string;
  };
  todayTenGod?: string;
  baziContext?: BaziContext; // 用于AI锦囊生成
}

function FortuneCard({
  mainTheme,
  totalScore,
  pillars,
  themeStyle,
  showBazi,
  onToggleBazi,
  yongShen,
  liuNian,
  todayTenGod,
  baziContext,
}: FortuneCardProps) {
  const { t } = useTranslation('ui');
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false);
  const [wisdomTip, setWisdomTip] = useState<string>('');
  const [isLoadingWisdom, setIsLoadingWisdom] = useState(false);

  // 获取AI今日锦囊
  useEffect(() => {
    if (baziContext && !wisdomTip && !isLoadingWisdom) {
      setIsLoadingWisdom(true);
      getTodayWisdom(baziContext)
        .then((tip) => {
          if (tip) {
            setWisdomTip(tip);
          }
        })
        .catch(() => {
          // 失败时使用默认锦囊
          setWisdomTip('');
        })
        .finally(() => {
          setIsLoadingWisdom(false);
        });
    }
  }, [baziContext]);

  // 生成深度解读内容
  const generateDeepAnalysis = () => {
    const analysis: string[] = [];

    // 运势形成原因
    if (liuNian && todayTenGod) {
      analysis.push(`今日流日为${liuNian.dayGan}${liuNian.dayZhi}，十神为${todayTenGod}。`);
    }

    if (yongShen) {
      const yongShenList = Array.isArray(yongShen.yongShen) ? yongShen.yongShen : [];
      if (yongShenList.length > 0) {
        analysis.push(`您的八字${yongShen.strength || '未知'}，用神为${yongShenList.join('、')}。`);
      }
      
      if (liuNian) {
        const dayGanElement = getElementFromGan(liuNian.dayGan);
        if (yongShenList.includes(dayGanElement)) {
          analysis.push(`今日流日天干${liuNian.dayGan}属${dayGanElement}，与您的用神相合，运势较为顺畅。`);
        } else {
          const jiShenList = Array.isArray(yongShen.jiShen) ? yongShen.jiShen : [];
          if (jiShenList.includes(dayGanElement)) {
            analysis.push(`今日流日天干${liuNian.dayGan}属${dayGanElement}，与您的忌神相冲，需谨慎行事。`);
          }
        }
      }
    }

    // 分数解读
    if (totalScore >= 80) {
      analysis.push(`综合评分${totalScore}分，属于上等运势，适合推进重要事务，把握机会。`);
    } else if (totalScore >= 60) {
      analysis.push(`综合评分${totalScore}分，运势平稳，按部就班即可，保持积极心态。`);
    } else {
      analysis.push(`综合评分${totalScore}分，运势较弱，建议谨慎决策，多听取他人意见。`);
    }

    return analysis;
  };

  // 从天干获取五行
  const getElementFromGan = (gan: string): string => {
    const ganToElement: Record<string, string> = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水',
    };
    return ganToElement[gan] || '';
  };

  const deepAnalysis = generateDeepAnalysis();

  return (
    <div
      className="mt-4 rounded-[2rem] p-6 shadow-lg relative overflow-hidden group"
      style={{ background: themeStyle.bg }}
    >
      {/* 背景装饰 Emoji */}
      <div className="absolute -right-6 -top-6 text-[10rem] opacity-10 select-none pointer-events-none rotate-12">
        {mainTheme.emoji}
      </div>

      {/* 主内容 */}
      <div className="relative z-10" style={{ color: themeStyle.text }}>
        {/* AI 今日锦囊 */}
        {wisdomTip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/30 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <Sparkles size={16} className="mt-0.5 flex-shrink-0 opacity-80" />
              <p className="text-sm font-medium leading-relaxed flex-1 italic">
                {wisdomTip}
              </p>
            </div>
          </motion.div>
        )}
        {isLoadingWisdom && (
          <div className="mb-4 bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/30 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin opacity-60" />
            <span className="text-xs opacity-60">{t('fortuneCard.aiGeneratingWisdom')}</span>
          </div>
        )}

        {/* 顶部：标签 + 分数 */}
        <div className="flex justify-between items-start mb-6">
          <div className="inline-flex items-center gap-1 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
            <Crown size={12} className="opacity-80" />
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
              Today's Vibe
            </span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter leading-none">
                {totalScore}
              </span>
              <span className="text-xs font-medium opacity-60">{t('fortuneCard.points')}</span>
            </div>
          </div>
        </div>

        {/* 主题关键词 */}
        <div className="mb-5">
          <h2 className="text-6xl font-black tracking-tighter mb-2 drop-shadow-sm">
            {mainTheme.keyword}
          </h2>
          <div className="flex items-center gap-2">
            <span className="bg-white/40 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
              <span className="text-lg">{mainTheme.emoji}</span>
              {mainTheme.subKeyword}
            </span>
          </div>
        </div>

        {/* 八字显示开关 */}
        <div className="mb-3">
          <button
            onClick={onToggleBazi}
            className="text-[10px] opacity-50 hover:opacity-100 transition flex items-center gap-1.5 bg-black/5 dark:bg-white/10 px-2 py-1 rounded hover:bg-black/10 dark:hover:bg-white/20 w-fit"
          >
            {showBazi ? <EyeOff size={10} /> : <Eye size={10} />}
            {showBazi
              ? `${pillars.year} / ${pillars.month} / ${pillars.day}`
              : t('fortuneCard.viewBaziPassword')}
          </button>
        </div>

        {/* 主题描述 */}
        <p className="text-sm font-medium opacity-90 leading-relaxed bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner mb-3">
          "{mainTheme.description}"
        </p>

        {/* 深度解读按钮 */}
        <motion.button
          onClick={() => setShowDeepAnalysis(!showDeepAnalysis)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/30 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border border-white/20 hover:bg-white/40 transition"
        >
          <Info size={14} />
          {showDeepAnalysis ? '收起深度解读' : '查看深度解读'}
          {showDeepAnalysis ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </motion.button>

        {/* 深度解读内容 */}
        <AnimatePresence>
          {showDeepAnalysis && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 space-y-3">
                <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                  <Info size={14} />
                  运势形成原因
                </h4>
                {deepAnalysis.map((item, idx) => (
                  <p key={idx} className="text-xs leading-relaxed opacity-90">
                    {item}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default memo(FortuneCard);