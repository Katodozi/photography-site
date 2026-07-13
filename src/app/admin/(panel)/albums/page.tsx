'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import type { IAlbum, IPhoto } from '@/types';

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState<IAlbum[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchAlbums = () => {
    fetch('/api/admin/albums')
      .then((r) => r.json())
      .then(setAlbums);
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/albums/${deleteId}`, { method: 'DELETE' });
      if (res.ok) fetchAlbums();
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div>
      <AdminHeader title="Albums" description="Organize photos into collections">
        <Link
          href="/admin/albums/new"
          className="rounded-lg bg-admin-primary px-4 py-2 text-sm font-medium text-admin-bg"
        >
          New Album
        </Link>
      </AdminHeader>

      <div className="overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-bg text-left text-admin-muted">
              <th className="p-3">Cover</th>
              <th className="p-3">Name</th>
              <th className="p-3">Photos</th>
              <th className="p-3">Status</th>
              <th className="p-3">Order</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {albums.map((album) => {
              const cover = album.coverPhoto as IPhoto | undefined;
              return (
                <tr key={album._id} className="border-b border-admin-border/50">
                  <td className="p-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded">
                      {cover ? (
                        <Image
                          src={cover.thumbnailUrl || cover.imageUrl}
                          alt={album.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="h-full w-full bg-admin-border" />
                      )}
                    </div>
                  </td>
                  <td className="p-3 font-medium text-admin-text">{album.name}</td>
                  <td className="p-3 text-admin-muted">{album.photoCount ?? 0}</td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        album.status === 'published'
                          ? 'bg-green-900/30 text-green-400'
                          : 'bg-yellow-900/30 text-yellow-400'
                      }`}
                    >
                      {album.status}
                    </span>
                  </td>
                  <td className="p-3 text-admin-muted">{album.order}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/albums/${album._id}/edit`}
                        className="text-admin-primary hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(album._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Album"
        message="Albums with photos cannot be deleted."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}
