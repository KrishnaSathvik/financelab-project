import { getGuide, guideList } from '@/lib/guides/catalog';
import { ogSize, renderOgImage } from '@/lib/og';
export const size = ogSize;
export const contentType = 'image/png';
export function generateStaticParams() { return guideList.map(g => ({slug:g.slug})); }
export const alt = 'MoneyBasis financial education guide';
export default async function Image({params}:{params:Promise<{slug:string}>}) {
  const guide=getGuide((await params).slug);
  return renderOgImage(guide?.ogHeadline ?? 'MoneyBasis guides',guide?.ogSubheadline ?? 'Understand the numbers behind a decision.');
}
