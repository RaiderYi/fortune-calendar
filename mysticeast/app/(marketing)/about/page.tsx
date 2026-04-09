import { Metadata } from 'next';
import Image from 'next/image';
import { CircleDot, Heart, Scale, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About MysticEast - Modern BaZi Wisdom | MysticEast',
  description: 'Bridging ancient Chinese wisdom with modern self-discovery. Learn about our approach to BaZi and how we make this practice accessible for conscious seekers.',
};

const values = [
  {
    icon: CircleDot,
    title: 'Ancient Wisdom, Modern Context',
    desc: 'We translate the timeless principles of BaZi into insights relevant for today&apos;s world, making this 3,000-year-old practice accessible and practical.',
  },
  {
    icon: Heart,
    title: 'Pattern Recognition, Not Fate',
    desc: 'We believe BaZi reveals energetic tendencies, not fixed destiny. You always have agency to work with your patterns and make conscious choices.',
  },
  {
    icon: Scale,
    title: 'Science and Spirituality',
    desc: 'We honor both the mathematical precision of traditional BaZi calculation and the intuitive wisdom that emerges from understanding your elemental nature.',
  },
];

const principles = [
  { title: 'Accuracy', desc: 'Precise calculations based on authentic classical methods' },
  { title: 'Integrity', desc: 'Honest interpretations without fear-based manipulation' },
  { title: 'Empowerment', desc: 'Insights that help you make better choices, not dependence' },
  { title: 'Privacy', desc: 'Your birth data and readings are always confidential' },
  { title: 'Accessibility', desc: 'Making BaZi wisdom available to sincere seekers everywhere' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Our Story</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Bridging Ancient Wisdom<br />with Modern Understanding
          </h1>
          <p className="text-xl text-primary-200/80 max-w-3xl mx-auto">
            We believe that the ancient practice of BaZi holds profound insights for modern life—
            when presented with clarity, integrity, and relevance.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-charcoal/70 leading-relaxed">
            To make the wisdom of BaZi accessible to conscious seekers worldwide, 
            providing tools for self-understanding that honor both the depth of tradition 
            and the realities of modern life. We believe everyone deserves to understand 
            their elemental nature and the natural cycles that influence their journey.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-charcoal/70">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div key={value.title} className="crystal-card p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-gold-700" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary-950 mb-3">
                  {value.title}
                </h3>
                <p className="text-charcoal/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-6">
                Our Approach
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-charcoal/70">
                  BaZi (八字), literally &ldquo;Eight Characters,&rdquo; is a sophisticated system 
                  of Chinese astrology that analyzes the five elements present at your birth moment. 
                  Developed over 3,000 years ago, it provides a unique map of your energetic tendencies.
                </p>
                <p className="text-lg text-charcoal/70">
                  At MysticEast, we&apos;ve combined this ancient wisdom with modern technology 
                  to create accurate, personalized readings that speak to contemporary seekers. 
                  Our calculations use precise astronomical data and authentic classical methods.
                </p>
                <p className="text-lg text-charcoal/70">
                  Most importantly, we present BaZi as a tool for self-understanding and 
                  optimal timing—not as fixed destiny. Your chart shows tendencies and cycles; 
                  you always have the power to work consciously with these patterns.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-100 via-gold-100 to-jade-100 p-6 shadow-soft">
                <div className="w-full h-full overflow-hidden rounded-[1.5rem] bg-white/70 backdrop-blur-sm">
                  <Image
                    src="/images/about-bazi-practice.svg"
                    alt="MysticEast approach to BaZi pattern recognition"
                    width={1000}
                    height={1000}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section id="principles" className="py-20 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Our Commitment to You
            </h2>
            <p className="text-lg text-primary-200/80">
              The standards we uphold in every reading
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {principles.map((principle, index) => (
              <div
                key={principle.title}
                className="bg-primary-900/50 backdrop-blur-sm rounded-xl p-6 border border-primary-800"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif font-bold text-gold-400">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{principle.title}</h3>
                    <p className="text-primary-200/70 text-sm">{principle.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            Begin Your Journey
          </h2>
          <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
            Start with our free elemental assessment to discover your Day Master, 
            then explore our personalized readings for deeper insights.
          </p>
          <a
            href="/calculator"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-950 text-white font-semibold rounded-xl hover:bg-primary-900 transition-colors"
          >
            Get Free Assessment
          </a>
        </div>
      </section>
    </div>
  );
}
