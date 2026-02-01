// ==========================================
// 今日页面组件
// ==========================================

import { motion, AnimatePresence } from 'framer-motion';
import FortuneCard from './FortuneCard';
import DimensionCard from './DimensionCard';
import { SkeletonFortuneCard, SkeletonDimensionCard } from './SkeletonLoader';
import { useState } from 'react';
import { TrendingUp, Sparkles, Crown, Loader2, Share2 } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';
import BaziTermTooltip from './BaziTermTooltip';

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
  onCustomYongShenChange?: (yongShen: string | null) => void;
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
}: TodayPageProps) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [isEditingYongShen, setIsEditingYongShen] = useState(false);
  const [editYongShenValue, setEditYongShenValue] = useState('');

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
                  AI 深度咨询
                </motion.button>
                <motion.button
                  onClick={onFeedbackClick}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition"
                >
                  <TrendingUp size={16} />
                  反馈准确度
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
                    title="八字详情"
                    icon={<Sparkles size={14} />}
                    defaultExpanded={false}
                  >
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">年柱</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.year}</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">月柱</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.month}</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">日柱</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.day}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-3 rounded-xl">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-1">时柱</div>
                        <div className="text-lg font-bold text-gray-800 dark:text-gray-200">{fortune.baziDetail.hour}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-xs text-gray-400 dark:text-gray-500">日主：</span>
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 ml-1">{fortune.baziDetail.dayMaster}</span>
                    </div>
                    <motion.button
                      onClick={() => onAIClick('请详细分析我的八字命理，包括四柱的含义、五行平衡、用神喜忌以及对我性格和运势的影响。')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition shadow-lg"
                    >
                      <Sparkles size={16} />
                      AI 深度解读八字
                    </motion.button>
                  </CollapsibleSection>
                )}

                {/* 用神喜忌 */}
                {fortune.yongShen && (
                  <CollapsibleSection
                    title="用神喜忌"
                    icon={<TrendingUp size={14} />}
                    defaultExpanded={true}
                    headerAction={
                      onCustomYongShenChange ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingYongShen(!isEditingYongShen);
                            setEditYongShenValue(fortune.yongShen.yongShen && fortune.yongShen.yongShen[0] ? fortune.yongShen.yongShen[0] : '');
                          }}
                          className="text-xs px-3 py-1.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg cursor-pointer font-medium transition-colors shadow-sm whitespace-nowrap"
                          type="button"
                        >
                          {isEditingYongShen ? '取消' : '编辑用神'}
                        </button>
                      ) : undefined
                    }
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">日主旺衰</div>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          fortune.yongShen.strength === '身旺' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                          fortune.yongShen.strength === '身弱' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {fortune.yongShen.strength}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 flex items-center justify-between">
                          <TermButton term="用神" className="text-gray-400 dark:text-gray-500" />
                          <div className="flex items-center gap-2">
                            {fortune.yongShen.isCustom && (
                              <span className="text-[10px] px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-medium">自定义</span>
                            )}
                          </div>
                        </div>
                        {isEditingYongShen && onCustomYongShenChange ? (
                          <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={editYongShenValue}
                              onChange={(e) => {
                                e.stopPropagation();
                                setEditYongShenValue(e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full"
                            >
                              <option value="">选择用神</option>
                              <option value="木">木</option>
                              <option value="火">火</option>
                              <option value="土">土</option>
                              <option value="金">金</option>
                              <option value="水">水</option>
                            </select>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (editYongShenValue && onCustomYongShenChange) {
                                    onCustomYongShenChange(editYongShenValue);
                                    setIsEditingYongShen(false);
                                  }
                                }}
                                disabled={!editYongShenValue}
                                className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition"
                                type="button"
                              >
                                保存
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onCustomYongShenChange) {
                                    onCustomYongShenChange(null);
                                    setIsEditingYongShen(false);
                                  }
                                }}
                                className="flex-1 px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                                type="button"
                              >
                                重置
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {fortune.yongShen.yongShen && fortune.yongShen.yongShen.length > 0 ? (
                              fortune.yongShen.yongShen.map((elem, idx) => (
                                <TermButton
                                  key={idx}
                                  term={elem}
                                  className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold"
                                />
                              ))
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-500">暂无</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
                          <TermButton term="喜神" className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {fortune.yongShen.xiShen && fortune.yongShen.xiShen.length > 0 ? (
                            fortune.yongShen.xiShen.map((elem, idx) => (
                              <TermButton
                                key={idx}
                                term={elem}
                                className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold"
                              />
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">暂无</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">
                          <TermButton term="忌神" className="text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {fortune.yongShen.jiShen && fortune.yongShen.jiShen.length > 0 ? (
                            fortune.yongShen.jiShen.map((elem, idx) => (
                              <TermButton
                                key={idx}
                                term={elem}
                                className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold"
                              />
                            ))
                          ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-500">暂无</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleSection>
                )}

                  {/* 大运信息 */}
                  {fortune.daYun && (
                    <CollapsibleSection
                      title="当前大运"
                      icon={<Crown size={14} />}
                      defaultExpanded={false}
                    >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl">
                          <div className="text-2xl font-black">{fortune.daYun.gan_zhi}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 dark:text-gray-500">起运年龄</div>
                          <div className="text-sm font-bold text-gray-800 dark:text-gray-200">{fortune.daYun.age}岁</div>
                        </div>
                      </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 dark:text-gray-500">大运周期</div>
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
                      title="今日神煞"
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
        <motion.button
          onClick={onGenerateImage}
          disabled={isGenerating || !fortune}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-700 text-white px-6 py-3 rounded-full shadow-xl shadow-slate-300 dark:shadow-slate-900 font-bold transition hover:bg-black dark:hover:bg-slate-600 disabled:opacity-70"
        >
          {isGenerating ? <Loader2 size={18} className="animate-spin"/> : <Share2 size={18} />}
          {isGenerating ? '生成中...' : '生成日签'}
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
