'use client';

import { useState } from 'react';
import PhotoGrid from '@/components/public/PhotoGrid';
import Lightbox from '@/components/public/Lightbox';
import type { ICategory, IPhoto } from '@/types';

interface CategoryDetailClientProps {
  category: ICategory;
  photos: IPhoto[];
}

export default function CategoryDetailClient({
  category,
  photos,
}: CategoryDetailClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <span
          className="mb-4 inline-block rounded-full px-4 py-1 text-sm text-white"
          style={{ backgroundColor: category.color }}
        >
          {category.name}
        </span>
        <h1 className="font-heading text-4xl font-medium text-text md:text-5xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mx-auto mt-4 max-w-2xl text-muted">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-muted">
          {photos.length} photo{photos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <PhotoGrid
        photos={photos}
        columns={3}
        onPhotoClick={(_, index) => setLightboxIndex(index)}
      />

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
