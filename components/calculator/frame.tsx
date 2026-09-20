"use client";

import { useEffect, useState } from "react";
import { LockKeyhole, SlidersHorizontal } from "lucide-react";

export function CalculatorActions({
  onReset,
  onCalculate,
  calculateLabel = "Calculate",
  calculateAriaLabel,
  confirmReset = false,
}: {
  onReset: () => void;
  onCalculate?: () => void;
  calculateLabel?: string;
  calculateAriaLabel?: string;
  confirmReset?: boolean;
}) {
  return (
    <div className="space-y-3 pt-3">
      <button
        type="button"
        aria-label={calculateAriaLabel ?? calculateLabel}
        onClick={() => {
          onCalculate?.();
        }}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold text-inverse hover:bg-primary-hover"
      >
        {calculateLabel}
      </button>
      <button
        type="button"
        onClick={() => {
          if (confirmReset && !window.confirm("Reset calculator?")) return;
          onReset();
        }}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-medium text-foreground hover:bg-surface"
      >
        Reset
      </button>
      <p className="text-center text-xs leading-5 text-muted">
        Nothing is uploaded when you calculate.
      </p>
    </div>
  );
}

export function CalculatorFrame({
  title,
  description,
  formTitle = "Your details",
  formNote,
  inputs,
  results,
  analysis,
  aside,
  share,
  validationError,
}: {
  validationError?: string | null;
  title: string;
  description: string;
  formTitle?: string;
  formNote?: string;
  inputs: React.ReactNode;
  results: React.ReactNode;
  analysis?: React.ReactNode;
  aside?: React.ReactNode;
  share?: React.ReactNode;
  illustration?: React.ReactNode;
}) {
  const [restoreError, setRestoreError] = useState<string | null>(null);
  useEffect(() => {
    const onError = (event: Event) => setRestoreError((event as CustomEvent<string>).detail);
    window.addEventListener("moneybasis-input-error", onError);
    return () => window.removeEventListener("moneybasis-input-error", onError);
  }, []);
  return (
    <div>
      {restoreError ? <p role="alert" className="mb-4 text-sm text-negative">{restoreError}</p> : null}
      <header className="calculator-header rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4"><h1>{title}</h1>{share}</div>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
          {description}
        </p>
        <div className="mt-5 flex flex-wrap gap-5 text-sm text-muted">
          <span className="inline-flex items-center gap-2">
            <LockKeyhole size={15} /> Runs in your browser
          </span>
        </div>
      </header>
      <div
        id="results"
        className="calculator-product"
        role="region"
        aria-label="Calculation results"
      >
        <div className="calculator-workspace">
        <section className="calculator-form">
          <h2 className="flex items-center gap-3 text-lg font-semibold"><SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />{formTitle}</h2>
          {formNote ? (
            <p className="mt-2 text-sm leading-6 text-muted">{formNote}</p>
          ) : null}
          <div className="mt-6">{inputs}
            {validationError ? <p role="alert" className="mt-4 text-sm text-negative">{validationError}</p> : null}</div>
        </section>
        <section className="calculator-summary">
          {results}
        </section>
        </div>
        {analysis ? <div className="calculator-analysis">{analysis}</div> : null}
      </div>
      {aside ? <aside className="mt-6">{aside}</aside> : null}
    </div>
  );
}
