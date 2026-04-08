import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Clock, FileText, Shield, Check, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Complete Destiny Map - 30+ Page BaZi Reading | MysticEast',
  description: 'Our signature comprehensive BaZi reading. 30+ pages of personalized insights about your elemental nature, life cycles, career, relationships, and optimal timing.',
};

const features = [
  { title: 'Complete Birth Chart Analysis', desc: 'Your unique 8-character blueprint decoded' },
  { title: 'Day Master Interpretation', desc: 'Understanding your core elemental nature' },
  { title: '10-Year Luck Cycle Forecast', desc: 'Major trends and transitions ahead' },
  { title: 'Next 12 Months Outlook', desc: 'Month-by-month guidance for the year' },
  { title: 'Career & Wealth Path', desc: 'Your natural professional strengths' },
  { title: 'Relationship Dynamics', desc: 'How you connect and relate to others' },
  { title: 'Feng Shui Recommendations', desc: 'Optimize your space by element' },
  { title: 'Crystal & Color Guidance', desc: 'Enhancements aligned with your chart' },
  { title: 'Action Steps', desc: 'Practical guidance for your current cycle' },
];

const testimonials = [
  {
    name: 'Jennifer M.',
    text: 'The Destiny Map was incredibly detailed and accurate. It helped me understand why I felt stuck in my career and gave me the confidence to make a change.',
    rating: 5,
  },
  {
    name: 'Robert K.',
    text: 'I was skeptical but the insights about my Metal nature were spot-on. The 10-year forecast has helped me plan major decisions.',
    rating: 5,
  },
];

export default function DestinyMapPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-500/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium text-gold-400">Signature Service</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Complete Destiny Map
              </h1>
              <p className="text-xl text-primary-200/80 mb-8">
                Your comprehensive 30+ page personalized BaZi reading. 
                Discover your elemental blueprint, natural strengths, and optimal timing for life&apos;s decisions.
              </p>
              <div className="flex items-baseline mb-8">
                <span className="text-2xl text-primary-200/60">$</span>
                <span className="font-serif text-6xl font-bold">99</span>
                <span className="ml-4 text-primary-200/60">one-time purchase</span>
              </div>
              <Link href="/calculator">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-primary-950">
                  Get Your Destiny Map
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-jade-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl flex items-center justify-center">
                    <div className="text-center p-8">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gold-400" />
                      <p className="text-2xl font-serif font-bold">30+ Pages</p>
                      <p className="text-primary-200/60">Personalized Report</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
              What&apos;s Included
            </h2>
            <p className="text-lg text-charcoal/70">
              A comprehensive analysis covering every aspect of your elemental nature
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="crystal-card p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-gold-700" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-primary-950 mb-2">
                  {feature.title}
                </h3>
                <p className="text-charcoal/60 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
              How It Works
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'Submit Your Details', desc: 'Enter your birth date, time, and location' },
              { icon: Sparkles, title: 'We Calculate Your Chart', desc: 'Our system analyzes your unique elemental blueprint' },
              { icon: FileText, title: 'Receive Your Report', desc: 'Get your 30+ page PDF within 2 hours via email' },
            ].map((step, index) => (
              <div key={step.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary-700" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary-950 mb-2">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-charcoal/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              What Our Clients Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="bg-primary-900/50 backdrop-blur-sm rounded-2xl p-8 border border-primary-800"
              >
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-lg text-primary-100/90 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="font-semibold text-gold-400">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee & CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jade-100 flex items-center justify-center">
            <Shield className="w-8 h-8 text-jade-600" />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            100% Satisfaction Guarantee
          </h2>
          <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
            If your Destiny Map doesn&apos;t provide at least one meaningful insight 
            that helps you understand yourself better, we&apos;ll refund 100% of your purchase.
          </p>
          <Link href="/calculator">
            <Button size="lg" className="text-lg px-10 py-5">
              Get Your Complete Destiny Map
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
