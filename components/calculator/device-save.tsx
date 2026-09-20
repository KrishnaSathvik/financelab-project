"use client";

export function DeviceSaveBar({
  saved,
  onSave,
  onClear,
}: {
  saved: boolean;
  onSave: () => void;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow)]">
      <p className="text-sm font-semibold">Save on this device</p>
      <p className="mt-1 text-sm leading-6 text-muted">
        {saved ? "Saved locally on this device." : "Keep this list in your browser. Nothing is uploaded."}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-inverse hover:bg-primary-hover"
        >
          Save on this device
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-11 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-surface"
        >
          Clear saved data
        </button>
      </div>
    </div>
  );
}
