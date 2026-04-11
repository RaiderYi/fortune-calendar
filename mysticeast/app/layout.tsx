import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.bazirili.top'),
  title: 'MysticEast - Ancient Eastern Wisdom for Modern Lives',
  description: 'Discover your elemental nature through personalized BaZi readings. Ancient wisdom meets modern science.',
  keywords: ['BaZi', 'Chinese Astrology', 'Destiny Map', 'Five Elements', 'Feng Shui'],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: 'MysticEast - Ancient Eastern Wisdom for Modern Lives',
    description: 'Discover your elemental nature through personalized BaZi readings.',
    url: 'https://www.bazirili.top',
    siteName: 'MysticEast',
    images: [
      {
        url: '/images/hero-bazi-chart.svg',
        width: 1200,
        height: 630,
        alt: 'MysticEast editorial elemental reading preview',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MysticEast - Editorial Eastern Wisdom',
    description: 'Ancient Eastern wisdom translated into practical cultural guidance for modern life.',
    images: ['/images/hero-bazi-chart.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
