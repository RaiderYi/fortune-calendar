import { Metadata } from 'next';
import { BirthForm } from '@/components/calculator/BirthForm';
import { Sparkles, Shield, Clock, BadgeCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free BaZi Calculator - Discover Your Elemental Nature | MysticEast',
  description: 'Calculate your free BaZi birth chart. Discover your Day Master element and receive personalized insights about your natural strengths and tendencies.',
};

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-primary-50/30 py-12 md:py-20">
      <div className="section-shell">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Content */}
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-100/50 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-800">
                Free Assessment
              </span>
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-950 mb-6 leading-tight">
              Calculate Your{' '}
              <span className="text-gradient-gold">Elemental Blueprint</span>
            </h1>
            
            <p className="text-lg md:text-xl text-charcoal/70 mb-8 leading-relaxed">
              Enter your birth details to discover your Day Master element—the core energy that shapes your personality, strengths, and life path according to ancient Chinese metaphysics.
            </p>

            <div className="mb-8 rounded-2xl border border-primary-100/80 bg-white/70 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700/80 mb-3">
                What you get instantly
              </p>
              <ul className="space-y-2 text-sm text-charcoal/75">
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-jade-600 mt-0.5" />
                  <span>Your Day Master element and personality pattern.</span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-jade-600 mt-0.5" />
                  <span>Five-element balance overview you can apply this week.</span>
                </li>
                <li className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-jade-600 mt-0.5" />
                  <span>Practical next steps without technical jargon.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-jade-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-jade-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-950">Takes 2 Minutes</h3>
                  <p className="text-charcoal/70 text-sm">Quick form, instant elemental insight</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-950">Personalized Result</h3>
                  <p className="text-charcoal/70 text-sm">Your unique Day Master and first insight</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-950">100% Private</h3>
                  <p className="text-charcoal/70 text-sm">Your data is never shared or sold</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <BirthForm />
          </div>
        </div>
      </div>
    </div>
  );
}
