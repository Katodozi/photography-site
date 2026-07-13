'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import UploadZone, { type UploadResult } from './UploadZone';
import TagInput from './TagInput';
import type { IAlbum, ICategory, IPhoto } from '@/types';

interface PhotoFormProps {
  initialData?: IPhoto;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  submitLabel?: string;
}

export default function PhotoForm({
  initialData,
  onSubmit,
  submitLabel = 'Save Photo',
}: PhotoFormProps) {
  const [uploadData, setUploadData] = useState<UploadResult | null>(
    initialData
      ? {
          imageUrl: initialData.imageUrl,
          thumbnailUrl: initialData.thumbnailUrl,
          blobPathname: initialData.blobPathname,
          width: initialData.width,
          height: initialData.height,
          fileSize: initialData.fileSize,
        }
      : null
  );

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [album, setAlbum] = useState(
    typeof initialData?.album === 'object'
      ? initialData.album._id
      : initialData?.album || ''
  );
  const [category, setCategory] = useState(
    typeof initialData?.category === 'object'
      ? initialData.category._id
      : initialData?.category || ''
  );
  const [tags, setTags] = useState<string[]>(
    initialData?.tags?.map((t) => (typeof t === 'object' ? t.name : t)) || []
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [dateTaken, setDateTaken] = useState(
    initialData?.dateTaken
      ? new Date(initialData.dateTaken).toISOString().split('T')[0]
      : ''
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState<'published' | 'draft'>(
    initialData?.status || 'draft'
  );

  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/albums').then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ]).then(([albumsData, categoriesData]) => {
      setAlbums(albumsData);
      setCategories(categoriesData);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!initialData && !uploadData) {
      setError('Please upload an image first');
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        title,
        description,
        album: album || undefined,
        category: category || undefined,
        tagNames: tags,
        location,
        dateTaken: dateTaken || undefined,
        featured,
        status,
        ...(uploadData && !initialData ? uploadData : {}),
      });
    } catch {
      setError('Failed to save photo');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text outline-none focus:border-admin-primary';
  const labelClass = 'mb-1 block text-sm text-admin-muted';

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          {initialData ? (
            <div className="overflow-hidden rounded-xl border border-admin-border">
              <Image
                src={initialData.imageUrl}
                alt={initialData.title}
                width={initialData.width || 600}
                height={initialData.height || 400}
                className="w-full object-contain"
              />
            </div>
          ) : (
            <UploadZone
              onUploadComplete={setUploadData}
              currentPreview={uploadData?.imageUrl}
            />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Album</label>
              <select
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {albums.map((a) => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputClass}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Tags</label>
            <TagInput tags={tags} onChange={setTags} />
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Chitwan National Park, Nepal"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Date Taken</label>
            <input
              type="date"
              value={dateTaken}
              onChange={(e) => setDateTaken(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-admin-text">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded"
              />
              Featured
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-admin-text">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-admin-text">
                <input
                  type="radio"
                  name="status"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                />
                Draft
              </label>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-admin-primary px-6 py-2.5 text-sm font-medium text-admin-bg transition-colors hover:bg-admin-primary/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
