export function HeroSparkline() {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <p className="text-xs font-medium text-muted">Your future in clearer focus</p>
      <svg viewBox="0 0 280 120" className="mt-4 h-28 w-full" aria-hidden="true">
        <path
          d="M8 92 C 48 88, 72 70, 104 64 C 136 58, 150 78, 176 52 C 202 26, 228 34, 272 16"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M8 92 C 48 88, 72 70, 104 64 C 136 58, 150 78, 176 52 C 202 26, 228 34, 272 16 V 112 H 8 Z"
          fill="url(#heroFill)"
          opacity="0.18"
        />
        <circle cx="272" cy="16" r="4" fill="var(--brand)" />
        <defs>
          <linearGradient id="heroFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
      <p className="mt-2 text-sm text-muted">Better tools. Brighter tomorrow.</p>
    </div>
  );
}
