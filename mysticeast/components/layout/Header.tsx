'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/services', label: 'Services' },
  { href: '/calculator', label: 'Calculator' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100/90 bg-cream/92 backdrop-blur-md">
      <div className="section-shell">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-700 to-primary-900 shadow-soft flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-gold-400" />
            </div>
            <span className="font-serif text-xl font-bold text-primary-950">
              MysticEast
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-900 underline decoration-primary-300 decoration-2 underline-offset-8'
                    : 'text-charcoal/70 hover:text-primary-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/calculator">
              <Button size="sm">Get Free Reading</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-charcoal/70 hover:text-primary-900 rounded-lg hover:bg-primary-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-100/90">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-primary-900'
                      : 'text-charcoal/70 hover:text-primary-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/calculator" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Get Free Reading</Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
