'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSiteModals } from './SiteModalsProvider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/albums', label: 'Albums' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { openModal } = useSiteModals();
  const [scrolled, setScrolled] = useState(false);
  const onHero = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showSolid = scrolled || !onHero;

  const linkClass = (active: boolean) =>
    cn(
      'relative text-sm font-medium transition-colors duration-300',
      showSolid
        ? active
          ? 'text-accent'
          : 'text-muted hover:text-text'
        : active
          ? 'text-white'
          : 'text-white/70 hover:text-white'
    );

  const actionClass = showSolid
    ? 'text-xs font-medium text-muted transition-colors hover:text-accent'
    : 'text-xs font-medium text-white/70 transition-colors hover:text-white';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        showSolid ? 'glass-nav shadow-card' : 'bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className={cn(
            'font-heading text-xl font-medium tracking-wide transition-colors duration-300 md:text-2xl',
            showSolid ? 'text-text' : 'text-white'
          )}
        >
          Passing Through 2000s
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-6 sm:flex md:gap-8">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass(active)}>
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

          <div className="flex items-center gap-3 md:gap-4">
            <button type="button" onClick={() => openModal('collaborate')} className={actionClass}>
              Collaborate
            </button>
            <button type="button" onClick={() => openModal('support')} className={actionClass}>
              Support
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
