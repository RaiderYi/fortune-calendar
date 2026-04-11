'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ActionableSuggestions } from '@/components/calculator/ActionableSuggestions';
import { ElementReveal } from '@/components/calculator/ElementReveal';
import { InsightCard } from '@/components/calculator/InsightCard';
import { NextStepButtons } from '@/components/calculator/NextStepButtons';
import { ShareModule } from '@/components/calculator/ShareModule';
import { trackEvent } from '@/lib/analytics';
import { type CalculationResult, type EmailCaptureData } from '@/types';
import { cn } from '@/lib/utils';

interface BirthData {
  date: string;
  time: string;
  timezone: string;
  location?: string;
}

const mockResult: CalculationResult = {
  dayMaster: {
    element: 'Metal',
    stem: 'Geng',
    yinYang: 'Yang',
    animal: 'Horse',
  },
  chart: {
    year: { stem: 'Jia', branch: 'Horse', element: 'Wood' },
    month: { stem: 'Bing', branch: 'Tiger', element: 'Fire' },
    day: { stem: 'Geng', branch: 'Horse', element: 'Metal' },
    hour: { stem: 'Wu', branch: 'Dog', element: 'Earth' },
  },
  elements: {
    wood: 25,
    fire: 20,
    earth: 15,
    metal: 30,
    water: 10,
  },
  insight: {
    title: 'Your Natural Authority',
    description:
      'As a Yang Metal Day Master, you bring clarity, standards, and courage into uncertain situations. Your strongest results come when you pair discipline with softness—staying decisive without becoming overly rigid.',
    category: 'general',
  },
};

const actionableSuggestions = [
  'Choose one decision you have been postponing and write down the clearest next step before the day ends.',
  'Create a little more flexibility in your schedule this week so your strong standards do not turn into unnecessary pressure.',
  'Have one honest conversation where you lead with calm clarity instead of trying to control the entire outcome.',
];

export default function ResultPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('birthData');
      const storedResult = sessionStorage.getItem('calculationResult');
      if (!stored || !storedResult) {
        router.push('/calculator');
        return;
      }

      const parsedBirthData = JSON.parse(stored) as BirthData;
      const parsedResult = JSON.parse(storedResult) as CalculationResult;
      setBirthData(parsedBirthData);
      setCalculationResult(parsedResult);
      trackEvent('result_viewed', {
        has_location: Boolean(parsedBirthData.location),
        timezone: parsedBirthData.timezone,
      });
    } catch {
      router.push('/calculator');
    }
  }, [router]);

  const result = calculationResult ?? mockResult;

  const shareSummary = useMemo(
    () =>
      `My MysticEast result: ${result.insight.title}. ${result.insight.description}`,
    [result.insight.description, result.insight.title]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!consent) {
      setError('Please agree to receive weekly free insights');
      return;
    }

    setIsSubmitting(true);

    try {
      const data: EmailCaptureData = {
        email,
        dayMaster: result.dayMaster.element,
        element: result.dayMaster.element,
        consent,
        source: 'result-weekly-insights',
      };

      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        sessionStorage.setItem('userEmail', email);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSubscribe = () => {
    const section = document.getElementById('subscribe-section');
    if (!section) return;
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!birthData || !calculationResult) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal/60">Loading your chart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-cream to-primary-50/30 py-12 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-jade-100/50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-jade-600" />
            <span className="text-sm font-medium text-jade-800">Your Elemental Blueprint</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-primary-950">
            Your first reading is ready
          </h1>
          <p className="mt-4 text-lg text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
            Here is your core pattern, three practical ways to work with it this week, and a next step if you want ongoing guidance.
          </p>
        </motion.div>

        <ElementReveal dayMaster={result.dayMaster} elements={result.elements} />

        <div className="mt-8">
          <InsightCard insight={result.insight} />
        </div>

        <ActionableSuggestions suggestions={actionableSuggestions} />

        <NextStepButtons onSubscribeClick={scrollToSubscribe} />

        <ShareModule summary={shareSummary} />

        <motion.div
          id="subscribe-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.5 }}
          className="mt-12 crystal-card p-8 border border-gold-200/60 bg-gradient-to-br from-white/80 to-gold-50/80"
        >
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-gold-600" />
                </div>
                <h2 className="font-serif text-2xl font-bold text-primary-950 mb-2">
                  Get weekly free insights
                </h2>
                <p className="text-charcoal/70 leading-relaxed max-w-xl mx-auto">
                  Subscribe for one practical BaZi insight each week, plus new articles and free guidance tailored to your elemental path.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        'form-input pl-12 pr-4 py-4',
                        error
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                          : 'border-primary-200'
                      )}
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                </div>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-charcoal/30 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-charcoal/70">
                    I agree to receive my free weekly insights and occasional updates from MysticEast. I can unsubscribe at any time.
                  </span>
                </label>

                <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      Subscribe Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-jade-500 flex items-center justify-center">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary-950 mb-2">
                Check your inbox
              </h2>
              <p className="text-charcoal/70 max-w-xl mx-auto leading-relaxed">
                We&apos;ve sent a confirmation to <strong>{email}</strong>. Once you confirm, you&apos;ll start receiving weekly free insights and new MysticEast articles.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
