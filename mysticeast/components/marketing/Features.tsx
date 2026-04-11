'use client';

import { motion } from 'framer-motion';
import { Target, Clock, Users, Building2, Heart, Brain } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Career Guidance',
    description: 'Discover your natural talents and the optimal timing for career moves, promotions, and new ventures.',
    color: 'from-gold-100 to-gold-50',
    iconColor: 'text-gold-600',
  },
  {
    icon: Clock,
    title: 'Luck Cycle Timing',
    description: 'Understand your 10-year luck cycles and annual influences to make decisions at the right time.',
    color: 'from-primary-100 to-primary-50',
    iconColor: 'text-primary-600',
  },
  {
    icon: Heart,
    title: 'Relationship Insights',
    description: 'Learn about your relationship patterns, compatibility dynamics, and how to nurture meaningful connections.',
    color: 'from-rose-100 to-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Building2,
    title: 'Feng Shui Alignment',
    description: 'Get personalized Feng Shui recommendations based on your element to optimize your living and workspace.',
    color: 'from-jade-100 to-jade-50',
    iconColor: 'text-jade-600',
  },
  {
    icon: Brain,
    title: 'Personal Growth',
    description: 'Identify your inherent strengths and challenges to accelerate your personal development journey.',
    color: 'from-violet-100 to-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: Users,
    title: 'Compatibility Analysis',
    description: 'Compare charts with partners, colleagues, or friends to understand your natural dynamics.',
    color: 'from-amber-100 to-amber-50',
    iconColor: 'text-amber-600',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-cream">
      <div className="section-shell">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="seal-chip">
            Five Energies, One Life Path
          </span>
          <h2 className="section-title text-primary-950">
            A Philosophy You Can Actually Use
          </h2>
          <p className="section-description">
            From career and relationships to home energy, each insight helps you move with balance rather than force.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group"
            >
              <div className="east-panel p-8 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary-950 mb-3">
                  {feature.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
