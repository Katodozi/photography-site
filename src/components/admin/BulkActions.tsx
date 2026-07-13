'use client';

interface BulkActionsProps {
  selected: string[];
  onAction: (action: string) => void;
  loading?: boolean;
}

export default function BulkActions({ selected, onAction, loading }: BulkActionsProps) {
  if (!selected.length) return null;

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-admin-border bg-admin-surface px-4 py-3">
      <span className="text-sm text-admin-muted">
        {selected.length} selected
      </span>
      <div className="flex gap-2">
        {['publish', 'draft', 'feature', 'unfeature', 'delete'].map((action) => (
          <button
            key={action}
            type="button"
            disabled={loading}
            onClick={() => onAction(action)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-colors disabled:opacity-50 ${
              action === 'delete'
                ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                : 'bg-admin-bg text-admin-text hover:bg-admin-border'
            }`}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
