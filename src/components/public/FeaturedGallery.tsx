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
      <div className="relative -mx-6 space-y-12 md:-mx-0">
        {groups.map(({ category, photos }, rowIndex) => (
          <div
            key={category._id}
            className="animate-stagger-in"
            style={{ animationDelay: `${rowIndex * 120}ms` }}
          >
            <div className="category-row-header">
              <span
                className="category-dot"
                style={{ color: category.color, backgroundColor: category.color }}
              />
              <h3 className="font-heading text-xl font-medium text-text md:text-2xl">
                {category.name}
              </h3>
              <span className="ml-2 text-xs text-muted">
                {photos.length} photo{photos.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="featured-scroll-row scrollbar-hide">
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
                      sizes="320px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p
                        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                        style={{ color: category.color }}
                      >
                        {category.name}
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
