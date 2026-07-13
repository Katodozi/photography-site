'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import type { IPhoto } from '@/types';
import ConfirmModal from './ConfirmModal';

interface PhotoTableProps {
  photos: IPhoto[];
  selected: string[];
  onSelectChange: (ids: string[]) => void;
  onRefresh: () => void;
}

export default function PhotoTable({
  photos,
  selected,
  onSelectChange,
  onRefresh,
}: PhotoTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toggleAll = () => {
    if (selected.length === photos.length) {
      onSelectChange([]);
    } else {
      onSelectChange(photos.map((p) => p._id));
    }
  };

  const toggleOne = (id: string) => {
    if (selected.includes(id)) {
      onSelectChange(selected.filter((s) => s !== id));
    } else {
      onSelectChange([...selected, id]);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/photos/${deleteId}`, { method: 'DELETE' });
      onRefresh();
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-bg text-left text-admin-muted">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={selected.length === photos.length && photos.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Title</th>
              <th className="p-3">Album</th>
              <th className="p-3">Category</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {photos.map((photo) => (
              <tr
                key={photo._id}
                className="border-b border-admin-border/50 hover:bg-admin-bg/50"
              >
                <td className="p-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(photo._id)}
                    onChange={() => toggleOne(photo._id)}
                  />
                </td>
                <td className="p-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded">
                    <Image
                      src={photo.thumbnailUrl || photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                </td>
                <td className="p-3 font-medium text-admin-text">{photo.title}</td>
                <td className="p-3 text-admin-muted">
                  {typeof photo.album === 'object' && photo.album
                    ? photo.album.name
                    : '—'}
                </td>
                <td className="p-3 text-admin-muted">
                  {typeof photo.category === 'object' && photo.category
                    ? photo.category.name
                    : '—'}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      photo.status === 'published'
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-yellow-900/30 text-yellow-400'
                    }`}
                  >
                    {photo.status}
                  </span>
                </td>
                <td className="p-3 text-admin-muted">
                  {photo.featured ? '★' : '—'}
                </td>
                <td className="p-3 text-admin-muted">
                  {new Date(photo.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/photos/${photo._id}/edit`}
                      className="rounded p-1.5 text-admin-muted hover:bg-admin-bg hover:text-admin-primary"
                    >
                      <FiEdit2 className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteId(photo._id)}
                      className="rounded p-1.5 text-admin-muted hover:bg-admin-bg hover:text-red-400"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Photo"
        message="This will permanently delete the photo and its file from storage."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </>
  );
}
