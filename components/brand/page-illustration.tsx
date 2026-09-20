export function PageIllustration({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="relative hidden min-w-[220px] overflow-hidden rounded-3xl border border-border bg-card px-5 py-4 lg:block">
      <p className="max-w-[180px] text-sm font-medium leading-6 text-foreground">{title}</p>
      {subtitle ? <p className="mt-1 max-w-[180px] text-xs leading-5 text-muted">{subtitle}</p> : null}
      <svg viewBox="0 0 180 90" className="mt-3 h-20 w-full" aria-hidden="true">
        <path d="M8 78 L48 48 L78 62 L118 28 L172 44" fill="none" stroke="var(--brand-border)" strokeWidth="8" />
        <path d="M8 78 L48 48 L78 62 L118 28 L172 44 V82 H8 Z" fill="var(--surface-subtle)" />
        <circle cx="154" cy="18" r="7" fill="var(--brand)" />
        <path d="M154 11 V4" stroke="var(--brand)" strokeWidth="2" />
      </svg>
    </div>
  );
}
