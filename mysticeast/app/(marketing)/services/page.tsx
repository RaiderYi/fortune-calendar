import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Calendar, Heart, ArrowRight, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Our Services - Personalized BaZi Readings | MysticEast',
  description: 'Choose from our range of personalized BaZi readings: Complete Destiny Map, Annual Forecast, and Compatibility Analysis. Ancient wisdom for modern decisions.',
};

const services = [
  {
    id: 'destiny-map',
    name: 'Complete Destiny Map',
    price: 99,
    description: 'Our signature 30+ page comprehensive reading. Discover your full elemental blueprint, life cycles, and personalized guidance.',
    features: [
      'Complete birth chart analysis',
      'Day Master element interpretation',
      '10-year luck cycle forecast',
      'Next 12 months detailed outlook',
      'Career & wealth path guidance',
      'Relationship dynamics analysis',
      'Feng Shui recommendations',
      'Crystal & color guidance',
      'Action steps for current cycle',
    ],
    popular: true,
    delivery: 'Within 2 hours via email',
  },
  {
    id: 'annual-forecast',
    name: 'Annual Forecast',
    price: 79,
    description: 'Year-ahead guidance for optimal timing. Know when to act and when to wait in the coming 12 months.',
    features: [
      'Annual luck analysis',
      'Month-by-month outlook',
      'Best timing for major decisions',
      'Career opportunity windows',
      'Relationship highlights',
      'Health & wellness focus',
      'Remedies & enhancements',
    ],
    popular: false,
    delivery: 'Within 2 hours via email',
  },
  {
    id: 'compatibility',
    name: 'Compatibility Reading',
    price: 89,
    description: 'Relationship dynamics between two charts. Understand your natural connection and growth areas.',
    features: [
      'Two complete chart analyses',
      'Element compatibility score',
      'Strengths & challenges',
      'Communication insights',
      'Long-term potential',
      'Harmony recommendations',
    ],
    popular: false,
    delivery: 'Within 2 hours via email',
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
            <span className="text-sm font-medium text-gold-400">Personalized Readings</span>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Choose Your Path to Clarity
          </h1>
          <p className="text-xl text-primary-200/80 max-w-2xl mx-auto">
            From free elemental insights to comprehensive destiny readings, 
            find the guidance that resonates with your journey.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`relative bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  service.popular ? 'lg:-mt-4 lg:mb-4 border-2 border-gold-200' : ''
                }`}
              >
                {service.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-600 text-white px-6 py-2 rounded-b-xl font-medium text-sm">
                    Most Popular
                  </div>
                )}
                
                <div className={`p-8 ${service.popular ? 'pt-12' : ''}`}>
                  <h3 className="font-serif text-2xl font-bold text-primary-950 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-charcoal/70 mb-4">{service.description}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-charcoal/50">$</span>
                    <span className="font-serif text-5xl font-bold text-primary-950">{service.price}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-charcoal/60 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>{service.delivery}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${service.popular ? 'text-gold-500' : 'text-jade-500'}`} />
                        <span className="text-charcoal/80 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={`/services/${service.id}`}>
                    <Button 
                      variant={service.popular ? 'gold' : 'primary'}
                      className="w-full"
                    >
                      Get Started
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jade-100 flex items-center justify-center">
            <Star className="w-8 h-8 text-jade-600" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-primary-950 mb-4">
            100% Satisfaction Guarantee
          </h2>
          <p className="text-lg text-charcoal/70">
            If your reading doesn&apos;t provide at least one meaningful insight that helps you 
            understand yourself better, we&apos;ll refund 100% of your purchase. No questions asked.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="w-12 h-12 mx-auto mb-6 text-gold-400" />
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Not Sure Which Reading is Right for You?
          </h2>
          <p className="text-lg text-primary-200/80 mb-8">
            Start with our free elemental assessment to discover your Day Master, 
            then choose the reading that best fits your needs.
          </p>
          <Link href="/calculator">
            <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-primary-950">
              Get Free Assessment
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
