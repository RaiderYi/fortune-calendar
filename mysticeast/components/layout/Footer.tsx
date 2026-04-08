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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-900" />
              </div>
              <span className="font-serif text-xl font-bold">MysticEast</span>
            </Link>
            <p className="text-primary-200/70 mb-6 max-w-sm">
              Bridging ancient Chinese wisdom with modern self-discovery. 
              Discover your elemental nature and the cycles that shape your path.
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
            <h3 className="font-semibold mb-4 text-gold-400">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
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

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-gold-400">Company</h3>
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
            <h3 className="font-semibold mb-4 text-gold-400">Legal</h3>
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
        <div className="border-t border-primary-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-primary-200/50 text-sm">
            © {new Date().getFullYear()} MysticEast. All rights reserved.
          </p>
          <p className="text-primary-200/50 text-sm mt-2 md:mt-0">
            Ancient wisdom for modern seekers
          </p>
        </div>
      </div>
    </footer>
  );
}
