import { financialSources, type SourceKey } from "@/lib/sources";

const shortNames: Record<SourceKey, string> = {
  irs2026: "IRS",
  irs2025: "IRS",
  ssa: "SSA",
  medicare: "IRS",
  mortgage: "CFPB",
  housing: "CFPB",
  compound: "SEC",
  investment: "SEC",
  netWorth: "SEC",
  budget: "CFPB",
  savings: "CFPB",
  debt: "CFPB",
  retirement: "DOL",
  apr: "CFPB",
  recast: "Fannie Mae",
  apy: "CFPB",
  pmi: "CFPB",
  fees: "SEC",
  inflation: "BLS",
  retirementTax: "IRS",
  cafeteria: "IRS",
  bengen: "Bengen 1994",
  bengenText: "Bengen 1994",
  trinity: "Trinity 1998",
  socialSecurityPlanning: "SSA",
};

export function sourceShortName(key: SourceKey) {
  return shortNames[key];
}

export function sourceWhen(key: SourceKey) {
  const source = financialSources[key];
  if (source.effectiveYear) {
    return key === "irs2026" || key === "irs2025" || key === "cafeteria"
      ? `Tax year ${source.effectiveYear}`
      : String(source.effectiveYear);
  }
  if (!source.publicationDate) return null;
  const parts = source.publicationDate.split("-");
  if (parts.length >= 2) {
    return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(
      new Date(`${parts[0]}-${parts[1]}-01T00:00:00Z`),
    );
  }
  return parts[0];
}
