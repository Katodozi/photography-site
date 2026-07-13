'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import PhotoPicker from '@/components/admin/PhotoPicker';
import type { IAlbum, IPhoto } from '@/types';
import { slugify } from '@/lib/utils';

export default function EditAlbumPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [album, setAlbum] = useState<IAlbum | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [coverPhoto, setCoverPhoto] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [order, setOrder] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/albums/${params.id}`)
      .then((r) => r.json())
      .then((data: IAlbum) => {
        setAlbum(data);
        setName(data.name);
        setSlug(data.slug);
        setDescription(data.description);
        setStatus(data.status);
        setOrder(data.order);
        const cover = data.coverPhoto as IPhoto | undefined;
        if (cover) {
          setCoverPhoto(cover._id);
          setCoverPreview(cover.imageUrl);
        }
      });
  }, [params.id]);

  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text outline-none focus:border-admin-primary';
  const labelClass = 'mb-1 block text-sm text-admin-muted';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/albums/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug, description, coverPhoto, status, order }),
    });

    if (res.ok) router.push('/admin/albums');
    setSaving(false);
  };

  if (!album) return <div className="text-admin-muted">Loading...</div>;

  return (
    <div>
      <AdminHeader title="Edit Album" description={album.name} />

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className={labelClass}>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Cover Photo</label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-admin-bg"
          >
            {coverPreview ? (
              <Image src={coverPreview} alt="Cover" width={96} height={96} className="object-cover" />
            ) : (
              <span className="text-sm text-admin-muted">Select</span>
            )}
          </button>
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input type="radio" checked={status === 'published'} onChange={() => setStatus('published')} />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm text-admin-text">
            <input type="radio" checked={status === 'draft'} onChange={() => setStatus('draft')} />
            Draft
          </label>
        </div>
        <div>
          <label className={labelClass}>Order</label>
          <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} className={inputClass} />
        </div>
        <button type="submit" disabled={saving} className="rounded-lg bg-admin-primary px-6 py-2.5 text-sm font-medium text-admin-bg disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
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
