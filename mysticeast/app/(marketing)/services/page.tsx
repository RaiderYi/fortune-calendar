import { Metadata } from 'next';
import { Sparkles, Compass, Heart, Users, Star, Gem, Home, Scroll, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Our Services - BaZi Destiny Reading & Feng Shui | MysticEast',
  description: 'Discover your destiny through authentic BaZi Four Pillars readings, personalized Feng Shui guidance, and energy-enhancing crystals. Ancient wisdom for modern transformation.',
};

const services = [
  {
    id: 'bazi-reading',
    icon: Scroll,
    name: 'Complete BaZi Destiny Reading',
    tagline: 'Your Blueprint for Life',
    description: 'A comprehensive analysis of your Four Pillars birth chart, revealing your elemental nature, life patterns, and destiny path.',
    includes: [
      'Complete Four Pillars birth chart analysis',
      'Day Master element interpretation and personality profile',
      'Ten-year luck cycle forecast and major transitions',
      'Annual energy flow and timing guidance',
      'Career path alignment and wealth potential',
      'Relationship dynamics and compatibility insights',
      'Health tendencies and wellness recommendations',
      'Personalized action plan for current cycle',
    ],
    deliverable: 'Comprehensive written report with visual charts',
  },
  {
    id: 'annual-guidance',
    icon: Compass,
    name: 'Annual Destiny Guidance',
    tagline: 'Navigate Your Year with Clarity',
    description: 'Focused yearly forecast to help you understand the energy patterns ahead and make optimal decisions for career, relationships, and personal growth.',
    includes: [
      'Yearly elemental energy analysis',
      'Month-by-month timing guidance',
      'Favorable periods for major decisions',
      'Career opportunity windows',
      'Relationship and social dynamics',
      'Financial flow predictions',
      'Health and wellness focus areas',
      'Remedies and enhancement strategies',
    ],
    deliverable: 'Detailed annual forecast report',
  },
  {
    id: 'compatibility',
    icon: Heart,
    name: 'Relationship Harmony Reading',
    tagline: 'Understand Your Connections',
    description: 'Deep analysis of relationship dynamics between two individuals, revealing natural affinities, challenges, and pathways to harmony.',
    includes: [
      'Individual chart analysis for both parties',
      'Elemental compatibility assessment',
      'Natural strengths and growth areas',
      'Communication style insights',
      'Long-term harmony potential',
      'Conflict resolution guidance',
      'Optimal timing for important discussions',
      'Strategies for deeper connection',
    ],
    deliverable: 'Joint compatibility report with guidance',
  },
];

