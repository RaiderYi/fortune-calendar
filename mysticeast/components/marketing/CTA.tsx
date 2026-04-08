'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
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

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/calculator">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-white shadow-gold"
              >
                Calculate Your Chart (Free)
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-10 py-5 border-2 border-white/30 text-white hover:bg-white/10"
              >
                View All Services
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
