'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, Gift } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jade-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-950" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Discover Your{' '}
            <span className="text-gradient-gold">Elemental Nature</span>?
          </h2>
          
          <p className="text-xl text-primary-200/80 mb-10 max-w-2xl mx-auto">
            Start with a free elemental assessment. In just 2 minutes, uncover your Day Master and receive your first personalized insight.
          </p>

          {/* Free Experience Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-gold-500/30"
          >
            <div className="flex items-center justify-center mb-4">
              <Gift className="w-6 h-6 text-gold-400 mr-2" />
              <span className="text-gold-400 font-semibold text-lg">Beta Experience Program</span>
            </div>
            <p className="text-primary-100/90 text-lg leading-relaxed mb-4">
              We&apos;re currently in the experience phase. Share your birth details with us and receive a complimentary complete reading.
            </p>
            <div className="text-primary-200/70 space-y-2">
              <p>Simply send the following information to:</p>
              <a 
                href="mailto:bazirili@foxmail.com" 
                className="inline-flex items-center text-gold-400 hover:text-gold-300 font-semibold text-xl transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                bazirili@foxmail.com
              </a>
            </div>
          </motion.div>

          {/* What to Include */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-10"
          >
            <p className="text-primary-300 mb-4">Include these details in your email:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Birth Date', 'Birth Time', 'Birth Location', 'Gender'].map((item) => (
                <span 
                  key={item}
                  className="px-4 py-2 bg-white/10 rounded-full text-primary-200 border border-white/10"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10 p-6 bg-primary-900/50 rounded-xl border border-primary-800 text-left max-w-2xl mx-auto"
          >
            <p className="text-gold-400 font-medium mb-2">Example message:</p>
            <p className="text-primary-200/80 italic">
              &ldquo;Hi MysticEast team, I&apos;d love to experience a BaZi reading. Here are my details: Born on June 15, 1990, at 8:30 AM in Los Angeles, CA. Female. Looking forward to discovering my elemental nature!&rdquo;
            </p>
          </motion.div>

          {/* Main CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/calculator">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-gold"
              >
                Try the Calculator First
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <p className="mt-8 text-sm text-primary-300/60">
            No credit card required. Your information is kept private and secure.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
