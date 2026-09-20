import Link from "next/link";
import { GuidePreview } from "@/components/brand/guide-preview";
import type { GuideDefinition } from "@/lib/guides/catalog";
export function guideCategory(g: GuideDefinition) { return g.category; }
export function guideReadingTime(g: GuideDefinition) { return g.readingTime; }

export function GuideCard({ guide: g, wide = false }: { guide: GuideDefinition; wide?: boolean }) {
  return (
    <Link href={g.href} className={`group min-w-0 rounded-2xl border border-border bg-card transition hover:border-foreground/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground ${wide ? 'directory-guide-card p-6 sm:p-8' : 'grid content-start gap-6 p-5'}`}>
      <div>
        <p className="text-xs font-medium text-muted">{guideCategory(g)} · {guideReadingTime(g)} min read</p>
        <h3 className={`mt-3 font-semibold tracking-tight ${wide ? 'text-2xl leading-tight sm:text-3xl' : 'text-xl leading-7'}`}>{g.title}</h3>
        <p className={`mt-4 text-muted ${wide ? 'max-w-xl leading-7' : 'text-sm leading-6'}`}>{g.summary}</p>
        <span className="mt-5 inline-block text-sm font-semibold text-foreground group-hover:underline">Read guide →</span>
      </div>
      <GuidePreview slug={g.slug} compact={!wide} />
    </Link>
  );
}
