import type { Metadata } from "next";
import Link from "next/link";
import { TrustPage, TrustSection } from "@/components/layout/trust-page";
import { ClearSavedData } from "@/components/privacy/clear-saved-data";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `Privacy | ${SITE_NAME}` },
  description: `${SITE_NAME} calculations run in your browser. This page explains local processing, localStorage, cookies, hosting, logging and analytics.`,
  alternates: { canonical: "/privacy" },
};

const promises = [
  "Calculations run in your browser",
  "No account required",
  "Calculator values are not sent to a MoneyBasis server",
  "Saved records are optional and local",
] as const;

const localItems = [
  "Calculator inputs",
  "Calculation state",
  "Temporary unsaved values",
] as const;

const activity = [
  {
    title: "Analytics",
    body: "No analytics SDK is currently installed.",
    status: "Not used",
  },
  {
    title: "Advertising cookies",
    body: `${SITE_NAME} does not currently set advertising cookies.`,
    status: "Not used",
  },
  {
    title: "Hosting & technical logs",
    body: "Hosting infrastructure and browsers may produce ordinary request metadata necessary to operate the site.",
    status: "Technical operation",
  },
] as const;

export default function PrivacyPage() {
  return (
    <TrustPage
      eyebrow="Trust & transparency"
      title="Privacy"
      description={`${SITE_NAME} is designed so standard calculator inputs stay on the device you are using. No account is required for standard calculator use.`}
      aside={
        <ul className="trust-summary">
          {promises.map((item) => (
            <li key={item}><span aria-hidden="true">✓</span>{item}</li>
          ))}
        </ul>
      }
    >
      <TrustSection title="Your calculations" description={`Standard ${SITE_NAME} calculators process the values you enter in your browser.`}>
        <p className="trust-prose">This includes mortgage, investing, salary, loan, net worth, budget, retirement, savings, debt and rent-versus-buy math, unless a feature explicitly states otherwise.</p>
        <div className="privacy-split">
          <div className="privacy-panel">
            <h3>What stays local</h3>
            <ul>
              {localItems.map((item) => (
                <li key={item}><span aria-hidden="true">•</span>{item}</li>
              ))}
            </ul>
            <p className="secondary-note">Resetting a calculator or closing the tab discards numbers held in memory, unless you chose to save on this device.</p>
          </div>
          <div className="privacy-panel">
            <h3>What is sent</h3>
            <p>For standard calculator use:</p>
            <p><strong className="font-semibold text-foreground">Your calculator values are not sent to a MoneyBasis server.</strong></p>
          </div>
        </div>
      </TrustSection>
      <TrustSection title="Saved data & sharing" description="Optional records can stay in this browser. Numbers are added to a link only when you choose.">
        <div className="privacy-split">
          <div className="privacy-panel">
            <h3>Local saves</h3>
            <p>Optional Budget, Net Worth and Debt Snowball records can be stored in this browser.</p>
            <p className="secondary-note">Theme preference may also persist in this browser. Saved calculator records use localStorage.</p>
          </div>
          <div className="privacy-panel">
            <h3>Shared links</h3>
            <p>{SITE_NAME} shares calculator inputs only when you explicitly opt to include them in a copied link.</p>
            <div className="share-distinction">
              <p><strong>Calculator-only link</strong> → no numbers included</p>
              <p><strong>Include my numbers</strong> → selected inputs encoded in the link</p>
            </div>
          </div>
        </div>
      </TrustSection>
      <TrustSection title="Website activity" description="How analytics, cookies and hosting are handled today.">
        <div className="activity-panel">
          {activity.map((row) => (
            <div key={row.title} className="activity-row">
              <div>
                <h3>{row.title}</h3>
                <p className="activity-copy">{row.body}</p>
              </div>
              <span className="status-badge">{row.status}</span>
            </div>
          ))}
        </div>
        <p className="secondary-note">The site does not claim “no tracking.” None of those are used today to reconstruct your financial situation.</p>
      </TrustSection>
      <TrustSection title="Data stored on this device" description="Control the optional calculator records saved in this browser.">
        <ClearSavedData />
        <p className="mt-6">
          <Link href="/sources" className="trust-text-link">Review MoneyBasis sources →</Link>
        </p>
      </TrustSection>
    </TrustPage>
  );
}
