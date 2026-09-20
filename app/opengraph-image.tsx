import { renderOgImage } from "@/lib/og";
import { SITE_TAGLINE } from "@/lib/site";

export const alt = "MoneyBasis — clear tools for everyday money decisions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(SITE_TAGLINE, "Free calculators for mortgages, investing, retirement, debt and budgeting.");
}
