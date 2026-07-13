import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="font-heading text-xl font-medium text-text">
              Passing Through 2000s
            </p>
            <p className="mt-1 text-sm text-muted">
              Nature photography from a quieter time
            </p>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm text-muted hover:text-accent">
              Home
            </Link>
            <Link href="/gallery" className="text-sm text-muted hover:text-accent">
              Gallery
            </Link>
            <Link href="/albums" className="text-sm text-muted hover:text-accent">
              Albums
            </Link>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted hover:text-accent"
            >
              <FaInstagram className="h-4 w-4" />
              Instagram
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} Passing Through 2000s. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
