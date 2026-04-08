import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Features } from '@/components/marketing/Features';
import { Testimonials } from '@/components/marketing/Testimonials';
import { CTA } from '@/components/marketing/CTA';

export const metadata = {
  title: 'MysticEast - Ancient Eastern Wisdom for Modern Lives',
  description: 'Discover your elemental nature through personalized BaZi readings. Ancient wisdom meets modern science. Get your free chart analysis today.',
  openGraph: {
    title: 'MysticEast - Discover Your True Nature',
    description: 'Personalized BaZi readings reveal your elemental blueprint and life\'s natural rhythms.',
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
    </>
  );
}
