import Image from 'next/image';
import type { IPhoto } from '@/types';

interface HeroSectionProps {
  featuredPhoto?: IPhoto | null;
}

export default function HeroSection({ featuredPhoto }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {featuredPhoto ? (
        <Image
          src={featuredPhoto.imageUrl}
          alt={featuredPhoto.title}
          fill
          priority
          className="object-cover scale-105 animate-fade-in"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-hero-fallback" />
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-bg" />

      <div className="relative z-10 px-6 text-center text-white animate-fade-up">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-white/60">
          Nature Photography
        </p>
        <h1 className="font-heading text-5xl font-light tracking-wide md:text-7xl lg:text-8xl">
          Passing Through 2000s
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-white/80 md:text-xl">
          A quiet archive of nature — forests, mountains, and light
          captured along the way.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <a href="/gallery" className="btn-primary">
            Explore Gallery
          </a>
          <a
            href="/albums"
            className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
          >
            View Albums
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="h-8 w-px bg-gradient-to-b from-transparent to-white/40" />
      </div>
    </section>
  );
}
