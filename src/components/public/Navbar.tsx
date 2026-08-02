'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSiteModals } from './SiteModalsProvider';
import NextImage from 'next/image';

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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const lightText = onHero && !scrolled;

  const linkClass = (active: boolean) =>
    cn(
      'relative text-sm font-medium transition-colors duration-300',
      lightText
        ? active
          ? 'text-white'
          : 'text-white/75 hover:text-white'
        : active
          ? 'text-accent'
          : 'text-muted hover:text-text'
    );

  const actionClass = lightText
    ? 'text-xs font-medium text-white/75 transition-colors hover:text-white'
    : 'text-xs font-medium text-muted transition-colors hover:text-accent';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'border-b border-white/5 bg-black/20 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center">
          <NextImage
            src="/OG-site-logo.png"
            alt="Passing Through 2000s"
            width={1200}
            height={80}
            className={cn(
              'h-24 w-80 object-contain object-left md:h-28 md:w-96',
              lightText && 'brightness-0 invert'
            )}
            priority
          />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <ul className="hidden items-center gap-5 sm:flex md:gap-6">
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
                          lightText ? 'bg-white/80' : 'bg-accent'
                        )}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
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
