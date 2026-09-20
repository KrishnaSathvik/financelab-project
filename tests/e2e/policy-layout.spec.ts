import { test, expect } from '@playwright/test';
import { financialSources } from '../../lib/sources';

for (const [route, count] of [['about', 3], ['sources', 6], ['privacy', 4], ['disclaimer', 3]] as const) {
  test(`${route} sections and minimal footer work on desktop and mobile`, async ({ page }) => {
    await page.goto(`/${route}`);
    await expect(page.locator('[data-content-section]')).toHaveCount(count);
    await expect(page.locator('[data-page-hero]').getByRole('img')).toHaveCount(0);
    if (route === 'sources') {
      for (const source of Object.values(financialSources)) {
        await expect(page.locator(`[data-source-id="${source.id}"]`)).toHaveCount(1);
        await expect(page.locator(`[data-source-id="${source.id}"]`).getByRole('link')).toHaveAttribute('href', source.url);
      }
    }
    await expect(page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link')).toHaveText(['About', 'Sources', 'Privacy', 'Disclaimer']);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await page.locator('[data-content-section]').first().screenshot({ path: `output/playwright/${route}-sections-${width}.png`, style: 'header.sticky { visibility: hidden; }' });
    }
    if (route === 'privacy') {
      await page.evaluate(() => { localStorage.setItem('moneybasis:budget', '{}'); localStorage.setItem('theme', 'light'); });
      await page.getByRole('button', { name: 'Clear saved data', exact: true }).click();
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(page.getByRole('button', { name: 'Clear saved data', exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Clear saved data', exact: true }).click();
      await page.getByRole('button', { name: 'Clear data', exact: true }).click();
      await expect(page.getByRole('status')).toHaveText('Saved data cleared');
      expect(await page.evaluate(() => localStorage.getItem('moneybasis:budget'))).toBeNull();
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');
    }
    await page.locator('footer').screenshot({ path: `output/playwright/minimal-footer-${route}.png`, style: 'header.sticky { visibility: hidden; }' });
  });
}
