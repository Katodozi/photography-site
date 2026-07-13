'use client';

import PhotoCard from './PhotoCard';
import type { IPhoto } from '@/types';
import { cn } from '@/lib/utils';

interface PhotoGridProps {
  photos: IPhoto[];
  columns?: 1 | 2 | 3;
  onPhotoClick?: (photo: IPhoto, index: number) => void;
}

export default function PhotoGrid({
  photos,
  columns = 3,
  onPhotoClick,
}: PhotoGridProps) {
  if (!photos?.length) {
    return (
      <div className="py-16 text-center text-muted">
        <p>No photos to display yet.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'masonry-grid',
        columns === 1 && 'masonry-1',
        columns === 2 && 'masonry-2',
        columns === 3 && 'masonry-3'
      )}
    >
      {photos.map((photo, index) => (
        <PhotoCard
          key={photo._id}
          photo={photo}
          onClick={() => onPhotoClick?.(photo, index)}
        />
      ))}
    </div>
  );
}
