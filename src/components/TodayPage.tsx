// ==========================================
// 今日页面组件
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import FortuneCard from './FortuneCard';
import DimensionCard from './DimensionCard';
import { SkeletonFortuneCard, SkeletonDimensionCard } from './SkeletonLoader';
import { useState } from 'react';
import { TrendingUp, Sparkles, Crown, Loader2, Share2, PenLine } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import BaziTermTooltip from './BaziTermTooltip';
import YongShenEditor from './YongShenEditor';
import { useTranslation } from 'react-i18next';

// DailyFortune 类型定义（与 App.tsx 保持一致）
interface DailyFortune {
  dateObj: Date;
  dateStr: string;
  lunarStr: string;
  weekDay: string;
  totalScore: number;
  pillars: { year: string; month: string; day: string; };
  mainTheme: {
    keyword: string;
    subKeyword: string;
    emoji: string;
    description: string;
  };
  dimensions: { [key: string]: any };
  todo: { label: string; content: string; type: 'up' | 'down'; }[];
  baziDetail?: any;
  yongShen?: any;
  daYun?: any;
  shenSha?: string[];
  liuNian?: any;
  todayTenGod?: string;
}

interface TodayPageProps {
  onDiaryClick?: () => void;
  fortune: DailyFortune | null;
  isLoading: boolean;
  currentDate: Date;
  slideDirection: 'left' | 'right' | null;
  showBazi: boolean;
  onToggleBazi: () => void;
  currentThemeStyle: { bg: string; text: string };
  onFeedbackClick: () => void;
  onAIClick: (question?: string) => void;
  onGenerateImage: () => void;
  isGenerating: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
  dailySignTheme?: 'zen' | 'minimal' | 'oracle';
  onThemeChange?: (theme: 'zen' | 'minimal' | 'oracle') => void;
  showThemeSelector?: boolean;
  onToggleThemeSelector?: () => void;
  baziContext?: any;
  customYongShen?: string | null;
  onCustomYongShenChange?: (yongShen: string | string[] | null) => void;
}

