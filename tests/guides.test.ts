import { describe, expect, it } from 'vitest';
import { guideList, guideCategories, getGuide } from '@/lib/guides/catalog';
import { calculatorList, calculators } from '@/lib/calculators/catalog';
import { guidePreviews } from '@/lib/guides/previews';
import { financialSources, type SourceKey } from '@/lib/sources';
import fixtures from '@/lib/guides/fixtures.json';
import { guideExhibits, formatGuideCell } from '@/components/brand/guide-exhibit';
import { generateMetadata } from '@/app/guides/[slug]/page';
import sitemap from '@/app/sitemap';
import { SITE_URL } from '@/lib/site';
import { guidePresentations, presentationFor } from '@/lib/guides/presentation';
import { sourceShortName } from '@/lib/guides/source-labels';
const originalSlugs = ['mortgage-amortization','compound-interest','salary-vs-hourly','net-worth','monthly-budget','debt-snowball-vs-avalanche','loan-prepayments','four-percent-rule','rent-vs-buy-costs','how-much-to-save'];
it('preserves all ten evergreen URLs and adds four unique foundations', () => {
  expect(guideList).toHaveLength(14);
  for(const slug of [...originalSlugs,'nominal-vs-real-return','gross-vs-net-pay','apr-vs-apy','savings-rate-vs-cash-flow']) expect(getGuide(slug)?.href).toBe(`/guides/${slug}`);
  for(const field of ['slug','seoTitle','description','ogHeadline'] as const) expect(new Set(guideList.map(g=>g[field])).size).toBe(14);
  expect(new Set(guideList.map(g=>g.category))).toEqual(new Set(guideCategories));
});
for(const guide of guideList) describe(guide.slug,()=>{
  it('has working curated relationships and no orphaned guide or calculator',()=>{
    expect(guide.relatedGuides.length).toBeGreaterThanOrEqual(2);
    expect(guide.relatedGuides.length).toBeLessThanOrEqual(3);
    expect(new Set(guide.relatedGuides).size).toBe(guide.relatedGuides.length);
    for(const slug of guide.relatedGuides) { expect(slug).not.toBe(guide.slug);expect(getGuide(slug)).not.toBeNull(); }
    expect(guideList.some(g=>g.relatedGuides.includes(guide.slug))).toBe(true);
    expect(guide.calculatorAssociations).toContain(guide.relatedCalculator);
    for(const c of guide.calculatorAssociations) expect(calculators[c].href).toBe(`/calculators/${c}`);
  });
  it('has claim-specific references, reproducible fixtures and valid exhibits',()=>{
    expect(guide.sourceIds.length).toBeGreaterThan(0);
    for(const key of guide.sourceIds){const source=financialSources[key];expect(source.supports.length).toBeGreaterThan(0);expect(new URL(source.url).protocol).toBe('https:');expect(source.verifiedAt).toBe(guide.reviewedAt);}
    expect(guide.fixtureIds.length).toBeGreaterThan(0);
    for(const id of guide.fixtureIds) {const fixture=fixtures.cases.find(c=>c.id===id);expect(fixture).toBeDefined();expect(fixture!.basis.length).toBeGreaterThan(20);expect(fixture!.args.length).toBeGreaterThan(0);}
    const exhibits=guide.sections.flatMap(s=>s.exhibits??[]);
    expect(exhibits.length).toBeGreaterThan(0);
    expect(new Set(exhibits).size).toBe(exhibits.length);
    for(const id of exhibits){const e=guideExhibits[id];expect(e).toBeDefined();expect(e.formats.length).toBe(e.columns.length);for(const row of e.rows)expect(row.length).toBe(e.columns.length);expect(e.note.length).toBeGreaterThan(30);}
  });
  it('has unique section anchors, substantive text and measured reading time',()=>{
    expect(new Set(guide.sections.map(s=>s.id)).size).toBe(guide.sections.length);
    expect(guide.sections.every(s=>/^[a-z0-9-]+$/.test(s.id))).toBe(true);
    expect(guide.sections.some(s=>s.id==='example')).toBe(true);
    const words=[guide.intro,guide.takeaway,...guide.sections.flatMap(s=>[s.heading,s.body]),guide.exercise].join(' ').split(/\s+/).length;
    expect(guide.readingTime).toBe(Math.ceil(words/200));
    expect(words).toBeGreaterThan(600);
    expect(guide.sections.map(s=>s.body).join(' ')).not.toMatch(/you should|avalanche is always best|4% is safe|buying is better|renting is better/i);
  });
  it('emits article metadata and a reviewed sitemap date',async()=>{
    const meta=await generateMetadata({params:Promise.resolve({slug:guide.slug})});
    expect(meta.title).toBe(guide.seoTitle);expect(meta.description).toBe(guide.description);
    expect(meta.alternates?.canonical).toBe(guide.href);
    expect(meta.openGraph).toMatchObject({type:'article',modifiedTime:guide.reviewedAt,url:guide.href});
    expect(meta.twitter).toMatchObject({card:'summary_large_image',title:guide.ogHeadline});
    const entry=sitemap().find(x=>x.url===`${SITE_URL}${guide.href}`);
    expect(entry?.lastModified).toEqual(new Date(guide.reviewedAt));
  });
});
it('every calculator has an appropriate guide backlink',()=>{for(const c of calculatorList)expect(guideList.some(g=>g.relatedCalculator===c.slug)).toBe(true);});
it('keeps example precision independent of display formatting',()=>{
  expect(fixtures.values['mortgage.payment']).toBeCloseTo(2022.61767518,8);
  expect(formatGuideCell(fixtures.values['mortgage.payment'],'money')).toBe('$2,022.62');
  expect(formatGuideCell(-113.61512828,'money')).toBe('-$113.62');
  expect(formatGuideCell(12.682503,'percent')).toBe('12.6825%');
});

it('gives every guide a complete visual preview', () => {
  expect(Object.keys(guidePreviews).sort()).toEqual(guideList.map(g => g.slug).sort());
  for (const guide of guideList) {
    const preview = guidePreviews[guide.slug];
    expect(preview.context).toBeTruthy();
    expect(preview.takeaway).toBeTruthy();
    expect(preview.values.length).toBeGreaterThanOrEqual(2);
    for (const item of preview.values) {
      expect(item.label).toBeTruthy();
      expect(item.value).not.toMatch(/NaN|undefined|Infinity/);
    }
  }
});

it('gives every guide a presentation overlay that preserves existing section ids', () => {
  expect(Object.keys(guidePresentations).sort()).toEqual(guideList.map(g => g.slug).sort());
  for (const guide of guideList) {
    const presentation = presentationFor(guide.slug);
    for (const id of Object.keys(presentation.sections)) {
      expect(guide.sections.some(section => section.id === id), `${guide.slug} unknown section ${id}`).toBe(true);
    }
    expect(presentation.exercise.steps.length).toBeGreaterThanOrEqual(2);
    if (presentation.opening) {
      expect(presentation.opening.id).toMatch(/^[a-z0-9-]+$/);
      expect(guide.sections.every(section => section.id !== presentation.opening!.id)).toBe(true);
    }
  }
});

it('keeps inline citations short and free of registry ids or urls', () => {
  for (const key of Object.keys(financialSources) as SourceKey[]) {
    expect(sourceShortName(key).length).toBeGreaterThan(1);
    expect(sourceShortName(key)).not.toMatch(/https?:|irs-rp-|cfpb-/i);
  }
});
