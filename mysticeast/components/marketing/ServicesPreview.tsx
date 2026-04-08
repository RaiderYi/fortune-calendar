'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Sparkles, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const services = [
  {
    id: 'destiny-map',
    icon: Sparkles,
    name: 'Complete Destiny Map',
    price: 99,
    description: 'Your comprehensive 30+ page personalized BaZi reading',
    features: [
      'Complete birth chart analysis',
      'Day Master element interpretation',
      '10-year luck cycle forecast',
      'Next 12 months outlook',
      'Career & wealth path guidance',
      'Relationship dynamics',
      'Feng Shui recommendations',
      'Crystal & color guidance',
    ],
    popular: true,
    cta: 'Get Your Destiny Map',
  },
  {
    id: 'annual-forecast',
    icon: Calendar,
    name: 'Annual Forecast',
    price: 79,
    description: 'Year-ahead guidance for optimal timing',
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
    cta: 'Get Annual Forecast',
  },
  {
    id: 'compatibility',
    icon: Heart,
    name: 'Compatibility Reading',
    price: 89,
    description: 'Relationship dynamics between two charts',
    features: [
      'Two complete chart analyses',
      'Element compatibility score',
      'Strengths & challenges',
      'Communication insights',
      'Long-term potential',
      'Harmony recommendations',
    ],
    popular: false,
    cta: 'Explore Compatibility',
  },
];

export function ServicesPreview() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-jade-600 font-medium tracking-wider uppercase text-sm">
            Our Services
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary-950 mt-4 mb-6">
            Choose Your Path to Clarity
          </h2>
          <p className="text-xl text-charcoal/70">
            From free elemental insights to comprehensive destiny readings, find the guidance that resonates with your journey
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative ${service.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-white text-sm font-semibold rounded-full shadow-gold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className={`h-full bg-white rounded-2xl shadow-soft hover:shadow-xl transition-all duration-300 overflow-hidden ${service.popular ? 'border-2 border-gold-200' : ''}`}>
                {/* Header */}
                <div className={`p-8 ${service.popular ? 'bg-gradient-to-br from-gold-50 to-gold-100/50' : ''}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.popular ? 'bg-gold-500 text-white' : 'bg-primary-100 text-primary-700'}`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl font-semibold text-primary-950 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-charcoal/70 mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-baseline">
                    <span className="text-charcoal/50 text-lg">$</span>
                    <span className="font-serif text-5xl font-bold text-primary-950">
                      {service.price}
                    </span>
                  </div>
                </div>
                
                {/* Features */}
                <div className="p-8 pt-0">
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start space-x-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${service.popular ? 'text-gold-500' : 'text-jade-500'}`} />
                        <span className="text-charcoal/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href={`/services/${service.id}`}>
                    <Button 
                      variant={service.popular ? 'gold' : 'primary'}
                      className="w-full"
                    >
                      {service.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-charcoal/60">
            <span className="font-semibold text-jade-600">100% Satisfaction Guarantee:</span>{' '}
            If your reading doesn&apos;t provide meaningful insights, we&apos;ll refund your purchase. No questions asked.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
