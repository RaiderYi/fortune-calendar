import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Annual Forecast - Year-Ahead BaZi Timing Guidance | MysticEast',
  description:
    'Understand the rhythms of the year ahead with a focused BaZi annual forecast covering timing, opportunities, relationships, and wellbeing.',
};

const includes = [
  'A focused overview of your annual energetic pattern',
  'Month-by-month guidance for major transitions and momentum shifts',
  'Career opportunity windows and slower periods to navigate carefully',
  'Relationship themes, communication timing, and emotional climate',
  'Wellness and restoration focus areas for the current cycle',
  'Practical balancing suggestions aligned with your chart',
];

export default function AnnualForecastPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Calendar className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium text-gold-400">Annual Forecast</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Navigate the year with better timing and steadier decisions
              </h1>
              <p className="text-xl text-primary-200/80 mb-8 max-w-2xl leading-relaxed">
                This reading turns your annual energy cycle into practical guidance so you can recognize when to push forward, when to pause, and where your attention matters most.
              </p>
              <Link href="/calculator">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-primary-950">
                  Start With the Free Calculator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold-500/25 to-jade-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <Image
                  src="/images/annual-forecast-calendar.svg"
                  alt="MysticEast annual forecast visual"
                  width={1200}
                  height={900}
                  className="h-auto w-full rounded-[1.5rem]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
              What this forecast helps you see
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              Instead of reacting to the year as it unfolds, you get a clearer sense of when momentum is building, where stress tends to rise, and how to work more intentionally with your natural cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {includes.map((item) => (
              <div key={item} className="crystal-card p-6 flex items-start space-x-4">
                <div className="h-11 w-11 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-gold-700" />
                </div>
                <p className="text-charcoal/75 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-jade-100 rounded-full mb-5">
            <Sparkles className="w-4 h-4 text-jade-700" />
            <span className="text-sm font-medium text-jade-700">Best for intentional planning</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            A calmer way to prepare for the year ahead
          </h2>
          <p className="text-lg text-charcoal/70 leading-relaxed mb-8 max-w-2xl mx-auto">
            If you want clarity on major decisions, seasonal rhythm, or where to direct your effort next, begin with the free calculator and we&apos;ll guide you toward the most relevant reading.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculator">
              <Button size="lg">
                Try Free Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="mailto:bazirili@foxmail.com" className="text-primary-800 font-medium hover:text-primary-950 transition-colors">
              Or email us directly for forecast details
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
