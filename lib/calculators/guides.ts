import { calculatorSlugs, type CalculatorSlug } from '@/lib/calculators/catalog';
import { guideList } from '@/lib/guides/catalog';

/** Short educational excerpts share the reviewed guide catalog; no separate stale copy. */
export const calculatorGuides = Object.fromEntries(calculatorSlugs.map(slug => [slug,
  guideList.filter(guide => guide.relatedCalculator === slug).map(guide => ({title:guide.title,body:guide.takeaway})),
])) as Record<CalculatorSlug, {title:string;body:string}[]>;
