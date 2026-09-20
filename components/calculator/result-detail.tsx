"use client";

import { useId, useState } from "react";
import { formatMoney } from "@/lib/format";

export function ResultDetailSection({
  title,
  description,
  kicker,
  actions,
  children,
}: {
  title: string;
  description?: string;
  kicker?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="result-detail">
      <div className="result-detail-head">
        <div>
          <h3 className="result-detail-title">{title}</h3>
          {kicker ? <p className="result-detail-kicker">{kicker}</p> : null}
          {description ? <p className="result-detail-copy">{description}</p> : null}
        </div>
        {actions ? <div className="result-detail-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}

export function PeriodModeToggle<T extends string>({
  value,
  onChange,
  options,
  label,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label: string;
}) {
  return (
    <div className="period-toggle" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function DownloadAction({
  label = "Download full CSV",
  onClick,
}: {
  label?: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="download-action" onClick={onClick}>
      {label}
    </button>
  );
}

export function YearSelector({
  value,
  years,
  onChange,
}: {
  value: number;
  years: number[];
  onChange: (year: number) => void;
}) {
  const id = useId();
  return (
    <div className="year-selector">
      <label htmlFor={id}>Year</label>
      <select id={id} value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export type TableColumn = {
  key: string;
  label: string;
  tone?: "principal" | "interest" | "growth" | "neutral";
};

export type TableRow = {
  key: string;
  cells: Record<string, React.ReactNode>;
};

export function ResultDataTable({
  caption,
  columns,
  rows,
  previewCount,
  expandLabel,
  collapseLabel,
  highlightedKey,
  onHighlight,
  note,
}: {
  caption: string;
  columns: TableColumn[];
  rows: TableRow[];
  previewCount?: number;
  expandLabel?: string;
  collapseLabel?: string;
  highlightedKey?: string | null;
  onHighlight?: (key: string | null) => void;
  note?: string;
}) {
  const [open, setOpen] = useState(false);
  const visible = previewCount && !open ? rows.slice(0, previewCount) : rows;
  const canExpand = Boolean(previewCount && rows.length > previewCount);
  return (
    <div>
      {note ? <p className="result-table-note">{note}</p> : null}
      <div className="result-table-scroll" tabIndex={0} role="region" aria-label={caption}>
        <table className="result-table">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={column.key} scope="col" className={index === 0 ? undefined : "num"}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.key}
                data-active={highlightedKey === row.key ? "true" : undefined}
                onMouseEnter={() => onHighlight?.(row.key)}
                onMouseLeave={() => onHighlight?.(null)}
                onFocus={() => onHighlight?.(row.key)}
                onBlur={() => onHighlight?.(null)}
              >
                {columns.map((column, index) =>
                  index === 0 ? (
                    <th key={column.key} scope="row">
                      {row.cells[column.key]}
                    </th>
                  ) : (
                    <td key={column.key} className={`num${column.tone ? ` tone-${column.tone}` : ""}`}>
                      {row.cells[column.key]}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {canExpand ? (
        <button type="button" className="expand-action" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? collapseLabel ?? "Show fewer rows" : expandLabel ?? `View all ${rows.length} rows`}
        </button>
      ) : null}
    </div>
  );
}

export function BreakdownList({
  rows,
}: {
  rows: { label: string; value: string; tone?: "principal" | "interest" | "neutral" }[];
}) {
  return (
    <dl className="result-breakdown">
      {rows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd className={row.tone ? `tone-${row.tone}` : undefined}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function moneyCell(value: number, cents = true) {
  return formatMoney(value, { cents });
}
