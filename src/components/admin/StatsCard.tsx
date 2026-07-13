interface StatsCardProps {
  label: string;
  value: number | string;
  accent?: boolean;
}

export default function StatsCard({ label, value, accent }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
      <p className="text-sm text-admin-muted">{label}</p>
      <p
        className={`mt-1 text-3xl font-semibold ${
          accent ? 'text-admin-accent' : 'text-admin-text'
        }`}
      >
        {value}
      </p>
    </div>
  );
}
