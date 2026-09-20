import { renderOgImage } from "@/lib/og";

export const alt = "MoneyBasis calculation methods";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage("Methodology", "Formulas, assumptions, limitations and sources.");
}
