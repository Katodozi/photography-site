import { FaInstagram } from 'react-icons/fa';

const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || '#';

export default function InstagramSection() {
  return (
    <section className="relative overflow-hidden border-y border-border bg-surface py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(143,168,136,0.08)_0%,_transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <FaInstagram className="mx-auto h-12 w-12 text-accent" />
        <h2 className="mt-6 section-heading">
          Visit My Instagram Gallery
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted leading-relaxed">
          This site grew from my Instagram — the original home for these photographs.
          Follow along for new captures, behind-the-scenes moments, and daily nature finds.
        </p>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-8 gap-3"
        >
          <FaInstagram className="h-5 w-5" />
          View on Instagram
        </a>
      </div>
    </section>
  );
}
