'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ScrollText, Gem, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const services = [
  {
    id: 'destiny-map',
    icon: ScrollText,
    name: 'Destiny Map Booklet',
    description: 'An editorial-style reading document blending BaZi analysis, story-driven interpretation, and practical timing notes.',
    image: '/images/destiny-map-report-cover.svg',
    cta: 'View Destiny Map',
  },
  {
    id: 'annual-forecast',
    icon: Sparkles,
    name: 'Annual Rhythm Guide',
    description: 'A seasonal visual guide for choosing when to push, pause, recover, and align major life decisions.',
    image: '/images/annual-forecast-calendar.svg',
    cta: 'Explore Annual Guide',
  },
  {
    id: 'compatibility',
    icon: Gem,
    name: 'Compatibility Folio',
    description: 'A two-chart narrative focused on emotional dynamics, communication style, and long-term energetic fit.',
    image: '/images/compatibility-elements.svg',
    cta: 'Read Compatibility Folio',
  },
];

const monthlyFeature = {
  monthLabel: 'Monthly Theme · April',
  title: 'The Season of Gentle Momentum',
  description:
    'This month we explore how Wood and Water energies shape decisions, creativity, and relationships. A long-form editorial essay with practical rituals and imagery.',
  image: '/images/about-bazi-practice.svg',
  href: '/blog',
};

export function ServicesPreview() {
  return (
    <section className="py-24 bg-white">
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
            Editorial East Collection
          </span>
          <h2 className="section-title text-primary-950">
            Cultural Products You Can Read, Keep, and Revisit
          </h2>
          <p className="section-description">
            Designed as collectible guidance pieces. Each product combines Eastern philosophy, modern language, and rich visual storytelling.
          </p>
        </motion.div>

        <div className="mb-10 east-panel p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary-700/80 font-semibold mb-3">Editorial Principle</p>
              <h3 className="font-serif text-3xl text-primary-950 mb-3">From Fortune Telling to Cultural Reading</h3>
              <p className="text-charcoal/75 leading-relaxed">
                We present BaZi as a reflective cultural practice: narrative pages, image-led interpretation, and practical rituals for daily life.
              </p>
            </div>
            <div className="rounded-2xl border border-gold-200/60 bg-gradient-to-br from-gold-50/90 to-white p-5">
              <p className="text-sm text-charcoal/75 leading-relaxed">
                Future-ready layout: this section is designed for frequent product updates, larger artwork blocks, and campaign storytelling.
              </p>
            </div>
          </div>
        </div>

        {/* Editorial spread */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-12 overflow-hidden rounded-3xl border border-gold-200/70 bg-gradient-to-br from-white via-cream/45 to-gold-50/70"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[340px]">
              <Image
                src="/images/destiny-map-report-cover.svg"
                alt="Editorial spread cover for MysticEast cultural reading"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-950/40 via-transparent to-transparent" />
            </div>
            <div className="p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.18em] text-primary-700/80 font-semibold mb-4">
                Featured Editorial Spread
              </p>
              <h3 className="font-serif text-4xl leading-tight text-primary-950 mb-4">
                The Destiny Map Issue
              </h3>
              <p className="text-charcoal/75 leading-relaxed mb-8">
                A magazine-style reading format: symbolic visuals, element narratives, and practical application notes.
                Built to be read like a cultural publication rather than a utility report.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/services/destiny-map">
                  <Button variant="primary">
                    Open Featured Reading
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline">View All Collections</Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Editorial product grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full east-panel overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={`${service.name} preview`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/20 to-transparent" />
                </div>

                <div className="p-7">
                  <div className="w-12 h-12 rounded-xl bg-primary-100/80 text-primary-700 flex items-center justify-center mb-5">
                    <service.icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-primary-950 mb-3">
                    {service.name}
                  </h3>
                  <p className="text-charcoal/75 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <Link href={`/services/${service.id}`}>
                    <Button variant="outline" className="w-full">
                      {service.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly story slot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="mt-14 east-panel overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[250px]">
              <Image
                src={monthlyFeature.image}
                alt={`${monthlyFeature.title} monthly cultural story`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-7 md:p-9">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-100/70 px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-primary-700/85 font-semibold mb-4">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{monthlyFeature.monthLabel}</span>
              </div>
              <h3 className="font-serif text-3xl text-primary-950 mb-4">
                {monthlyFeature.title}
              </h3>
              <p className="text-charcoal/75 leading-relaxed mb-6">
                {monthlyFeature.description}
              </p>
              <Link href={monthlyFeature.href}>
                <Button variant="outline">
                  Read This Month&apos;s Story
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
