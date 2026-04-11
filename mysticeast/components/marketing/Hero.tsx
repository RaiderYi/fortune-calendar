'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-cream to-primary-50/30" />
      
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
            className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100/50 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span className="text-sm font-medium text-primary-800">
              Ancient Wisdom • Modern Science
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-950 mb-6 leading-tight"
          >
            Discover Your{' '}
            <span className="text-gradient-gold">True Nature</span>{' '}
            Through Ancient Wisdom
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl sm:text-2xl text-charcoal/70 mb-10 max-w-2xl lg:max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Personalized BaZi readings reveal your elemental blueprint, natural strengths,
            and optimal timing for life's important decisions.
          </motion.p>

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
                Start Free Assessment
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4">
                Explore Services
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
            </div>
          </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative max-w-xl mx-auto w-full"
          >
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold-300/25 via-transparent to-jade-300/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-4 shadow-soft backdrop-blur-sm">
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
