import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MysticEast - Ancient Eastern Wisdom for Modern Lives',
  description: 'Discover your elemental nature through personalized BaZi readings. Ancient wisdom meets modern science.',
  keywords: ['BaZi', 'Chinese Astrology', 'Destiny Map', 'Five Elements', 'Feng Shui'],
  openGraph: {
    title: 'MysticEast - Ancient Eastern Wisdom for Modern Lives',
    description: 'Discover your elemental nature through personalized BaZi readings.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MysticEast',
    description: 'Ancient Eastern wisdom for modern lives',
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
