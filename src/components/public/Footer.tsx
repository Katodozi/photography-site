'use client';

import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import { FiMail, FiHeart } from 'react-icons/fi';
import { useSiteModals } from './SiteModalsProvider';

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';
const EMAIL = 'anuzbhattarai12@gmail.com';

export default function Footer() {
  const { openModal } = useSiteModals();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-heading text-2xl font-medium text-text">
              Passing Through 2000s
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              A curated archive of nature photography — quiet landscapes, wild
              moments, and light captured along the way.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Explore</p>
            <nav className="mt-4 flex flex-col gap-3">
              <Link href="/" className="text-sm text-muted transition-colors hover:text-accent">
                Home
              </Link>
              <Link href="/gallery" className="text-sm text-muted transition-colors hover:text-accent">
                Gallery
              </Link>
              <Link href="/albums" className="text-sm text-muted transition-colors hover:text-accent">
                Albums
              </Link>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
              >
                <FaInstagram className="h-4 w-4" />
                Instagram
              </a>
            </nav>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Connect</p>
            <div className="mt-4 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => openModal('collaborate')}
                className="inline-flex items-center gap-2 text-left text-sm text-muted transition-colors hover:text-accent"
              >
                <FiMail className="h-4 w-4" />
                Collaborate
              </button>
              <button
                type="button"
                onClick={() => openModal('support')}
                className="inline-flex items-center gap-2 text-left text-sm text-muted transition-colors hover:text-gold"
              >
                <FiHeart className="h-4 w-4" />
                Support the Journey
              </button>
              <a
                href={`mailto:${EMAIL}`}
                className="text-sm text-muted transition-colors hover:text-accent"
              >
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Passing Through 2000s. All rights reserved.</p>
          <p className="font-heading italic text-muted/80">
            Made with care for the wild and the quiet.
          </p>
        </div>
      </div>
    </footer>
  );
}
