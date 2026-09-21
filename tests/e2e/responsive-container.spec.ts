import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const out = "output/playwright/responsive-container-v1";
const hideHeader = "header.sticky { visibility: hidden; }";

async function widthOf(page: Page, selector: string) {
  const box = await page.locator(selector).first().boundingBox();
  return box?.width ?? 0;
}

test.describe("responsive container pass v1", () => {
  test("homepage uses the wide shell from 1280 through 1920", async ({ page }) => {
    await mkdir(out, { recursive: true });
    const checkpoints = [1280, 1440, 1600, 1792, 1920] as const;
    const measured: Record<number, { shell: number; header: number; ratio: number }> = {};

    for (const width of checkpoints) {
      await page.setViewportSize({ width, height: 1100 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const shell = await widthOf(page, ".site-container");
      const header = await widthOf(page, ".header-inner");
      const footer = await widthOf(page, "footer .site-container");
      const trustCols = await page.locator(".trust-grid > li").evaluateAll((nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().x))).size);
      const toolCols = await page.locator(".tools-grid > a").evaluateAll((nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().x))).size);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      expect(Math.abs(shell - header)).toBeLessThanOrEqual(2);
      expect(Math.abs(shell - footer)).toBeLessThanOrEqual(2);
      expect(trustCols).toBe(4);
      expect(toolCols).toBe(3);
      measured[width] = { shell, header, ratio: shell / width };
      await page.screenshot({ path: `${out}/home-${width}.png`, fullPage: true });
      if (width === 1792) {
        await page.locator("[data-page-hero]").screenshot({ path: `${out}/home-hero-1792.png`, style: hideHeader });
        await page.locator(".trust-grid").screenshot({ path: `${out}/home-trust-1792.png`, style: hideHeader });
        await page.locator(".tools-grid").screenshot({ path: `${out}/home-tools-1792.png`, style: hideHeader });
        await page.locator(".mortgage-demo-grid").screenshot({ path: `${out}/home-demo-1792.png`, style: hideHeader });
      }
    }

    expect(measured[1792].shell).toBeGreaterThanOrEqual(1470);
    expect(measured[1792].shell).toBeLessThanOrEqual(1490);
    expect(measured[1792].ratio).toBeGreaterThanOrEqual(0.8);
    expect(measured[1792].ratio).toBeLessThanOrEqual(0.85);
    expect(measured[1920].shell).toBeLessThanOrEqual(measured[1792].shell + 2);
    expect(measured[1440].shell).toBeGreaterThan(1280);
    expect(measured[1600].shell).toBeGreaterThan(measured[1440].shell - 1);
  });

  test("compact and tablet widths do not overflow", async ({ page }) => {
    await mkdir(out, { recursive: true });
    for (const width of [1024, 900, 768, 430, 390, 375]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if ([1024, 768, 390, 375].includes(width)) {
        await page.screenshot({ path: `${out}/home-${width}.png`, fullPage: true });
      }
    }
  });

  test("page-type shells widen independently", async ({ page }) => {
    await mkdir(out, { recursive: true });
    for (const width of [1440, 1792] as const) {
      await page.setViewportSize({ width, height: 1100 });

      await page.goto("/calculators");
      const directory = await widthOf(page, ".site-container");
      expect(directory).toBeGreaterThan(width >= 1600 ? 1400 : 1280);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${out}/calculators-${width}.png`, fullPage: true });

      await page.goto("/calculators/mortgage");
      const product = await widthOf(page, ".site-container-product");
      const workspace = await widthOf(page, ".calculator-workspace");
      expect(product).toBeGreaterThan(1200);
      expect(product).toBeLessThanOrEqual(1450);
      expect(workspace).toBeGreaterThan(product - 8);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${out}/mortgage-${width}.png`, fullPage: true });

      await page.goto("/guides");
      const guides = await widthOf(page, ".site-container");
      expect(Math.abs(guides - directory)).toBeLessThanOrEqual(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${out}/guides-${width}.png`, fullPage: true });

      await page.goto("/guides/apr-vs-apy");
      const article = await widthOf(page, ".guide-page");
      const prose = await page.locator(".guide-prose").first().boundingBox();
      expect(Math.abs(article - directory)).toBeLessThanOrEqual(2);
      expect(prose!.width).toBeLessThanOrEqual(780);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${out}/guide-article-${width}.png`, fullPage: true });

      await page.goto("/how-it-works");
      const howItWorks = await widthOf(page, ".how-it-works");
      expect(Math.abs(howItWorks - directory)).toBeLessThanOrEqual(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${out}/how-it-works-${width}.png`, fullPage: true });

      await page.goto("/about");
      const about = await widthOf(page, ".trust-page");
      expect(Math.abs(about - directory)).toBeLessThanOrEqual(2);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.screenshot({ path: `${out}/about-${width}.png`, fullPage: true });
    }
  });
});
