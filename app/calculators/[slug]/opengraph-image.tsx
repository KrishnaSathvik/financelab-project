import { getCalculator, calculatorSlugs } from "@/lib/calculators/catalog";
import { ogSize, renderCalculatorOgImage } from "@/lib/og";
import { SITE_NAME } from "@/lib/site";

export const alt = "MoneyBasis calculator";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return calculatorSlugs.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  return renderCalculatorOgImage(
    slug,
    calculator?.name ?? SITE_NAME,
    calculator?.ogDescription ?? "Free, private personal finance calculators.",
  );
}
