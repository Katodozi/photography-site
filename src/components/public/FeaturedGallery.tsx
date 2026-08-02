'use client';

import { useState } from 'react';
import Image from 'next/image';
import Lightbox from '@/components/public/Lightbox';
import type { CategoryPhotoGroup } from '@/lib/data';
import type { IPhoto } from '@/types';

interface FeaturedGalleryProps {
  groups: CategoryPhotoGroup[];
}

export default function FeaturedGallery({ groups }: FeaturedGalleryProps) {
  const [lightboxPhotos, setLightboxPhotos] = useState<IPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!groups.length) {
    return (
      <p className="py-12 text-center text-muted">
        No published photos yet. Upload photos and assign categories in the admin panel.
      </p>
    );
  }

  const openLightbox = (rowPhotos: IPhoto[], photo: IPhoto) => {
    setLightboxPhotos(rowPhotos);
    setLightboxIndex(rowPhotos.findIndex((p) => p._id === photo._id));
  };

  return (
    <>
      <div className="relative space-y-10">
        {groups.map(({ category, photos }, rowIndex) => (
          <div
            key={category._id}
            className="animate-stagger-in"
            style={{ animationDelay: `${rowIndex * 100}ms` }}
          >
            <div className="category-row-header">
              <span
                className="category-dot shrink-0"
                style={{ color: category.color, backgroundColor: category.color }}
              />
              <h3 className="font-heading text-lg font-medium text-text md:text-xl">
                {category.name}
              </h3>
              <span className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">
                {photos.length} photos · scroll →
              </span>
            </div>

            <div className="featured-scroll-row">
              {photos.map((photo) => (
                <button
                  key={photo._id}
                  type="button"
                  onClick={() => openLightbox(photos, photo)}
                  className="featured-card group text-left"
                >
                  <div className="featured-card-image">
                    <Image
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-3.5 transition-transform duration-300 group-hover:translate-y-0">
                      <h4 className="font-heading text-base font-medium leading-snug text-white">
                        {photo.title}
                      </h4>
                      {photo.location && (
                        <p className="mt-0.5 text-[11px] text-white/55">{photo.location}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && lightboxPhotos.length > 0 && (
        <Lightbox
          photos={lightboxPhotos}
          currentIndex={lightboxIndex}
          onClose={() => {
            setLightboxIndex(null);
            setLightboxPhotos([]);
          }}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
