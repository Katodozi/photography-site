'use client';

import { useState } from 'react';
import PhotoGrid from '@/components/public/PhotoGrid';
import Lightbox from '@/components/public/Lightbox';
import type { IPhoto } from '@/types';

interface FeaturedGalleryProps {
  photos: IPhoto[];
}

export default function FeaturedGallery({ photos }: FeaturedGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!photos.length) {
    return (
      <p className="text-center text-muted py-8">
        No featured photos yet. Upload and mark photos as featured in the admin panel.
      </p>
    );
  }

  return (
    <>
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
    </>
  );
}
