"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculatorIcons } from "@/components/brand/calculator-icons";
import { calculatorTints } from "@/components/brand/icon-tints";
import { calculatorList } from "@/lib/calculators/catalog";

export function SearchControl() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return calculatorList;
    return calculatorList.filter((item) =>
      `${item.name} ${item.description} ${item.shortName}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface hover:text-foreground"
        aria-label="Search calculators"
      >
        <Search className="h-4 w-4" />
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-foreground/20 p-4 pt-24">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search calculators"
                className="h-12 w-full bg-transparent text-base outline-none"
              />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close search">
                <X className="h-4 w-4 text-muted" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {matches.map((item) => {
                const Icon = calculatorIcons[item.slug];
                return (
                  <Link
                    key={item.slug}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface"
                  >
                    <span className={`icon-chip ${calculatorTints[item.slug]}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{item.name}</span>
                      <span className="block text-xs text-muted">{item.shortName}</span>
                    </span>
                  </Link>
                );
              })}
              {matches.length === 0 ? (
                <p className="px-3 py-6 text-sm text-muted">No matching calculators.</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
