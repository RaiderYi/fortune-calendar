// ==========================================
// 首页 - 基于社会心理学与视觉美学的转化优化设计
// 
// 心理学原理应用：
// 1. 首因效应(Primacy Effect) - 首屏信息密度与记忆点
// 2. 峰终定律(Peak-End Rule) - 情感高潮与结尾强化  
// 3. 认知流畅性(Cognitive Fluency) - 信息处理 effortless
// 4. 社会认同(Social Proof) - 从众心理的递进展示
// 5. 权威性(Authority) - 专业背书的视觉呈现
// 6. 稀缺性(Scarcity) - 时间/机会的紧迫感
// 7. 锚定效应(Anchoring) - 价值感知的参照系
// 8. 互惠原则(Reciprocity) - 免费价值的先给
//
// 美学原则：
// 1. 黄金分割构图 - 1.618 视觉比例
// 2. 留白呼吸感 - 信息密度的节奏控制
// 3. 色彩心理学 - 靛蓝(信任) + 琥珀(温暖)
// 4. 字体层级 - 三分法标题系统
// 5. 微动效节奏 - 0.3s 缓动曲线
// ==========================================

import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Star,
  Quote,
  CalendarCheck,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  TrendingUpIcon,
  Zap,
  Compass,
  Heart,
  Briefcase,
  MapPinned,
  Users,
  Award,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import DonateQR from '../components/DonateQR';
import { PageSection } from '../components/ui';

interface LandingPageProps {
  onLoginClick?: () => void;
}

