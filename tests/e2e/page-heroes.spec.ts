import { test, expect } from '@playwright/test';

for (const route of ['/', '/calculators', '/guides', '/how-it-works', '/about', '/sources', '/privacy', '/disclaimer']) {
  test(`${route} has the shared responsive hero`, async ({ page }) => {
    await page.goto(route);
    const hero = page.locator('[data-page-hero]');
    const textOnly = ['/about', '/sources', '/privacy', '/disclaimer'].includes(route);
    await expect(hero).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    if (textOnly) await expect(hero.getByRole('img')).toHaveCount(0);
    else await expect(hero.getByRole('img')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveCount(0);
    const name = route.slice(1) || 'home';
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      if (width !== 390) await hero.screenshot({ path: `output/playwright/shared-hero-${name}-${width}.png`, style: 'header.sticky { visibility: hidden; }' });
    }
    await page.getByRole('button', { name: 'Open menu', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close menu', exact: true })).toHaveText('Close');
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await page.getByRole('button', { name: 'Close menu', exact: true }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    if (textOnly) await expect(hero.getByRole('img')).toHaveCount(0);
    else await expect(hero.getByRole('img')).toBeVisible();
    if (route === '/privacy') await hero.screenshot({ path: 'output/playwright/shared-hero-privacy-dark.png', style: 'header.sticky { visibility: hidden; }' });
  });
}

test('navigating to another page opens at the top instead of scrolling from the previous position', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto('/guides/apr-vs-apy');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.locator('footer').scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
  await page.getByRole('navigation', { name: 'Footer' }).getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBeLessThan(8);
});

