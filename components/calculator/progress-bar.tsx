export function ProgressBar({
  percent,
  leftLabel,
  rightLabel,
}: {
  percent: number;
  leftLabel?: string;
  rightLabel?: string;
}) {
  const width = Math.min(100, Math.max(0, percent));
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <div className="h-3 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${width}%` }} />
      </div>
      {leftLabel || rightLabel ? (
        <div className="mt-3 flex justify-between gap-4 text-sm text-muted">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
