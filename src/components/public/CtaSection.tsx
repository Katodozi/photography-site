import Image from 'next/image';
import Link from 'next/link';
import type { IPhoto } from '@/types';

interface CtaSectionProps {
  backgroundPhoto?: IPhoto | null;
}

export default function CtaSection({ backgroundPhoto }: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden py-32">
      {backgroundPhoto ? (
        <Image
          src={backgroundPhoto.imageUrl}
          alt={backgroundPhoto.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-hero-fallback" />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/50" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          A Living Archive
        </p>
        <h2 className="mt-4 font-heading text-4xl font-light leading-tight text-white md:text-5xl lg:text-6xl">
          Photographs from a time when the world moved slower,
        </h2>
        <p className="mx-auto mt-5 max-w-2xl font-heading text-xl font-light italic leading-relaxed text-white/75 md:text-2xl">
          and nature still had room to breathe.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/gallery" className="btn-primary">
            Browse the Collection
          </Link>
          <Link
            href="/albums"
            className="inline-flex items-center justify-center rounded-full border border-white/35 px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/70 hover:bg-white/10"
          >
            Explore Albums
          </Link>
        </div>
      </div>
    </section>
  );
}
