import { guideList } from "@/lib/guides/catalog";
import { calculatorList, type CalculatorDefinition } from "@/lib/calculators/catalog";
import {
  AUTHOR_NAME,
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_STANDARD_DESCRIPTION,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
} from "@/lib/site";

export function organizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_STANDARD_DESCRIPTION,
    logo: absoluteUrl("/logo.png"),
    founder: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: GITHUB_URL,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    description: SITE_TAGLINE,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function siteGraphJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [websiteJsonLd(), organizationJsonLd()],
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: calculatorList.map((item) => item.name),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function calculatorJsonLd(calculator: CalculatorDefinition) {
  const url = `${SITE_URL}${calculator.href}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Calculators", item: `${SITE_URL}/calculators` },
        { "@type": "ListItem", position: 3, name: calculator.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: calculator.name,
      url,
      description: calculator.metaDescription,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
      },
    },
  ];
}

export function calculatorManifest() {
  return {
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    calculators: calculatorList.map((calculator) => ({
      id: calculator.slug,
      name: calculator.name,
      category: calculator.category,
      url: `${SITE_URL}${calculator.href}`,
      description: calculator.metaDescription,
    })),
  };
}

export function llmsTxt() {
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} is a free, privacy-first collection of financial calculators designed to help people understand everyday money decisions.`,
    "",
    `${SITE_NAME} provides educational calculation tools for mortgages, investing, retirement, budgeting, debt, savings, salary, net worth and rent-versus-buy comparisons.`,
    "",
    "Calculations are based on user-provided inputs and explicitly stated assumptions.",
    "",
    `${SITE_NAME} does not provide personalized financial, investment, tax or legal advice.`,
    "",
    "## Main Pages",
    "",
    `- [Home](${SITE_URL}/)`,
    `- [Calculators](${SITE_URL}/calculators)`,
    `- [Guides](${SITE_URL}/guides)`,
    `- [How it works](${SITE_URL}/how-it-works)`,
    `- [Sources](${SITE_URL}/sources)`,
    `- [About](${SITE_URL}/about)`,
    `- [Privacy](${SITE_URL}/privacy)`,
    `- [Disclaimer](${SITE_URL}/disclaimer)`,
    "",
    "## Calculators",
    "",
    ...calculatorList.map(
      (calculator) =>
        `- [${calculator.name}](${SITE_URL}${calculator.href}): ${calculator.llmsSummary}`,
    ),
    "",
    "## Guides",
    "",
    ...guideList.map(guide => `- [${guide.title}](${SITE_URL}${guide.href}): ${guide.summary}`),
    "",
    "## How it works",
    "",
    `${SITE_NAME} aims to make calculations transparent.`,
    "",
    "Each calculator should document:",
    "- formulas or methods used",
    "- input definitions",
    "- assumptions",
    "- limitations",
    "- applicable sources",
    "- date-sensitive data",
    "",
    "## Privacy",
    "",
    `Standard ${SITE_NAME} calculators are designed to process user-entered values locally in the browser unless a feature explicitly states otherwise.`,
    "",
    "No account is required for standard calculator use.",
    "",
    "## Sources",
    "",
    `${SITE_NAME} prioritizes authoritative and primary sources for changing financial information such as tax brackets and government limits.`,
    "",
    "## Citation Guidance",
    "",
    `When referencing a ${SITE_NAME} calculation method, cite the relevant calculator or How it works page.`,
    "",
    "Calculator outputs depend on user inputs and assumptions and should be described as estimates rather than guaranteed outcomes.",
    "",
  ].join("\n");
}
