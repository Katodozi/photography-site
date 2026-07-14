'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminErrorBanner from '@/components/admin/AdminErrorBanner';
import PhotoTable from '@/components/admin/PhotoTable';
import BulkActions from '@/components/admin/BulkActions';
import type { IPhoto, IAlbum, ICategory } from '@/types';

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bulkLoading, setBulkLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState('all');
  const [albumFilter, setAlbumFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState('');

  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (albumFilter) params.set('album', albumFilter);
    if (categoryFilter) params.set('category', categoryFilter);
    if (featuredFilter) params.set('featured', featuredFilter);

    const res = await fetch(`/api/admin/photos?${params}`);
    const data = await res.json();
    setPhotos(data.photos || []);
    setTotalPages(data.pagination?.totalPages || 1);
    setLoading(false);
  }, [page, statusFilter, albumFilter, categoryFilter, featuredFilter]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/albums').then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ]).then(([a, c]) => {
      setAlbums(a);
      setCategories(c);
    });
  }, []);

  const handleBulkAction = async (action: string) => {
    setBulkLoading(true);
    await fetch('/api/admin/photos', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected, action }),
    });
    setSelected([]);
    await fetchPhotos();
    setBulkLoading(false);
  };

  const selectClass =
    'rounded-lg border border-admin-border bg-admin-bg px-3 py-2 text-sm text-admin-text';

  return (
    <div>
      <AdminHeader title="All Photos" description="Manage your photo library">
        <Link
          href="/admin/photos/upload"
          className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-medium text-admin-bg"
        >
          Upload New
        </Link>
      </AdminHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className={selectClass}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select
          value={albumFilter}
          onChange={(e) => { setAlbumFilter(e.target.value); setPage(1); }}
          className={selectClass}
        >
          <option value="">All Albums</option>
          {albums.map((a) => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className={selectClass}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        <select
          value={featuredFilter}
          onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1); }}
          className={selectClass}
        >
          <option value="">All Featured</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
      </div>

      <BulkActions
        selected={selected}
        onAction={handleBulkAction}
        loading={bulkLoading}
      />

      {loading ? (
        <p className="text-admin-muted">Loading...</p>
      ) : (
        <PhotoTable
          photos={photos}
          selected={selected}
          onSelectChange={setSelected}
          onRefresh={fetchPhotos}
        />
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="rounded-lg border border-admin-border px-4 py-2 text-sm text-admin-text disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-admin-muted">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="rounded-lg border border-admin-border px-4 py-2 text-sm text-admin-text disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
