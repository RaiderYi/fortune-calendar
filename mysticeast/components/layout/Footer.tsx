import Link from 'next/link';
import { Sparkles, Mail } from 'lucide-react';

const footerLinks = {
  services: [
    { href: '/services/destiny-map', label: 'Complete Destiny Map' },
    { href: '/services/annual-forecast', label: 'Annual Forecast' },
    { href: '/services/compatibility', label: 'Compatibility Reading' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/about#principles', label: 'Our Principles' },
    { href: '/contact', label: 'Contact' },
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary-950 text-white">
      <div className="section-shell py-14">
        <div className="mb-10 border-b border-primary-800/80 pb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary-300/70 mb-3">
            MysticEast Editorial Letter
          </p>
          <p className="max-w-3xl text-primary-100/85 leading-relaxed">
            A living publication at the intersection of Chinese metaphysics, reflective practice, and modern life design.
            Read it slowly. Revisit it often.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-900" />
              </div>
              <span className="font-serif text-xl font-bold">MysticEast</span>
            </Link>
            <p className="text-primary-200/80 mb-6 max-w-sm leading-relaxed">
              We publish guidance rooted in Eastern philosophy and translated for modern English readers seeking calm clarity.
            </p>
            <div className="flex items-center space-x-2 text-primary-200/70">
              <Mail className="w-4 h-4" />
              <a href="mailto:bazirili@foxmail.com" className="hover:text-gold-400 transition-colors">
                bazirili@foxmail.com
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-gold-400 uppercase tracking-[0.12em] text-xs">Readings</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200/70 hover:text-white transition-colors text-sm leading-relaxed"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-gold-400 uppercase tracking-[0.12em] text-xs">Journal</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-gold-400 uppercase tracking-[0.12em] text-xs">Policies</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-primary-200/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-800/80 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-primary-200/50 text-sm">
            © {new Date().getFullYear()} MysticEast. All rights reserved.
          </p>
          <p className="text-primary-200/50 text-sm mt-2 md:mt-0">
            East to West, depth to daily life.
          </p>
        </div>
      </div>
    </footer>
  );
}
