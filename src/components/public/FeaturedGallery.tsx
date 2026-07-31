'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Lightbox from '@/components/public/Lightbox';
import type { ICategory, IPhoto } from '@/types';

interface FeaturedGalleryProps {
  photos: IPhoto[];
}

function getCategoryInfo(photo: IPhoto): { name: string; slug: string; color: string } {
  if (typeof photo.category === 'object' && photo.category) {
    const cat = photo.category as ICategory;
    return {
      name: cat.name || 'Uncategorized',
      slug: cat.slug || '',
      color: cat.color || '#5ed33d',
    };
  }
  return { name: 'Uncategorized', slug: '', color: '#5ed33d' };
}

export default function FeaturedGallery({ photos }: FeaturedGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, { info: ReturnType<typeof getCategoryInfo>; photos: IPhoto[] }>();

    for (const photo of photos) {
      const info = getCategoryInfo(photo);
      const key = info.slug || info.name;
      const existing = map.get(key);
      if (existing) {
        existing.photos.push(photo);
      } else {
        map.set(key, { info, photos: [photo] });
      }
    }

    return Array.from(map.values());
  }, [photos]);

  if (!photos.length) {
    return (
      <p className="py-12 text-center text-muted">
        No featured photos yet. Upload and mark photos as featured in the admin panel.
      </p>
    );
  }

  return (
    <>
      <div className="relative space-y-12">
        {grouped.map(({ info, photos: rowPhotos }, rowIndex) => (
          <div
            key={info.slug || info.name}
            className="animate-stagger-in"
            style={{ animationDelay: `${rowIndex * 120}ms` }}
          >
            <div className="category-row-header">
              <span
                className="category-dot"
                style={{ color: info.color, backgroundColor: info.color }}
              />
              <h3 className="font-heading text-xl font-medium text-text md:text-2xl">
                {info.name}
              </h3>
              {info.slug && (
                <Link
                  href={`/categories/${info.slug}`}
                  className="ml-auto text-xs font-medium uppercase tracking-wider text-accent transition-colors hover:text-gold"
                >
                  View all →
                </Link>
              )}
            </div>

            <div className="featured-scroll-row scrollbar-hide">
              {rowPhotos.map((photo) => {
                const globalIndex = photos.indexOf(photo);
                return (
                  <button
                    key={photo._id}
                    type="button"
                    onClick={() => setLightboxIndex(globalIndex)}
                    className="featured-card group text-left"
                  >
                    <div className="featured-card-image">
                      <Image
                        src={photo.thumbnailUrl || photo.imageUrl}
                        alt={photo.title}
                        fill
                        className="object-cover"
                        sizes="320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p
                          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: info.color }}
                        >
                          {info.name}
                        </p>
                        <h4 className="mt-1 font-heading text-lg font-medium text-white">
                          {photo.title}
                        </h4>
                        {photo.location && (
                          <p className="mt-0.5 text-xs text-white/60">{photo.location}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
