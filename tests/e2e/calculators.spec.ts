import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { calculators } from '../../lib/calculators/catalog';
const slugs = ['mortgage', 'compound-interest', 'salary-hourly', 'loan-payoff', 'net-worth', 'budget', 'retirement', 'savings-goal', 'debt-snowball', 'rent-vs-buy'] as const;
async function calculate(page: Page) {
  await page.getByRole('button', { name: /^Calculate/ }).click();
  await expect(page.getByRole('region', { name: 'Calculation results' })).not.toContainText('Your estimate will appear here');
}
for (const slug of slugs) test(`${slug} calculates without browser errors`, async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`/calculators/${slug}`);
  const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(crumbs).toHaveCount(1);
  await expect(crumbs.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
  await expect(crumbs.getByRole("link", { name: "Calculators" })).toHaveAttribute("href", "/calculators");
  await expect(crumbs).toContainText(calculators[slug].name);
  await calculate(page);
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  for (const width of [1920, 1600, 1440, 1280, 1024, 900, 768, 430, 390, 375, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (width === 1440) {
      const form = await page.locator('.calculator-form').boundingBox();
      const summary = await page.locator('.calculator-summary').boundingBox();
      const chartRoot = await page.locator('.calculator-summary .interactive-chart').first().boundingBox();
      const chart = await page.locator('.calculator-summary .interactive-chart').first().locator('canvas').boundingBox();
      expect(form).not.toBeNull();
      expect(summary).not.toBeNull();
      expect(chartRoot).not.toBeNull();
      expect(chart).not.toBeNull();
      expect(summary!.x).toBeGreaterThan(form!.x + form!.width - 2);
      expect(chartRoot!.y).toBeGreaterThanOrEqual(summary!.y - 2);
      expect(chartRoot!.y).toBeLessThan(summary!.y + summary!.height);
      if (['rent-vs-buy', 'budget', 'debt-snowball', 'net-worth'].includes(slug)) {
        expect(chartRoot!.y).toBeLessThan(form!.y + form!.height - 40);
      }
      expect(chart!.width).toBeGreaterThan(slug === 'budget' ? 280 : 700);
      if (slug === 'rent-vs-buy') {
        await expect(page.locator('.chart-chips')).toContainText('Selected horizon');
        await expect(page.locator('.chart-chips')).toContainText('First crossover');
      }
    }
    if (width === 1024) {
      const form = await page.locator('.calculator-form').boundingBox();
      const summary = await page.locator('.calculator-summary').boundingBox();
      expect(summary!.y).toBeGreaterThan(form!.y + form!.height - 8);
    }
    if ([1440, 1024, 768, 390].includes(width)) {
      await page.locator('#results').screenshot({ path: `output/playwright/calculator-workspace-v4/${slug}-${width}.png`, style: 'header.sticky { visibility: hidden; }' });
    }
    if (slug === 'mortgage' || slug === 'budget') await page.screenshot({ path: `output/playwright/calculator-refresh-${slug}-${width}.png` });
  }
  expect(errors).toEqual([]);
});
test('budget and net-worth editors stay readable on a 320px phone', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/calculators/budget');
  const housing = page.getByRole('textbox', { name: 'Category name' }).first();
  await expect(housing).toHaveValue('Housing');
  expect(await housing.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await page.goto('/calculators/net-worth');
  const accountType = page.getByLabel('Account type').first();
  expect(await accountType.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
test('tablet chrome uses the full nav and keeps calculator rows intact', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toHaveCount(0);
  await expect(page.locator('header').getByRole('link', { name: 'Calculators', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.goto('/how-it-works');
  const nav = page.getByRole('navigation', { name: 'Calculator explanations' });
  await expect(nav.getByRole('button', { name: 'Retirement', exact: true })).toBeVisible();
  expect(await nav.getByRole('button').evaluateAll((nodes) => nodes.every((node) => node.getBoundingClientRect().right <= innerWidth + 1))).toBe(true);
});
test('invalid typed inputs suppress stale results and recover', async ({ page }) => {
  await page.goto('/calculators/debt-snowball');
  await calculate(page);
  const budget = page.getByRole('textbox', { name: 'Total amount available each month' });
  for (const invalid of ['0', '-1', '', 'abc100']) {
    await budget.fill(invalid);
    await expect(page.getByRole('main').getByRole('alert')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Calculation results' })).toContainText('Your estimate will appear here');
  }
  await budget.fill('800');
  await expect(page.getByRole('main').getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Calculation results' })).toContainText('Debt free in');
});
test('invalid shared URL keeps defaults and explains rejection', async ({ page }) => {
  const payload = { goalName: 'House down payment', goalAmount: -100, alreadySaved: 0, years: 1.5, annualReturnPercent: 0 };
  const share = Buffer.from(JSON.stringify(payload)).toString('base64url');
  await page.goto(`/calculators/savings-goal?share=${share}`);
  await expect(page.getByRole('main').getByRole('alert')).toContainText('shared inputs are invalid');
  await calculate(page);
  await expect(page.getByRole('region', { name: 'Calculation results' })).not.toContainText('NaN');
});
test('fractional shared goal preserves month-end dates and growth-funded state', async ({ page }) => {
  await page.clock.setFixedTime(new Date(2026, 0, 31, 12));
  const share = Buffer.from(JSON.stringify({ goalName: 'Future target', goalAmount: 1100, alreadySaved: 1000, years: 1.5, annualReturnPercent: 12 })).toString('base64url');
  await page.goto(`/calculators/savings-goal?share=${share}`);
  await expect(page.getByRole('textbox', { name: 'Goal name' })).toHaveValue('Future target');
  await calculate(page);
  const results = page.getByRole('region', { name: 'Calculation results' });
  await expect(results).toContainText('No deposits needed');
  await expect(results).toContainText('Jul 2027');
  await expect(results).toContainText('it has not been achieved today');
});
test('corrupt saved record falls back, valid save survives reload', async ({ page }) => {
  await page.goto('/calculators/budget');
  await page.evaluate(() => localStorage.setItem('moneybasis:budget', '{broken'));
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Take-home income' })).toHaveValue('5,000');
  await page.getByRole('textbox', { name: 'Take-home income' }).fill('6000');
  await calculate(page);
  await page.getByRole('button', { name: 'Save on this device', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Take-home income' })).toHaveValue('6,000');
});
test('retirement inflation changes spending basis and target comparison', async ({ page }) => {
  await page.goto('/calculators/retirement');
  await calculate(page);
  const results = page.getByRole('region', { name: 'Calculation results' });
  await expect(results).toContainText('Spending at retirement (future dollars)');
  await page.getByRole('button', { name: 'Show advanced options' }).click();
  await page.getByRole('textbox', { name: 'Inflation', exact: true }).fill('3');
  await expect(results).toContainText('$11,255');
});
test('mortgage CSV uses the same monthly ledger as its headline and table', async ({ page }) => {
  const share = Buffer.from(JSON.stringify({ homePrice: 1200, downPayment: 0, annualRatePercent: 0, termYears: 1, annualPropertyTax: 0, annualInsurance: 0, monthlyHoa: 0, monthlyPmi: 0 })).toString('base64url');
  await page.goto(`/calculators/mortgage?share=${share}`);
  await expect(page.getByRole('textbox', { name: 'Home price', exact: true })).toHaveValue('1,200');
  await calculate(page);
  await page.getByRole('button', { name: 'Monthly', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download full CSV' }).click();
  const download = await downloadEvent;
  const csv = await readFile((await download.path())!, 'utf8');
  const rows = csv.trim().split('\n');
  expect(rows).toHaveLength(13);
  expect(rows[1]).toBe('"1","100.00","100.00","0.00","1100.00"');
  expect(rows[12]).toBe('"12","100.00","100.00","0.00","0.00"');
  await expect(page.getByRole('region', { name: 'Calculation results' })).toContainText('$100');
});
test('calculate scrolls down to the result chart instead of up to the form', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/calculators/mortgage');
  const calculateButton = page.getByRole('button', { name: /^Calculate/ });
  await calculateButton.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await calculateButton.click();
  await expect(page.locator('.calculator-summary .interactive-chart')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => document.querySelector('.calculator-summary')?.getBoundingClientRect().top ?? 9999)).toBeGreaterThan(60);
  await expect.poll(async () => page.evaluate(() => document.querySelector('.calculator-summary')?.getBoundingClientRect().top ?? -1)).toBeLessThan(160);
  const after = await page.evaluate(() => {
    const summary = document.querySelector('.calculator-summary')!.getBoundingClientRect();
    const chart = document.querySelector('.calculator-summary .interactive-chart')!.getBoundingClientRect();
    const form = document.querySelector('.calculator-form')!.getBoundingClientRect();
    return { scrollY: window.scrollY, summaryTop: summary.top, chartTop: chart.top, formBottom: form.bottom };
  });
  expect(after.scrollY).toBeGreaterThan(before);
  expect(after.formBottom).toBeLessThanOrEqual(120);
  expect(after.chartTop).toBeGreaterThan(after.summaryTop);
  expect(after.chartTop).toBeLessThan(800);
});
