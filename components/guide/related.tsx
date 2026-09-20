import Link from "next/link";
import { GuidePreview } from "@/components/brand/guide-preview";
import { getGuide } from "@/lib/guides/catalog";

export function GuideRelated({ slugs }: { slugs: string[] }) {
  return (
    <section id="keep-learning" className="guide-related">
      <h2>Keep learning</h2>
      <div className="guide-related-grid" data-count={slugs.length}>
        {slugs.map((slug) => {
          const guide = getGuide(slug);
          if (!guide) return null;
          return (
            <Link key={slug} href={guide.href} className="guide-related-card">
              <p className="guide-related-meta">
                {guide.category} · {guide.readingTime} min
              </p>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <GuidePreview slug={guide.slug} compact />
              <span className="guide-related-cta">Read guide →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
