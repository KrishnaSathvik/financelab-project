"use client";
import { useEffect, useEffectEvent } from "react";
import { modelForSlug, validatePayload } from "@/lib/validation/index";
import { decodeSharePayload } from "@/lib/persistence";

const choices: Record<string, readonly unknown[]> = {
  method: ["snowball", "avalanche"],
  compoundingFrequency: ["annually", "semiannually", "quarterly", "monthly", "daily"],
  mode: ["annual", "hourly", "salary"],
  filingStatus: ["single", "mfj", "hoh"],
  taxYear: [2025, 2026],
};

export function matchesSharedInput(value: unknown, example: unknown, key: string = ""): boolean {
  if (choices[key] && !choices[key].includes(value)) return false;
  if (typeof example === "number") {
    if (typeof value !== "number" || !Number.isFinite(value) || Math.abs(value) > 1e12) return false;
    if (/(?:Years|Age)$|^years/.test(key) && (value < 0 || value > 100 || Math.abs(value * 12 - Math.round(value * 12)) > 1e-7)) return false;
    return true;
  }
  if (typeof example === "string") return typeof value === "string" && value.length <= 200;
  if (typeof example === "boolean") return typeof value === "boolean";
  if (Array.isArray(example)) return Array.isArray(value) && value.length <= 100 && value.every(item => example.length > 0 && matchesSharedInput(item, example[0], ""));
  if (example && typeof example === "object") return !!value && typeof value === "object" && !Array.isArray(value) && Object.entries(example).every(([k,v])=>matchesSharedInput((value as Record<string,unknown>)[k],v,k));
  return false;
}

/** Restore explicit shared inputs after hydration; never persist them to device storage. */
export function useSharedInputs<T extends object>(example: T, apply: (value: T) => void) {
  const restore = useEffectEvent(() => {
    const encoded = new URLSearchParams(window.location.search).get("share");
    if (!encoded || encoded.length > 50000) return;
    const value = decodeSharePayload<unknown>(encoded);
    const slug = window.location.pathname.split("/").filter(Boolean).at(-1) ?? "";
    const model = modelForSlug[slug];
    if (model && matchesSharedInput(value, example, "") && validatePayload(model, value).valid) apply(value as T);
    else window.dispatchEvent(new CustomEvent("moneybasis-input-error", { detail: "The shared inputs are invalid or unsupported. Default inputs were kept." }));
  });
  useEffect(() => { restore(); }, []);
}
