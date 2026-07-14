'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminErrorBanner from '@/components/admin/AdminErrorBanner';
import type { IPhoto } from '@/types';

export default function AdminHomepagePage() {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [ctaId, setCtaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchSlots = () => {
    setLoading(true);
    fetch('/api/admin/homepage', { credentials: 'same-origin' })
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || 'Failed to load homepage settings');
          return;
        }
        setPhotos(Array.isArray(data.photos) ? data.photos : []);
        setHeroId(data.heroId);
        setCtaId(data.ctaId);
      })
      .catch(() => setError('Failed to load homepage settings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const assignSlot = async (photoId: string, slot: 'hero' | 'cta' | 'none') => {
    setSaving(photoId + slot);
    try {
      const res = await fetch('/api/admin/homepage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ photoId, slot }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to update slot');
        return;
      }
      setError(null);
      fetchSlots();
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <div className="text-admin-muted">Loading homepage settings...</div>;
  }

  return (
    <div>
      <AdminHeader
        title="Homepage Display"
        description="Choose which published photos appear in the hero and CTA sections"
      />

      {error && <AdminErrorBanner message={error} />}

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-4">
          <p className="text-xs uppercase tracking-wider text-admin-muted">Hero Background</p>
          <p className="mt-1 text-sm text-admin-text">
            {heroId ? 'Assigned' : 'Not set — using first featured photo'}
          </p>
        </div>
        <div className="rounded-xl border border-admin-border bg-admin-surface p-4">
          <p className="text-xs uppercase tracking-wider text-admin-muted">CTA Background</p>
          <p className="mt-1 text-sm text-admin-text">
            {ctaId ? 'Assigned' : 'Not set — using second featured photo'}
          </p>
        </div>
      </div>

      {photos.length === 0 ? (
        <p className="text-admin-muted">Publish photos first, then assign them here.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo) => {
            const isHero = heroId === photo._id;
            const isCta = ctaId === photo._id;
            const busy = saving?.startsWith(photo._id);

            return (
              <div
                key={photo._id}
                className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={photo.thumbnailUrl || photo.imageUrl}
                    alt={photo.title}
                    fill
                    className="object-cover"
                    sizes="250px"
                  />
                  {(isHero || isCta) && (
                    <div className="absolute left-2 top-2 flex gap-1">
                      {isHero && (
                        <span className="rounded-full bg-admin-primary px-2 py-0.5 text-xs font-medium text-admin-bg">
                          Hero
                        </span>
                      )}
                      {isCta && (
                        <span className="rounded-full bg-admin-accent px-2 py-0.5 text-xs font-medium text-admin-bg">
                          CTA
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm font-medium text-admin-text">{photo.title}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy || isHero}
                      onClick={() => assignSlot(photo._id, 'hero')}
                      className="rounded-lg bg-admin-primary px-3 py-1.5 text-xs font-medium text-admin-bg disabled:opacity-50"
                    >
                      Set Hero
                    </button>
                    <button
                      type="button"
                      disabled={busy || isCta}
                      onClick={() => assignSlot(photo._id, 'cta')}
                      className="rounded-lg border border-admin-accent px-3 py-1.5 text-xs text-admin-accent disabled:opacity-50"
                    >
                      Set CTA
                    </button>
                    {(isHero || isCta) && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => assignSlot(photo._id, 'none')}
                        className="rounded-lg px-3 py-1.5 text-xs text-admin-muted hover:text-red-400"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
