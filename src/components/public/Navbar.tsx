'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/albums', label: 'Albums' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const onHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showSolid = scrolled || !onHero;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        showSolid ? 'glass-nav shadow-card' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={cn(
            'font-heading text-2xl font-medium tracking-wide transition-colors duration-300',
            showSolid ? 'text-text' : 'text-white'
          )}
        >
          Passing Through 2000s
        </Link>

        <ul className="flex items-center gap-8">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors duration-300',
                    showSolid
                      ? active
                        ? 'text-accent'
                        : 'text-muted hover:text-text'
                      : active
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-px w-full',
                        showSolid ? 'bg-accent' : 'bg-white/80'
                      )}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
