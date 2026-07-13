'use client';

import { useState } from 'react';
import PhotoGrid from '@/components/public/PhotoGrid';
import Lightbox from '@/components/public/Lightbox';
import type { IAlbum, IPhoto } from '@/types';

interface AlbumDetailClientProps {
  album: IAlbum;
  photos: IPhoto[];
}

export default function AlbumDetailClient({ album, photos }: AlbumDetailClientProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-medium text-text md:text-5xl">
          {album.name}
        </h1>
        {album.description && (
          <p className="mx-auto mt-4 max-w-2xl text-muted">{album.description}</p>
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