const enhancements = [
  {
    icon: Gem,
    title: 'Crystal Energy Selection',
    description: 'Personalized crystal recommendations based on your elemental chart to enhance your natural strengths and balance areas of deficiency.',
    items: [
      'Birth chart-based crystal prescriptions',
      'Energy amplification stones',
      'Protective and grounding crystals',
      'Abundance and success enhancers',
      'Love and relationship harmonizers',
    ],
  },
  {
    icon: Home,
    title: 'Feng Shui Space Optimization',
    description: 'Practical Feng Shui guidance to align your living and working spaces with your personal energy for optimal flow and prosperity.',
    items: [
      'Personal elemental direction analysis',
      'Workspace arrangement for success',
      'Bedroom layout for rest and harmony',
      'Color palette recommendations',
      'Energy activation techniques',
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-jade-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">Ancient Wisdom, Modern Application</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Discover Your Path Through<br />
            <span className="text-gradient-gold">BaZi & Feng Shui</span>
          </h1>
          <p className="text-xl text-primary-200/80 max-w-3xl mx-auto">
            Unlock the secrets of your destiny with authentic Eastern metaphysics. 
            Personalized readings, energy alignment, and crystal guidance for your unique elemental nature.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-serif text-3xl font-bold text-primary-950 mb-6">
            The Art of BaZi (Four Pillars)
          </h2>
          <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
            BaZi, meaning "Eight Characters," is an ancient Chinese metaphysical system that analyzes the 
            five elements present at your moment of birth. Your birth chart reveals your unique energetic 
            blueprint—your natural strengths, challenges, optimal timing, and life path.
          </p>
          <p className="text-lg text-charcoal/70 leading-relaxed">
            Unlike fortune-telling, BaZi is a sophisticated pattern recognition system that helps you 
            understand the natural rhythms of your life and make conscious choices aligned with your energy.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-primary-950 mb-4">
              Our Reading Services
            </h2>
            <p className="text-lg text-charcoal/70">
              Each reading is personalized based on your unique birth chart, 
              providing insights that resonate with your specific elemental composition.
            </p>
          </div>

          <div className="space-y-12">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Left - Content */}
                  <div className={`p-8 md:p-12 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center mb-6">
                      <service.icon className="w-7 h-7 text-gold-700" />
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-primary-950 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gold-600 font-medium mb-4">{service.tagline}</p>
                    <p className="text-charcoal/70 text-lg mb-6">{service.description}</p>
                    
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-50 rounded-lg">
                      <Scroll className="w-4 h-4 text-primary-600" />
                      <span className="text-sm text-primary-700">{service.deliverable}</span>
                    </div>
                  </div>

                  {/* Right - Includes */}
                  <div className={`p-8 md:p-12 bg-gradient-to-br from-primary-50 to-cream ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <h4 className="font-semibold text-primary-950 mb-4">What&apos;s Included:</h4>
                    <ul className="space-y-3">
                      {service.includes.map((item) => (
                        <li key={item} className="flex items-start space-x-3">
                          <Star className="w-5 h-5 text-gold-500 mt-0.5 flex-shrink-0" />
                          <span className="text-charcoal/80">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhancement Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-jade-100 rounded-full mb-4">
              <Gem className="w-4 h-4 text-jade-600" />
              <span className="text-sm font-medium text-jade-700">Energy Enhancement</span>
            </div>
            <h2 className="font-serif text-4xl font-bold text-primary-950 mb-4">
              Complete Your Transformation
            </h2>
            <p className="text-lg text-charcoal/70">
              Beyond the reading itself, we offer practical guidance to align your environment 
              and personal energy with your chart&apos;s wisdom.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {enhancements.map((enhancement) => (
              <div
                key={enhancement.title}
                className="crystal-card p-8 md:p-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-jade-100 to-jade-200 flex items-center justify-center mb-6">
                  <enhancement.icon className="w-7 h-7 text-jade-700" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary-950 mb-3">
                  {enhancement.title}
                </h3>
                <p className="text-charcoal/70 mb-6">{enhancement.description}</p>
                
                <ul className="space-y-2">
                  {enhancement.items.map((item) => (
                    <li key={item} className="flex items-center space-x-2 text-sm text-charcoal/70">
                      <div className="w-1.5 h-1.5 rounded-full bg-jade-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">
              Your Journey to Clarity
            </h2>
            <p className="text-lg text-primary-200/80">
              A simple process to receive personalized insights based on authentic BaZi methodology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Submit Your Details',
                description: 'Provide your birth date, time, and location for accurate chart calculation.',
              },
              {
                step: '02',
                title: 'Chart Analysis',
                description: 'Our system calculates your Four Pillars and analyzes your elemental composition.',
              },
              {
                step: '03',
                title: 'Receive Your Reading',
                description: 'Get your comprehensive report with personalized insights and recommendations.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center border border-gold-500/30">
                  <span className="font-serif text-2xl font-bold text-gold-400">{item.step}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-primary-200/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-6 text-gold-500" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
            Ready to Discover Your Elemental Nature?
          </h2>
          <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
            Begin with our complimentary elemental assessment. Share your birth details 
            and receive personalized insights into your unique energy blueprint.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href="/calculator"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary-950 text-white font-semibold rounded-xl hover:bg-primary-900 transition-colors"
            >
              Try Free Calculator
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a 
              href="mailto:bazirili@foxmail.com"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary-950 text-primary-950 font-semibold rounded-xl hover:bg-primary-50 transition-colors"
            >
              Request Full Reading
            </a>
          </div>
          <p className="mt-6 text-sm text-charcoal/50">
            Email us at bazirili@foxmail.com with your birth details for a complete analysis.
          </p>
        </div>
      </section>
    </div>
  );
}
