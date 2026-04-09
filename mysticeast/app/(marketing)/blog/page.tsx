import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getAllArticles } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'MysticEast Journal - Practical BaZi Articles & Elemental Guidance',
  description:
    'Read practical MysticEast articles on core elements, BaZi pattern recognition, and daily guidance for modern seekers.',
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-cream">
      <section className="py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-16 left-12 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute bottom-8 right-12 w-96 h-96 rounded-full bg-jade-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">MysticEast Journal</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Thoughtful BaZi guidance for modern life
          </h1>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-primary-200/80 leading-relaxed">
            Start with practical articles that translate elemental insight into calmer decisions, better timing, and a more grounded understanding of your natural patterns.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-950 mb-4">
              Start with these essentials
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              These articles are designed to support the free calculator journey and help you use your result with more clarity and confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article key={article.slug} className="crystal-card p-8 flex flex-col h-full">
                <div className="inline-flex w-fit items-center rounded-full bg-jade-100 px-3 py-1 text-sm font-medium text-jade-700 mb-4">
                  {article.category}
                </div>

                <h3 className="font-serif text-2xl font-bold text-primary-950 mb-3 leading-tight">
                  {article.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed mb-6 flex-1">{article.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-charcoal/55 mb-6">
                  <div className="inline-flex items-center">
                    <CalendarDays className="w-4 h-4 mr-2 text-gold-600" />
                    {article.publishedAt}
                  </div>
                  <div className="inline-flex items-center">
                    <Clock3 className="w-4 h-4 mr-2 text-gold-600" />
                    {article.readingTime}
                  </div>
                </div>

                <Link href={`/blog/${article.slug}`}>
                  <Button className="w-full justify-center">
                    Read article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
