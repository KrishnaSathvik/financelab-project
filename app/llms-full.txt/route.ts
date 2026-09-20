import { calculatorList } from "@/lib/calculators/catalog";
import { SITE_LONG_DESCRIPTION, SITE_NAME, SITE_SHORT_DESCRIPTION, SITE_URL } from "@/lib/site";

export function GET() {
  const body = [
    `# ${SITE_NAME} — full overview`,
    SITE_SHORT_DESCRIPTION,
    "",
    SITE_LONG_DESCRIPTION,
    "",
    "All calculators are educational estimates. They are not financial, tax, or investment advice. Calculations happen client-side.",
    "",
    ...calculatorList.flatMap((calculator) => [
      `## ${calculator.name}`,
      `URL: ${SITE_URL}${calculator.href}`,
      calculator.intro,
      `Formula: ${calculator.formula}`,
      calculator.formulaNote,
      "Assumptions:",
      ...calculator.assumptions.map((item) => `- ${item}`),
      "Sources:",
      ...calculator.sources.map((source) => `- ${source.label}: ${source.href}`),
      "",
    ]),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
