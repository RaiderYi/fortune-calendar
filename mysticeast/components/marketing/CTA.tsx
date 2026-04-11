'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Mail, Gift, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

type CTAVariant = 'a' | 'b';

interface CTAProps {
  variant?: CTAVariant;
}

export function CTA({ variant = 'a' }: CTAProps) {
  const isVariantB = variant === 'b';
  const title = isVariantB ? 'Turn Insight Into Action' : 'Ready to Discover Your';
  const accent = isVariantB ? 'This Week' : 'Elemental Nature';
  const description = isVariantB
    ? 'Start with a free elemental reading, then choose one practical change you can apply today.'
    : 'Start with a free elemental assessment. In under two minutes, uncover your Day Master and get your first practical insight.';
  const bannerTitle = isVariantB ? 'Early Access Circle' : 'Founding Reader Access';
  const bannerCopy = isVariantB
    ? 'Join our early-access circle to receive one complimentary full reading while we fine-tune our premium advisory experience.'
    : 'We\'re inviting early readers to receive one complimentary full reading while we refine our premium advisory experience.';
  const finalNote = isVariantB
    ? 'Try the free assessment first. Keep what helps, ignore what does not.'
    : 'No credit card required. Free assessment first, then decide if deeper guidance is right for you.';

  return (
    <section
      className={`py-24 relative overflow-hidden ${
        isVariantB
          ? 'bg-gradient-to-br from-jade-50 via-white to-gold-50 text-primary-950'
          : 'bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white'
      }`}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${isVariantB ? 'bg-gold-200/40' : 'bg-gold-500/10'}`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${isVariantB ? 'bg-jade-200/45' : 'bg-jade-500/10'}`} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div
            className={`w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br flex items-center justify-center ${
              isVariantB ? 'from-jade-400 to-jade-600' : 'from-gold-400 to-gold-600'
            }`}
          >
            <Sparkles className="w-10 h-10 text-primary-950" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            {isVariantB ? 'Let Ancient Pattern Guide Modern Choices' : title}{' '}
            <span className="text-gradient-gold">{isVariantB ? 'With Calm Precision' : accent}</span>?
          </h2>
          
          <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isVariantB ? 'text-charcoal/75' : 'text-primary-200/85'}`}>
            {description}
          </p>

          {/* Free Experience Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mb-10 p-6 backdrop-blur-sm rounded-2xl border ${
              isVariantB ? 'bg-white/80 border-jade-200/90' : 'bg-white/10 border-gold-500/30'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              <Gift className={`w-6 h-6 mr-2 ${isVariantB ? 'text-jade-600' : 'text-gold-400'}`} />
              <span className={`font-semibold text-lg ${isVariantB ? 'text-jade-700' : 'text-gold-400'}`}>{bannerTitle}</span>
            </div>
            <p className={`text-lg leading-relaxed mb-4 ${isVariantB ? 'text-charcoal/80' : 'text-primary-100/90'}`}>
              {bannerCopy}
            </p>
            <div className={`space-y-2 ${isVariantB ? 'text-charcoal/65' : 'text-primary-200/70'}`}>
              <p>Simply send the following information to:</p>
              <a 
                href="mailto:bazirili@foxmail.com" 
                className={`inline-flex items-center font-semibold text-xl transition-colors ${
                  isVariantB ? 'text-jade-700 hover:text-jade-800' : 'text-gold-400 hover:text-gold-300'
                }`}
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
            <p className={`mb-4 ${isVariantB ? 'text-charcoal/70' : 'text-primary-300'}`}>Include these details in your letter:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Birth Date', 'Birth Time', 'Birth Location', 'Gender'].map((item) => (
                <span 
                  key={item}
                  className={`px-4 py-2 rounded-full border ${
                    isVariantB ? 'bg-white text-charcoal/80 border-primary-100' : 'bg-white/10 text-primary-200 border-white/10'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
            <div className={`mt-4 flex items-center justify-center gap-2 text-sm ${isVariantB ? 'text-charcoal/70' : 'text-primary-200/85'}`}>
              <ShieldCheck className={`h-4 w-4 ${isVariantB ? 'text-jade-600' : 'text-jade-400'}`} />
              <span>Your information is used only for your reading and never shared.</span>
            </div>
          </motion.div>

          {/* Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`mb-10 p-6 rounded-xl border text-left max-w-2xl mx-auto ${
              isVariantB ? 'bg-white/85 border-primary-100' : 'bg-primary-900/50 border-primary-800'
            }`}
          >
            <p className={`font-medium mb-2 ${isVariantB ? 'text-jade-700' : 'text-gold-400'}`}>Example message:</p>
            <p className={`italic ${isVariantB ? 'text-charcoal/75' : 'text-primary-200/80'}`}>
              &ldquo;Hi MysticEast team, I&apos;d love to experience a BaZi reading. Here are my details: Born on June 15, 1990, at 8:30 AM in Los Angeles, CA. Female. Looking forward to discovering my elemental nature!&rdquo;
            </p>
          </motion.div>

          {/* Main CTA Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/calculator">
              <Button
                variant={isVariantB ? 'primary' : 'gold'}
                size="lg"
                className="w-full sm:w-auto text-lg px-10 py-5"
                onClick={() => trackEvent('landing_cta_clicked', { source: 'cta_section' })}
              >
                {isVariantB ? 'Begin With My Free Reading' : 'Try the Calculator First'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <p className={`mt-8 text-sm ${isVariantB ? 'text-charcoal/60' : 'text-primary-300/60'}`}>
            {finalNote}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
