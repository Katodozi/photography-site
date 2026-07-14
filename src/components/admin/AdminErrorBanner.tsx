'use client';

interface AdminErrorBannerProps {
  message: string;
}

export default function AdminErrorBanner({ message }: AdminErrorBannerProps) {
  return (
    <div className="mb-6 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
      {message}
      {message.includes('MONGODB') || message.includes('MongoDB') || message.includes('Database') ? (
        <p className="mt-2 text-xs text-red-400/80">
          On Vercel: set <code className="text-red-300">MONGODB_URI</code> in Environment Variables
          and allow network access in MongoDB Atlas (0.0.0.0/0).
        </p>
      ) : null}
    </div>
  );
}
