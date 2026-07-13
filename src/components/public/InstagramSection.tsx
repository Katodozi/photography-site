import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';

export default function InstagramSection() {
  return (
    <section className="bg-accent-light py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <FaInstagram className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-6 font-heading text-3xl font-medium text-text md:text-4xl">
          Visit My Instagram Gallery
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          This site grew from my Instagram — the original home for these photographs.
          Follow along for new captures, behind-the-scenes moments, and daily nature finds.
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-accent px-8 py-3 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-lg"
        >
          <FaInstagram className="h-5 w-5" />
          View on Instagram
        </a>
      </div>
    </section>
  );
}
