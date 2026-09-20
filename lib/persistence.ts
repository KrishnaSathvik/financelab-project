import { modelForSlug, validatePayload } from "@/lib/validation/index";
export const STORAGE_PREFIX = "moneybasis:";
export const STORAGE_EVENT = "moneybasis-save";

export function loadLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!raw) return fallback;
    const parsed: unknown = JSON.parse(raw);
    const model = modelForSlug[key];
    return model && validatePayload(model, parsed).valid ? parsed as T : fallback;
  } catch {
    return fallback;
  }
}

export function saveLocal<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  const model = modelForSlug[key];
  if (!model || !validatePayload(model, value).valid) return;
  window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
}

export function clearLocal(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
}

export function clearAllLocal() {
  if (typeof window === "undefined") return;
  const keys = Object.keys(window.localStorage).filter((key) => key.startsWith(STORAGE_PREFIX));
  for (const key of keys) window.localStorage.removeItem(key);
}

export function encodeSharePayload(payload: unknown) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodeSharePayload<T>(value: string): T | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
