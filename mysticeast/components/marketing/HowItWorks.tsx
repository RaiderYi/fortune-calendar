'use client';

import { motion } from 'framer-motion';
import { Calendar, Sparkles, Compass } from 'lucide-react';

const steps = [
  {
    icon: Calendar,
    number: '01',
    title: 'Enter Your Birth Details',
    description: 'Share your birth date, time, and location. Our system uses traditional Chinese metaphysics to calculate your unique elemental blueprint.',
  },
  {
    icon: Sparkles,
    number: '02',
    title: 'Receive Your Analysis',
    description: 'Discover your Day Master element, natural strengths, and current luck cycle. Get personalized insights about your career, relationships, and timing.',
  },
  {
    icon: Compass,
    number: '03',
    title: 'Align With Your Energy',
    description: 'Use your personalized recommendations to make better decisions, optimize your space with Feng Shui, and flow with life\'s natural rhythms.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
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
            How It Works
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-primary-950 mt-4 mb-6">
            Your Journey to Self-Discovery
          </h2>
          <p className="text-xl text-charcoal/70">
            Three simple steps to unlock the ancient wisdom encoded in your birth chart
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
              )}
              
              <div className="crystal-card p-8 h-full hover:shadow-lg transition-shadow duration-300">
                {/* Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-primary-700" />
                  </div>
                  <span className="text-5xl font-serif font-bold text-primary-100">
                    {step.number}
                  </span>
                </div>
                
                <h3 className="font-serif text-2xl font-semibold text-primary-950 mb-4">
                  {step.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
