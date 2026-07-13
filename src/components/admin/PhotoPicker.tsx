'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import type { IPhoto } from '@/types';

interface PhotoPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (photoId: string) => void;
  selectedId?: string;
}

export default function PhotoPicker({
  open,
  onClose,
  onSelect,
  selectedId,
}: PhotoPickerProps) {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    fetch('/api/admin/photos?status=published&limit=50')
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data.photos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="max-h-[80vh] w-full max-w-3xl overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="flex items-center justify-between border-b border-admin-border px-6 py-4">
          <h3 className="text-lg font-semibold text-admin-text">Select Cover Photo</h3>
          <button type="button" onClick={onClose}>
            <FiX className="h-5 w-5 text-admin-muted" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <p className="text-center text-admin-muted">Loading photos...</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {photos.map((photo) => (
                <button
                  key={photo._id}
                  type="button"
                  onClick={() => {
                    onSelect(photo._id);
                    onClose();
                  }}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                    selectedId === photo._id
                      ? 'border-admin-primary'
                      : 'border-transparent hover:border-admin-muted'
                  }`}
                >
                  <Image
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    sizes="150px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
