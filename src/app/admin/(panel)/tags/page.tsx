'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import type { ITag } from '@/types';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<ITag[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const fetchTags = () => {
    fetch('/api/admin/tags')
      .then((r) => r.json())
      .then(setTags);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setDeleteError('');

    const res = await fetch(`/api/admin/tags/${deleteId}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json();
      setDeleteError(data.error || 'Cannot delete tag');
    } else {
      fetchTags();
      setDeleteId(null);
    }
    setDeleting(false);
  };

  return (
    <div>
      <AdminHeader title="Tags" description="Manage photo tags" />

      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag._id}
            className="rounded-full bg-admin-surface px-4 py-2 text-sm text-admin-text"
            style={{ fontSize: `${Math.min(12 + tag.count * 2, 20)}px` }}
          >
            {tag.name} ({tag.count})
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-admin-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-bg text-left text-admin-muted">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Usage</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag._id} className="border-b border-admin-border/50">
                <td className="p-3 font-medium text-admin-text">{tag.name}</td>
                <td className="p-3 text-admin-muted">{tag.slug}</td>
                <td className="p-3 text-admin-muted">{tag.count}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => setDeleteId(tag._id)}
                    className={`hover:underline ${
                      tag.count > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Tag"
        message={
          deleteError ||
          'Tags in use cannot be deleted. Unused tags will be removed.'
        }
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeleteError(''); }}
        loading={deleting}
      />
    </div>
  );
}
