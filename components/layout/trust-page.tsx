import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";

export function TrustPage({
  eyebrow,
  title,
  description,
  actions,
  aside,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="trust-page">
      <PageHero eyebrow={eyebrow} title={title} description={description}>
        {actions}
      </PageHero>
      {aside}
      <article>{children}</article>
    </div>
  );
}

export function TrustSection({
  id,
  title,
  description,
  children,
}: {
  id?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section data-content-section id={id} className="trust-section">
      <h2 className="section-title">{title}</h2>
      {description ? <p className="trust-section-intro">{description}</p> : null}
      {children}
    </section>
  );
}

export function TrustCta({
  title,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="trust-cta">
      <h2 className="section-title">{title}</h2>
      <div className="trust-cta-links">
        {primaryHref && primaryLabel ? (
          <Link href={primaryHref} className="text-[17px] font-semibold text-foreground">
            {primaryLabel}
          </Link>
        ) : null}
        <Link href={secondaryHref} className="text-[17px] font-medium text-muted">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
