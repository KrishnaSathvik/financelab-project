"use client";

export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={`min-h-11 px-2 py-2 rounded-xl border text-sm font-medium leading-snug ${
            value === option.value ? "border-primary bg-primary text-inverse" : "border-border bg-card hover:bg-surface"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
