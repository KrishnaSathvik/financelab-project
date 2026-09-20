"use client";

import { useCallback, useState, useSyncExternalStore } from "react";
import { modelForSlug, validatePayload } from "@/lib/validation/index";
import { STORAGE_EVENT, STORAGE_PREFIX, clearLocal, saveLocal } from "@/lib/persistence";

function subscribe(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(STORAGE_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(STORAGE_EVENT, handler);
  };
}

export function useDeviceRecord<T>(key: string, fallback: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => { try { return window.localStorage.getItem(`${STORAGE_PREFIX}${key}`); } catch { return null; } },
    () => null,
  );
  let stored: T | null = null;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    const model = modelForSlug[key];
    if (parsed && model && validatePayload(model, parsed).valid) stored = parsed as T;
  } catch { /* Corrupted device records fall back without crashing hydration. */ }
  const [draft, setDraft] = useState<T | null>(null);
  const value = draft ?? stored ?? fallback;
  const saved = stored !== null;

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setDraft((current) => {
        const prev = current ?? stored ?? fallback;
        return typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      });
    },
    [fallback, stored],
  );

  const save = useCallback(() => {
    if (!validatePayload(modelForSlug[key], value).valid) {
      window.dispatchEvent(new CustomEvent("moneybasis-input-error", { detail: "Correct the invalid inputs before saving." }));
      return;
    }
    try { saveLocal(key, value); } catch {
      window.dispatchEvent(new CustomEvent("moneybasis-input-error", { detail: "Device storage is unavailable. Your inputs remain on screen." }));
      return;
    }
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, [key, value]);

  const clear = useCallback(() => {
    clearLocal(key);
    setDraft(fallback);
    window.dispatchEvent(new Event(STORAGE_EVENT));
  }, [fallback, key]);

  return { value, update, save, clear, saved };
}
