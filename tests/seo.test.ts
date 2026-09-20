import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { calculatorList, calculatorSlugs, relatedCalculators } from "@/lib/calculators/catalog";
import { calculatorPageCopy } from "@/lib/calculators/page-copy";
import { calculatorJsonLd, calculatorManifest, llmsTxt, organizationJsonLd } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

describe("calculator SEO catalog", () => {
  it("gives every calculator a unique canonical title and meta description", () => {
    const titles = calculatorList.map((item) => item.title);
    const descriptions = calculatorList.map((item) => item.metaDescription);

    expect(titles).toHaveLength(new Set(titles).size);
    expect(descriptions).toHaveLength(new Set(descriptions).size);
    for (const calculator of calculatorList) {
      expect(calculator.title).toContain(SITE_NAME);
      expect(calculator.href).toBe(`/calculators/${calculator.slug}`);
      expect(calculator.intro.length).toBeGreaterThan(40);
      expect(calculator.subtitle.length).toBeGreaterThan(20);
      expect(calculator.inputs.length).toBeGreaterThan(0);
      expect(calculator.sources.length).toBeGreaterThan(0);
    }
  });

  it("includes crawlable page copy and related calculators for every slug", () => {
    for (const slug of calculatorSlugs) {
      const copy = calculatorPageCopy[slug];
      expect(copy.howToUse.length).toBeGreaterThan(0);
      expect(copy.resultTerms.length).toBeGreaterThan(0);
      expect(copy.definitions.length).toBeGreaterThan(0);
      expect(relatedCalculators(slug).length).toBeGreaterThan(0);
    }
  });

  it("uses SoftwareApplication and BreadcrumbList markup that matches visible names", () => {
    const mortgage = calculatorList[0];
    const data = calculatorJsonLd(mortgage);
    expect(data[0]["@type"]).toBe("BreadcrumbList");
    expect(data[1]["@type"]).toBe("SoftwareApplication");
    expect(data[1].name).toBe(mortgage.name);
    expect(data[1].isAccessibleForFree).toBe(true);
    expect(data[1].operatingSystem).toBe("Any");
  });
});

describe("machine-readable SEO files", () => {
  it("lists every calculator in llms.txt and calculators.json", () => {
    const txt = llmsTxt();
    const manifest = calculatorManifest();

    expect(txt).toContain(`# ${SITE_NAME}`);
    expect(txt).not.toContain("FinanceLab");
    expect(txt).toContain("/how-it-works");
    expect(txt).toContain("/sources");
    expect(manifest.calculators).toHaveLength(calculatorList.length);

    for (const calculator of calculatorList) {
      expect(txt).toContain(calculator.href);
      expect(manifest.calculators.some((item) => item.id === calculator.slug)).toBe(true);
    }
  });

  it("puts canonical calculator URLs in the sitemap and allows OAI-SearchBot", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);
    const robotsFile = robots();

    expect(urls).toContain(SITE_URL);
    expect(urls.some((url) => url.endsWith("/calculators"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/how-it-works"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/sources"))).toBe(true);
    expect(urls.some((url) => url.endsWith("/guides"))).toBe(true);
    for (const calculator of calculatorList) {
      expect(urls.some((url) => url.endsWith(calculator.href))).toBe(true);
    }

    const rules = Array.isArray(robotsFile.rules) ? robotsFile.rules : [robotsFile.rules];
    expect(rules.some((rule) => rule.userAgent === "OAI-SearchBot")).toBe(true);
    expect(rules.some((rule) => rule.userAgent === "GPTBot")).toBe(true);
  });

  it("points organization structured data at the public logo", () => {
    expect(organizationJsonLd().logo).toBe(`${SITE_URL}/logo.png`);
  });

  it("ships a 1200x630 Open Graph image for every calculator", () => {
    for (const slug of calculatorSlugs) {
      expect(existsSync(join(process.cwd(), "public", "og", `${slug}.png`))).toBe(true);
    }
  });
});
