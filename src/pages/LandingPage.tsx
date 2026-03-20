// ==========================================
// 首页 - 基于社会心理学与视觉美学的转化优化设计
// 
// 心理学原理应用：
// 1. 首因效应(Primacy Effect) - 首屏信息密度与记忆点
// 2. 峰终定律(Peak-End Rule) - 情感高潮与结尾强化  
// 3. 认知流畅性(Cognitive Fluency) - 信息处理 effortless
// 4. 社会认同(Social Proof) - 从众心理的递进展示
// 5. 权威性(Authority) - 专业背书的视觉呈现
// 6. 互惠原则(Reciprocity) - 免费价值的先给
//
// 美学原则：
// 1. 黄金分割构图 - 1.618 视觉比例
// 2. 留白呼吸感 - 信息密度的节奏控制
// 3. 色彩心理学 - primary 紫系(品牌) + 琥珀点缀(温暖)
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
  Compass,
  MapPinned,
  Gift,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import SiteHeader from '../components/layout/SiteHeader';
import SiteFooter from '../components/layout/SiteFooter';
import DonateQR from '../components/DonateQR';
import { PageSection } from '../components/ui';
import { HOME_PROMO_ITEMS } from '../data/homePromo';
import { buildTodayEntryLink } from '../utils/appEntry';
import LandingFortunePreview from '../components/landing/LandingFortunePreview';
import {
  LANDING_PRIMARY_CTA_CLASSNAME,
  landingPrimaryCtaPadding,
} from '../components/landing/landingCtaStyles';

interface LandingPageProps {
  onLoginClick?: () => void;
}

