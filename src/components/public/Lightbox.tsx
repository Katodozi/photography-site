'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { IoClose, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import type { IPhoto, ITag } from '@/types';
import { formatDate } from '@/lib/utils';

interface LightboxProps {
  photos: IPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: LightboxProps) {
  const photo = photos[currentIndex];

  const handlePrev = useCallback(() => {
    onNavigate(currentIndex > 0 ? currentIndex - 1 : photos.length - 1);
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex < photos.length - 1 ? currentIndex + 1 : 0);
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, handlePrev, handleNext]);

  if (!photo) return null;

  const tags = photo.tags as ITag[];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Close"
      >
        <IoClose className="h-8 w-8" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        className="absolute left-4 z-10 rounded-full p-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Previous"
      >
        <IoChevronBack className="h-8 w-8" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); handleNext(); }}
        className="absolute right-4 z-10 rounded-full p-3 text-white/80 transition-colors hover:bg-white/10 hover:text-white md:right-16"
        aria-label="Next"
      >
        <IoChevronForward className="h-8 w-8" />
      </button>

      <div
        className="flex max-h-[90vh] max-w-6xl flex-col items-center px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[70vh] w-full">
          <Image
            src={photo.imageUrl}
            alt={photo.title}
            width={photo.width || 1200}
            height={photo.height || 800}
            className="mx-auto max-h-[70vh] w-auto object-contain transition-opacity duration-300"
            priority
          />
        </div>

        <div className="mt-6 max-w-2xl text-center text-white">
          <h2 className="font-heading text-2xl font-medium">{photo.title}</h2>
          {photo.description && (
            <p className="mt-2 text-sm text-white/70">{photo.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            {photo.location && <span>{photo.location}</span>}
            {photo.dateTaken && <span>{formatDate(photo.dateTaken)}</span>}
          </div>
          {tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {tags.map((tag) => (
                <span
                  key={typeof tag === 'string' ? tag : tag._id}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {typeof tag === 'string' ? tag : tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
