import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Features } from '@/components/marketing/Features';
import { ServicesPreview } from '@/components/marketing/ServicesPreview';
import { Testimonials } from '@/components/marketing/Testimonials';
import { CTA } from '@/components/marketing/CTA';

type LandingVariant = 'a' | 'b';
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'MysticEast Editorial East | BaZi Reading, Five Elements, and Cultural Guidance',
  description:
    'Explore Editorial East: magazine-style BaZi readings, Five Elements insight, monthly cultural stories, and practical Eastern philosophy in plain English.',
  keywords: [
    'BaZi reading',
    'Five Elements',
    'Chinese metaphysics',
    'Eastern philosophy',
    'cultural wellness',
    'destiny map',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'MysticEast Editorial East',
    description: 'Magazine-style Eastern philosophy, BaZi readings, and monthly cultural stories.',
    images: [
      {
        url: '/images/destiny-map-report-cover.svg',
        width: 1200,
        height: 630,
        alt: 'MysticEast Editorial East featured spread',
      },
    ],
  },
};

interface HomePageProps {
  searchParams?: {
    v?: string;
  };
}

export default function HomePage({ searchParams }: HomePageProps) {
  const variantParam = String(searchParams?.v ?? '').toLowerCase();
  const variant: LandingVariant = variantParam === 'b' ? 'b' : 'a';
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'MysticEast',
        url: 'https://www.bazirili.top',
        logo: 'https://www.bazirili.top/images/hero-bazi-chart.svg',
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: 'bazirili@foxmail.com',
          },
        ],
      },
      {
        '@type': 'WebSite',
        name: 'MysticEast',
        url: 'https://www.bazirili.top',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.bazirili.top/blog?query={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'CollectionPage',
        name: 'Editorial East Collection',
        url: 'https://www.bazirili.top',
        description:
          'Editorial East: BaZi guidance, Five Elements cultural stories, and practical philosophical insights for modern life.',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Hero variant={variant} />
      <HowItWorks />
      <Features />
      <ServicesPreview />
      <Testimonials variant={variant} />
      <CTA variant={variant} />
    </>
  );
}
