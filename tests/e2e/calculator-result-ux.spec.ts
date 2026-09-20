import { test, expect, type Page } from '@playwright/test';

const out = 'output/playwright/calculator-result-ux-v2';
const details: Record<string, string> = {
  mortgage: 'Amortization schedule',
  'compound-interest': 'Growth by year',
  retirement: 'Retirement projection',
  'savings-goal': 'Savings timeline',
  budget: 'Expense breakdown',
  'salary-hourly': 'Pay & tax breakdown',
  'loan-payoff': 'Payoff schedule',
  'debt-snowball': 'Debt payoff timeline',
  'net-worth': 'Assets & liabilities',
  'rent-vs-buy': 'Cost comparison',
};

async function calculate(page: Page) {
  await page.getByRole('button', { name: /^Calculate/ }).click();
  await expect(page.getByRole('region', { name: 'Calculation results' })).not.toContainText('Your estimate will appear here');
}

test('mortgage exposes chart data, schedule preview and year paging', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/calculators/mortgage');
  await calculate(page);
  const results = page.getByRole('region', { name: 'Calculation results' });
  await expect(results).not.toContainText('Detailed breakdown / schedule');
  await expect(results).not.toContainText('Choose a point');
  await expect(results.getByRole('button', { name: 'View chart data' })).toHaveCount(0);
  await expect(results.getByRole('heading', { name: 'Chart data' })).toHaveCount(0);
  await expect(results.getByRole('heading', { name: 'Amortization schedule' })).toBeVisible();
  await expect(results).toContainText('See how each payment is divided');
  await expect(results.locator('.result-table tbody tr')).toHaveCount(4);
  await expect(results.getByRole('button', { name: 'View all 30 years' })).toBeVisible();
  await expect(results.getByRole('button', { name: 'Download full CSV' })).toBeVisible();
  await page.locator('#results').screenshot({ path: `${out}/mortgage-chart-normal.png`, style: 'header.sticky { visibility: hidden; }' });

  const chart = page.locator('.interactive-chart').first();
  await chart.locator('.chart-stage').focus();
  await page.keyboard.press('ArrowRight');
  await expect(chart.getByRole('status')).toBeVisible();
  await chart.screenshot({ path: `${out}/mortgage-chart-tooltip.png`, style: 'header.sticky { visibility: hidden; }' });

  await page.locator('.result-detail').screenshot({ path: `${out}/mortgage-schedule-preview.png`, style: 'header.sticky { visibility: hidden; }' });
  await results.getByRole('button', { name: 'View all 30 years' }).click();
  await expect(results.locator('.result-detail tbody tr')).toHaveCount(30);
  await page.locator('.result-detail').screenshot({ path: `${out}/mortgage-yearly-full.png`, style: 'header.sticky { visibility: hidden; }' });

  await results.getByRole('group', { name: 'Amortization period' }).getByRole('button', { name: 'Monthly', exact: true }).click();
  await expect(results.getByRole('combobox', { name: 'Year' })).toBeVisible();
  await expect(results.locator('.result-detail tbody tr')).toHaveCount(12);
  await expect(results).toContainText('Showing 12 of 360 payments');
  await page.locator('.result-detail').screenshot({ path: `${out}/mortgage-monthly-year.png`, style: 'header.sticky { visibility: hidden; }' });

  await page.setViewportSize({ width: 390, height: 1000 });
  await expect(results.getByRole('heading', { name: 'Amortization schedule' })).toBeVisible();
  await page.locator('.result-detail').screenshot({ path: `${out}/mortgage-schedule-mobile.png`, style: 'header.sticky { visibility: hidden; }' });
});

for (const [slug, title] of Object.entries(details)) {
  test(`${slug} has a named detail preview`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/calculators/${slug}`);
    await calculate(page);
    const results = page.getByRole('region', { name: 'Calculation results' });
    await expect(results).not.toContainText('Detailed breakdown / schedule');
    await expect(results.getByText('View data', { exact: true })).toHaveCount(0);
    await expect(results.getByRole('button', { name: 'View chart data' })).toHaveCount(0);
    await expect(results.getByRole('heading', { name: title })).toBeVisible();
    if (['compound-interest', 'budget', 'debt-snowball', 'rent-vs-buy'].includes(slug)) {
      await page.locator('.result-detail').first().screenshot({ path: `${out}/${slug}-detail.png`, style: 'header.sticky { visibility: hidden; }' });
    }
  });
}
