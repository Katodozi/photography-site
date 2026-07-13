'use client';

import { useCallback, useEffect, useState } from 'react';
import PhotoGrid from '@/components/public/PhotoGrid';
import Lightbox from '@/components/public/Lightbox';
import CategoryPill from '@/components/public/CategoryPill';
import LoadMore from '@/components/public/LoadMore';
import type { IPhoto, ICategory, ITag } from '@/types';

export default function GalleryPageClient() {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [tags, setTags] = useState<ITag[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setCategories(Array.isArray(data) ? data : []));
    fetch('/api/tags')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setTags(Array.isArray(data) ? data : []));
  }, []);

  const fetchPhotos = useCallback(
    async (pageNum: number, append = false) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pageNum),
        limit: '12',
        sort,
      });
      if (categoryFilter) params.set('category', categoryFilter);
      if (tagFilter) params.set('tag', tagFilter);

      const res = await fetch(`/api/photos?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Failed to load photos');
        if (!append) setPhotos([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      setError(null);
      const nextPhotos = Array.isArray(data.photos) ? data.photos : [];

      if (append) {
        setPhotos((prev) => [...prev, ...nextPhotos]);
      } else {
        setPhotos(nextPhotos);
      }
      setHasMore(data.pagination?.hasMore ?? false);
      setLoading(false);
    },
    [categoryFilter, tagFilter, sort]
  );

  useEffect(() => {
    setPage(1);
    fetchPhotos(1, false);
  }, [fetchPhotos]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPhotos(nextPage, true);
  };

  const selectClass =
    'rounded-full border border-border bg-surface px-4 py-2 text-sm text-text outline-none';

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <h1 className="font-heading text-4xl font-medium text-text md:text-5xl">
        Gallery
      </h1>
      <p className="mt-2 text-muted">Browse the full collection</p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <CategoryPill
            name="All"
            slug=""
            active={!categoryFilter}
            onClick={() => setCategoryFilter('')}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat._id}
              name={cat.name}
              slug={cat.slug}
              color={cat.color}
              active={categoryFilter === cat._id}
              onClick={() => setCategoryFilter(cat._id)}
            />
          ))}
        </div>

        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className={selectClass}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>{tag.name}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={selectClass}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>

      {error && (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}. Check that <code className="text-xs">MONGODB_URI</code> is set in{' '}
          <code className="text-xs">.env.local</code> and restart the dev server.
        </p>
      )}

      <div className="mt-10">
        <PhotoGrid
          photos={photos}
          columns={3}
          onPhotoClick={(_, index) => setLightboxIndex(index)}
        />
      </div>

      <LoadMore onClick={loadMore} loading={loading} hasMore={hasMore} />

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
