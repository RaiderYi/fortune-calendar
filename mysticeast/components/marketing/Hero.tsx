'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

type HeroVariant = 'a' | 'b';

interface HeroProps {
  variant?: HeroVariant;
}

export function Hero({ variant = 'a' }: HeroProps) {
  const isVariantB = variant === 'b';
  const badge = isVariantB ? 'Five Elements • Living Wisdom' : 'BaZi Philosophy • Modern Clarity';
  const titleLead = isVariantB ? 'Read the Rhythm of Your' : 'Find Harmony in Your';
  const titleTail = isVariantB ? 'with Eastern Insight' : 'Elemental Blueprint';
  const subline = isVariantB
    ? 'When timing and temperament align, decisions become lighter. We translate BaZi principles into practical guidance for modern life.'
    : 'Ancient Chinese metaphysics, interpreted in plain English. Understand your core element and make decisions with steadier balance.';
  const trustPoints = isVariantB
    ? ['Free result in under 2 minutes', 'No signup required to start', 'Practical guidance you can use today']
    : ['Free result in under 2 minutes', 'No signup required to start', 'Private by default, never sold'];
  const primaryCta = isVariantB ? 'Reveal My Element Now' : 'Start Free Assessment';
  const secondaryCta = isVariantB ? 'How It Works' : 'Explore Services';

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden ink-wash-bg">
      {/* Background Elements */}
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-jade-100/10 rounded-full blur-3xl" />
      
      {/* Content */}
      <div className="relative section-shell py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          <div className="text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="seal-chip mb-4"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>{badge}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-950 mb-6 leading-tight"
          >
            {titleLead}{' '}
            <span className="text-gradient-gold">True Nature</span>{' '}
            {titleTail}
          </motion.h1>
          <div className="zen-divider lg:mx-0 mb-6" />

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-charcoal/70 mb-10 max-w-2xl lg:max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            {subline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-10 grid grid-cols-1 gap-3 text-left sm:grid-cols-3"
          >
            {trustPoints.map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-primary-100/80 bg-white/72 px-3 py-2 text-sm text-charcoal/75">
                <CheckCircle2 className="h-4 w-4 text-jade-600" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Link href="/calculator">
              <Button
                size="lg"
                className="w-full sm:w-auto text-lg px-8 py-4"
                onClick={() => trackEvent('landing_cta_clicked', { source: 'hero' })}
              >
                {primaryCta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href={isVariantB ? '/#how-it-works' : '/services'}>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                {secondaryCta}
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-primary-100"
          >
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-charcoal/60">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 border-2 border-cream"
                    />
                  ))}
                </div>
                <span>10,000+ assessments completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gold-500">★★★★★</span>
                <span>4.9/5 average rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-jade-600" />
                <span>{isVariantB ? 'Clarity-first decisions' : 'Privacy-first experience'}</span>
              </div>
            </div>
          </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-xl mx-auto w-full"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold-300/30 via-transparent to-jade-300/25 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-gold-200/60 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
              <Image
                src="/images/hero-bazi-chart.svg"
                alt="MysticEast elemental chart preview"
                width={1200}
                height={900}
                className="h-auto w-full rounded-[1.5rem]"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-300 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
