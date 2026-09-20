"use client";
import { useId, useState } from "react";
import { Share2 } from "lucide-react";
import { modelForSlug, validatePayload } from "@/lib/validation/index";
import { encodeSharePayload } from "@/lib/persistence";

export function ShareBar({ slug, payload }: { slug: string; payload: unknown }) {
  const id = useId();
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [message, setMessage] = useState("");
  return <details className="share-action relative" onKeyDown={e => { if(e.key === "Escape") e.currentTarget.open = false; }}>
    <summary className="flex min-h-11 list-none items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium"><Share2 size={16}/>Share</summary>
    <div className="share-popover absolute right-0 z-20 mt-2 w-[min(18rem,calc(100vw-2rem))] max-w-full rounded-xl border border-border bg-card p-5 shadow-lg">
      <p className="font-semibold">Share this calculation</p>
      <fieldset className="mt-3"><legend className="sr-only">Link contents</legend>
        {[false,true].map(include=><label key={String(include)} className="flex min-h-11 items-center gap-2 text-sm"><input type="radio" name={id} checked={includeNumbers===include} onChange={()=>{setIncludeNumbers(include);setMessage("");}}/>{include ? "Include my current inputs" : "Share calculator only"}</label>)}
      </fieldset>
      {includeNumbers && <p className="mt-2 text-xs leading-5 text-muted">Anyone with this link can read the included inputs.</p>}
      <button type="button" className="mt-4 min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-inverse" onClick={async()=>{
        const url = new URL(`/calculators/${slug}`,window.location.origin);
        if (includeNumbers && !validatePayload(modelForSlug[slug], payload).valid) { setMessage("Correct invalid inputs before sharing them."); return; }
        if(includeNumbers) url.searchParams.set("share",encodeSharePayload(payload));
        try { await navigator.clipboard.writeText(url.toString()); setMessage("Link copied"); }
        catch { setMessage("Copy failed. Please allow clipboard access and try again."); }
      }}>Copy link</button><p role="status" className="mt-2 text-xs leading-5 text-muted">{message}</p>
    </div>
  </details>;
}
