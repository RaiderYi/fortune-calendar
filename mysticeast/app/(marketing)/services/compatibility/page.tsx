import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Compatibility Reading - Relationship Dynamics Through BaZi | MysticEast',
  description:
    'Explore how two charts interact through a MysticEast compatibility reading focused on strengths, communication patterns, and relationship rhythm.',
};

const includes = [
  'Two-chart overview with elemental compatibility insights',
  'Natural strengths and recurring points of friction between both people',
  'Communication style patterns and how to reduce unnecessary conflict',
  'Guidance for pacing, timing, and emotional rhythm in the relationship',
  'Support for romantic, family, or business partnerships',
  'Practical suggestions for more harmony and understanding',
];

export default function CompatibilityPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Heart className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium text-gold-400">Compatibility Reading</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Understand the rhythm between two people more clearly
              </h1>
              <p className="text-xl text-primary-200/80 mb-8 max-w-2xl leading-relaxed">
                A compatibility reading helps you see where two energetic styles naturally support one another, where tension tends to arise, and how to build more ease into the connection.
              </p>
              <Link href="/calculator">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-primary-950">
                  Begin With a Free Reading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-gold-500/25 to-jade-500/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
                <Image
                  src="/images/compatibility-elements.svg"
                  alt="MysticEast compatibility reading visual"
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
              What a compatibility reading can reveal
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              This is not about assigning blame or predicting a fixed outcome. It is about understanding how two people can meet each other more skillfully.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {includes.map((item) => (
              <div key={item} className="crystal-card p-6 flex items-start space-x-4">
                <div className="h-11 w-11 rounded-full bg-jade-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-jade-700" />
                </div>
                <p className="text-charcoal/75 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-100 rounded-full mb-5">
            <Sparkles className="w-4 h-4 text-gold-700" />
            <span className="text-sm font-medium text-gold-700">Ideal for couples, family, and partnerships</span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            Better understanding creates better conversations
          </h2>
          <p className="text-lg text-charcoal/70 leading-relaxed mb-8 max-w-2xl mx-auto">
            If you want to explore how two charts interact, begin with your own free result first. It will give you the clearest foundation before going deeper into a two-person reading.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/calculator">
              <Button size="lg">
                Try Free Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="mailto:bazirili@foxmail.com" className="text-primary-800 font-medium hover:text-primary-950 transition-colors">
              Ask about a compatibility reading by email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
