import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  illustration,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  illustration?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section
      data-page-hero
      className={`page-hero ${illustration ? "page-hero-split" : "page-hero-plain"}`}
    >
      <div className="page-hero-copy">
        {eyebrow ? <p className="mb-5 text-sm text-muted">{eyebrow}</p> : null}
        <h1 className="page-hero-title">{title}</h1>
        <p className="page-hero-lede">{description}</p>
        {children ? <div className="page-hero-actions">{children}</div> : null}
      </div>
      {illustration ? <div className="page-hero-visual">{illustration}</div> : null}
    </section>
  );
}
