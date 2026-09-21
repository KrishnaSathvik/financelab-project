import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Calculator, Eye, LineChart, LockKeyhole, Search } from "lucide-react";
import { TrustCta, TrustPage, TrustSection } from "@/components/layout/trust-page";

export const metadata: Metadata = {
  title: "About MoneyBasis",
  description:
    "Free, transparent tools for understanding everyday money decisions.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    icon: Eye,
    title: "Understand, don't guess",
    body: "See how a change in rate, time or contribution affects the result. The visual breakdown helps explain the number.",
  },
  {
    icon: BookOpen,
    title: "Transparent by design",
    body: "Formulas, assumptions and original sources accompany every calculator. Estimates should be possible to inspect.",
  },
  {
    icon: LockKeyhole,
    title: "Private by default",
    body: "Calculations run in your browser. Supported saved records remain on this device unless you choose to share them.",
  },
] as const;

const steps = [
  { index: "01", icon: Calculator, title: "Calculate", body: "Start with your numbers." },
  { index: "02", icon: LineChart, title: "Visualize", body: "See how values change and compare scenarios." },
  { index: "03", icon: Search, title: "Understand", body: "Inspect formulas, assumptions and sources." },
] as const;

const isItems = [
  "Financial calculation software",
  "Educational explanations",
  "Scenario comparison tools",
  "Transparent assumptions",
] as const;

const isNotItems = [
  "A bank",
  "A lender",
  "An investment adviser",
  "A tax service",
  "A substitute for professional advice",
] as const;

export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="About"
      title="Money decisions are easier when the numbers are clear."
      description="MoneyBasis makes everyday financial calculations understandable. Start with your numbers, explore a scenario, and see what creates the result."
      actions={
        <>
          <Link href="/calculators" className="text-[17px] font-semibold text-foreground">
            Explore calculators →
          </Link>
          <Link href="/how-it-works" className="text-[17px] font-medium text-muted">
            How it works →
          </Link>
        </>
      }
    >
      <TrustSection title="Why MoneyBasis exists" description="Clear tools for understanding everyday money decisions.">
        <div className="principle-grid">
          {principles.map((item) => (
            <article key={item.title} className="principle-card">
              <item.icon className="h-5 w-5" aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </TrustSection>
      <TrustSection title="Calculate, visualize, understand">
        <ol className="about-steps">
          {steps.map((step) => (
            <li key={step.title} className="about-step">
              <p className="step-index">{step.index}</p>
              <step.icon className="mt-3 h-5 w-5" aria-hidden="true" />
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </TrustSection>
      <TrustSection title="What MoneyBasis is — and isn't" description="Calculation and education, with the assumptions in view.">
        <div className="compare-grid">
          <div className="compare-col compare-is">
            <h3>MoneyBasis is</h3>
            <ul>
              {isItems.map((item) => (
                <li key={item}><span aria-hidden="true">✓</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="compare-col compare-isnt">
            <h3>MoneyBasis isn&apos;t</h3>
            <ul>
              {isNotItems.map((item) => (
                <li key={item}><span aria-hidden="true">–</span>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <p className="label-note">Results reflect the inputs and assumptions you select.</p>
      </TrustSection>
      <TrustCta
        title="Start with a money question."
        primaryHref="/calculators"
        primaryLabel="Explore calculators"
        secondaryHref="/privacy"
        secondaryLabel="Read our privacy approach →"
      />
    </TrustPage>
  );
}