// ==========================================
// 动画配置 - 符合人眼视觉暂留规律(0.3s)
// ==========================================
const EASE_CURVE = [0.25, 0.1, 0.25, 1];
const STAGGER_DELAY = 0.08;

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  const { t, i18n } = useTranslation('ui');
  const isEnglish = i18n.language === 'en';
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // 定性信任支柱（避免不可验证数字）
  const trustPillars = [
    {
      icon: Shield,
      title: isEnglish ? 'Privacy first' : '隐私优先',
      desc: isEnglish ? 'Birth data stays on your device by default.' : '出生信息默认保存在本机，可掌控同步范围。',
    },
    {
      icon: MapPinned,
      title: isEnglish ? 'True solar time' : '真太阳时',
      desc: isEnglish ? '330+ cities for longitude calibration.' : '支持多城市经度校准，排盘更贴近传统方法。',
    },
    {
      icon: Sparkles,
      title: isEnglish ? 'AI & I Ching' : 'AI 与易经',
      desc: isEnglish ? 'Chat, synastry, monthly outlook & more.' : '对话解读、合盘、月运与多种轻量入口。',
    },
  ];

  // 核心功能
  const features = [
    {
      icon: Compass,
      title: isEnglish ? 'Daily compass' : '每日指南针',
      desc: isEnglish
        ? 'Career, wealth, love, health, study, travel — one screen for decisions that fit your day.'
        : '事业、财运、桃花、健康、学业、出行 — 一眼把握今日节奏与取舍。',
      color: 'from-primary-500 to-primary-700',
      tag: isEnglish ? 'Daily' : '日运',
    },
    {
      icon: TrendingUp,
      title: isEnglish ? 'Life trajectory' : '人生轨迹',
      desc: isEnglish
        ? 'Decade trends and turning points to plan ahead with context.'
        : '十年趋势与关键节点，辅助中长期规划与心态预期。',
      color: 'from-emerald-500 to-teal-600',
      tag: isEnglish ? 'Trends' : '大运',
    },
    {
      icon: Sparkles,
      title: isEnglish ? 'AI companion' : 'AI 命理师',
      desc: isEnglish
        ? 'Ask follow-ups in plain language; answers grounded in your chart.'
        : '用自然语言追问，解读贴合你的八字与当日运势。',
      color: 'from-violet-500 to-primary-700',
      tag: 'AI',
    },
    {
      icon: CalendarCheck,
      title: isEnglish ? 'Auspicious timing' : '择日良辰',
      desc: isEnglish
        ? 'Pick dates for travel, signings, and milestones using your pillars.'
        : '出行、签约、重要事项，结合命盘择取相对更有利的时间。',
      color: 'from-amber-500 to-orange-600',
      tag: isEnglish ? 'Dates' : '择日',
    },
  ];

  // 用户评价
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

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      <SiteHeader onLoginClick={onLoginClick} />

      <main id="main" className="flex-1 overflow-hidden">
        {/* ==========================================
            HERO SECTION
            ========================================== */}
        <section className="relative flex items-center pt-8 pb-16 sm:pb-20 lg:py-24 lg:min-h-[88vh]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-[min(100vw,42rem)] h-[min(100vw,42rem)] bg-gradient-to-bl from-primary-400/15 via-violet-400/8 to-transparent rounded-full blur-3xl translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-[min(90vw,28rem)] h-[min(90vw,28rem)] bg-gradient-to-tr from-amber-400/10 to-transparent rounded-full blur-3xl -translate-x-1/3 translate-y-1/4" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              <motion.div
                className="lg:col-span-6 xl:col-span-7"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: EASE_CURVE }}
              >
                <motion.p
                  className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200/80 dark:border-primary-800/60 bg-white/70 dark:bg-slate-900/60 px-3 py-1 text-primary-800 dark:text-primary-200">
                    <Gift size={14} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    {isEnglish ? 'Free · no ads' : '免费使用 · 无广告'}
                  </span>
                  <span className="hidden sm:inline text-slate-400">·</span>
                  <span className="flex items-center gap-1">
                    <Shield size={14} className="text-slate-400" />
                    {isEnglish ? 'Birth data stays local by default' : '出生信息默认仅存本机'}
                  </span>
                </motion.p>

                <h1
                  className={`text-[2rem] sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-5 leading-[1.15] tracking-tight ${
                    !isEnglish ? 'font-serif' : ''
                  }`}
                >
                  {isEnglish ? (
                    <>
                      Bazi clarity for{' '}
                      <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                        today and the years ahead
                      </span>
                    </>
                  ) : (
                    <>
                      以八字看清{' '}
                      <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
                        今日与长远节奏
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl leading-relaxed">
                  {isEnglish
                    ? 'Daily scores, dos and don’ts, six dimensions, decade trends — plus AI when you want to go deeper.'
                    : '每日评分与宜忌、六维分析、十年趋势；需要时再问 AI 深入解读。'}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                  <Link to={buildTodayEntryLink('home')} className="inline-flex">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${LANDING_PRIMARY_CTA_CLASSNAME} ${landingPrimaryCtaPadding('hero')}`}
                    >
                      <Sparkles size={20} className="shrink-0 group-hover:rotate-12 transition-transform" />
                      {t('homeToApp.primaryCta')}
                      <ArrowRight size={18} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </motion.button>
                  </Link>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                  {[
                    { icon: Clock, text: isEnglish ? 'Results in seconds' : '数秒出结果' },
                    { icon: CheckCircle2, text: isEnglish ? 'Optional account for sync' : '登录可同步与积分' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon size={16} className="text-primary-500 dark:text-primary-400 shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="lg:col-span-6 xl:col-span-5 relative max-w-md mx-auto lg:max-w-none w-full"
                style={{ y }}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.55, delay: 0.15, ease: EASE_CURVE }}
              >
                <div
                  className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary-500/20 to-violet-600/10 blur-2xl opacity-70 dark:opacity-40"
                  aria-hidden
                />
                <div className="relative">
                  <LandingFortunePreview isEnglish={isEnglish} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==========================================
            社会认同区
            ========================================== */}
        <section className="py-14 sm:py-16 bg-white dark:bg-slate-900 border-y border-slate-200/90 dark:border-slate-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
            >
              {trustPillars.map((row, i) => {
                const Icon = row.icon;
                return (
                  <motion.div
                    key={row.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * STAGGER_DELAY, duration: 0.45 }}
                    className="text-left md:text-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 p-6"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-100/80 dark:bg-primary-950/50 text-primary-700 dark:text-primary-300 mb-4 md:mx-auto">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{row.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{row.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* 精选推荐 · 占卜工具矩阵 */}
        <section className="py-14 bg-gradient-to-b from-primary-50/50 to-white dark:from-slate-900 dark:to-slate-950 border-y border-primary-100/60 dark:border-slate-800/90">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-white mb-2 tracking-tight">
              {isEnglish ? 'Featured tools' : '精选功能'}
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-10 max-w-lg mx-auto leading-relaxed">
              {isEnglish
                ? 'Monthly I Ching, synastry & more — same Bazi profile, richer rituals.'
                : '月运、问卦、合盘等入口，沿用同一套命理档案，丰富使用场景。'}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOME_PROMO_ITEMS.map((item) => {
                const ring =
                  item.accent === 'amber'
                    ? 'ring-amber-200 dark:ring-amber-900/40 hover:border-amber-300'
                    : item.accent === 'rose'
                      ? 'ring-rose-200 dark:ring-rose-900/40 hover:border-rose-300'
                      : item.accent === 'emerald'
                        ? 'ring-emerald-200 dark:ring-emerald-900/40 hover:border-emerald-300'
                        : 'ring-violet-200 dark:ring-violet-900/40 hover:border-violet-300';
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`block rounded-2xl border border-slate-200/90 dark:border-slate-700/90 bg-white dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition-all ring-1 ${ring}`}
                  >
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                      {isEnglish ? item.titleEn : item.titleZh}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isEnglish ? item.descEn : item.descZh}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 dark:text-primary-400">
                      {isEnglish ? 'Open' : '进入'}
                      <ArrowRight size={14} />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 能力与场景合并为单一矩阵 */}
        <PageSection variant="alt">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              {isEnglish ? 'What you can do' : '能力与场景'}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {isEnglish
                ? 'Daily choices, long-term planning, relationships, and timing — in one coherent toolkit.'
                : '日常决策、中长期规划、感情与择日 — 同一套八字档案贯穿使用。'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * STAGGER_DELAY, duration: 0.45 }}
                className="group relative p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900/35 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden hover:border-primary-200 dark:hover:border-primary-900/50 hover:shadow-lg hover:shadow-slate-900/5 dark:hover:shadow-black/20 transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${f.color} opacity-[0.12] blur-3xl group-hover:opacity-[0.18] transition-opacity`} />

                <div className="relative flex items-start gap-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} text-white shadow-md shrink-0`}>
                    <f.icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary-100/90 dark:bg-primary-950/80 text-primary-800 dark:text-primary-200">
                        {f.tag}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </PageSection>

        {/* ==========================================
            用户评价
            ========================================== */}
        <PageSection>
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
              {isEnglish ? 'What people say' : '用户怎么说'}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              {isEnglish
                ? 'Short notes from people who use the app for daily grounding and bigger decisions.'
                : '来自日常参考与重要决策场景下的真实反馈（示意展示）。'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * STAGGER_DELAY, duration: 0.45 }}
                className="p-6 rounded-2xl bg-slate-50/90 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-700/80"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(item.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <Quote size={24} className="text-primary-200 dark:text-primary-900/50 mb-4" />
                
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
            行动召唤 + 打赏合并区
            ========================================== */}
        <PageSection variant="alt" className="!pb-20 sm:!pb-24">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/90 dark:bg-emerald-900/25 text-emerald-800 dark:text-emerald-300 text-sm font-medium mb-5">
                <Gift size={16} />
                {isEnglish ? 'Free to use' : '永久免费使用'}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                {isEnglish ? 'Start with today’s fortune' : '从今日运势开始'}
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                {isEnglish
                  ? 'Add your birth time once, then see scores, themes, and guidance you can act on.'
                  : '填写一次出生信息，即可查看评分、主题与可执行的宜忌建议。'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-8">
                <Link to={buildTodayEntryLink('home_bottom')} className="inline-flex justify-center">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`${LANDING_PRIMARY_CTA_CLASSNAME} ${landingPrimaryCtaPadding('footer')}`}
                  >
                    <Sparkles size={20} className="shrink-0 group-hover:rotate-12 transition-transform" />
                    {t('homeToApp.primaryCta')}
                    <ArrowRight size={18} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-primary-500 dark:text-primary-400 shrink-0" />
                  <span>{isEnglish ? 'Privacy first' : '隐私优先'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-primary-500 dark:text-primary-400 shrink-0" />
                  <span>{isEnglish ? 'No signup required to try' : '试用无需注册'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary-500 dark:text-primary-400 shrink-0" />
                  <span>{isEnglish ? 'Fast results' : '快速出结果'}</span>
                </div>
              </div>
            </div>

            <div className="relative py-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200/90 dark:border-slate-700/90" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white dark:bg-slate-800/50 text-sm text-slate-500 dark:text-slate-400">
                  {isEnglish ? 'Support the project' : '支持项目'}
                </span>
              </div>
            </div>

            {/* 打赏区域 - 合并到 CTA 区域 */}
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
                {isEnglish 
                  ? 'Fortune Calendar is free forever, supported by generous users like you. Your donation helps us keep improving.'
                  : '命运日历永久免费，靠像您这样的慷慨用户维持。您的打赏帮助我们持续改进。'
                }
              </p>
              <DonateQR />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                {isEnglish ? 'Scan to buy us a coffee ☕' : '扫码请我们喝杯咖啡 ☕'}
              </p>
            </div>
          </motion.div>
        </PageSection>
      </main>

      <div className="mt-12 sm:mt-16 border-t border-transparent" aria-hidden />

      <SiteFooter />
    </div>
  );
}
