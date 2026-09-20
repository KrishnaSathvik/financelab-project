export function formatMoney(value: number | null, options?: { compact?: boolean; cents?: boolean }) {
  if (value === null || !Number.isFinite(value)) return "—";

  const abs = Math.abs(value);
  if (options?.compact && abs >= 1_000_000) {
    const sign = value < 0 ? "-" : "";
    return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  }

  const digits = options?.cents ? 2 : abs >= 100 ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatPercent(value: number | null, digits = 1) {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(digits)}%`;
}

export function formatHours(value: number) {
  if (value === null || !Number.isFinite(value)) return "—";
  return `$${value.toFixed(2)}/hr`;
}

export function formatDurationMonths(months: number) {
  if (!Number.isFinite(months) || months > 700) return "50+ yrs";
  const years = Math.floor(months / 12);
  const remaining = Math.round(months % 12);
  if (years > 0 && remaining > 0) return `${years}y ${remaining}m`;
  if (years > 0) return `${years} yr${years > 1 ? "s" : ""}`;
  return `${remaining} mo`;
}

export function formatDurationLong(months: number) {
  if (!Number.isFinite(months) || months > 700) return "50+ years";
  const years = Math.floor(months / 12);
  const remaining = Math.round(months % 12);
  const yearPart = years === 1 ? "1 year" : years > 0 ? `${years} years` : "";
  const monthPart = remaining === 1 ? "1 month" : remaining > 0 ? `${remaining} months` : "";
  if (yearPart && monthPart) return `${yearPart} ${monthPart}`;
  return yearPart || monthPart || "0 months";
}

export function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function formatMultiplier(value: number) {
  if (value === null || !Number.isFinite(value)) return "—";
  return `${value.toFixed(2)}x`;
}
