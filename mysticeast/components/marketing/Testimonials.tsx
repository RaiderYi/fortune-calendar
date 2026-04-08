'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Marketing Director',
    content: 'The Destiny Map reading was incredibly accurate. It helped me understand why I felt stuck in my career and gave me the confidence to pivot at the right time. Six months later, I landed my dream job!',
    rating: 5,
    element: 'Fire',
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Entrepreneur',
    content: 'I was skeptical at first, but the insights about my natural strengths were spot-on. Understanding my Metal element helped me leverage my analytical abilities in business decisions.',
    rating: 5,
    element: 'Metal',
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Wellness Coach',
    content: 'As someone who works with energy, I appreciate how BaZi bridges ancient wisdom with practical guidance. The Feng Shui recommendations transformed my home office and my productivity.',
    rating: 5,
    element: 'Wood',
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-primary-950 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-800/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-gold-400 font-medium tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mt-4 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-primary-200/80">
            Join thousands who have gained clarity and direction through their personalized readings
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-900/50 backdrop-blur-sm rounded-2xl p-8 border border-primary-800/50 hover:border-gold-500/30 transition-colors duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-gold-500/30 mb-6" />
              
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-primary-100/90 leading-relaxed mb-6 text-lg">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              
              {/* Author */}
              <div className="flex items-center space-x-4 pt-6 border-t border-primary-800/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-primary-950 font-serif font-bold text-lg">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-primary-300">{testimonial.role}</p>
                </div>
                <div className="ml-auto">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-800/50 text-xs font-medium text-gold-400">
                    {testimonial.element} Element
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-primary-800/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Charts Created' },
              { number: '4.9/5', label: 'Average Rating' },
              { number: '98%', label: 'Satisfaction Rate' },
              { number: '50+', label: 'Countries Served' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif text-3xl sm:text-4xl font-bold text-gold-400">
                  {stat.number}
                </p>
                <p className="text-primary-300 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
