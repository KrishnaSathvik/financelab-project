import type { ReactNode } from "react";

export function GuideSection({
  id,
  heading,
  kicker,
  yearSpecific,
  children,
}: {
  id: string;
  heading: string;
  kicker?: string;
  yearSpecific?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-guide-section={id}
      className={yearSpecific ? "guide-section guide-section-dated" : "guide-section"}
    >
      {yearSpecific ? <p className="guide-kicker">Year-specific · US federal scope · 2026</p> : null}
      {kicker && !yearSpecific ? <p className="guide-kicker">{kicker}</p> : null}
      <h2>{heading}</h2>
      {children}
    </section>
  );
}
