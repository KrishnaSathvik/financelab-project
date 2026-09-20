import { test, expect } from '@playwright/test';

test('guide calculation links select the correct explanation', async ({ page }) => {
  for (const [guide, calculator, name] of [
    ['mortgage-amortization', 'mortgage', 'Mortgage Calculator'],
    ['compound-interest', 'compound-interest', 'Compound Interest Calculator'],
    ['monthly-budget', 'budget', 'Monthly Budget Planner'],
  ]) {
    await page.goto(`/guides/${guide}`);
    await expect(page.locator('#sources').getByRole('heading')).toHaveText('Sources & further reading');
    const explanation = page.locator('#try-it').getByRole('link', { name: /How MoneyBasis calculates/ });
    await expect(explanation).toHaveAttribute('href', `/how-it-works?calculator=${calculator}`);
    await explanation.click();
    await expect(page.locator('#methodology-panel h2')).toHaveText(name);
  }
  await page.getByRole('navigation', { name: 'Calculator explanations' }).getByRole('button', { name: 'Savings Goal', exact: true }).click();
  await expect(page.locator('#methodology-panel')).toContainText('Current savings × (1 + r)^n');
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.goto('/how-it-works?calculator=unknown');
  await expect(page.locator('#methodology-panel h2')).toHaveText('Mortgage Calculator');
});

test('homepage, guide library and footer categories stay coherent', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Built into every calculation' })).toBeVisible();
  const learning = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Learn the numbers', exact: true }) });
  for (const slug of ['mortgage-amortization', 'gross-vs-net-pay', 'compound-interest']) {
    await expect(learning.locator(`a[href="/guides/${slug}"]`)).toBeVisible();
  }
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({ path: `output/playwright/illustration-home-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await page.goto('/guides');
  await expect(page.getByText('Featured guide')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'APR vs APY vs Investment Return', exact: true })).toBeVisible();
  await page.goto('/calculators');
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.screenshot({ path: `output/playwright/calculator-directory-hero-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  const footer = page.getByRole('navigation', { name: 'Footer', exact: true });
  await expect(footer.getByRole('link')).toHaveCount(4);
  for (const [label, href] of [['About', '/about'], ['Sources', '/sources'], ['Privacy', '/privacy'], ['Disclaimer', '/disclaimer']]) {
    await expect(footer.getByRole('link', { name: label, exact: true })).toHaveAttribute('href', href);
  }

});
