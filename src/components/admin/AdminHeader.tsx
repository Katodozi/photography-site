interface AdminHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export default function AdminHeader({ title, description, children }: AdminHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-admin-text">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-admin-muted">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
