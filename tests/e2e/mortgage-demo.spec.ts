import { test, expect } from '@playwright/test';
import { calculateMortgage } from '../../lib/calculators/mortgage';
import { formatMoney } from '../../lib/format';

test('mortgage playground synchronizes controls and handles boundary values', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  const demo = page.locator('#mortgage-demo');
  const output = demo.locator('[aria-live]');
  const expected = (price: number, down: number, rate: number, years: number) => formatMoney(calculateMortgage({ homePrice: price, downPayment: price * down / 100, annualRatePercent: rate, termYears: years }).monthlyPayment);
  await expect(output).toContainText(expected(400000, 20, 6.5, 30));
  await demo.getByRole('slider', { name: 'Home price slider', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(demo.getByRole('spinbutton', { name: 'Home price', exact: true })).toHaveValue('405000');
  await expect(output).toContainText(expected(405000, 20, 6.5, 30));
  await demo.getByRole('spinbutton', { name: 'Home price', exact: true }).fill('500000');
  await expect(demo.getByRole('slider', { name: 'Home price slider', exact: true })).toHaveValue('500000');
  await demo.getByRole('button', { name: '15 years', exact: true }).click();
  await expect(output).toContainText(expected(500000, 20, 6.5, 15));
  await demo.getByRole('spinbutton', { name: 'Interest rate', exact: true }).fill('0');
  await expect(output).toContainText(expected(500000, 20, 0, 15));
  await expect(output).toContainText('$0.00');
  await demo.getByRole('spinbutton', { name: 'Down payment', exact: true }).fill('100');
  await expect(output).toContainText('No mortgage is needed');
  await demo.getByRole('spinbutton', { name: 'Home price', exact: true }).fill('');
  await expect(output).toContainText('Check the highlighted inputs');
  await demo.getByRole('spinbutton', { name: 'Home price', exact: true }).fill('-1');
  await expect(output).toContainText('Check the highlighted inputs');
  await demo.getByRole('button', { name: 'Reset example' }).click();
  await expect(output).toContainText(expected(400000, 20, 6.5, 30));
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await demo.screenshot({ path: `output/playwright/mortgage-playground-${width}.png`, style: 'header.sticky { visibility: hidden; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  expect(errors).toEqual([]);
});
