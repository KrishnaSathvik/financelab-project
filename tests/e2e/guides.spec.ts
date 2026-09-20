import { test, expect } from '@playwright/test';
import { guideList } from '../../lib/guides/catalog';
import { guideExhibits, formatGuideCell } from '../../components/brand/guide-exhibit';
import { mkdir, writeFile } from 'node:fs/promises';
for (const guide of guideList) test(`${guide.slug}: desktop and mobile content, links and metadata`, async ({ page, request }) => {
  const errors: string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:1440,height:1000});
  const response=await page.goto(guide.href);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading',{level:1})).toHaveText(guide.title);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://moneybasis.app${guide.href}`);
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content','article');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content',guide.description);
  const image=await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(image).toContain(`${guide.href}/opengraph-image`);
  const imageResponse=await request.get(new URL(image!).pathname+new URL(image!).search);
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()['content-type']).toContain('image/png');
  const imageBuffer=await imageResponse.body();
  expect(imageBuffer.readUInt32BE(16)).toBe(1200);expect(imageBuffer.readUInt32BE(20)).toBe(630);
  const shell=await page.locator('.guide-page').boundingBox();
  expect(shell!.width).toBeGreaterThanOrEqual(1100);expect(shell!.width).toBeLessThanOrEqual(1260);
  const prose = page.locator(".guide-prose").first();
  expect((await prose.boundingBox())!.width).toBeLessThanOrEqual(780);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toHaveCount(1);
  await expect(page.locator('.guide-takeaway')).toContainText(guide.takeaway);
  await expect(page.locator('.guide-meta')).toContainText(`${guide.readingTime} min read`);
  await expect(page.locator('.guide-page')).not.toContainText('Reviewed Sep');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
  await expect(page.getByText('On this page')).toHaveCount(0);
  await expect(page.getByText('References:')).toHaveCount(0);
  const sourceText=await page.locator('#sources').innerText();
  expect(sourceText).not.toMatch(/https?:\/\//);
  expect(sourceText).toContain('Primary references supporting the factual claims');
  const primaryCTA=page.locator('#try-it').getByRole('link',{name:/^Open /});
  await expect(primaryCTA).toHaveAttribute('href',`/calculators/${guide.relatedCalculator}`);
  expect((await request.get(`/calculators/${guide.relatedCalculator}`)).status()).toBe(200);
  for(const slug of guide.relatedGuides) await expect(page.locator('#keep-learning').getByRole('link').filter({has:page.getByRole('heading',{name:guideList.find(g=>g.slug===slug)!.title})})).toHaveAttribute('href',`/guides/${slug}`);
  await expect(page.locator('#keep-learning .guide-related-grid')).toHaveAttribute('data-count', String(guide.relatedGuides.length));
  for(const section of guide.sections){await expect(page.locator(`#${section.id}`).getByRole('heading',{level:2,exact:true,name:section.heading})).toBeVisible();}
  for(const id of guide.sections.flatMap(s=>s.exhibits??[])){
    const figure=page.locator(`[data-exhibit="${id}"]`);const e=guideExhibits[id];
    await expect(figure).toBeVisible();
    const rows=figure.locator('tbody tr');await expect(rows).toHaveCount(e.rows.length);
    for(let i=0;i<e.rows.length;i++)await expect(rows.nth(i).locator('th,td')).toHaveText(e.rows[i].map((v,j)=>formatGuideCell(v,e.formats[j])));
  }
  for(const width of [1920,1280,1024,768,390,320]){
    await page.setViewportSize({width,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    for(const table of await page.locator('.guide-exhibit [role="region"]').all())expect(await table.evaluate(el=>getComputedStyle(el).overflowX)).toBe('auto');
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.getByRole('button',{name:'Switch to dark mode'}).click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  const tokenColor = async (name: string) => page.evaluate((token) => {
    const probe = document.createElement('span');
    probe.style.color = `var(${token})`;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
  expect(await page.locator('.guide-prose').first().evaluate(el=>getComputedStyle(el).color)).toBe(await tokenColor('--text'));
  for(const label of await page.locator('.guide-exhibit svg text').all()) expect(await label.evaluate(el=>getComputedStyle(el).fill)).toBe(await tokenColor('--text-secondary'));
  expect(errors).toEqual([]);
});
test('library categories, calculator backlinks and review screenshots',async({page,request})=>{
  await page.goto('/guides');
  for(const guide of guideList) await expect(page.locator(`[data-guide-preview="${guide.slug}"]`).last()).toBeVisible();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.locator('[data-guide-preview="mortgage-amortization"]').locator('..').screenshot({ path: `output/playwright/guide-preview-${width}.png`, style: 'header.sticky { visibility: hidden; }' });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  for(const category of ['Home & Mortgage','Saving & Investing','Retirement','Income & Budgeting','Debt','Financial Basics'])await expect(page.getByRole('heading',{name:category,exact:true})).toBeVisible();
  for(const guide of guideList)await expect(page.getByRole('heading',{name:guide.title,exact:true}).last()).toBeVisible();
  for(const slug of [...new Set(guideList.map(g=>g.relatedCalculator))]){
    await page.goto(`/calculators/${slug}`);
    await expect(page.getByRole('heading',{name:'See a worked example'})).toBeVisible();
    for(const guide of guideList.filter(g=>g.relatedCalculator===slug))await expect(page.locator(`a[href="${guide.href}"]`).first()).toBeVisible();
  }
  await mkdir('output/playwright/content-v1',{recursive:true});
  for(const slug of ['mortgage-amortization','compound-interest','salary-vs-hourly','four-percent-rule','rent-vs-buy-costs']){
    await page.setViewportSize({width:1440,height:1000});await page.goto(`/guides/${slug}`);
    await page.screenshot({path:`output/playwright/content-v1/${slug}-desktop.png`});
    if(slug==='compound-interest'){await page.getByRole('button',{name:'Switch to dark mode'}).click();await page.locator('.guide-exhibit').first().screenshot({style:'header.sticky { visibility: hidden; }',path:'output/playwright/content-v1/compound-interest-dark.png'});await page.getByRole('button',{name:'Switch to light mode'}).click();}
    const og=await request.get(`/guides/${slug}/opengraph-image`);await writeFile(`output/playwright/content-v1/${slug}-og.png`,await og.body());
    await page.locator('.guide-exhibit').first().screenshot({style:"header.sticky { visibility: hidden; }",path:`output/playwright/content-v1/${slug}-figure.png`});
    await page.setViewportSize({width:390,height:844});await page.goto(`/guides/${slug}`);
    await page.screenshot({path:`output/playwright/content-v1/${slug}-mobile.png`});
    await page.locator('.guide-exhibit').first().screenshot({style:"header.sticky { visibility: hidden; }",path:`output/playwright/content-v1/${slug}-figure-mobile.png`});
  }
});
test('guide visual pass v1 screenshots and article chrome', async ({ page }) => {
  await mkdir('output/playwright/guide-visual-pass-v1', { recursive: true });
  const hideChrome = 'header.sticky, .guide-progress { visibility: hidden; }';
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto('/guides/apr-vs-apy');
  await page.screenshot({ path: 'output/playwright/guide-visual-pass-v1/apr-apy-desktop.png' });
  await page.locator('.guide-formula').first().screenshot({ path: 'output/playwright/guide-visual-pass-v1/formula-block.png', style: hideChrome });
  await page.locator('.guide-example').first().screenshot({ path: 'output/playwright/guide-visual-pass-v1/worked-example.png', style: hideChrome });
  await page.locator('#sources').screenshot({ path: 'output/playwright/guide-visual-pass-v1/source-section.png', style: hideChrome });
  await page.locator('#keep-learning').screenshot({ path: 'output/playwright/guide-visual-pass-v1/keep-learning.png', style: hideChrome });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await page.screenshot({ path: 'output/playwright/guide-visual-pass-v1/dark-mode-guide.png' });
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/guides/apr-vs-apy');
  await page.screenshot({ path: 'output/playwright/guide-visual-pass-v1/apr-apy-mobile.png' });
  await page.setViewportSize({ width: 1440, height: 1100 });
  for (const [slug, file] of [['mortgage-amortization','mortgage-desktop.png'],['salary-vs-hourly','salary-desktop.png'],['four-percent-rule','retirement-desktop.png'],['rent-vs-buy-costs','rent-buy-desktop.png']] as const) {
    await page.goto(`/guides/${slug}`);
    await page.screenshot({ path: `output/playwright/guide-visual-pass-v1/${file}` });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/guides/monthly-budget');
  await page.screenshot({ path: 'output/playwright/guide-visual-pass-v1/budget-mobile.png' });
});
