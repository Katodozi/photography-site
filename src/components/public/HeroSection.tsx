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
          className="object-cover"
          sizes="100vw"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-accent-light to-surface" />
      )}

      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 px-6 text-center text-white">
        <h1 className="font-heading text-5xl font-light tracking-wide md:text-7xl lg:text-8xl">
          Passing Through 2000s
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-light text-white/90 md:text-xl">
          A quiet archive of nature — forests, mountains, and light
          captured along the way.
        </p>
      </div>
    </section>
  );
}