export default function TodayPage({
  fortune,
  isLoading,
  currentDate,
  slideDirection,
  showBazi,
  onToggleBazi,
  currentThemeStyle,
  onFeedbackClick,
  onAIClick,
  onGenerateImage,
  isGenerating,
  contentRef,
  dailySignTheme = 'minimal',
  onThemeChange,
  showThemeSelector = false,
  onToggleThemeSelector,
  baziContext,
  customYongShen,
  onCustomYongShenChange,
  onDiaryClick,
}: TodayPageProps) {
  const { t } = useTranslation(['ui', 'bazi']);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // 使术语可点击
  const TermButton = ({ term, className = '' }: { term: string; className?: string }) => (
    <button
      onClick={() => setSelectedTerm(term)}
      className={`${className} hover:opacity-80 transition cursor-pointer`}
    >
      {term}
    </button>
  );

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-24 relative">
      <AnimatePresence mode="wait">
        {isLoading || !fortune ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <SkeletonFortuneCard />
            <SkeletonDimensionCard />
          </motion.div>
        ) : (
          <motion.div
            key={currentDate.toISOString()}
            initial={{ 
              opacity: 0,
              x: slideDirection === 'right' ? 50 : slideDirection === 'left' ? -50 : 0
            }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ 
              opacity: 0,
              x: slideDirection === 'right' ? -50 : slideDirection === 'left' ? 50 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            ref={contentRef}
            style={{ paddingBottom: '24px', background: '#F5F5F7', paddingLeft: '4px', paddingRight: '4px' }}
          >
            {/* 主运势卡片 */}
            <FortuneCard
              mainTheme={fortune.mainTheme}
              totalScore={fortune.totalScore}
              pillars={fortune.pillars}
              themeStyle={currentThemeStyle}
              showBazi={showBazi}
              onToggleBazi={onToggleBazi}
              yongShen={fortune.yongShen}
              liuNian={fortune.liuNian}
              todayTenGod={fortune.todayTenGod}
              baziContext={{
                baziDetail: fortune.baziDetail,
                yongShen: fortune.yongShen,
                dimensions: fortune.dimensions,
                mainTheme: fortune.mainTheme,
                totalScore: fortune.totalScore,
                liuNian: fortune.liuNian,
              }}
            />

            {/* AI 咨询和反馈按钮 */}
            {fortune && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <motion.button
                  onClick={onAIClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition shadow-lg"
                >
                  <Sparkles size={16} />
                  {t('ui:todayPage.aiDeepConsult')}
                </motion.button>
                <motion.button
                  onClick={onFeedbackClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <TrendingUp size={16} />
                  {t('ui:todayPage.feedbackAccuracy')}
                </motion.button>
              </div>
            )}

            {/* Todo List */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {fortune.todo.map((item, idx) => (
                <div key={idx} className={`p-4 rounded-2xl ${item.type === 'up' ? 'bg-white dark:bg-gray-800' : 'bg-gray-200/50 dark:bg-gray-700/50'} flex flex-col justify-between shadow-sm border border-transparent`}>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded w-fit mb-2 uppercase tracking-wide ${
                    item.type === 'up' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  }`}>
                    {item.label}
                  </span>
                  <span className="font-bold text-gray-700 dark:text-gray-200 leading-tight text-sm">{item.content}</span>
                </div>
              ))}
            </div>

            {/* 八字详情和用神喜忌（可折叠） */}
            {(showBazi || fortune.baziDetail) && (
              <div className="mt-6 space-y-4">
                {/* 八字详情 */}
                {fortune.baziDetail && (
                  <CollapsibleSection
                    title={t('ui:todayPage.baziDetails')}
                    icon={<Sparkles size={14} />}
                    defaultExpanded={false}
                  >
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{t('ui:todayPage.yearPillar')}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.year}</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{t('ui:todayPage.monthPillar')}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.month}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{t('ui:todayPage.dayPillar')}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.day}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">{t('ui:todayPage.hourPillar')}</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.hour}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-400 dark:text-gray-500">{t('ui:todayPage.dayMaster')}</span>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 ml-1">{fortune.baziDetail.dayMaster}</span>
                    </div>
                    <motion.button
                      onClick={() => onAIClick(t('ui:todayPage.aiConsultPrompt'))}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition shadow-lg"
                    >
                      <Sparkles size={16} />
                      {t('ui:todayPage.aiDeepAnalysis')}
                    </motion.button>
                  </CollapsibleSection>
                )}

                {/* 用神喜忌 */}
                {fortune.yongShen && (
                  <YongShenEditor
                    yongShen={fortune.yongShen}
                    onChange={onCustomYongShenChange}
                    darkMode={true}
                    onTermClick={(term) => setSelectedTerm(term)}
                  />
                )}

                  {/* 大运信息 */}
                  {fortune.daYun && (
                    <CollapsibleSection
                      title={t('ui:todayPage.currentDayun')}
                      icon={<Crown size={14} />}
                      defaultExpanded={false}
                    >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl">
                          <div className="text-2xl font-black">{fortune.daYun.gan_zhi}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">{t('ui:todayPage.startAge')}</div>
                          <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{fortune.daYun.age}{t('ui:todayPage.yearsOld')}</div>
                        </div>
                      </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 dark:text-gray-500">{t('ui:todayPage.dayunCycle')}</div>
                          <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                            {fortune.daYun.start_year} - {fortune.daYun.end_year}
                          </div>
                        </div>
                      </div>
                    </CollapsibleSection>
                  )}

                  {/* 神煞信息 */}
                  {fortune.shenSha && fortune.shenSha.length > 0 && (
                    <CollapsibleSection
                      title={t('ui:todayPage.todayShenSha')}
                      icon={<Sparkles size={14} />}
                      defaultExpanded={false}
                    >
                    <div className="flex flex-wrap gap-2">
                      {fortune.shenSha.map((ss, idx) => (
                        <TermButton
                          key={idx}
                          term={ss}
                          className="px-3 py-1.5 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-xs font-bold border border-purple-200 dark:border-purple-800"
                        />
                        ))}
                      </div>
                    </CollapsibleSection>
                  )}
                </div>
              )}

            {/* 六维度运势 */}
            <DimensionCard 
              dimensions={fortune.dimensions}
              onAIClick={(question) => onAIClick(question)}
            />

            {/* 日签水印（截图时包含） */}
            <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t('ui:todayPage.watermark', { defaultValue: '运势日历 · 每日运势' })}
              </p>
              <p className="text-[10px] text-gray-400/80 dark:text-gray-500/80 mt-1">
                {typeof window !== 'undefined' ? window.location.origin : ''}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部悬浮按钮 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20 no-screenshot lg:hidden">
        {onToggleThemeSelector && (
          <motion.button
            onClick={onToggleThemeSelector}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 font-bold transition hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Sparkles size={18} />
          </motion.button>
        )}
        {onDiaryClick && (
          <motion.button
            onClick={onDiaryClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg font-bold transition"
            aria-label={t('ui:todayPage.diary', { defaultValue: '写日记' })}
          >
            <PenLine size={18} />
            <span className="text-sm">{t('ui:todayPage.diary', { defaultValue: '写日记' })}</span>
          </motion.button>
        )}
        <motion.button
          onClick={onGenerateImage}
          disabled={isGenerating || !fortune}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-full shadow-xl shadow-slate-300 dark:shadow-slate-900 font-bold transition hover:bg-black dark:hover:bg-slate-600 disabled:opacity-70"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Share2 size={18} />}
          {isGenerating ? t('ui:todayPage.generating') : t('ui:todayPage.generateSign')}
        </motion.button>
      </div>

      {/* 主题选择器 */}
      {showThemeSelector && onThemeChange && (
        <DailySignThemeSelector
          selectedTheme={dailySignTheme}
          onThemeChange={onThemeChange}
          onClose={() => onToggleThemeSelector?.()}
        />
      )}

      {/* 术语解释浮窗 */}
      <BaziTermTooltip
        term={selectedTerm || ''}
        isOpen={!!selectedTerm}
        onClose={() => setSelectedTerm(null)}
        baziContext={baziContext}
      />

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#F5F5F7] dark:from-slate-900 to-transparent pointer-events-none z-10 lg:hidden"></div>
    </div>
  );
}
