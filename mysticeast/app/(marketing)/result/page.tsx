'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Loader2, Sparkles, FileText, Clock, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ElementReveal } from '@/components/calculator/ElementReveal';
import { InsightCard } from '@/components/calculator/InsightCard';
import { type CalculationResult, type EmailCaptureData } from '@/types';
import { cn } from '@/lib/utils';

// Mock calculation result - in production this would come from API
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
    description: 'As a Yang Metal Day Master, you possess natural leadership qualities and a strong sense of justice. You cut through confusion with clarity and precision. Your challenge is to balance your strong will with flexibility—learning when to stand firm and when to bend.',
    category: 'general',
  },
};

export default function ResultPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [birthData, setBirthData] = useState<any>(null);

  useEffect(() => {
    // Get birth data from sessionStorage
    const stored = sessionStorage.getItem('birthData');
    if (!stored) {
      router.push('/calculator');
      return;
    }
    setBirthData(JSON.parse(stored));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!consent) {
      setError('Please agree to receive your reading and updates');
      return;
    }

    setIsSubmitting(true);

    try {
      const data: EmailCaptureData = {
        email,
        dayMaster: mockResult.dayMaster.element,
        element: mockResult.dayMaster.element,
        consent,
        source: 'mini-result',
      };

      // Call API to save email
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        // Store email for future use
        sessionStorage.setItem('userEmail', email);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!birthData) {
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-jade-100/50 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-jade-600" />
            <span className="text-sm font-medium text-jade-800">
              Your Elemental Blueprint
            </span>
          </div>
        </motion.div>

        {/* Element Reveal */}
        <ElementReveal 
          dayMaster={mockResult.dayMaster} 
          elements={mockResult.elements} 
        />

        {/* Insight Card */}
        <div className="mt-8">
          <InsightCard insight={mockResult.insight} />
        </div>

        {/* Email Capture Section */}
        {!isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mt-12 crystal-card p-8 border-2 border-gold-200/50"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                <Mail className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-950 mb-2">
                Unlock Your Complete Reading
              </h3>
              <p className="text-charcoal/70">
                Enter your email to receive your full 30-page Destiny Map with detailed insights about career, relationships, and optimal timing.
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
                      'w-full pl-12 pr-4 py-4 rounded-xl border bg-white/50 focus:bg-white transition-all duration-200 outline-none',
                      error 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-primary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                    )}
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-500">{error}</p>
                )}
              </div>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-charcoal/30 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-charcoal/70">
                  I agree to receive my personalized reading and occasional updates about BaZi insights and services. 
                  You can unsubscribe at any time.
                </span>
              </label>

              <Button
                type="submit"
                size="lg"
                isLoading={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send My Complete Reading
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-charcoal/50">
              <div className="flex items-center space-x-1">
                <Lock className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>30+ Pages</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Instant Delivery</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 crystal-card p-8 bg-gradient-to-br from-jade-50 to-jade-100/50 border-2 border-jade-200"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-jade-500 flex items-center justify-center">
                <Mail className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-primary-950 mb-2">
                Check Your Inbox!
              </h3>
              <p className="text-charcoal/70 mb-6">
                We&apos;ve sent your complete Destiny Map to <strong>{email}</strong>. 
                Please check your email (and spam folder) to access your 30+ page personalized reading.
              </p>
              <Link href="/services/destiny-map">
                <Button variant="outline" className="w-full sm:w-auto">
                  Learn More About Destiny Map
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: FileText, title: '30+ Page Report', desc: 'Comprehensive analysis of your chart' },
            { icon: Clock, title: '10-Year Forecast', desc: 'Know your luck cycles ahead' },
            { icon: Palette, title: 'Feng Shui Guide', desc: 'Optimize your space by element' },
          ].map((item) => (
            <div key={item.title} className="text-center p-4">
              <item.icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
              <h4 className="font-semibold text-primary-950 mb-1">{item.title}</h4>
              <p className="text-sm text-charcoal/60">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
