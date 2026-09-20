"use client";

import { parseNumberInput } from "@/lib/input-parser";
import { useState } from "react";

type NumberFieldProps = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  prefix?: string;
  suffix?: string;
  badge?: string;
  step?: string;
  min?: number;
  error?: string;
  warning?: string;
};

function formatDisplay(value: number, step: string) {
  if (!Number.isFinite(value)) return "";
  const decimals = Math.max(2, step.includes(".") ? step.split(".")[1]?.length ?? 0 : 0);
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: Math.max(12, decimals),
    minimumFractionDigits: 0,
  }).format(value);
}


export function NumberField({
  id,
  label,
  value,
  onChange,
  hint,
  prefix,
  suffix,
  badge,
  step = "1",
  min,
  error,
  warning,
}: NumberFieldProps) {
  const [focused, setFocused] = useState(false);
  const [draft, setDraft] = useState("");
  const text = focused ? draft : formatDisplay(value, step);
  const inputError = !Number.isFinite(value) ? "Enter a valid number." : error;

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <span className="relative block">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted">
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          name={id}
          aria-label={label}
          aria-invalid={!!inputError}
          type="text"
          inputMode="decimal"
          min={min}
          value={text}
          onFocus={(event) => {
            setDraft(event.currentTarget.value);
            setFocused(true);
          }}
          onBlur={() => setFocused(false)}
          onChange={(event) => {
            const nextText = event.target.value;
            setDraft(nextText);
            const parsed = parseNumberInput(nextText);
            onChange(parsed ?? Number.NaN);
          }}
          className={`h-12 w-full rounded-xl border bg-card text-base tabular-nums text-foreground outline-none transition placeholder:text-muted/70 focus:ring-2 ${
            inputError
              ? "border-negative focus:border-negative focus:ring-negative/20"
              : warning
                ? "border-warning focus:border-warning focus:ring-warning/20"
                : "border-border focus:border-primary focus:ring-primary/15"
          } ${prefix ? "pl-8" : "pl-3.5"} ${suffix || badge ? "pr-16" : "pr-3.5"}`}
        />
        {badge ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-primary">
            {badge}
          </span>
        ) : suffix ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
            {suffix}
          </span>
        ) : null}
      </span>
      {inputError ? <span className="mt-1 block text-sm text-negative">{inputError}</span> : null}
      {!inputError && warning ? <span className="mt-1 block text-sm text-warning">⚠ {warning}</span> : null}
      {!inputError && !warning && hint ? <span className="mt-1 block text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
};

export function SelectField({ id, label, value, onChange, options }: SelectFieldProps) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      <select
        id={id}
        name={id}
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-card px-3.5 text-base text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
