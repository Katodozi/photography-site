'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import StatsCard from '@/components/admin/StatsCard';

interface DashboardData {
  stats: {
    totalPhotos: number;
    publishedPhotos: number;
    draftPhotos: number;
    featuredPhotos: number;
    totalAlbums: number;
    totalCategories: number;
    totalViews: number;
  };
  recentPhotos: Array<{
    _id: string;
    title: string;
    thumbnailUrl: string;
    imageUrl: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="text-admin-muted">Loading dashboard...</div>;
  }

  const { stats, recentPhotos } = data;

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        description="Overview of your photography site"
      />

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <StatsCard label="Total Photos" value={stats.totalPhotos} />
        <StatsCard label="Published" value={stats.publishedPhotos} accent />
        <StatsCard label="Draft" value={stats.draftPhotos} />
        <StatsCard label="Featured" value={stats.featuredPhotos} />
        <StatsCard label="Albums" value={stats.totalAlbums} />
        <StatsCard label="Categories" value={stats.totalCategories} />
        <StatsCard label="Total Views" value={stats.totalViews} />
      </div>

      <div className="mb-8 flex gap-3">
        <Link
          href="/admin/photos/upload"
          className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-medium text-admin-bg hover:bg-admin-primary/90"
        >
          Upload Photo
        </Link>
        <Link
          href="/admin/albums/new"
          className="rounded-lg border border-admin-border px-4 py-2 text-sm text-admin-text hover:bg-admin-surface"
        >
          New Album
        </Link>
        <Link
          href="/admin/categories"
          className="rounded-lg border border-admin-border px-4 py-2 text-sm text-admin-text hover:bg-admin-surface"
        >
          New Category
        </Link>
      </div>

      <h2 className="mb-4 text-lg font-semibold text-admin-text">Recent Uploads</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {recentPhotos.map((photo) => (
          <Link
            key={photo._id}
            href={`/admin/photos/${photo._id}/edit`}
            className="group overflow-hidden rounded-lg border border-admin-border"
          >
            <div className="relative aspect-square">
              <Image
                src={photo.thumbnailUrl || photo.imageUrl}
                alt={photo.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="150px"
              />
            </div>
            <p className="truncate p-2 text-xs text-admin-muted">{photo.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
