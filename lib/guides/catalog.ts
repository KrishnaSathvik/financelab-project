import { homeGuides } from './content/home';
import { growthGuides } from './content/growth';
import { incomeGuides } from './content/income';
import { debtGuides } from './content/debt';
import { netWorthGuide } from './content/net-worth';
import { retirementGuide } from './content/retirement';
import type { GuideDefinition } from './types';
export type { GuideDefinition } from './types';
export { guideCategories } from './types';
const content = [...homeGuides, ...growthGuides, ...incomeGuides, ...debtGuides, netWorthGuide, retirementGuide];
export const guides: GuideDefinition[] = content.map(guide => ({
  ...guide,
  href: `/guides/${guide.slug}`,
  readingTime: Math.max(1, Math.ceil([guide.intro, guide.takeaway, ...guide.sections.flatMap(s => [s.heading, s.body]), guide.exercise].join(' ').split(/\s+/).length / 200)),
  sourceIds: [...new Set(guide.sections.flatMap(s => s.sources ?? []))],
}));
export const guideList = guides;
export function getGuide(slug: string) { return guides.find(g => g.slug === slug) ?? null; }
