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
      className="photo-frame group relative w-full"
    >
      <div className="relative aspect-auto overflow-hidden">
        <Image
          src={photo.thumbnailUrl || photo.imageUrl}
          alt={photo.title}
          width={photo.width || 800}
          height={photo.height || 600}
          className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 opacity-0 transition-all duration-500 group-hover:opacity-100">
        <h3 className="font-heading text-lg font-medium text-white translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
          {photo.title}
        </h3>
        {photo.location && (
          <p className="text-sm text-white/70 translate-y-2 transition-transform duration-500 delay-75 group-hover:translate-y-0">
            {photo.location}
          </p>
        )}
      </div>
    </button>
  );
}
