import { test, expect } from '@playwright/test';
import { financialSources, sourceCategories } from '../../lib/sources';

const screenshot = (name: string) => `output/playwright/trust-pages-v1/${name}`;
const hideHeader = 'header.sticky { visibility: hidden; }';

test('about uses principle cards, is/isn\'t comparison and calculator CTA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/about');
  await expect(page.getByRole('heading', { name: "Understand, don't guess" })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Transparent by design' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Private by default' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MoneyBasis is', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: "MoneyBasis isn't", exact: true })).toBeVisible();
  await expect(page.getByText('Trust & transparency')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Explore calculators →' }).first()).toHaveAttribute('href', '/calculators');
  await expect(page.getByRole('link', { name: 'How it works →' }).first()).toHaveAttribute('href', '/how-it-works');
  await expect(page.getByRole('link', { name: 'Read our privacy approach →' })).toHaveAttribute('href', '/privacy');
  const columns = await page.locator('.principle-card').evaluateAll((nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().x))).size);
  expect(columns).toBe(3);
  await page.screenshot({ path: screenshot('about-desktop.png'), fullPage: true, style: hideHeader });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.locator('.principle-card').evaluateAll((nodes) => new Set(nodes.map((node) => Math.round(node.getBoundingClientRect().x))).size)).toBe(1);
  await expect(page.locator('.compare-is')).not.toHaveCSS('background-color', 'rgb(220, 38, 38)');
  await page.screenshot({ path: screenshot('about-mobile.png'), fullPage: true, style: hideHeader });
});

test('privacy states local processing, share distinction and confirmed clear', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/privacy');
  await expect(page.getByText('Trust & transparency')).toHaveCount(0);
  await expect(page.locator('.trust-summary')).toContainText('Calculations run in your browser');
  await expect(page.locator('.trust-summary')).toContainText('Calculator values are not sent to a MoneyBasis server');
  await expect(page.getByText('Google Analytics 4 records page views', { exact: false })).toBeVisible();
  await expect(page.getByText('No analytics SDK is currently installed.')).toHaveCount(0);
  await expect(page.getByText('Budget · Net Worth · Debt Snowball', { exact: true })).toBeVisible();
  await expect(page.getByText('Calculator-only link', { exact: true })).toBeVisible();
  await expect(page.getByText('Include my numbers', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Review MoneyBasis sources →' })).toHaveAttribute('href', '/sources');
  await page.screenshot({ path: screenshot('privacy-desktop.png'), fullPage: true, style: hideHeader });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: screenshot('privacy-mobile.png'), fullPage: true, style: hideHeader });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => { localStorage.setItem('moneybasis:networth', '{}'); localStorage.setItem('theme', 'light'); });
  await page.getByRole('button', { name: 'Clear saved data', exact: true }).click();
  await expect(page.getByRole('alertdialog', { name: 'Clear saved MoneyBasis data?' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear data', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Saved data cleared');
  expect(await page.evaluate(() => localStorage.getItem('moneybasis:networth'))).toBeNull();
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
});

test('disclaimer keeps limitation sections and inspection links', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/disclaimer');
  await expect(page.getByText('Trust & transparency')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Educational estimates' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What MoneyBasis does not provide' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Before making an important decision' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See how MoneyBasis calculates estimates →' })).toHaveAttribute('href', '/how-it-works');
  await expect(page.getByRole('link', { name: 'Review sources →' })).toHaveAttribute('href', '/sources');
  await page.screenshot({ path: screenshot('disclaimer-desktop.png'), fullPage: true, style: hideHeader });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: screenshot('disclaimer-mobile.png'), fullPage: true, style: hideHeader });
});

test('sources renders every registry item with category navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/sources');
  await expect(page.getByText('Trust & transparency')).toHaveCount(0);
  await expect(page.locator('.trust-chip')).toHaveText([
    'Primary sources preferred',
    'Year-specific tax data',
    'Reviewed references',
  ]);
  const nav = page.getByRole('navigation', { name: 'Source categories' });
  await expect(nav).toBeVisible();
  await expect(page.getByLabel('Source category')).toBeHidden();
  for (const category of sourceCategories) {
    await expect(nav.getByRole('link', { name: new RegExp(category.title) })).toBeVisible();
    await expect(page.locator(`#${category.id}`)).toBeVisible();
  }
  for (const source of Object.values(financialSources)) {
    const row = page.locator(`[data-source-id="${source.id}"]`);
    await expect(row).toHaveCount(1);
    await expect(row.getByRole('link')).toHaveAttribute('href', source.url);
    await expect(row.getByRole('link')).toHaveAttribute('target', '_blank');
    await expect(row.getByText('Details', { exact: true })).toHaveCount(0);
  }
  await expect(page.locator('[data-source-id="irs-rp-2025-32"] .year-badge')).toHaveText('2026');
  await expect(page.locator('[data-source-id="irs-rp-2024-40"] .year-badge')).toHaveText('2025');
  await expect(page.getByRole('link', { name: 'How MoneyBasis calculates results →' })).toHaveAttribute('href', '/how-it-works');
  await page.screenshot({ path: screenshot('sources-desktop.png'), fullPage: true, style: hideHeader });

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(nav).toBeHidden();
  const select = page.getByLabel('Source category');
  await expect(select).toBeVisible();
  await select.selectOption('retirement');
  await expect(page.locator('#retirement')).toBeInViewport();
  await page.screenshot({ path: screenshot('sources-mobile.png'), fullPage: true, style: hideHeader });
});

test('privacy and sources hold dark-mode surfaces', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({ path: screenshot('dark-mode-privacy.png'), fullPage: true, style: hideHeader });
  await page.goto('/sources');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({ path: screenshot('dark-mode-sources.png'), fullPage: true, style: hideHeader });
});

for (const width of [1440, 1280, 1024, 768, 430, 390, 375]) {
  test(`trust pages do not overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/about', '/privacy', '/disclaimer', '/sources']) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    }
  });
}
