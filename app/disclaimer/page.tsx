import type { Metadata } from "next";
import Link from "next/link";
import { TrustPage, TrustSection } from "@/components/layout/trust-page";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Financial Disclaimer | ${SITE_NAME}` },
  description: `${SITE_NAME} provides calculators and educational information for general informational purposes. Results are estimates, not financial advice.`,
  alternates: { canonical: "/disclaimer" },
};

const exclusions = [
  "personalized financial advice",
  "investment advice",
  "tax advice",
  "accounting advice",
  "legal advice",
] as const;

export default function DisclaimerPage() {
  return (
    <TrustPage
      title="Financial disclaimer"
      description={`${SITE_NAME} helps you inspect estimates based on your inputs. It is educational software, not personalized financial advice.`}
      aside={
        <aside className="disclaimer-callout">
          <p>Important</p>
          <p>{SITE_NAME} results are estimates based on the numbers and assumptions you enter. Actual outcomes can differ.</p>
        </aside>
      }
    >
      <TrustSection title="Educational estimates">
        <p className="trust-prose">{SITE_NAME} provides calculators and educational information for general informational purposes.</p>
        <p className="trust-prose">Results depend on user-provided inputs and stated assumptions.</p>
      </TrustSection>
      <TrustSection title="What MoneyBasis does not provide">
        <p className="trust-prose">{SITE_NAME} does not provide:</p>
        <ul className="limit-list">
          {exclusions.map((item) => (
            <li key={item}><span aria-hidden="true">•</span>{item}</li>
          ))}
        </ul>
      </TrustSection>
      <TrustSection title="Before making an important decision">
        <p className="trust-prose">Use {SITE_NAME} as one input into your research.</p>
        <p className="trust-prose">Financial markets, taxes, rates, laws and personal circumstances can change.</p>
        <p className="trust-prose">Verify important information independently and consult an appropriately qualified professional when necessary.</p>
      </TrustSection>
      <div className="trust-cta">
        <h2>Want to inspect the numbers?</h2>
        <div className="trust-cta-links">
          <Link href="/how-it-works" className="text-[17px] font-semibold text-foreground">See how MoneyBasis calculates estimates →</Link>
          <Link href="/sources" className="text-[17px] font-medium text-muted">Review sources →</Link>
        </div>
      </div>
    </TrustPage>
  );
}
