import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/blog';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found | MysticEast',
    };
  }

  return {
    title: `${article.title} | MysticEast Journal`,
    description: article.description,
    keywords: article.keywords,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
    },
  };
}

export default function BlogArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = getRelatedArticles(article.slug, 2);

  return (
    <div className="min-h-screen bg-cream">
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-96 h-96 rounded-full bg-jade-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-primary-200 hover:text-white transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journal
          </Link>

          <div className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">{article.category}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-6">
            {article.title}
          </h1>
          <p className="text-xl text-primary-200/80 leading-relaxed max-w-3xl">
            {article.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-5 text-sm text-primary-200/70">
            <div className="inline-flex items-center">
              <CalendarDays className="w-4 h-4 mr-2 text-gold-400" />
              {article.publishedAt}
            </div>
            <div className="inline-flex items-center">
              <Clock3 className="w-4 h-4 mr-2 text-gold-400" />
              {article.readingTime}
            </div>
            <div>By {article.author}</div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <article className="crystal-card p-8 md:p-12">
            <div className="space-y-12">
              {article.sections.map((section, index) => (
                <section key={`${article.slug}-${index}`}>
                  {section.heading && (
                    <h2 className="font-serif text-3xl font-bold text-primary-950 mb-5">
                      {section.heading}
                    </h2>
                  )}

                  <div className="space-y-4 text-lg leading-relaxed text-charcoal/80">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.bullets && section.bullets.length > 0 && (
                    <ul className="mt-6 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start text-charcoal/80">
                          <span className="mt-2 mr-3 h-2 w-2 rounded-full bg-jade-500 flex-shrink-0" />
                          <span className="text-lg leading-relaxed">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          </article>

          <div className="mt-12 crystal-card p-8 bg-gradient-to-br from-white/80 to-gold-50/80 border border-gold-200/60">
            <h2 className="font-serif text-3xl font-bold text-primary-950 mb-4">
              Ready to explore your own pattern?
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mb-6">
              Use the free MysticEast calculator to discover your core element and get practical guidance tailored to your chart.
            </p>
            <Link href="/calculator">
              <Button size="lg">
                Try Free Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary-950 mb-2">
                Continue reading
              </h2>
              <p className="text-charcoal/70">A couple of related pieces to deepen your understanding.</p>
            </div>
            <Link href="/blog" className="text-primary-800 font-medium hover:text-primary-950 transition-colors">
              View all articles
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((related) => (
              <Link key={related.slug} href={`/blog/${related.slug}`} className="crystal-card p-6 block hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-sm font-medium text-primary-700 mb-4">
                  {related.category}
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary-950 mb-3 leading-tight">
                  {related.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed mb-4">{related.description}</p>
                <span className="inline-flex items-center text-primary-800 font-medium">
                  Read article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