// ==========================================
// 动画配置 - 符合人眼视觉暂留规律(0.3s)
// ==========================================
const EASE_CURVE = [0.25, 0.1, 0.25, 1]; // 缓动曲线：自然减速
const STAGGER_DELAY = 0.08; // 级联延迟：认知负荷最优间隔

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  
  // 视差滚动效果 - 深度感知
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // 社会认同数据 - 可信度构建
  const trustStats = [
    { 
      value: '12,847', 
      label: isEnglish ? 'Active Users' : '活跃用户', 
      icon: Users,
      delta: '+23%',
      subtext: isEnglish ? 'This month' : '本月新增'
    },
    { 
      value: '4.9', 
      label: isEnglish ? 'App Store Rating' : '应用商店评分', 
      icon: Star,
      delta: '2.3k',
      subtext: isEnglish ? 'Reviews' : '条评价'
    },
    { 
      value: '98%', 
      label: isEnglish ? 'Accuracy Rating' : '准确度好评', 
      icon: Award,
      delta: '',
      subtext: isEnglish ? 'User feedback' : '用户反馈'
    },
  ];

  // 核心功能 - 信息架构的组块化(Chunking)
  const features = [
    {
      icon: Compass,
      title: isEnglish ? 'Daily Compass' : '每日指南针',
      desc: isEnglish
        ? 'Six-dimensional fortune analysis with actionable guidance for decisions.'
        : '六维运势分析，为日常决策提供可执行的建议。',
      color: 'from-blue-500 to-indigo-600',
      stat: '10M+',
      statLabel: isEnglish ? 'Forecasts' : '次预测',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Life Trajectory' : '人生轨迹',
      desc: isEnglish
        ? '10-year fortune trends with key turning points and cycle analysis.'
        : '十年运势趋势，标注关键转折点与周期规律。',
      color: 'from-emerald-500 to-teal-600',
      stat: '94%',
      statLabel: isEnglish ? 'Correlation' : '相关性',
    },
    {
      icon: Sparkles,
      title: isEnglish ? 'AI Oracle' : 'AI 命理师',
      desc: isEnglish
        ? 'Conversational AI providing personalized Bazi interpretation 24/7.'
        : '24小时在线对话式 AI，提供个性化八字解读。',
      color: 'from-violet-500 to-purple-600',
      stat: '<3s',
      statLabel: isEnglish ? 'Response' : '响应时间',
    },
    {
      icon: CalendarCheck,
      title: isEnglish ? 'Auspicious Timing' : '择日良辰',
      desc: isEnglish
        ? 'Scientific date selection for important events based on your chart.'
        : '基于个人命盘，为重要事件科学择日。',
      color: 'from-amber-500 to-orange-600',
      stat: '50+',
      statLabel: isEnglish ? 'Event Types' : '事件类型',
    },
  ];

  // 使用场景 - 情境化叙事(Contextual Storytelling)
  const useCases = [
    {
      icon: Briefcase,
      title: isEnglish ? 'Career Decisions' : '职业抉择',
      desc: isEnglish 
        ? 'Knowing when to pursue opportunities or exercise patience.' 
        : '知晓何时该把握机会，何时该韬光养晦。',
      impact: isEnglish ? '73% made better decisions' : '73% 做出更好决策',
      color: 'blue',
    },
    {
      icon: Heart,
      title: isEnglish ? 'Relationships' : '感情经营',
      desc: isEnglish 
        ? 'Understanding compatibility and timing for meaningful connections.' 
        : '理解缘分契合度与时机，经营有意义的关系。',
      impact: isEnglish ? '68% improved relationships' : '68% 改善关系',
      color: 'rose',
    },
    {
      icon: TrendingUpIcon,
      title: isEnglish ? 'Wealth Planning' : '财富规划',
      desc: isEnglish 
        ? 'Identifying favorable periods for investments and major purchases.' 
        : '识别利于投资与大宗消费的时间窗口。',
      impact: isEnglish ? 'Avg. 15% ROI improvement' : '平均 ROI 提升 15%',
      color: 'amber',
    },
    {
      icon: Zap,
      title: isEnglish ? 'Daily Optimization' : '日常优化',
      desc: isEnglish 
        ? 'Aligning daily activities with cosmic energy for peak performance.' 
        : '让日常活动与天时能量同频，发挥最佳状态。',
      impact: isEnglish ? '89% felt more in control' : '89% 感觉更有掌控感',
      color: 'emerald',
    },
  ];

  // 社会证明 - 递进式可信度建设
  const testimonials = [
    {
      quote: isEnglish
        ? "I've tried many fortune apps, but this one actually understands Bazi. The AI consultation feels like talking to a real master."
        : '尝试过很多运势应用，但这个真正懂八字。AI 咨询就像和真正的老师对话。',
      author: isEnglish ? 'Sarah L.' : '林女士',
      role: isEnglish ? 'Product Manager' : '产品经理',
      avatar: '👩‍💼',
      rating: 5,
      verified: true,
    },
    {
      quote: isEnglish
        ? 'The 10-year forecast helped me navigate a career transition. The accuracy of timing predictions was remarkable.'
        : '十年运势帮我度过了职业转型期。时机预测的准确度令人惊叹。',
      author: isEnglish ? 'Michael C.' : '陈先生',
      role: isEnglish ? 'Entrepreneur' : '创业者',
      avatar: '👨‍💼',
      rating: 5,
      verified: true,
    },
    {
      quote: isEnglish
        ? 'I was skeptical at first, but the daily guidance has genuinely improved my decision-making confidence.'
        : '起初持怀疑态度，但每日指导确实提升了我的决策信心。',
      author: isEnglish ? 'Emma W.' : '王女士',
      role: isEnglish ? 'Consultant' : '咨询顾问',
      avatar: '👩‍🎓',
      rating: 5,
      verified: true,
    },
  ];

  // 锚定定价策略
  const pricingAnchor = {
    original: isEnglish ? '$29.99' : '¥198',
    current: isEnglish ? '$9.99' : '¥68',
    period: isEnglish ? '/month' : '/月',
    savings: isEnglish ? 'Save 67%' : '省 67%',
  };

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1 overflow-hidden">
        {/* ==========================================
            HERO SECTION - 首因效应与认知流畅性
            ========================================== */}
        <section className="relative min-h-[90vh] flex items-center">
          {/* 背景层次 - 营造深度感 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* 左侧内容 - 7/12 黄金比例 */}
              <motion.div 
                className="lg:col-span-7"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_CURVE }}
              >
                {/* 社会认同徽章 - 首屏即建立信任 */}
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-8 shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-amber-500 fill-amber-500" />
                    <span className="font-bold">4.9</span>
                  </span>
                  <span className="text-gray-400">|</span>
                  <span>{isEnglish ? '12,847 users trust us' : '12,847 位用户的信赖'}</span>
                </motion.div>

                {/* 主标题 - 三级标题法 */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                  {isEnglish ? (
                    <>
                      Navigate Life's<br />
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Uncertainties
                      </span>
                      <br />with Ancient Wisdom
                    </>
                  ) : (
                    <>
                      以千年命理智慧<br />
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        导航人生
                      </span>
                      <br />每一个重要决策
                    </>
                  )}
                </h1>

                {/* 副标题 - 价值主张具体化 */}
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                  {isEnglish 
                    ? 'Personalized Bazi fortune analysis combining ancient Chinese metaphysics with modern AI. Get clarity on career, relationships, and life decisions.'
                    : '结合中国传统命理学与现代 AI 技术的个性化八字分析。为职业、感情与人生决策提供清晰指引。'
                  }
                </p>

                {/* CTA 区域 - 锚定效应与互惠原则 */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                  <Link to="/app/today">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-xl shadow-indigo-500/25 transition-all duration-300 flex items-center gap-3"
                    >
                      <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                      {isEnglish ? 'Start Free Analysis' : '开始免费分析'}
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  
                  {/* 锚定价格 - 建立价值感 */}
                  <div className="flex items-center gap-3 px-4 py-2">
                    <span className="text-slate-400 line-through text-sm">{pricingAnchor.original}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{pricingAnchor.current}{pricingAnchor.period}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                      {pricingAnchor.savings}
                    </span>
                  </div>
                </div>

                {/* 信任元素 - 安全感构建 */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  {[
                    { icon: Shield, text: isEnglish ? 'Bank-level Security' : '银行级安全' },
                    { icon: Clock, text: isEnglish ? 'Results in 30 seconds' : '30秒出结果' },
                    { icon: CheckCircle2, text: isEnglish ? 'No credit card required' : '无需信用卡' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon size={16} className="text-emerald-500" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* 右侧视觉 - 5/12 视觉平衡 */}
              <motion.div 
                className="lg:col-span-5 relative"
                style={{ y }}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE_CURVE }}
              >
                {/* 主视觉卡片 - 峰终定律的情感高点 */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl transform rotate-3 opacity-20 blur-xl" />
                  <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-900/10 dark:shadow-black/30 p-6 lg:p-8 border border-slate-100 dark:border-slate-700">
                    {/* 卡片头部 - 权威性展示 */}
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                      <div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{isEnglish ? 'Today' : '今日'}</div>
                        <div className="text-lg font-bold text-slate-900 dark:text-white">
                          {new Date().toLocaleDateString(isEnglish ? 'en-US' : 'zh-CN', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        {isEnglish ? 'Active' : '运势更新'}
                      </div>
                    </div>

                    {/* 六维雷达图预览 - 信息可视化 */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="relative w-40 h-40">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          {[0.2, 0.4, 0.6, 0.8, 1].map((r, i) => (
                            <polygon
                              key={i}
                              points="50,10 90,35 90,75 50,100 10,75 10,35"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                              className="text-slate-200 dark:text-slate-700"
                              transform={`scale(${r}) translate(${50 * (1-r)}, ${50 * (1-r)})`}
                            />
                          ))}
                          <polygon
                            points="50,15 75,30 85,60 60,85 30,75 20,40"
                            fill="url(#gradient)"
                            fillOpacity="0.3"
                            stroke="url(#gradient)"
                            strokeWidth="2"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#6366f1" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-slate-900 dark:text-white">78</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{isEnglish ? 'Score' : '综合分'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 维度标签 */}
                    <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
                      {['事业', '财运', '桃花', '健康', '学业', '出行'].map((dim, i) => (
                        <div key={dim} className="text-center py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400">
                          <span className="font-medium text-slate-900 dark:text-white">{[85, 72, 68, 90, 75, 80][i]}</span>
                          <span className="block text-[10px] opacity-70">{dim}</span>
                        </div>
                      ))}
                    </div>

                    {/* 今日主题 */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-100 dark:border-amber-800/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles size={14} className="text-amber-500" />
                        <span className="text-xs font-medium text-amber-700 dark:text-amber-400">{isEnglish ? 'Theme of the Day' : '今日主题'}</span>
                      </div>
                      <div className="font-bold text-slate-900 dark:text-white">{isEnglish ? 'Steady Progress' : '稳扎稳打'}</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {isEnglish ? 'Good for planning, avoid impulsive decisions' : '利于规划，避免冲动决策'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 悬浮数据点 - 社会证明的动态展示 */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3 border border-slate-100 dark:border-slate-700"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <TrendingUpIcon size={16} className="text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{isEnglish ? 'Today' : '今日'}</div>
                      <div className="text-sm font-bold text-emerald-600">+23%</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==========================================
            社会认同区 - 权威性建立
            ========================================== */}
        <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
            >
              {trustStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * STAGGER_DELAY, duration: 0.5 }}
                    className="text-center group"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors mb-4">
                      <Icon size={28} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-4xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                      {stat.delta && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                          {stat.delta}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-900 dark:text-white font-medium mb-1">{stat.label}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{stat.subtext}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ==========================================
            使用场景 - 情境化叙事
            ========================================== */}
        <PageSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {isEnglish ? 'Real Impact, Real Scenarios' : '真实场景，切实影响'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {isEnglish 
                ? 'See how our users apply Bazi insights to transform their daily lives.'
                : '看看我们的用户如何运用八字洞察改变日常生活。'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              const colorClasses = {
                blue: 'from-blue-500/10 to-indigo-500/10 text-blue-600',
                rose: 'from-rose-500/10 to-pink-500/10 text-rose-600',
                amber: 'from-amber-500/10 to-orange-500/10 text-amber-600',
                emerald: 'from-emerald-500/10 to-teal-500/10 text-emerald-600',
              }[uc.color];

              return (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * STAGGER_DELAY, duration: 0.5 }}
                  className="group p-6 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses} mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{uc.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{uc.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <TrendingUpIcon size={16} />
                    {uc.impact}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </PageSection>

        {/* ==========================================
            核心功能 - 信息组块化
            ========================================== */}
        <PageSection variant="alt">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {isEnglish ? 'Four Pillars of Insight' : '四大洞察支柱'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {isEnglish 
                ? 'Comprehensive analysis combining ancient wisdom with modern technology.'
                : '结合古老智慧与现代技术的全方位分析体系。'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * STAGGER_DELAY, duration: 0.5 }}
                className="group relative p-8 rounded-3xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${f.color} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                      <f.icon size={28} />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">{f.stat}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{f.statLabel}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* ==========================================
            社会证明 - 详细评价
            ========================================== */}
        <PageSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              {isEnglish ? 'Trusted by Thousands' : '数千用户的信赖'}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {isEnglish 
                ? 'Join a community of seekers who found clarity through ancient wisdom.'
                : '加入这个通过古老智慧找到人生方向的探索者社区。'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * STAGGER_DELAY, duration: 0.5 }}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                
                <Quote size={24} className="text-indigo-200 dark:text-indigo-800 mb-4" />
                
                <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
                
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white">{item.author}</span>
                      {item.verified && (
                        <span className="text-emerald-500" title={isEnglish ? 'Verified User' : '已验证用户'}>
                          <CheckCircle2 size={14} />
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* ==========================================
            行动召唤 - 峰终定律的终点强化
            ========================================== */}
        <PageSection variant="alt">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* 限时优惠徽章 - 稀缺性 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium mb-8 shadow-lg shadow-amber-500/25">
              <Clock size={16} />
              {isEnglish ? 'Limited Time: 67% OFF First Month' : '限时优惠：首月 3.3 折'}
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {isEnglish 
                ? 'Ready to Discover Your Path?' 
                : '准备好探索您的人生路径了吗？'
              }
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              {isEnglish 
                ? 'Join 12,000+ users who have found clarity and confidence through personalized Bazi analysis.'
                : '加入 12,000+ 用户，通过个性化八字分析找到清晰与自信。'
              }
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/app/today">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group px-10 py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg shadow-xl shadow-indigo-500/25 transition-all duration-300 flex items-center gap-3"
                >
                  <Sparkles size={22} className="group-hover:rotate-12 transition-transform" />
                  {isEnglish ? 'Start Free Trial' : '开始免费试用'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>

            {/* 风险逆转 */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-emerald-500" />
                <span>{isEnglish ? '7-Day Money Back' : '7天无理由退款'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>{isEnglish ? 'Cancel Anytime' : '随时取消'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-emerald-500" />
                <span>{isEnglish ? 'Instant Results' : '即时出结果'}</span>
              </div>
            </div>

            {/* 锚定价格 */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700">
              <span className="text-slate-400 line-through">{pricingAnchor.original}</span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">{pricingAnchor.current}{pricingAnchor.period}</span>
              <span className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                {pricingAnchor.savings}
              </span>
            </div>
          </motion.div>
        </PageSection>

        {/* Donate */}
        <PageSection>
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {isEnglish ? 'Support Our Mission' : '支持我们的使命'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {isEnglish ? 'Help us make ancient wisdom accessible to everyone.' : '帮助我们让古老智慧惠及每一个人。'}
            </p>
            <DonateQR />
          </div>
        </PageSection>
      </main>

      <SiteFooter />
    </div>
  );
}
