import { test, expect } from '@playwright/test';

const widths = [1440, 1280, 1024, 900, 768, 430, 390, 375];
for (const width of widths) {
  test(`final layouts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const cards = page.locator('.learning-card');
    await expect(cards).toHaveCount(3);
    const geometry = await cards.evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect();
      const preview = node.querySelector('.learning-preview')!.getBoundingClientRect();
      const cta = node.querySelector('.learning-cta')!.getBoundingClientRect();
      return { x: rect.x, y: rect.y, height: rect.height, preview: preview.height, cta: cta.y - rect.y };
    }));
    expect(new Set(geometry.map(x => x.height)).size).toBe(1);
    expect(new Set(geometry.map(x => x.preview)).size).toBe(1);
    expect(new Set(geometry.map(x => x.cta)).size).toBe(1);
    expect(new Set(geometry.map(x => x.x)).size).toBe(width >= 960 ? 3 : width >= 640 ? 2 : 1);
    expect(await cards.evaluateAll(nodes => nodes.every(node => [...node.querySelectorAll('*')].every(child => child.scrollWidth <= child.clientWidth + 1)))).toBe(true);
    const panels = await page.locator('.mortgage-demo-grid > div').evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(); return { y: r.y, h: r.height }; }));
    if (width >= 960) { expect(panels[0].y).toBe(panels[1].y); expect(panels[0].h).toBe(panels[1].h); }
    else expect(panels[1].y).toBeGreaterThan(panels[0].y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([1440, 1024, 390].includes(width)) {
      await page.screenshot({ path: `output/playwright/final-ui/home-${width}.png`, fullPage: true });
      await page.locator('.learning-grid').screenshot({ path: `output/playwright/final-ui/learning-${width}.png`, style: "header.sticky { visibility: hidden; }" });
    }
    await page.goto('/how-it-works');
    const nav = page.getByRole('navigation', { name: 'Calculator explanations' });
    const select = page.getByRole('combobox', { name: 'Choose a calculator' });
    if (width >= 768) {
      await expect(nav).toBeVisible();
      await expect(select).toBeHidden();
      const choice = nav.getByRole('button', { name: 'Compound Interest', exact: true });
      await choice.focus();
      await page.keyboard.press('Enter');
      await expect(choice).toBeFocused();
      await expect(choice).toHaveAttribute('aria-pressed', 'true');
      await expect(nav.getByRole('button', { name: 'Mortgage', exact: true })).toHaveAttribute('aria-pressed', 'false');
    } else {
      await expect(nav).toBeHidden();
      await expect(select).toBeVisible();
      await select.selectOption('compound-interest');
    }
    await expect(page.locator('#methodology-panel h2')).toHaveText('Compound Interest Calculator');
    await expect(page.locator('#methodology-panel').getByRole('link', { name: /Open/ })).toHaveAttribute('href', '/calculators/compound-interest');
    if (width >= 1024) {
      const hero = await page.locator('[data-page-hero]').boundingBox();
      const panel = await page.locator('#methodology-panel').boundingBox();
      const sidebar = await nav.boundingBox();
      expect(panel!.y - (hero!.y + hero!.height)).toBeLessThanOrEqual(1);
      expect(panel!.y).toBe(sidebar!.y);
      expect(sidebar!.width).toBe(230);
      expect(hero!.height).toBeLessThan(500);
    }
    if (width >= 768) await nav.getByRole('button', { name: 'Mortgage', exact: true }).click();
    else await select.selectOption('mortgage');
    await page.evaluate(() => scrollTo(0, 0));
    expect(await page.locator('.detail-content').evaluate(node => node.clientWidth)).toBeLessThanOrEqual(800);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([1440, 1280, 1024, 768, 390].includes(width)) await page.screenshot({ path: `output/playwright/final-ui/how-it-works-${width}.png`, fullPage: true });
  });
}
