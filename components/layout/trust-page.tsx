import type { ReactNode } from "react";
import Link from "next/link";

export function TrustPage({
  eyebrow,
  title,
  description,
  actions,
  aside,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="trust-page">
      <header data-page-hero className="trust-hero">
        {eyebrow ? <p className="trust-eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <div className="trust-lede">{description}</div>
        {actions ? <div className="trust-actions">{actions}</div> : null}
        {aside}
      </header>
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
      <h2>{title}</h2>
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
      <h2>{title}</h2>
      <div className="trust-cta-links">
        {primaryHref && primaryLabel ? (
          <Link href={primaryHref} className="trust-button">
            {primaryLabel}
          </Link>
        ) : null}
        <Link href={secondaryHref} className="trust-text-link">
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}
