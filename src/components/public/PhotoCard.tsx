'use client';

import Image from 'next/image';
import type { IPhoto } from '@/types';

interface PhotoCardProps {
  photo: IPhoto;
  onClick?: () => void;
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-lg bg-surface"
    >
      <div className="relative aspect-auto">
        <Image
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={photo.title}
          width={photo.width || 800}
          height={photo.height || 600}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="font-heading text-lg font-medium text-white">{photo.title}</h3>
        {photo.location && (
          <p className="text-sm text-white/80">{photo.location}</p>
        )}
      </div>
    </button>
  );
}
