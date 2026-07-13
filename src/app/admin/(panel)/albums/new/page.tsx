'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import PhotoPicker from '@/components/admin/PhotoPicker';
import { slugify } from '@/lib/utils';

export default function NewAlbumPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [order, setOrder] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [saving, setSaving] = useState(false);

  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text outline-none focus:border-admin-primary';
  const labelClass = 'mb-1 block text-sm text-admin-muted';

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(slugify(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch('/api/admin/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, description, coverPhoto, status, order }),
    });

    if (res.ok) {
      router.push('/admin/albums');
    }
    setSaving(false);
  };

  return (
    <div>
      <AdminHeader title="New Album" description="Create a new photo album" />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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

        <div>
          <label className={labelClass}>Cover Photo</label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-admin-bg text-sm text-admin-muted hover:border-admin-primary"
          >
            {coverPreview ? (
              <Image src={coverPreview} alt="Cover" width={96} height={96} className="object-cover" />
            ) : (
              'Select'
            )}
          </button>
        </div>

        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="radio"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input
              type="radio"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
            />
            Draft
          </label>
        </div>

        <div>
          <label className={labelClass}>Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-admin-primary px-6 py-2.5 text-sm font-medium text-admin-bg disabled:opacity-50"
        >
          {saving ? 'Creating...' : 'Create Album'}
        </button>
      </form>

      <PhotoPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedId={coverPhoto}
        onSelect={(id) => {
          setCoverPhoto(id);
          fetch(`/api/admin/photos/${id}`)
            .then((r) => r.json())
            .then((p) => setCoverPreview(p.imageUrl));
        }}
      />
    </div>
  );
}
