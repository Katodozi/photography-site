'use client';

import { useEffect, useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { formatBytes } from '@/lib/utils';

export default function AdminSettingsPage() {
  const [blobUsage, setBlobUsage] = useState({ count: 0, totalSize: 0 });

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => setBlobUsage(data.blobUsage || { count: 0, totalSize: 0 }));
  }, []);

  return (
    <div>
      <AdminHeader title="Settings" description="Site configuration" />

      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
          <h3 className="text-lg font-semibold text-admin-text">Site Info</h3>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm text-admin-muted">Site Name</label>
              <p className="text-admin-text">Passing Through 2000s</p>
            </div>
            <div>
              <label className="text-sm text-admin-muted">Site URL</label>
              <p className="text-admin-text">
                {process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}
              </p>
            </div>
            <div>
              <label className="text-sm text-admin-muted">Instagram</label>
              <p className="text-admin-text">
                {process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'Not configured'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
          <h3 className="text-lg font-semibold text-admin-text">Blob Storage</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-admin-muted">
              Files stored: <span className="text-admin-text">{blobUsage.count}</span>
            </p>
            <p className="text-sm text-admin-muted">
              Total size: <span className="text-admin-text">{formatBytes(blobUsage.totalSize)}</span>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-admin-border bg-admin-surface p-6">
          <h3 className="text-lg font-semibold text-admin-text">Admin Credentials</h3>
          <p className="mt-2 text-sm text-admin-muted">
            Admin username and password are configured via environment variables
            (ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET). Update them in your
            .env.local file or Vercel project settings.
          </p>
        </div>
      </div>
    </div>
  );
}
