import { test, expect } from '@playwright/test';

const cases = [
  {slug:'mortgage', input:'#home-price', value:'450000', initial:'$320,000'},
  {slug:'compound-interest', input:'#starting', value:'15000', initial:'$10,000'},
  {slug:'retirement', input:'#savings', value:'35000', initial:'$25,000'},
  {slug:'savings-goal', input:'#saved', value:'7000', initial:'$5,000'},
  {slug:'budget', input:'#income', value:'6000', initial:'$1,500'},
  {slug:'salary-hourly', input:'#salary', value:'85000', initial:'$75,000'},
  {slug:'loan-payoff', input:'#balance', value:'30000', initial:'$25,000'},
  {slug:'debt-snowball', input:'#budget', value:'900', initial:'$18,700'},
  {slug:'net-worth', input:'input[aria-label="Checking & savings value"]', value:'15000', initial:'$150,000'},
  {slug:'rent-vs-buy', input:'#price', value:'450000', initial:'$80,000'},
];
const out='output/playwright/calculator-visuals-v1';
test.use({ hasTouch: true });
for (const item of cases) test(`${item.slug}: inspect, update, touch, responsive and accessible data`, async ({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(`/calculators/${item.slug}`);
  await expect(page.locator('.empty-results')).toBeVisible();
  await page.locator('.calculator-workspace').screenshot({path:`${out}/${item.slug}-empty-desktop.png`,style:'header.sticky { visibility: hidden; }'});
  await page.setViewportSize({width:390,height:1000});
  await page.locator('.empty-results').screenshot({path:`${out}/${item.slug}-empty-mobile.png`,style:'header.sticky { visibility: hidden; }'});
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('button', { name: /^Calculate/ }).click();
  const chart=page.locator('.interactive-chart').first();
  const canvas=chart.locator('canvas');
  const stage=chart.locator('.chart-stage');
  await expect(canvas).toBeVisible();
  await stage.focus();
  await page.keyboard.press('Home');
  await expect(chart.getByRole('status')).toContainText(item.initial);
  await chart.getByRole('button',{name:'Close chart details'}).click();
  await canvas.hover({position:{x:130,y:100}});
  await expect(chart.getByRole('status')).toBeVisible();
  await page.keyboard.press('Escape');
  await stage.focus();
  await page.keyboard.press('Home');
  const pinnedValues=await chart.getByRole('status').locator('dd').allTextContents();
  expect(pinnedValues.length).toBeGreaterThan(0);
  await expect(chart.getByRole('button',{name:'View chart data'})).toHaveCount(0);
  await expect(page.locator('.result-detail').first()).toBeVisible();
  await stage.focus();
  await page.keyboard.press('Home');
  await chart.screenshot({path:`${out}/${item.slug}-tooltip-desktop.png`,style:'header.sticky { visibility: hidden; }'});
  await page.keyboard.press('Escape');
  await page.getByRole('heading',{level:1}).click();
  for(const width of [1440,1280,1024,900,768,430,390,375]) {
    await page.setViewportSize({width,height:1000});
    await expect(canvas).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await expect.poll(async () => (await canvas.boundingBox())!.width).toBeGreaterThan(180);
    const kind = await stage.getAttribute('data-chart-kind');
    const maxHeight = kind === 'horizontal' ? 420 : width < 640 ? 330 : 400;
    await expect.poll(async () => (await canvas.boundingBox())!.height).toBeLessThanOrEqual(maxHeight);
    if (kind !== 'horizontal' && width >= 1024) {
      await expect.poll(async () => (await canvas.boundingBox())!.height).toBeGreaterThanOrEqual(300);
    }
    if (width >= 1440 && item.slug !== 'budget') {
      await expect.poll(async () => (await canvas.boundingBox())!.width).toBeGreaterThan(700);
    } else if (width >= 1280 && item.slug !== 'budget') {
      await expect.poll(async () => (await canvas.boundingBox())!.width).toBeGreaterThan(600);
    }
    if([1440,390].includes(width)) await page.locator('#results').screenshot({path:`${out}/${item.slug}-result-${width===1440?'desktop':'mobile'}.png`,style:'header.sticky { visibility: hidden; }'});
    if(['budget','net-worth','debt-snowball','rent-vs-buy'].includes(item.slug) && ![1440,390].includes(width)) await page.locator('#results').screenshot({path:`${out}/${item.slug}-result-${width}.png`,style:'header.sticky { visibility: hidden; }'});
  }
  await page.setViewportSize({width:390,height:1000});
  await canvas.tap({position:{x:110,y:100}});
  await expect(chart.getByRole('status')).toBeVisible();
  await chart.screenshot({path:`${out}/${item.slug}-tooltip-mobile.png`,style:'header.sticky { visibility: hidden; }'});
  await chart.getByRole('button',{name:'Close chart details'}).click();
  await expect(chart.getByRole('status')).toHaveCount(0);
  await stage.focus();
  await page.keyboard.press('Home');
  await page.getByRole('heading',{level:1}).click();
  await expect(chart.getByRole('status')).toHaveCount(0);
  const prior=await chart.locator('.chart-summary').innerText();
  await page.locator(item.input).fill(item.value);
  await expect(chart.locator('.chart-summary')).not.toHaveText(prior);
  await expect(canvas).toBeVisible();
  await stage.focus();
  await page.keyboard.press('Home');
  const pointCount = Number(await stage.getAttribute('data-point-count'));
  if (pointCount > 1) {
    const firstLabel=await chart.getByRole('status').locator('strong').first().innerText();
    await page.keyboard.press('ArrowRight');
    await expect(chart.getByRole('status').locator('strong').first()).not.toHaveText(firstLabel);
  }
  const modes=chart.locator('.chart-modes button');
  if(await modes.count()>1) {
    await modes.nth(1).click();
    await expect(modes.nth(1)).toHaveAttribute('aria-pressed','true');
    await stage.focus();
    await page.keyboard.press('Home');
    await chart.screenshot({path:`${out}/${item.slug}-alternate-mobile.png`,style:'header.sticky { visibility: hidden; }'});
  }
  if(item.slug==='net-worth') {
    await page.getByRole('button',{name:'Project',exact:true}).click();
    await expect(page.getByRole('region',{name:'Projected net worth',exact:true}).locator('canvas')).toBeVisible();
    await page.getByRole('region',{name:'Projected net worth',exact:true}).screenshot({path:`${out}/net-worth-projection-mobile.png`,style:'header.sticky { visibility: hidden; }'});
  }
  if(item.slug==='debt-snowball') {
    await page.getByRole('button',{name:'Avalanche',exact:true}).click();
    await expect(page.locator('.payoff-timeline')).toContainText('Credit Card');
    await expect(page.locator('.payoff-timeline')).toContainText('Starting balance');
    await page.locator('#results').screenshot({path:`${out}/debt-snowball-avalanche-mobile.png`,style:'header.sticky { visibility: hidden; }'});
  }
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.evaluate(()=>{ document.documentElement.classList.add('dark'); });
  // Switch through the actual theme control so canvas colors also update.
  await page.setViewportSize({width:1440,height:1000});
  const theme=page.getByRole('button',{name:'Switch to dark mode'});
  if(await theme.count()) await theme.click();
  await chart.screenshot({path:`${out}/${item.slug}-dark.png`,style:'header.sticky { visibility: hidden; }'});
  expect(errors).toEqual([]);
});
