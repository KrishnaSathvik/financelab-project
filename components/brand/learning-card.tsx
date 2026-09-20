import type { CSSProperties } from "react";
import Link from "next/link";
import type { GuideDefinition } from "@/lib/guides/catalog";
import { guidePreviews } from "@/lib/guides/previews";

/** Homepage editorial cards share one layout and the reviewed guide examples. */
export function LearningCard({ guide }: { guide: GuideDefinition }) {
  const preview = guidePreviews[guide.slug];
  return (
    <Link href={guide.href} className="learning-card">
      <p className="learning-category">{guide.category} · {guide.readingTime} min read</p>
      <h3>{guide.title}</h3>
      <p className="learning-description">{guide.summary}</p>
      <span className="learning-cta">Read guide →</span>
      <div className="learning-preview" data-guide-preview={guide.slug}>
        <p className="learning-context">{preview.context}</p>
        <dl className="learning-metrics" style={{ "--metric-count": preview.values.length } as CSSProperties}>
          {preview.values.map(metric => (
            <div key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
        <p className="learning-takeaway">{preview.takeaway}</p>
      </div>
    </Link>
  );
}
