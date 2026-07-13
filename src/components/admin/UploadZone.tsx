'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { FiUploadCloud } from 'react-icons/fi';

export interface UploadResult {
  imageUrl: string;
  thumbnailUrl: string;
  blobPathname: string;
  width: number;
  height: number;
  fileSize: number;
}

interface UploadZoneProps {
  onUploadComplete: (result: UploadResult) => void;
  currentPreview?: string;
}

export default function UploadZone({ onUploadComplete, currentPreview }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(currentPreview || null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(
    async (file: File) => {
      const allowed = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP images are allowed');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be under 10MB');
        return;
      }

      setError('');
      setUploading(true);
      setProgress(0);

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      try {
        const img = new window.Image();
        const dimensions = await new Promise<{ width: number; height: number }>(
          (resolve) => {
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.src = localPreview;
          }
        );

        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/blob/upload',
        });

        setProgress(100);

        onUploadComplete({
          imageUrl: blob.url,
          thumbnailUrl: blob.url,
          blobPathname: blob.pathname,
          width: dimensions.width,
          height: dimensions.height,
          fileSize: file.size,
        });

        setPreview(blob.url);
      } catch (err) {
        console.error('Upload failed:', err);
        setError('Upload failed. Please try again.');
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [onUploadComplete]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? 'border-admin-primary bg-admin-primary/10'
            : 'border-admin-border bg-admin-bg hover:border-admin-muted'
        }`}
      >
        {preview ? (
          <div className="relative h-full w-full p-4">
            <Image
              src={preview}
              alt="Preview"
              width={600}
              height={400}
              className="mx-auto max-h-[280px] w-auto rounded-lg object-contain"
            />
          </div>
        ) : (
          <div className="p-8 text-center">
            <FiUploadCloud className="mx-auto h-12 w-12 text-admin-muted" />
            <p className="mt-4 text-sm text-admin-text">
              Drag and drop an image here
            </p>
            <p className="mt-1 text-xs text-admin-muted">
              or click to browse (JPEG, PNG, WebP — max 10MB)
            </p>
          </div>
        )}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFileSelect}
          className="absolute inset-0 cursor-pointer opacity-0"
          disabled={uploading}
        />
      </div>

      {uploading && (
        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-admin-border">
            <div
              className="h-full rounded-full bg-admin-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-admin-muted">Uploading... {progress}%</p>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}
